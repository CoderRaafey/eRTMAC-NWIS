import React, { useState } from 'react';
import { Layers, AlertTriangle, Info, CheckCircle2, ChevronRight, Activity, Gauge } from 'lucide-react';
import { FORMATIONS_DETAIL } from '../data/mockData';

export default function FormationAnalysisView({ selectedWell }) {
  const [selectedFormation, setSelectedFormation] = useState(FORMATIONS_DETAIL[1]); // Default to Shale
  const [selectedWellLog, setSelectedWellLog] = useState(selectedWell?.name || 'Well-03');

  return (
    <div className="p-5 max-w-[1600px] w-full mx-auto space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            Stratigraphic Correlation & Lithology Workbench
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Cross-well formation strata correlation, rock mechanical properties, pore pressure evaluation, and formation-specific drilling risks.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-600 dark:text-slate-400">Inspecting Well Log:</span>
          <select
            value={selectedWellLog}
            onChange={(e) => setSelectedWellLog(e.target.value)}
            className="bg-slate-100 dark:bg-[#141d33] border border-slate-200 dark:border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value="Well-01" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Well-01 (Bassein)</option>
            <option value="Well-03" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Well-03 (Active - Mumbai High)</option>
            <option value="Well-05" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Well-05 (Ratna Deep)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Visual Wellbore Stratigraphy Column (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col space-y-3 shadow-sm transition-colors">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Subsurface Lithology Column
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Click any strata layer to inspect petrophysical properties</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-sky-400">{selectedWellLog}</span>
          </div>

          {/* Interactive Stacked Strata Column */}
          <div className="space-y-2 flex-1 flex flex-col justify-between py-1">
            {FORMATIONS_DETAIL.map((formation) => {
              const isSelected = selectedFormation.name === formation.name;
              return (
                <button
                  key={formation.name}
                  onClick={() => setSelectedFormation(formation)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600/10 dark:bg-blue-600/20 border-blue-500 shadow-md ring-1 ring-blue-500/30'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-4 h-10 rounded-md shrink-0 border border-black/30 shadow-sm"
                      style={{ backgroundColor: formation.color }}
                    ></span>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-2">
                        <span>{formation.name}</span>
                        {formation.name.includes('Reservoir') && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/40">
                            PAY ZONE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                        {formation.depth_interval}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Porosity</div>
                      <div className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">{formation.porosity_pct}</div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isSelected ? 'translate-x-1 text-blue-600 dark:text-blue-400' : ''}`} />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span>Total Logged Interval: <strong className="text-slate-800 dark:text-slate-200">4,200m MD / 3,850m TVD</strong></span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active Caliper: 8.5" bit</span>
          </div>
        </div>

        {/* Right Column: Deep Petrophysical Properties & Hazard Warnings (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Strata Title Card */}
          <div className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedFormation.color }}
                ></span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    {selectedFormation.name} Lithology Profile
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Interval: {selectedFormation.depth_interval}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                Active Inspection
              </span>
            </div>

            {/* 4 Petrophysical KPI Gauges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Estimated Porosity</span>
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{selectedFormation.porosity_pct}</div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: selectedFormation.porosity_pct }}></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Permeability (mD)</span>
                <div className="text-lg font-bold text-blue-600 dark:text-sky-400 font-mono mt-0.5">{selectedFormation.permeability_md}</div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Fracture Gradient</span>
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono mt-1">{selectedFormation.fracture_gradient}</div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Maximum ECD limit</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Pore Pressure Gradient</span>
                <div className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono mt-1">{selectedFormation.pore_pressure}</div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Kick threshold</span>
              </div>
            </div>

            {/* Mineralogy & Geomechanical Properties */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                  Mineralogy Composition
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {selectedFormation.mineralogy}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  Unconfined Compressive Strength (UCS)
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {selectedFormation.compressive_strength}
                </p>
              </div>
            </div>

            {/* Formation-Specific Risk Warning Box */}
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Geological Hazard Assessment & Mitigation Protocol:</span>
              </div>
              <p className="text-xs text-rose-700 dark:text-rose-200 leading-relaxed font-medium">
                {selectedFormation.risk_warning}
              </p>
              <div className="pt-1 flex flex-wrap gap-2 text-[10px]">
                <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-medium">
                  Recommended MW: 11.2 - 11.8 ppg
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-medium">
                  LCM Pill On Standby: 50 ppb
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-medium">
                  Trip Speed Limit: &lt; 25 m/min
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
