import React, { useState, useMemo } from 'react';
import { Search, Filter, MapPin, Sliders, ArrowUpDown, ExternalLink, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function WellSearchView({ allWells, onSelectWell, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [formationFilter, setFormationFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [maxDepth, setMaxDepth] = useState(5000);
  const [sortField, setSortField] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Filter and sort wells
  const filteredWells = useMemo(() => {
    return allWells.filter((well) => {
      const matchesSearch =
        well.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        well.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (well.field && well.field.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && well.status === 'ACTIVE') ||
        (statusFilter === 'Safe' && well.status === 'SAFE') ||
        (statusFilter === 'High Risk' && well.status === 'HIGH_RISK') ||
        (statusFilter === 'Nearby' && well.status === 'NEARBY');

      const matchesFormation =
        formationFilter === 'All' ||
        (well.formation && well.formation.toLowerCase().includes(formationFilter.toLowerCase()));

      const matchesDepth = (well.depth_num || 2500) <= maxDepth;

      const matchesRisk =
        riskFilter === 'All' ||
        (riskFilter === 'High' && (well.risk_score || 50) >= 70) ||
        (riskFilter === 'Medium' && (well.risk_score || 50) >= 40 && (well.risk_score || 50) < 70) ||
        (riskFilter === 'Low' && (well.risk_score || 50) < 40);

      return matchesSearch && matchesStatus && matchesFormation && matchesDepth && matchesRisk;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [allWells, searchTerm, statusFilter, formationFilter, riskFilter, maxDepth, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="p-5 max-w-[1600px] w-full mx-auto space-y-4">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            Well Search & Offset Intelligence Explorer
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Query active boreholes, offset trajectories, historical incidents, and real-time drilling status.
          </p>
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <span>Showing <strong className="text-slate-900 dark:text-white">{filteredWells.length}</strong> of <strong className="text-slate-900 dark:text-white">{allWells.length}</strong> cataloged wells</span>
        </div>
      </div>

      {/* Multi-Filter Bar */}
      <div className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm space-y-3 transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by name, code, field..."
              className="w-full bg-slate-100 dark:bg-[#141d33] border border-slate-200 dark:border-slate-700/60 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#141d33] border border-slate-200 dark:border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300">
            <span className="text-slate-500 dark:text-slate-400 shrink-0 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer w-full"
            >
              <option value="All" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">All Statuses</option>
              <option value="Active" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Active (Target)</option>
              <option value="High Risk" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">High Risk</option>
              <option value="Safe" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Safe</option>
              <option value="Nearby" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Nearby Offset</option>
            </select>
          </div>

          {/* Formation Filter */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#141d33] border border-slate-200 dark:border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300">
            <span className="text-slate-500 dark:text-slate-400 shrink-0 font-medium">Formation:</span>
            <select
              value={formationFilter}
              onChange={(e) => setFormationFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer w-full"
            >
              <option value="All" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">All Formations</option>
              <option value="Miocene" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Miocene</option>
              <option value="Pliocene" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Pliocene</option>
              <option value="Oligocene" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Oligocene</option>
              <option value="Eocene" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Eocene</option>
              <option value="Sandstone" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Sandstone</option>
            </select>
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#141d33] border border-slate-200 dark:border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300">
            <span className="text-slate-500 dark:text-slate-400 shrink-0 font-medium">Risk Rating:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer w-full"
            >
              <option value="All" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">All Risk Levels</option>
              <option value="High" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">High (&gt;= 70)</option>
              <option value="Medium" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Medium (40 - 69)</option>
              <option value="Low" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Low (&lt; 40)</option>
            </select>
          </div>
        </div>

        {/* Depth Range Slider */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-3 w-full max-w-md">
            <span className="text-slate-600 dark:text-slate-400 shrink-0 font-medium">Max Depth: <strong className="text-blue-600 dark:text-sky-400">{maxDepth} m</strong></span>
            <input
              type="range"
              min="1000"
              max="5000"
              step="100"
              value={maxDepth}
              onChange={(e) => setMaxDepth(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setFormationFilter('All');
                setRiskFilter('All');
                setMaxDepth(5000);
              }}
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Explorer Table */}
      <div className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th onClick={() => handleSort('name')} className="p-3.5 cursor-pointer hover:text-blue-600 dark:hover:text-white">
                  <div className="flex items-center gap-1.5">
                    <span>Well Name & Code</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort('field')} className="p-3.5 cursor-pointer hover:text-blue-600 dark:hover:text-white">
                  <div className="flex items-center gap-1.5">
                    <span>Field / Basin</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort('depth_num')} className="p-3.5 cursor-pointer hover:text-blue-600 dark:hover:text-white">
                  <div className="flex items-center gap-1.5">
                    <span>Depth</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5">Target Formation</th>
                <th onClick={() => handleSort('rop')} className="p-3.5 cursor-pointer hover:text-blue-600 dark:hover:text-white">
                  <div className="flex items-center gap-1.5">
                    <span>ROP (m/hr)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5">Last Incident</th>
                <th onClick={() => handleSort('risk_score')} className="p-3.5 cursor-pointer hover:text-blue-600 dark:hover:text-white">
                  <div className="flex items-center gap-1.5">
                    <span>Risk Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 bg-white dark:bg-transparent">
              {filteredWells.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No wells match the selected filter parameters.
                  </td>
                </tr>
              ) : (
                filteredWells.map((well) => {
                  const score = well.risk_score || (well.status === 'HIGH_RISK' ? 84 : well.status === 'SAFE' ? 25 : 45);
                  return (
                    <tr
                      key={well.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition group"
                    >
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            well.status === 'ACTIVE' ? 'bg-amber-500 shadow-sm shadow-amber-500/50' :
                            well.status === 'HIGH_RISK' ? 'bg-rose-500' :
                            well.status === 'SAFE' ? 'bg-emerald-500' : 'bg-sky-400'
                          }`}></div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{well.name}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">{well.code}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">
                        {well.field || 'Regional Offshore'}
                      </td>

                      <td className="p-3.5">
                        <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{well.depth}</span>
                      </td>

                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px] border border-slate-200 dark:border-slate-700/60">
                          {well.formation}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          <span>{well.rop || 92}</span>
                          <span className="text-[10px] text-slate-500 font-normal">m/hr</span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className={`text-[11px] font-medium ${
                          well.last_event?.includes('Loss') || well.last_event?.includes('kick') || well.last_event?.includes('Stuck')
                            ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {well.last_event}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{score} / 100</span>
                            <span className={`font-semibold ${
                              score >= 70 ? 'text-rose-600 dark:text-rose-400' : score >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                            }`}>
                              {score >= 70 ? 'High' : score >= 40 ? 'Med' : 'Low'}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                score >= 70 ? 'bg-rose-500' : score >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            onSelectWell(well);
                            onNavigate('Dashboard');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white font-semibold text-xs border border-blue-500/40 transition inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Focus on Map</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
