import React from 'react';
import {
  LayoutDashboard,
  Search,
  Layers,
  FileText,
  AlertTriangle,
  Map as MapIcon,
  BarChart3,
  Settings
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'Well Search', label: 'Well Search', icon: Search },
  { id: 'Formation Analysis', label: 'Formation Analysis', icon: Layers },
  { id: 'Historical Events', label: 'Historical Events', icon: FileText },
  { id: 'Risk Analysis', label: 'Risk Analysis', icon: AlertTriangle },
  { id: 'Maps & Visualization', label: 'Maps & Visualization', icon: MapIcon },
  { id: 'Reports', label: 'Reports', icon: BarChart3 },
  { id: 'Settings', label: 'Settings', icon: Settings },
];

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

export default function Sidebar({ activeTab, onSelectTab, backendConnected = true }) {
  return (
    <aside className="w-56 shrink-0 bg-white dark:bg-[#0d1424] border-r border-slate-200 dark:border-slate-800/80 flex flex-col justify-between z-40 select-none print:hidden transition-colors">
      <div>
        {/* Brand Header */}
        <div
          onClick={() => onSelectTab('Dashboard')}
          className="p-4 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800/60 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/20 transition"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white border border-orange-400/40">
            <OilRigIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center text-base font-extrabold tracking-tight">
              <span className="text-slate-900 dark:text-white">eRTMAC-</span>
              <span className="text-amber-500">NWIS</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
              Nearby Wells Intelligence System
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Backend Status indicator */}
      <div className="p-3 m-3 rounded-lg bg-slate-50 dark:bg-[#11192e] border border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
          <span className="text-[10px] font-medium">FastAPI: 8000</span>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">v1.2.0</span>
      </div>
    </aside>
  );
}
