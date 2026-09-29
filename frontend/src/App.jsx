import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CopilotChat from './components/CopilotChat';
import DashboardView from './views/DashboardView';
import WellSearchView from './views/WellSearchView';
import FormationAnalysisView from './views/FormationAnalysisView';
import HistoricalEventsView from './views/HistoricalEventsView';
import RiskAnalysisView from './views/RiskAnalysisView';
import MapsVisualizationView from './views/MapsVisualizationView';
import ReportsView from './views/ReportsView';
import SettingsView from './views/SettingsView';
import { BASINS_CONFIG, HISTORICAL_EVENTS_DATA, FORMATIONS_DETAIL } from './data/mockData';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('Dashboard');

  // Global Basin & Well Selection
  const [selectedBasin, setSelectedBasin] = useState('Arabian Sea (Offshore)');
  const [basinData, setBasinData] = useState(BASINS_CONFIG['Arabian Sea (Offshore)']);
  const [selectedWell, setSelectedWell] = useState(BASINS_CONFIG['Arabian Sea (Offshore)'].wells[0]);

  // Live Drilling Simulator State (starts at 2350m, +5m every 2s)
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentDepth, setCurrentDepth] = useState(2350);

  // Operational User Persona & Thresholds
  const [userRole, setUserRole] = useState('Drilling Engineer');

  // Engine Settings
  const [settings, setSettings] = useState({
    searchRadius: 5,
    depthBuffer: 150,
    refreshInterval: 10
  });

  // Global Light / Dark Mode State (defaulting to true)
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Telemetry Metric Selection
  const [selectedMetric, setSelectedMetric] = useState('ROP');

  // Backend Live Datasets
  const [backendConnected, setBackendConnected] = useState(true);
  const [kpis, setKpis] = useState({
    total_wells: { value: '1,284', trend: '↑ 12%', is_positive: true },
    formations: { value: '356', trend: '↑ 8%', is_positive: true },
    historical_events: { value: '4,892', trend: '↑ 15%', is_positive: true },
    active_risk_alerts: { value: '12', trend: '↑ 3 new', is_positive: false }
  });
  const [riskIndex, setRiskIndex] = useState({
    score: 62,
    label: 'Moderate',
    high_risk: 18,
    medium_risk: 24,
    low_risk: 20,
    segments: [
      { name: 'High Risk', value: 18, color: '#ef4444' },
      { name: 'Medium Risk', value: 24, color: '#f59e0b' },
      { name: 'Low Risk', value: 20, color: '#0ea5e9' }
    ]
  });
  const [drillingTrends, setDrillingTrends] = useState([
    { date: 'Jun 1', 'Well-01': 95, 'Well-03': 58, 'Well-05': 32 },
    { date: 'Jun 3', 'Well-01': 110, 'Well-03': 65, 'Well-05': 38 },
    { date: 'Jun 5', 'Well-01': 108, 'Well-03': 74, 'Well-05': 35 },
    { date: 'Jun 7', 'Well-01': 125, 'Well-03': 72, 'Well-05': 45 },
    { date: 'Jun 9', 'Well-01': 115, 'Well-03': 88, 'Well-05': 36 },
    { date: 'Jun 10', 'Well-01': 138, 'Well-03': 105, 'Well-05': 42 },
    { date: 'Jun 12', 'Well-01': 122, 'Well-03': 98, 'Well-05': 40 },
    { date: 'Jun 14', 'Well-01': 142, 'Well-03': 102, 'Well-05': 48 },
    { date: 'Jun 15', 'Well-01': 136, 'Well-03': 104, 'Well-05': 44 }
  ]);
  const [eventsList, setEventsList] = useState(HISTORICAL_EVENTS_DATA);

  // Ingest basin data switch
  const handleSelectBasin = async (basinName) => {
    setSelectedBasin(basinName);
    // Fetch live basin wells from FastAPI backend if available
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/wells?basin=${encodeURIComponent(basinName)}`);
      if (res.data) {
        setBasinData(res.data);
        if (res.data.center_well) {
          setSelectedWell(res.data.center_well);
        } else if (res.data.wells && res.data.wells.length > 0) {
          setSelectedWell(res.data.wells[0]);
        }
        return;
      }
    } catch {
      // Graceful fallback to static configuration
    }

    if (BASINS_CONFIG[basinName]) {
      setBasinData(BASINS_CONFIG[basinName]);
      setSelectedWell(BASINS_CONFIG[basinName].wells[0]);
    }
  };

  // Poll live backend
  useEffect(() => {
    const API_BASE = 'http://127.0.0.1:8000/api';

    async function fetchData() {
      try {
        const [kpiRes, riskRes, trendsRes, eventsRes] = await Promise.all([
          axios.get(`${API_BASE}/kpis?role=${encodeURIComponent(userRole)}`).catch(() => null),
          axios.get(`${API_BASE}/risk-index`).catch(() => null),
          axios.get(`${API_BASE}/drilling-trends?metric=${selectedMetric}`).catch(() => null),
          axios.get(`${API_BASE}/events`).catch(() => null)
        ]);

        if (kpiRes && kpiRes.data) {
          setKpis(kpiRes.data);
          setBackendConnected(true);
        }
        if (riskRes && riskRes.data) {
          setRiskIndex(riskRes.data);
        }
        if (trendsRes && trendsRes.data && trendsRes.data.data) {
          setDrillingTrends(trendsRes.data.data);
        }
        if (eventsRes && eventsRes.data && eventsRes.data.length > 0) {
          setEventsList(eventsRes.data);
        }
      } catch {
        setBackendConnected(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, (settings.refreshInterval || 10) * 1000);
    return () => clearInterval(interval);
  }, [userRole, selectedMetric, settings.refreshInterval]);

  // Toggle Live Drilling Simulation
  const handleToggleSimulation = () => {
    setIsSimulating((prev) => {
      const next = !prev;
      if (next && currentDepth >= 2500) {
        setCurrentDepth(2350);
      }
      return next;
    });
  };

  // Live Drilling Simulation Interval (increase currentDepth by 5m every 2 seconds)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setCurrentDepth((prev) => {
        const next = prev + 5;
        if (next === 2450) {
          toast.error(
            "CRITICAL: Approaching Miocene Shale boundary. Offset Well-03 experienced Loss of Circulation at this exact depth!",
            {
              duration: 8000,
              position: 'top-right',
              style: {
                background: '#1a0b0e',
                color: '#fca5a5',
                border: '1px solid #ef4444',
                padding: '14px 18px',
                fontSize: '12px',
                fontWeight: '600',
                boxShadow: '0 10px 25px rgba(239, 68, 68, 0.25)'
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff'
              }
            }
          );
          setRiskIndex((r) => ({
            ...r,
            score: 85,
            label: 'High Risk'
          }));
        }
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Synchronize active well depth telemetry
  useEffect(() => {
    setSelectedWell((well) => {
      if (!well) return well;
      return {
        ...well,
        depth: `${currentDepth} m`,
        depth_num: currentDepth
      };
    });
  }, [currentDepth]);

  // Aggregate all wells across catalog for search & explorer
  const allCatalogWells = Object.values(BASINS_CONFIG).flatMap(b => b.wells || []);

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${isDarkMode ? 'dark' : ''} bg-slate-50 dark:bg-[#0a0f1d] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white print:h-auto print:w-full print:overflow-visible print:bg-white print:text-black transition-colors`}>
      {/* -------------------- SIDEBAR -------------------- */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        backendConnected={backendConnected}
      />

      {/* -------------------- MAIN WORKSPACE -------------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto overflow-x-hidden bg-slate-50 dark:bg-[#0a0f1d] print:w-full print:ml-0 print:p-0 print:overflow-visible print:bg-white print:text-black transition-colors">
        {/* Global Interactive Header */}
        <Header
          selectedBasin={selectedBasin}
          onSelectBasin={handleSelectBasin}
          userRole={userRole}
          onChangeRole={(role) => setUserRole(role)}
          onNavigate={(tab) => setActiveTab(tab)}
          onSelectWell={(well) => setSelectedWell(well)}
          allWells={allCatalogWells}
          allEvents={eventsList}
          allFormations={FORMATIONS_DETAIL}
          isSimulating={isSimulating}
          onToggleSimulation={handleToggleSimulation}
          currentDepth={currentDepth}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        />

        {/* Dynamic View Dispatcher */}
        <main className="flex-1 print:w-full print:p-0">
          {activeTab === 'Dashboard' && (
            <DashboardView
              kpis={kpis}
              basinData={basinData}
              selectedWell={selectedWell}
              onSelectWell={(well) => setSelectedWell(well)}
              riskIndex={riskIndex}
              drillingTrends={drillingTrends}
              selectedMetric={selectedMetric}
              onChangeMetric={(m) => setSelectedMetric(m)}
              onNavigate={(tab) => setActiveTab(tab)}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'Well Search' && (
            <WellSearchView
              allWells={allCatalogWells}
              onSelectWell={(well) => setSelectedWell(well)}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'Formation Analysis' && (
            <FormationAnalysisView
              selectedWell={selectedWell}
            />
          )}

          {activeTab === 'Historical Events' && (
            <HistoricalEventsView
              events={eventsList}
            />
          )}

          {activeTab === 'Risk Analysis' && (
            <RiskAnalysisView
              selectedWell={selectedWell}
              depthBuffer={settings.depthBuffer}
            />
          )}

          {activeTab === 'Maps & Visualization' && (
            <MapsVisualizationView
              basinData={basinData}
              selectedWell={selectedWell}
              onSelectWell={(well) => setSelectedWell(well)}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'Reports' && (
            <ReportsView
              selectedWell={selectedWell}
              selectedBasin={selectedBasin}
            />
          )}

          {activeTab === 'Settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={(newSettings) => setSettings(newSettings)}
              userRole={userRole}
              backendConnected={backendConnected}
            />
          )}
        </main>
      </div>

      {/* Global Hot Toast Notification System */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: isDarkMode
            ? 'border border-slate-700 bg-[#11192e] text-slate-100 shadow-2xl text-xs font-sans'
            : 'border border-slate-200 bg-white text-slate-900 shadow-2xl text-xs font-sans',
          duration: 6000
        }}
      />

      {/* Globally Mounted Drill-Site Copilot Chat */}
      <CopilotChat isDarkMode={isDarkMode} />
    </div>
  );
}
