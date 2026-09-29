import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, ChevronDown, User, ShieldAlert, Cpu, Radio, Check, X, Sun, Moon } from 'lucide-react';

const BASINS = [
  "Arabian Sea (Offshore)",
  "Assam Shelf (Onshore)",
  "Rajasthan Basin",
  "KG Deepwater"
];

const ROLES = [
  { id: "Drilling Engineer", label: "Drilling Engineer", desc: "Focus on ROP, torque, hydraulics & mechanical stuck pipe", threshold: "Standard Operational (80% / 60%)" },
  { id: "Lead Geoscientist", label: "Lead Geoscientist", desc: "Focus on pore pressure, seismic faults & lithology correlation", threshold: "Geological Precautionary (70% / 50%)" },
  { id: "Risk Safety Officer", label: "Risk Safety Officer", desc: "Focus on well control, H2S/gas kicks & blowout barrier envelopes", threshold: "Zero-Tolerance Safety (60% / 40%)" }
];

export default function Header({
  selectedBasin,
  onSelectBasin,
  userRole,
  onChangeRole,
  onNavigate,
  onSelectWell,
  allWells = [],
  allEvents = [],
  allFormations = [],
  isSimulating = false,
  onToggleSimulation,
  currentDepth = 2350,
  isDarkMode = true,
  onToggleDarkMode
}) {
  const [basinDropdownOpen, setBasinDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const basinRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (basinRef.current && !basinRef.current.contains(e.target)) {
        setBasinDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileModalOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search results across Wells, Formations, and Incidents
  const filteredResults = searchQuery.trim().length > 0 ? {
    wells: allWells.filter(w =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.field && w.field.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 4),
    formations: allFormations.filter(f =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.risk_warning.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3),
    events: allEvents.filter(e =>
      e.event_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.well_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.root_cause.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3)
  } : null;

  const hasSearchResults = filteredResults && (
    filteredResults.wells.length > 0 ||
    filteredResults.formations.length > 0 ||
    filteredResults.events.length > 0
  );

  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0d1424]/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40 shrink-0 print:hidden transition-colors">
      {/* Global Interactive Search Bar */}
      <div className="relative w-80 md:w-96" ref={searchRef}>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            placeholder="Search well, formation, event... (Type 'Miocene', 'Kick', 'Well-03')"
            className="w-full bg-slate-100 dark:bg-[#141d33] border border-slate-200 dark:border-slate-700/60 rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dynamic Search Suggestions Dropdown */}
        {searchFocused && searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs max-h-80 overflow-y-auto space-y-2">
            {!hasSearchResults ? (
              <div className="p-3 text-slate-500 dark:text-slate-400 text-center">
                No matching wells, formations, or incidents found for "{searchQuery}".
              </div>
            ) : (
              <>
                {filteredResults.wells.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 px-2 py-1">
                      Wells
                    </div>
                    {filteredResults.wells.map(w => (
                      <button
                        key={w.id}
                        onClick={() => {
                          onSelectWell(w);
                          onNavigate('Dashboard');
                          setSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition"
                      >
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{w.name}</span>
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] ml-2">({w.field || 'Basin'}) &bull; {w.depth}</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          w.status === 'ACTIVE' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' :
                          w.status === 'HIGH_RISK' ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {w.risk_badge || w.status}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {filteredResults.formations.length > 0 && (
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 px-2 py-1">
                      Formations & Strata
                    </div>
                    {filteredResults.formations.map(f => (
                      <button
                        key={f.name}
                        onClick={() => {
                          onNavigate('Formation Analysis');
                          setSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition"
                      >
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{f.name}</span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">{f.depth_interval}</span>
                      </button>
                    ))}
                  </div>
                )}

                {filteredResults.events.length > 0 && (
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 px-2 py-1">
                      Historical Incidents
                    </div>
                    {filteredResults.events.map(e => (
                      <button
                        key={e.id}
                        onClick={() => {
                          onNavigate('Historical Events');
                          setSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition"
                      >
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{e.event_type}</span>
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] ml-2">in {e.well_id} ({e.depth})</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          e.severity === 'High' ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                        }`}>
                          {e.severity}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right Header Controls */}
      <div className="flex items-center gap-3">
        {/* Simulate Live Drilling Toggle Button */}
        <button
          onClick={onToggleSimulation}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition shadow-sm cursor-pointer ${
            isSimulating
              ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-300 ring-1 ring-emerald-500/40 shadow-emerald-950/50'
              : 'bg-slate-100 dark:bg-[#141d33] border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-white'
          }`}
          title={isSimulating ? 'Click to pause drilling simulator' : 'Click to start live drilling simulation'}
        >
          {isSimulating ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>Drilling: <strong className="font-mono text-white">{currentDepth}m</strong></span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/30 text-emerald-200 font-bold uppercase tracking-wider">
                LIVE
              </span>
            </>
          ) : (
            <>
              <Radio className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              <span>Simulate Live Drilling</span>
            </>
          )}
        </button>

        {/* Basin Dropdown */}
        <div className="relative" ref={basinRef}>
          <button
            onClick={() => setBasinDropdownOpen(!basinDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#141d33] border border-slate-200 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 transition shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
            <span className="font-semibold">{selectedBasin}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 transition-transform ${basinDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {basinDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-60 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 text-xs space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Select Operational Basin
              </div>
              {BASINS.map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    onSelectBasin(b);
                    setBasinDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition ${
                    selectedBasin === b
                      ? 'bg-blue-600/20 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{b}</span>
                  {selectedBasin === b && <Check className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle Button (Light / Dark Mode) */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg bg-slate-100 dark:bg-[#141d33] border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:border-slate-400 dark:hover:border-slate-600 transition shadow-sm cursor-pointer"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Light / Dark Mode"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
          )}
        </button>

        {/* User Profile & Role Modal */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileModalOpen(!profileModalOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#141d33] border border-slate-200 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 transition shadow-sm"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-600 dark:text-blue-300">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold">{userRole}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 transition-transform ${profileModalOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileModalOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 z-50 text-xs space-y-3.5 animate-in fade-in duration-150">
              {/* Profile Card Header */}
              <div className="flex items-start gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">Senior Drilling Superintendent</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate">eRTMAC Command Center (Rig-07 Offshore)</div>
                </div>
              </div>

              {/* Status Stream */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 animate-pulse" />
                    eRTMAC Telemetry Stream
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">24 ms latency</span>
                </div>
                <div className="text-slate-500 text-[10px]">
                  Real-time WITSML / OPC-UA feeds online
                </div>
              </div>

              {/* Role Switcher */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Switch Operational Persona & Sensitivity
                </div>
                <div className="space-y-1.5">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => onChangeRole(r.id)}
                      className={`w-full text-left p-2.5 rounded-xl border transition ${
                        userRole === r.id
                          ? 'bg-blue-600/15 border-blue-500/50 text-blue-700 dark:text-white shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span>{r.label}</span>
                        {userRole === r.id && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{r.desc}</p>
                      <p className="text-[10px] text-amber-600 dark:text-amber-400/90 font-medium mt-1">Alert: {r.threshold}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
