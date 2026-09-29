import React, { useState, useRef } from 'react';
import {
  MapPin,
  Maximize2,
  Crosshair,
  Plus,
  Minus,
  Globe
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

function MapCenterController({ center, zoom, onMount }) {
  const map = useMap();
  React.useEffect(() => {
    if (center) map.setView(center, zoom || 8);
  }, [center, zoom, map]);
  React.useEffect(() => {
    if (onMount) onMount(map);
  }, [map, onMount]);
  return null;
}

// Generate subterranean curved trajectory points extending from wellhead
export function generateCurvedTrajectory(lat, lng, isTarget = false, seed = 1) {
  const points = [];
  const steps = 10;
  // Subterranean horizontal displacement: directional build and azimuth turn
  const angle = isTarget ? 1.2 : (0.5 + (seed * 1.25) % 5.8);
  const maxReach = isTarget ? 0.09 : 0.06;
  const doglegCurvature = 0.025;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Non-linear build-up profile to simulate true wellbore kick-off and horizontal drift
    const displacement = maxReach * Math.pow(t, 1.7);
    const dLat = -displacement * Math.cos(angle) + doglegCurvature * Math.sin(t * Math.PI) * (seed % 2 === 0 ? 1 : -1);
    const dLng = displacement * Math.sin(angle) + doglegCurvature * Math.cos(t * Math.PI * 0.75);
    points.push([lat + dLat, lng + dLng]);
  }
  return points;
}

export default function WellMap({
  basinData,
  selectedWell,
  onSelectWell,
  onNavigate,
  isDarkMode = true
}) {
  const [selectedFormation, setSelectedFormation] = useState('All Formations');
  const [selectedEvent, setSelectedEvent] = useState('All Events');
  const [layerNearbyWells, setLayerNearbyWells] = useState(true);
  const [layerFormations, setLayerFormations] = useState(true);
  const [layerHistoricalEvents, setLayerHistoricalEvents] = useState(true);
  const [layerRiskZones, setLayerRiskZones] = useState(true);
  const [layerTrajectory, setLayerTrajectory] = useState(true);
  const [layerSatellite, setLayerSatellite] = useState(false);

  const mapInstanceRef = useRef(null);
  const targetWell = selectedWell || (basinData.wells && basinData.wells[0]);

  const createPlatformIcon = () => {
    return L.divIcon({
      className: 'custom-platform-marker',
      html: `
        <div style="background: rgba(15, 23, 42, 0.9); border: 1.5px solid #94a3b8; border-radius: 4px; padding: 2px 4px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 8px rgba(0,0,0,0.8); cursor: pointer;">
          <svg style="width: 14px; height: 14px; color: #38bdf8;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 2 22 22 22 12 2"></polygon>
          </svg>
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });
  };

  const createWellIcon = (name, color, isCenter = false) => {
    const colorHex = {
      orange: '#f97316',
      green: '#22c55e',
      blue: '#38bdf8',
      red: '#ef4444'
    }[color] || '#38bdf8';

    return L.divIcon({
      className: 'custom-well-marker',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: pointer;">
          <span style="background: rgba(15, 23, 42, 0.85); color: #fff; padding: 1px 5px; border-radius: 4px; font-size: 10px; font-weight: bold; border: 1px solid rgba(255,255,255,0.2); white-space: nowrap; margin-bottom: 2px;">
            ${name}
          </span>
          <div style="width: ${isCenter ? '14px' : '10px'}; height: ${isCenter ? '14px' : '10px'}; border-radius: 50%; background: ${colorHex}; border: 2px solid #ffffff; box-shadow: 0 0 8px ${colorHex};"></div>
        </div>
      `,
      iconSize: [50, 30],
      iconAnchor: [25, 30]
    });
  };

  return (
    <div className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-md transition-colors">
      {/* Map Header Toolbar */}
      <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#141d33] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            WELL MAP & TRAJECTORY LAYER
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            <span>{basinData.region || basinData.name || 'Arabian Sea'}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
            <select
              value={selectedFormation}
              onChange={(e) => setSelectedFormation(e.target.value)}
              className="bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All Formations" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">All Formations</option>
              <option value="Miocene" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Miocene</option>
              <option value="Pliocene" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Pliocene</option>
              <option value="Oligocene" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Oligocene</option>
              <option value="Eocene" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Eocene</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All Events" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">All Events</option>
              <option value="Loss of circulation" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Loss of circulation</option>
              <option value="Gas kick" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Gas kick</option>
              <option value="Stuck pipe" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Stuck pipe</option>
            </select>
          </div>

          <button
            onClick={() => {
              if (mapInstanceRef.current && basinData.center) {
                mapInstanceRef.current.setView(basinData.center, basinData.zoom || 8);
              }
            }}
            className="p-1 rounded bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            title="Reset View"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative h-[380px] w-full bg-slate-100 dark:bg-[#070b14] overflow-hidden">
        <MapContainer
          center={basinData.center || [19.30, 71.70]}
          zoom={basinData.zoom || 8}
          zoomControl={false}
          scrollWheelZoom={true}
          className="w-full h-full z-10"
        >
          <MapCenterController
            center={basinData.center}
            zoom={basinData.zoom}
            onMount={(map) => { mapInstanceRef.current = map; }}
          />

          {layerSatellite ? (
            <TileLayer
              key="esri-satellite"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri"
              maxZoom={18}
            />
          ) : (
            <TileLayer
              key={`osm-${isDarkMode ? 'dark' : 'light'}`}
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
              maxZoom={19}
              className={isDarkMode ? "dark-tile-filter filter invert hue-rotate-180 brightness-90 contrast-85" : ""}
            />
          )}

          {/* Concentric Proximity Rings */}
          {targetWell && (
            <>
              <Circle
                center={[targetWell.lat, targetWell.lng]}
                radius={16000}
                pathOptions={{
                  color: '#f59e0b',
                  weight: 1.5,
                  dashArray: '4, 4',
                  fillColor: '#f59e0b',
                  fillOpacity: 0.05
                }}
              />
              <Circle
                center={[targetWell.lat, targetWell.lng]}
                radius={36000}
                pathOptions={{
                  color: '#f59e0b',
                  weight: 1.5,
                  dashArray: '4, 4',
                  fillColor: '#f59e0b',
                  fillOpacity: 0.03
                }}
              />
              <Circle
                center={[targetWell.lat, targetWell.lng]}
                radius={62000}
                pathOptions={{
                  color: '#f59e0b',
                  weight: 1.5,
                  dashArray: '5, 5',
                  fillColor: '#f59e0b',
                  fillOpacity: 0.02
                }}
              />
            </>
          )}

          {/* Subsurface Inter-Well Connections */}
          {(basinData.trajectories || []).map((traj, idx) => (
            <Polyline
              key={`inter-${idx}`}
              positions={traj.coords}
              pathOptions={{
                color: '#64748b',
                weight: 1.5,
                dashArray: '4, 6',
                opacity: 0.4
              }}
            />
          ))}

          {/* 2D SUBTERRANEAN WELL TRAJECTORY DISPLACEMENT LAYER */}
          {/* Neon Orange for Active Well-03, Cyan for Offset Wells */}
          {layerTrajectory && (basinData.wells || []).map((well, idx) => {
            const isActiveWell03 = well.name?.toLowerCase().includes('well-03') ||
                                   well.id?.toLowerCase().includes('well-03') ||
                                   well.type === 'active' ||
                                   well.id === targetWell?.id;

            const trajectoryCoords = generateCurvedTrajectory(well.lat, well.lng, isActiveWell03, idx + 1);

            return (
              <Polyline
                key={`curved-traj-${well.id}`}
                positions={trajectoryCoords}
                pathOptions={{
                  color: isActiveWell03 ? '#ff6b00' : '#00f0ff',
                  weight: isActiveWell03 ? 3.5 : 2.5,
                  dashArray: isActiveWell03 ? '6, 6' : '5, 5',
                  opacity: isActiveWell03 ? 0.95 : 0.85
                }}
              />
            );
          })}

          {/* Offshore Platforms */}
          {(basinData.platforms || []).map((plat) => (
            <Marker
              key={plat.id}
              position={[plat.lat, plat.lng]}
              icon={createPlatformIcon()}
            />
          ))}

          {/* Well Markers */}
          {layerNearbyWells && (basinData.wells || []).map((well) => {
            let color = 'blue';
            if (well.id === targetWell?.id || well.type === 'active') color = 'orange';
            else if (well.status === 'SAFE' || well.type === 'safe') color = 'green';
            else if (well.status === 'HIGH_RISK' || well.type === 'risk') color = 'red';

            return (
              <Marker
                key={well.id}
                position={[well.lat, well.lng]}
                icon={createWellIcon(well.name, color, well.id === targetWell?.id)}
                eventHandlers={{
                  click: () => onSelectWell && onSelectWell(well)
                }}
              />
            );
          })}
        </MapContainer>

        {/* Selected Well Quick Overlay Card */}
        {targetWell && (
          <div className="absolute top-24 left-[58%] z-30 pointer-events-auto bg-white/95 dark:bg-[#101728]/95 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 rounded-xl p-3.5 shadow-2xl w-48 text-xs space-y-1">
            <div className="text-slate-900 dark:text-white font-bold text-sm tracking-tight">{targetWell.name}</div>
            <div className="text-slate-600 dark:text-slate-300">Formation: <span className="text-slate-900 dark:text-slate-100 font-medium">{targetWell.formation}</span></div>
            <div className="text-slate-600 dark:text-slate-300">Depth: <span className="text-slate-900 dark:text-slate-100 font-medium">{targetWell.depth}</span></div>
            <div className="text-slate-600 dark:text-slate-300">Last Event: <span className="text-slate-900 dark:text-slate-100 font-medium">{targetWell.last_event}</span></div>
            <div className="pt-1.5 flex items-center justify-between">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                targetWell.risk_badge === 'Safe' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              } shadow-sm`}>
                {targetWell.risk_badge || 'High Risk'}
              </span>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('Risk Analysis')}
                  className="text-[10px] text-blue-600 dark:text-sky-400 hover:underline font-semibold"
                >
                  Analyze &rarr;
                </button>
              )}
            </div>
          </div>
        )}

        {/* Bottom Left Legend Box */}
        <div className="absolute bottom-3 left-3 z-30 bg-white/95 dark:bg-[#0d1424]/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/70 rounded-lg p-2.5 shadow-lg text-[11px] space-y-1.5 min-w-[140px]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50"></span>
            <span className="text-slate-700 dark:text-slate-200 font-medium">Active Well</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <span className="text-slate-700 dark:text-slate-200 font-medium">Nearby Well</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-slate-700 dark:text-slate-200 font-medium">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 border-b-2 border-dashed border-[#ff6b00]"></span>
            <span className="text-orange-600 dark:text-orange-400 font-medium">Active Trajectory</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 border-b-2 border-dashed border-[#00f0ff]"></span>
            <span className="text-cyan-600 dark:text-cyan-400 font-medium">Offset Trajectory</span>
          </div>
        </div>

        {/* Top Right Layers Toggle Panel */}
        <div className="absolute top-3 right-3 z-30 bg-white/95 dark:bg-[#0d1424]/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/70 rounded-lg p-2.5 shadow-lg text-[11px] space-y-2 min-w-[145px]">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={layerNearbyWells}
              onChange={(e) => setLayerNearbyWells(e.target.checked)}
              className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-blue-500 focus:ring-0 w-3.5 h-3.5"
            />
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <span className="text-slate-700 dark:text-slate-200">Nearby Wells</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={layerFormations}
              onChange={(e) => setLayerFormations(e.target.checked)}
              className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-blue-500 focus:ring-0 w-3.5 h-3.5"
            />
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span className="text-slate-700 dark:text-slate-200">Formations</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={layerHistoricalEvents}
              onChange={(e) => setLayerHistoricalEvents(e.target.checked)}
              className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-blue-500 focus:ring-0 w-3.5 h-3.5"
            />
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span className="text-slate-700 dark:text-slate-200">Historical Events</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={layerRiskZones}
              onChange={(e) => setLayerRiskZones(e.target.checked)}
              className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-blue-500 focus:ring-0 w-3.5 h-3.5"
            />
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="text-slate-700 dark:text-slate-200">Risk Zones</span>
          </label>

          {/* Wired Up "Well Trajectory" checkbox */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={layerTrajectory}
              onChange={(e) => setLayerTrajectory(e.target.checked)}
              className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-blue-500 focus:ring-0 w-3.5 h-3.5"
            />
            <span className="w-3 border-b-2 border-dashed border-cyan-400"></span>
            <span className="text-slate-700 dark:text-slate-200 font-semibold">Well Trajectory</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none pt-1 border-t border-slate-200 dark:border-slate-800">
            <input
              type="checkbox"
              checked={layerSatellite}
              onChange={(e) => setLayerSatellite(e.target.checked)}
              className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-blue-500 focus:ring-0 w-3.5 h-3.5"
            />
            <Globe className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
            <span className="text-slate-700 dark:text-slate-200">{layerSatellite ? 'Satellite View' : 'Standard Map'}</span>
          </label>
        </div>

        {/* Bottom Right Map Navigation Tools */}
        <div className="absolute bottom-3 right-3 z-30 flex flex-col gap-1">
          <button
            onClick={() => {
              if (mapInstanceRef.current && basinData.center) {
                mapInstanceRef.current.setView(basinData.center, basinData.zoom || 8);
              }
            }}
            className="w-7 h-7 rounded bg-white/90 dark:bg-[#0d1424]/90 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Recenter"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
            }}
            className="w-7 h-7 rounded bg-white/90 dark:bg-[#0d1424]/90 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Zoom In"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
            }}
            className="w-7 h-7 rounded bg-white/90 dark:bg-[#0d1424]/90 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Zoom Out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <div className="w-7 h-7 rounded bg-white/90 dark:bg-[#0d1424]/90 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 flex flex-col items-center justify-center text-[9px] font-bold">
            <span className="text-rose-500">▲</span>
            <span>N</span>
          </div>
        </div>
      </div>
    </div>
  );
}
