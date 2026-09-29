import React, { useState, useMemo } from 'react';
import { FileText, Download, Filter, AlertTriangle, Clock, IndianRupee, ChevronDown, CheckCircle2 } from 'lucide-react';
import { HISTORICAL_EVENTS_DATA } from '../data/mockData';

export default function HistoricalEventsView({ events = HISTORICAL_EVENTS_DATA }) {
  const [eventTypeFilter, setEventTypeFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesType = eventTypeFilter === 'All' || e.event_type.toLowerCase() === eventTypeFilter.toLowerCase();
      const matchesSeverity = severityFilter === 'All' || e.severity.toLowerCase() === severityFilter.toLowerCase();
      const matchesSearch =
        e.well_id.toLowerCase().includes(searchFilter.toLowerCase()) ||
        e.well_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        e.event_type.toLowerCase().includes(searchFilter.toLowerCase()) ||
        e.root_cause.toLowerCase().includes(searchFilter.toLowerCase()) ||
        e.formation.toLowerCase().includes(searchFilter.toLowerCase());
      return matchesType && matchesSeverity && matchesSearch;
    });
  }, [events, eventTypeFilter, severityFilter, searchFilter]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Well ID", "Well Name", "Event Type", "Severity", "Depth", "Formation", "NPT (Hours)", "Cost Incurred", "Root Cause", "Mitigation Taken"];
    const rows = filteredEvents.map(e => [
      `"${e.id}"`,
      `"${e.well_id}"`,
      `"${e.well_name}"`,
      `"${e.event_type}"`,
      `"${e.severity}"`,
      `"${e.depth}"`,
      `"${e.formation}"`,
      e.impact_npt_hrs,
      `"${e.impact_cost_usd}"`,
      `"${e.root_cause.replace(/"/g, '""')}"`,
      `"${e.mitigation.replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `eRTMAC_NWIS_Historical_Events_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredEvents, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `eRTMAC_NWIS_Historical_Events_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-5 max-w-[1600px] w-full mx-auto space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            Historical Incidents & Drilling Hazard Intelligence Ledger
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Archival record of non-productive time (NPT), kicks, stuck pipe incidents, loss zones, and proven mitigations across offset wells.
          </p>
        </div>

        {/* Working Export Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-600 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 hover:text-white font-semibold text-xs border border-emerald-500/40 transition flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-600 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 hover:text-white font-semibold text-xs border border-blue-500/40 transition flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm space-y-3 transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search by well, cause, mitigation..."
              className="w-full bg-slate-100 dark:bg-[#141d33] border border-slate-200 dark:border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Event Type Filter */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#141d33] border border-slate-200 dark:border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300">
            <span className="text-slate-500 dark:text-slate-400 shrink-0 font-medium">Event Type:</span>
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer w-full"
            >
              <option value="All" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">All Event Types</option>
              <option value="Loss of circulation" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Loss of circulation</option>
              <option value="Stuck pipe" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Stuck pipe</option>
              <option value="Gas kick" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Gas kick</option>
              <option value="Torque spike" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Torque spike</option>
              <option value="Cementing failure" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Cementing failure</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#141d33] border border-slate-200 dark:border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300">
            <span className="text-slate-500 dark:text-slate-400 shrink-0 font-medium">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer w-full"
            >
              <option value="All" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">All Severities</option>
              <option value="High" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">High Risk (Red)</option>
              <option value="Medium" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Medium Risk (Orange)</option>
              <option value="Low" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Low Risk (Yellow)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events List / Cards */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            No historical incidents found matching your query.
          </div>
        ) : (
          filteredEvents.map((event) => {
            const isHigh = event.severity === 'High';
            const isMedium = event.severity === 'Medium';
            return (
              <div
                key={event.id}
                className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition space-y-3"
              >
                {/* Event Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200 dark:border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      isHigh ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30' :
                      isMedium ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
                      'bg-yellow-500/20 text-yellow-600 dark:text-yellow-300 border border-yellow-500/30'
                    }`}>
                      {event.severity} Severity
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{event.event_type}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">&bull; {event.id}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-slate-700 dark:text-slate-300 font-bold bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                      {event.well_id} ({event.well_name})
                    </span>
                    <span className="text-blue-600 dark:text-sky-400 font-bold">Depth: {event.depth}</span>
                  </div>
                </div>

                {/* Impact Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> NPT Lost:
                    </span>
                    <span className="font-bold font-mono text-amber-600 dark:text-amber-400">{event.impact_npt_hrs} hrs</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" /> Cost Incurred:
                    </span>
                    <span className="font-bold font-mono text-rose-600 dark:text-rose-400">{event.impact_cost_usd}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between sm:col-span-2">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Formation Horizon:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{event.formation}</span>
                  </div>
                </div>

                {/* Root Cause & Mitigation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Root Cause Analysis
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{event.root_cause}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mitigation Implemented
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{event.mitigation}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
