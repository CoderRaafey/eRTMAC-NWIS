import React from 'react';
import { Printer, Download, FileCheck, ShieldAlert, CheckCircle2, Building, FileSpreadsheet } from 'lucide-react';
import { HISTORICAL_EVENTS_DATA, FORMATIONS_DETAIL } from '../data/mockData';

export default function ReportsView({ selectedWell, selectedBasin }) {
  const well = selectedWell || {
    name: 'Well-03',
    code: 'ARB-MH-W03',
    field: 'Mumbai High South',
    depth: '2450 m',
    formation: 'Miocene',
    status: 'ACTIVE',
    risk_badge: 'High Risk'
  };

  const reportId = `REP-NWIS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const timestamp = new Date().toLocaleString();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportPayload = {
      report_id: reportId,
      generated_at: timestamp,
      system: "eRTMAC-NWIS (Nearby Wells Intelligence System)",
      basin: selectedBasin,
      well_data: well,
      lithology_matrix: FORMATIONS_DETAIL,
      offset_incidents: HISTORICAL_EVENTS_DATA,
      signoff: {
        superintendent: "Senior Drilling Superintendent",
        station: "eRTMAC Command Center - Rig-07 Offshore",
        approval_status: "AUTHORIZED FOR REAL-TIME DRILLING"
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportPayload, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `${reportId}_Audit_Package.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-5 max-w-[1400px] w-full mx-auto space-y-4 print:p-0 print:m-0 print:max-w-none">
      {/* Top Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm print:hidden transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            Automated Well Hazard Assessment Report Generator
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Formal engineering pre-spud audit document ready for field export, regulatory compliance, and print dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2.5 print:hidden">
          <button
            onClick={handleDownloadJSON}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition flex items-center gap-2 shadow-sm print:hidden"
          >
            <Download className="w-4 h-4 text-blue-500 dark:text-sky-400" />
            <span>Download Raw Audit JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs border border-blue-500 transition flex items-center gap-2 shadow-md shadow-blue-600/30 print:hidden cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Generate & Print PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl text-slate-800 dark:text-slate-100 space-y-6 print:bg-white print:text-black print:p-0 print:border-none print:shadow-none print:w-full transition-colors">
        {/* Document Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 dark:border-slate-800 print:border-gray-300 pb-5 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded bg-blue-500/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-mono font-bold text-xs print:bg-gray-100 print:text-blue-700 print:border-blue-400">
                OFFICIAL REPORT
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 print:text-gray-500 font-mono">{reportId}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white print:text-black">
              eRTMAC-NWIS Pre-Spud & Real-Time Offset Well Hazard Assessment
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 print:text-gray-600">
              National Water & Petroleum Subsurface Intelligence Division &bull; Real-Time Operations Center
            </p>
          </div>

          <div className="text-right text-xs space-y-1 font-mono text-slate-600 dark:text-slate-400 print:text-gray-600">
            <div>Timestamp: <strong className="text-slate-900 dark:text-slate-200 print:text-black">{timestamp}</strong></div>
            <div>Basin Sector: <strong className="text-blue-600 dark:text-sky-400 print:text-blue-700">{selectedBasin}</strong></div>
            <div>Classification: <strong className="text-rose-600 dark:text-rose-400 print:text-red-700">RESTRICTED DRILLING AUDIT</strong></div>
          </div>
        </div>

        {/* Section 1: Well Profile & Status */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 print:text-gray-700 border-b border-slate-200 dark:border-slate-800 print:border-gray-300 pb-1 flex items-center gap-2">
            <Building className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 print:text-blue-700" />
            1. Target Well Identification & Status
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 print:bg-gray-50 border border-slate-200 dark:border-slate-800/80 print:border-gray-300">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 print:text-gray-500 block">Well Name & Code</span>
              <strong className="text-sm font-bold text-slate-900 dark:text-white print:text-black font-mono mt-0.5 block">{well.name}</strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 print:text-gray-500">{well.code}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 print:bg-gray-50 border border-slate-200 dark:border-slate-800/80 print:border-gray-300">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 print:text-gray-500 block">Operational Field</span>
              <strong className="text-sm font-bold text-slate-800 dark:text-slate-200 print:text-black mt-0.5 block">{well.field || 'Regional Basin'}</strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 print:text-gray-500">{selectedBasin}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 print:bg-gray-50 border border-slate-200 dark:border-slate-800/80 print:border-gray-300">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 print:text-gray-500 block">Current Target Depth</span>
              <strong className="text-sm font-bold text-emerald-600 dark:text-emerald-400 print:text-emerald-700 font-mono mt-0.5 block">{well.depth}</strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 print:text-gray-500">Formation: {well.formation}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 print:bg-gray-50 border border-slate-200 dark:border-slate-800/80 print:border-gray-300">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 print:text-gray-500 block">Hazard Level</span>
              <strong className="text-sm font-bold text-rose-600 dark:text-rose-400 print:text-red-700 font-mono mt-0.5 block">{well.risk_badge || 'High Risk'}</strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 print:text-gray-500">Score: 84 / 100</span>
            </div>
          </div>
        </div>

        {/* Section 2: Stratigraphic Lithology Hazard Matrix */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 print:text-gray-700 border-b border-slate-200 dark:border-slate-800 print:border-gray-300 pb-1 flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 print:text-amber-700" />
            2. Geological Strata & Fracture Gradient Envelope
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 print:border-gray-300">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/50 print:bg-gray-100 text-slate-700 dark:text-slate-300 print:text-gray-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Horizon</th>
                  <th className="p-2.5">Depth Interval</th>
                  <th className="p-2.5">Porosity</th>
                  <th className="p-2.5">Permeability</th>
                  <th className="p-2.5">Pore Pressure</th>
                  <th className="p-2.5">Primary Risk Factor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 print:divide-gray-200 bg-white dark:bg-slate-900/40 print:bg-white text-slate-700 dark:text-slate-200 print:text-gray-800">
                {FORMATIONS_DETAIL.map((f) => (
                  <tr key={f.name}>
                    <td className="p-2.5 font-bold text-slate-900 dark:text-slate-100 print:text-black flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm print:border print:border-gray-400" style={{ backgroundColor: f.color }}></span>
                      <span>{f.name}</span>
                    </td>
                    <td className="p-2.5 font-mono text-slate-600 dark:text-slate-300 print:text-gray-700">{f.depth_interval}</td>
                    <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400 print:text-emerald-700 font-bold">{f.porosity_pct}</td>
                    <td className="p-2.5 font-mono text-blue-600 dark:text-sky-400 print:text-blue-700">{f.permeability_md}</td>
                    <td className="p-2.5 font-mono text-purple-600 dark:text-purple-400 print:text-purple-700">{f.pore_pressure}</td>
                    <td className="p-2.5 text-slate-600 dark:text-slate-300 print:text-gray-700 text-[11px]">{f.risk_warning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Proximal Offset Incidents */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 print:text-gray-700 border-b border-slate-200 dark:border-slate-800 print:border-gray-300 pb-1 flex items-center gap-2">
            <FileCheck className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 print:text-red-700" />
            3. Correlated Offset Well Incident Ledger
          </h3>
          <div className="space-y-2 text-xs">
            {HISTORICAL_EVENTS_DATA.slice(0, 3).map((e) => (
              <div key={e.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 print:bg-gray-50 border border-slate-200 dark:border-slate-800/80 print:border-gray-300 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white print:text-black">{e.event_type}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 print:bg-red-100 print:text-red-800 print:border-red-300 font-bold">
                      {e.severity}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 print:text-gray-600 text-[11px]">in {e.well_id} ({e.depth})</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 print:text-gray-700">{e.root_cause}</p>
                </div>
                <div className="text-right text-[11px] shrink-0 font-mono text-slate-600 dark:text-slate-300 print:text-gray-700">
                  <div>NPT: <strong className="text-amber-600 dark:text-amber-400 print:text-amber-700">{e.impact_npt_hrs} hrs</strong></div>
                  <div>Cost: <strong className="text-rose-600 dark:text-rose-400 print:text-red-700">{e.impact_cost_usd}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Sign-off Block */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 print:border-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 print:bg-gray-50 border border-slate-200 dark:border-slate-800 print:border-gray-300 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:text-gray-600">Technical Approval</span>
            <div className="font-bold text-slate-900 dark:text-white print:text-black text-sm">Senior Drilling Superintendent</div>
            <div className="text-slate-500 dark:text-slate-400 print:text-gray-600 text-[11px]">eRTMAC Command Center - Rig-07 Offshore</div>
            <div className="text-emerald-600 dark:text-emerald-400 print:text-emerald-700 text-[11px] font-bold flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>DIGITALLY SIGNED &amp; VERIFIED VIA WITSML TOKEN</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 print:bg-gray-50 border border-slate-200 dark:border-slate-800 print:border-gray-300 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:text-gray-600">Well Barrier Envelope Status</span>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 print:text-emerald-700 text-sm">DUAL BARRIER INTEGRITY CONFIRMED</div>
            <div className="text-slate-500 dark:text-slate-400 print:text-gray-600 text-[11px]">BOP Annular &amp; Blind Shear Rams Certified to 10,000 psi</div>
            <div className="text-slate-400 dark:text-slate-500 print:text-gray-500 text-[10px]">Next mandatory pit test due in 72 hours</div>
          </div>
        </div>
      </div>
    </div>
  );
}
