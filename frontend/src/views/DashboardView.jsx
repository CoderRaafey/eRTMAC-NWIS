import React from 'react';
import WellMap from '../components/WellMap';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Oil Rig / Drilling Derrick SVG Icon
const OilRigIcon = ({ className = "w-5 h-5", strokeWidth = 2 }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 22h16" />
    <path d="M7 22l4-18h2l4 18" />
    <path d="M8 17h8" />
    <path d="M9.5 12h5" />
    <path d="M10.8 7h2.4" />
    <path d="M12 4V2" />
    <path d="M8 22l7-10" />
    <path d="M16 22l-7-10" />
  </svg>
);

const FormationsIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M21 8.5c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M21 15.5c0 1.66-4 3-9 3s-9-1.34-9-3" />
  </svg>
);

export default function DashboardView({
  kpis,
  basinData,
  selectedWell,
  onSelectWell,
  riskIndex,
  drillingTrends,
  selectedMetric,
  onChangeMetric,
  onNavigate,
  isDarkMode = true
}) {

  return (
    <div className="space-y-3.5 max-w-[1600px] w-full mx-auto p-3.5">
      {/* -------------------- 4 KPI METRIC CARDS -------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Total Wells */}
        <div
          onClick={() => onNavigate('Well Search')}
          className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between shadow-sm relative overflow-hidden cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <OilRigIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Wells</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{kpis.total_wells?.value || '1,284'}</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>{kpis.total_wells?.trend || '↑ 12%'}</span>
              </div>
            </div>
          </div>
          <div className="w-16 h-8 text-blue-500 dark:text-blue-400 shrink-0">
            <svg viewBox="0 0 64 24" className="w-full h-full stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 18 L14 14 L26 16 L38 9 L50 11 L62 4" />
            </svg>
          </div>
        </div>

        {/* Card 2: Formations */}
        <div
          onClick={() => onNavigate('Formation Analysis')}
          className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between shadow-sm relative overflow-hidden cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <FormationsIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Formations</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{kpis.formations?.value || '356'}</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>{kpis.formations?.trend || '↑ 8%'}</span>
              </div>
            </div>
          </div>
          <div className="w-16 h-8 text-emerald-500 dark:text-emerald-400 shrink-0">
            <svg viewBox="0 0 64 24" className="w-full h-full stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 19 L15 16 L28 17 L40 10 L52 11 L62 5" />
            </svg>
          </div>
        </div>

        {/* Card 3: Historical Events */}
        <div
          onClick={() => onNavigate('Historical Events')}
          className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between shadow-sm relative overflow-hidden cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 dark:bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Historical Events</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{kpis.historical_events?.value || '4,892'}</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>{kpis.historical_events?.trend || '↑ 15%'}</span>
              </div>
            </div>
          </div>
          <div className="w-16 h-8 text-purple-500 dark:text-purple-400 shrink-0">
            <svg viewBox="0 0 64 24" className="w-full h-full stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 20 L14 17 L26 19 L38 12 L50 14 L62 6" />
            </svg>
          </div>
        </div>

        {/* Card 4: Active Risk Alerts */}
        <div
          onClick={() => onNavigate('Risk Analysis')}
          className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between shadow-sm relative overflow-hidden cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/10 dark:bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <svg className="w-5 h-5 text-rose-600 dark:text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Active Risk Alerts</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{kpis.active_risk_alerts?.value || '12'}</p>
              <div className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                <span>{kpis.active_risk_alerts?.trend || '↑ 3 new'}</span>
              </div>
            </div>
          </div>
          <div className="w-16 h-8 text-rose-500 dark:text-rose-400 shrink-0">
            <svg viewBox="0 0 64 24" className="w-full h-full stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 18 L15 15 L28 17 L40 11 L52 14 L62 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* -------------------- WELL MAP SECTION -------------------- */}
      <WellMap
        basinData={basinData}
        selectedWell={selectedWell}
        onSelectWell={onSelectWell}
        onNavigate={onNavigate}
        isDarkMode={isDarkMode}
      />

      {/* -------------------- BOTTOM ANALYTICS ROW (3 CARDS) -------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Card 1: Well Correlation */}
        <div
          onClick={() => onNavigate('Formation Analysis')}
          className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex flex-col cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
              Well Correlation
            </h3>
            <span className="text-[10px] text-blue-600 dark:text-sky-400 hover:underline">Workbench &rarr;</span>
          </div>

          <div className="flex-1 flex gap-2 items-stretch min-h-[200px]">
            <div className="flex-1 relative flex flex-col justify-between">
              <div className="flex justify-between pl-10 pr-4 text-[11px] font-semibold text-slate-700 dark:text-slate-300 pb-1">
                <span>Well-01</span>
                <span>Well-03</span>
                <span>Well-05</span>
              </div>

              <div className="flex-1 relative flex items-center">
                <svg viewBox="0 0 320 180" className="w-full h-full">
                  <g className="text-[9px] fill-slate-500 dark:fill-slate-400 font-sans">
                    <text x="5" y="15">0</text>
                    <text x="5" y="55">1,000</text>
                    <text x="5" y="95">2,000</text>
                    <text x="5" y="135">3,000</text>
                    <text x="5" y="175">4,000</text>
                    <text x="-120" y="2" transform="rotate(-90)" className="text-[8px] fill-slate-500 dark:fill-slate-400">Depth (m)</text>
                  </g>

                  {/* Connecting Ribbon Polygons */}
                  <polygon points="65,10 65,40 160,45 160,10" fill="#f59e0b" fillOpacity="0.45" />
                  <polygon points="160,10 160,45 255,42 255,10" fill="#f59e0b" fillOpacity="0.45" />

                  <polygon points="65,40 65,85 160,88 160,45" fill="#64748b" fillOpacity="0.45" />
                  <polygon points="160,45 160,88 255,84 255,42" fill="#64748b" fillOpacity="0.45" />

                  <polygon points="65,85 65,115 160,118 160,88" fill="#38bdf8" fillOpacity="0.45" />
                  <polygon points="160,88 160,118 255,116 255,84" fill="#38bdf8" fillOpacity="0.45" />

                  <polygon points="65,115 65,145 160,148 160,118" fill="#ef4444" fillOpacity="0.55" />
                  <polygon points="160,118 160,148 255,142 255,116" fill="#ef4444" fillOpacity="0.55" />

                  <polygon points="65,145 65,175 160,175 160,148" fill="#14b8a6" fillOpacity="0.45" />
                  <polygon points="160,148 160,175 255,175 255,142" fill="#14b8a6" fillOpacity="0.45" />

                  {/* Columns */}
                  <rect x="50" y="10" width="30" height="30" fill="#f59e0b" rx="2" />
                  <rect x="50" y="40" width="30" height="45" fill="#64748b" rx="2" />
                  <rect x="50" y="85" width="30" height="30" fill="#38bdf8" rx="2" />
                  <rect x="50" y="115" width="30" height="30" fill="#ef4444" rx="2" />
                  <rect x="50" y="145" width="30" height="30" fill="#14b8a6" rx="2" />

                  <rect x="145" y="10" width="30" height="35" fill="#f59e0b" rx="2" />
                  <rect x="145" y="45" width="30" height="43" fill="#64748b" rx="2" />
                  <rect x="145" y="88" width="30" height="30" fill="#38bdf8" rx="2" />
                  <rect x="145" y="118" width="30" height="30" fill="#ef4444" rx="2" />
                  <rect x="145" y="148" width="30" height="27" fill="#14b8a6" rx="2" />

                  <rect x="240" y="10" width="30" height="32" fill="#f59e0b" rx="2" />
                  <rect x="240" y="42" width="30" height="42" fill="#64748b" rx="2" />
                  <rect x="240" y="84" width="30" height="32" fill="#38bdf8" rx="2" />
                  <rect x="240" y="116" width="30" height="26" fill="#ef4444" rx="2" />
                  <rect x="240" y="142" width="30" height="33" fill="#14b8a6" rx="2" />
                </svg>
              </div>
            </div>

            <div className="w-24 shrink-0 flex flex-col justify-center space-y-2.5 text-[11px] border-l border-slate-200 dark:border-slate-800/80 pl-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#f59e0b]"></span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Sandstone</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#64748b]"></span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Shale</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#38bdf8]"></span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Limestone</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#ef4444]"></span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Reservoir</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#14b8a6]"></span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Other</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Risk Index */}
        <div
          onClick={() => onNavigate('Risk Analysis')}
          className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex flex-col justify-between cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition"
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
              Risk Index
            </h3>
            <span className="text-[10px] text-blue-600 dark:text-sky-400 hover:underline">Matrix &rarr;</span>
          </div>

          <div className="relative h-40 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskIndex.segments}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={72}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {riskIndex.segments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke={isDarkMode ? "#11192e" : "#ffffff"} strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{riskIndex.score}</span>
              <span className="text-xs font-semibold text-amber-500 dark:text-amber-400">{riskIndex.label}</span>
            </div>
          </div>

          <div className="space-y-1 pt-1 text-xs border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
                <span className="text-slate-600 dark:text-slate-300">High Risk</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-slate-100">{riskIndex.high_risk}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
                <span className="text-slate-600 dark:text-slate-300">Medium Risk</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-slate-100">{riskIndex.medium_risk}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-500"></span>
                <span className="text-slate-600 dark:text-slate-300">Low Risk</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-slate-100">{riskIndex.low_risk}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Drilling Trends */}
        <div className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
              Drilling Trends
            </h3>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-[#141d33] border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
              <select
                value={selectedMetric}
                onChange={(e) => onChangeMetric(e.target.value)}
                className="bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="ROP" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">ROP (m/hr)</option>
                <option value="WOB" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">WOB (klbs)</option>
                <option value="RPM" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">RPM</option>
                <option value="Torque" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Torque</option>
              </select>
            </div>
          </div>

          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={drillingTrends} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#1e293b" : "#e2e8f0"} vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke={isDarkMode ? "#64748b" : "#94a3b8"}
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: isDarkMode ? '#334155' : '#cbd5e1' }}
                />
                <YAxis
                  stroke={isDarkMode ? "#64748b" : "#94a3b8"}
                  fontSize={10}
                  domain={[0, 'dataMax + 20']}
                  tickLine={false}
                  axisLine={{ stroke: isDarkMode ? '#334155' : '#cbd5e1' }}
                  label={{ value: selectedMetric, angle: -90, position: 'insideLeft', offset: 28, fill: isDarkMode ? '#64748b' : '#94a3b8', fontSize: 9 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                    color: isDarkMode ? '#f8fafc' : '#0f172a',
                    borderRadius: '8px',
                    fontSize: '11px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 'bold' }}
                />
                <Line
                  type="monotone"
                  dataKey="Well-01"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3.5, fill: '#3b82f6', stroke: isDarkMode ? '#11192e' : '#ffffff', strokeWidth: 1.5 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="Well-03"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ r: 3.5, fill: '#f97316', stroke: isDarkMode ? '#11192e' : '#ffffff', strokeWidth: 1.5 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="Well-05"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3.5, fill: '#10b981', stroke: isDarkMode ? '#11192e' : '#ffffff', strokeWidth: 1.5 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-1.5 text-[11px] border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Well-01</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Well-03</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Well-05</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
