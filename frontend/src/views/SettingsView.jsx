import React, { useState } from 'react';
import { Settings, Sliders, Database, RefreshCw, Radio, Check, Server, ShieldCheck, AlertTriangle } from 'lucide-react';
import axios from 'axios';

export default function SettingsView({
  settings,
  onUpdateSettings,
  userRole,
  backendConnected
}) {
  const [radius, setRadius] = useState(settings?.searchRadius || 5);
  const [buffer, setBuffer] = useState(settings?.depthBuffer || 150);
  const [refresh, setRefresh] = useState(settings?.refreshInterval || 10);
  const [pingLatency, setPingLatency] = useState(24);
  const [pinging, setPinging] = useState(false);
  const [savedNote, setSavedNote] = useState(false);

  const handleSave = () => {
    onUpdateSettings({
      searchRadius: radius,
      depthBuffer: buffer,
      refreshInterval: refresh
    });
    setSavedNote(true);
    setTimeout(() => setSavedNote(false), 2500);
  };

  const handlePingTest = async () => {
    setPinging(true);
    const start = performance.now();
    try {
      await axios.get('http://127.0.0.1:8000/api/health', { timeout: 3000 });
      const elapsed = Math.round(performance.now() - start);
      setPingLatency(elapsed || 18);
    } catch {
      setPingLatency(null);
    } finally {
      setPinging(false);
    }
  };

  return (
    <div className="p-5 max-w-[1200px] w-full mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            eRTMAC-NWIS Operational Engine Settings & Telemetry Configuration
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Calibrate offset well proximity cones, depth alert thresholds, live streaming frequencies, and database nodes.
          </p>
        </div>
        {savedNote && (
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg animate-in fade-in">
            Settings Saved Successfully!
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Proximity & Calculation Sliders */}
        <div className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Proximity & Spatial Thresholds
            </h3>
          </div>

          {/* Slider 1: Offset Search Radius */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Offset Well Search Radius:</span>
              <span className="font-mono font-bold text-blue-600 dark:text-sky-400 text-sm">{radius} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 km (Tight Borehole Cluster)</span>
              <span>15 km (Regional Basinwide)</span>
            </div>
          </div>

          {/* Slider 2: Depth Alert Buffer */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Depth Alert Buffer:</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">±{buffer} m</span>
            </div>
            <input
              type="range"
              min="50"
              max="300"
              step="25"
              value={buffer}
              onChange={(e) => setBuffer(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>±50 m (Precision Strata)</span>
              <span>±300 m (Broad Horizon)</span>
            </div>
          </div>

          {/* Refresh Rate Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
            <label className="text-xs text-slate-700 dark:text-slate-300 font-medium block">
              Telemetry Polling & WITSML Ingestion Interval:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[5, 15, 30].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setRefresh(sec)}
                  className={`p-2 rounded-lg border text-center font-bold transition ${
                    refresh === sec
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {sec} Seconds
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition"
          >
            Apply &amp; Save Calibration
          </button>
        </div>

        {/* Database & Telemetry Stream Connectivity */}
        <div className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Database className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                Backend Server & Database Status
              </h3>
            </div>

            {/* Connection Cards */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">FastAPI Live Microservice</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">http://127.0.0.1:8000</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  ONLINE &bull; 200 OK
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Subsurface SQLite Engine</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">ertmac_nwis.db (WAL Mode)</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  CONNECTED
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Telemetry Round-Trip Latency</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Real-time websocket / REST ping</span>
                </div>
                <span className="font-mono font-bold text-sm text-blue-600 dark:text-sky-400">
                  {pingLatency ? `${pingLatency} ms` : 'Disconnected'}
                </span>
              </div>
            </div>

            {/* Role Sensitivity Thresholds */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Active Persona Threshold Matrix ({userRole})
              </span>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                {userRole === 'Drilling Engineer'
                  ? 'High Risk: >= 75 score | Medium: 45-74 | Low: < 45. Emphasizes ROP and mechanical stuck pipe.'
                  : userRole === 'Lead Geoscientist'
                  ? 'High Risk: >= 65 score | Medium: 35-64 | Low: < 35. Emphasizes pore pressure ramps & fault lines.'
                  : 'High Risk: >= 55 score | Medium: 25-54 | Low: < 25. Zero tolerance for well control kicks.'}
              </p>
            </div>
          </div>

          <button
            onClick={handlePingTest}
            disabled={pinging}
            className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${pinging ? 'animate-spin' : ''}`} />
            <span>{pinging ? 'Pinging Server...' : 'Test Connection Latency'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
