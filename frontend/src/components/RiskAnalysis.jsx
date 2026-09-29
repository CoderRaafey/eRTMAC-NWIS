import React, { useState, useMemo } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { HISTORICAL_EVENTS_DATA } from '../data/mockData';

export default function RiskAnalysis({ selectedWell, depthBuffer = 150 }) {
  const [localBuffer, setLocalBuffer] = useState(depthBuffer);
  const activeDepth = selectedWell?.depth_num || 2450;

  // Filter offset incidents within +/- buffer of active depth
  const proximalIncidents = useMemo(() => {
    return HISTORICAL_EVENTS_DATA.filter((e) => {
      const diff = Math.abs(e.depth_num - activeDepth);
      return diff <= localBuffer;
    });
  }, [activeDepth, localBuffer]);

  return (
    <div className="p-5 max-w-[1600px] w-full mx-auto space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500 dark:text-rose-400" />
            Offset-Well Proximity Risk Matrix & Hazard Prediction
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Real-time depth horizon correlation comparing active borehole bit position against nearby offset incidents.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-100 dark:bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400">Target Well:</span>
          <strong className="text-blue-600 dark:text-sky-400 font-mono">{selectedWell?.name || 'Well-03'}</strong>
          <span className="text-slate-300 dark:text-slate-500">|</span>
          <span className="text-slate-500 dark:text-slate-400">Bit Depth:</span>
          <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{activeDepth} m</strong>
        </div>
      </div>

      {/* Real-time Depth Proximity Warning Banner */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
        proximalIncidents.length > 0
          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-600/50 shadow-sm'
          : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-600/40'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl shrink-0 ${proximalIncidents.length > 0 ? 'bg-rose-500/10 dark:bg-rose-600/20 text-rose-600 dark:text-rose-400' : 'bg-emerald-500/10 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400'}`}>
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {proximalIncidents.length > 0
                  ? `Depth Proximity Alert: ${proximalIncidents.length} Offset Incidents within ±${localBuffer}m Horizon!`
                  : `Clear Geological Horizon within ±${localBuffer}m Buffer`}
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/40">
                Active Zone
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
              Monitoring bit interval ({activeDepth - localBuffer}m to {activeDepth + localBuffer}m).
              {proximalIncidents.length > 0
                ? " Correlated offset well logs indicate high risk of sudden mud loss and abnormal pressure ramp."
                : " No major non-productive time incidents recorded by offset boreholes at this specific interval."}
            </p>
          </div>
        </div>

        {/* Live Depth Buffer Slider */}
        <div className="bg-white dark:bg-[#11192e] p-3 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 w-full md:w-64 space-y-1 shadow-sm">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400">Proximity Buffer:</span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">±{localBuffer}m</span>
          </div>
          <input
            type="range"
            min="50"
            max="300"
            step="25"
            value={localBuffer}
            onChange={(e) => setLocalBuffer(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Hazard Severity Breakdown Cards (5 Categories) with Financial NPT Quantification */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Card 1: Lost Circulation */}
        <div className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Lost Circulation</span>
            <span className="text-xs font-mono font-extrabold text-rose-600 dark:text-rose-400">78%</span>
          </div>
          
          {/* Bold red financial metric under risk percentage */}
          <div className="text-[11px] font-bold text-red-600 dark:text-red-500 tracking-tight leading-tight">
            Estimated NPT Risk: 48 Hours | Financial Exposure: ₹12,00,000
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: '78%' }}></div>
          </div>

          <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/60">
            <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold block">CRITICAL RISK &bull; Carbonates</span>
            <span className="inline-flex items-center self-start px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
              Residual Exposure: ₹2,40,000
            </span>
          </div>
        </div>

        {/* Card 2: Pipe Sticking */}
        <div className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pipe Sticking</span>
            <span className="text-xs font-mono font-extrabold text-amber-600 dark:text-amber-400">42%</span>
          </div>

          {/* Bold red financial metric under risk percentage */}
          <div className="text-[11px] font-bold text-red-600 dark:text-red-500 tracking-tight leading-tight">
            Estimated NPT Risk: 24 Hours | Financial Exposure: ₹6,00,000
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '42%' }}></div>
          </div>

          <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/60">
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block">MODERATE &bull; Reactive Shales</span>
            <span className="inline-flex items-center self-start px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
              Residual Exposure: ₹1,50,000
            </span>
          </div>
        </div>

        {/* Card 3: Wellbore Instability */}
        <div className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Wellbore Instability</span>
            <span className="text-xs font-mono font-extrabold text-amber-600 dark:text-amber-400">61%</span>
          </div>

          <div className="text-[11px] font-bold text-red-600 dark:text-red-500 tracking-tight leading-tight">
            Estimated NPT Risk: 32 Hours | Financial Exposure: ₹8,50,000
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '61%' }}></div>
          </div>

          <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/60">
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block">ELEVATED &bull; Fault zones</span>
            <span className="inline-flex items-center self-start px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
              Residual Exposure: ₹1,80,000
            </span>
          </div>
        </div>

        {/* Card 4: Differential Sticking */}
        <div className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Differential Sticking</span>
            <span className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400">35%</span>
          </div>

          <div className="text-[11px] font-bold text-red-600 dark:text-red-500 tracking-tight leading-tight">
            Estimated NPT Risk: 18 Hours | Financial Exposure: ₹3,00,000
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '35%' }}></div>
          </div>

          <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/60">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">CONTROLLED &bull; Filter cake OK</span>
            <span className="inline-flex items-center self-start px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
              Residual Exposure: ₹80,000
            </span>
          </div>
        </div>

        {/* Card 5: Gas Influx / Kick */}
        <div className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Gas Influx / Kick</span>
            <span className="text-xs font-mono font-extrabold text-amber-600 dark:text-amber-400">54%</span>
          </div>

          <div className="text-[11px] font-bold text-red-600 dark:text-red-500 tracking-tight leading-tight">
            Estimated NPT Risk: 36 Hours | Financial Exposure: ₹9,50,000
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '54%' }}></div>
          </div>

          <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/60">
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block">MODERATE &bull; Gas cap near</span>
            <span className="inline-flex items-center self-start px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
              Residual Exposure: ₹2,00,000
            </span>
          </div>
        </div>
      </div>

      {/* Actionable Decision Support Recommendations & Proximal Events List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Preventative Recommendations */}
        <div className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 shadow-sm transition-colors">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Actionable Decision Support Recommendations
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40">
              Total Residual Exposure: ₹8,50,000
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
              <div className="flex-1">
                <strong className="text-slate-900 dark:text-slate-100 block">Increase Mud Weight before entering Lower Miocene (2,480m)</strong>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-1 leading-relaxed">
                  Raise active system mud weight from 11.2 ppg to 11.8 ppg to counteract the abnormal 0.62 psi/ft pore pressure ramp documented in Well-04.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
              <div className="flex-1">
                <strong className="text-slate-900 dark:text-slate-100 block">Spot LCM Pill (50 ppb Nutplug / Mica) prior to Carbonate Intersection</strong>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-1 leading-relaxed">
                  Have 80 bbl coarse/medium fiber pill blended in pill pit. Reduce annular flow rate by 15% when ROP drops suddenly in fractured limestone.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
              <div className="flex-1">
                <strong className="text-slate-900 dark:text-slate-100 block">Maintain Rotary Table Speed &lt; 90 RPM & Monitor Stick-Slip</strong>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-1 leading-relaxed">
                  Well-01 experienced a 28 kft-lbs torque spike in the Pliocene/Miocene boundary stringer. Keep high-frequency MWD vibration monitoring enabled.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">4</span>
              <div className="flex-1">
                <strong className="text-slate-900 dark:text-slate-100 block">Dual Barrier Verification at 2,420m Casing Shoe</strong>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-1 leading-relaxed">
                  Perform positive & negative inflow test on the intermediate liner before penetrating hydrocarbon pay zone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Proximal Incidents Table */}
        <div className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 shadow-sm transition-colors">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400" />
              Offset Borehole Incidents within Horizon (±{localBuffer}m)
            </h3>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{proximalIncidents.length} Match(es)</span>
          </div>

          <div className="space-y-2">
            {proximalIncidents.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                No offset well incidents recorded in this exact depth window.
              </div>
            ) : (
              proximalIncidents.map((inc) => (
                <div key={inc.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{inc.event_type}</span>
                    <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">{inc.depth}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Offset Borehole: <strong className="text-blue-600 dark:text-sky-300">{inc.well_id}</strong> &bull; Formation: {inc.formation}
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-950/60 p-2 rounded border border-slate-200 dark:border-slate-800">
                    {inc.root_cause}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
