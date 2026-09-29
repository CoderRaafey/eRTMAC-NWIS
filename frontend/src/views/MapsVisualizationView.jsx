import React, { useState, useRef } from 'react';
import Trajectory3D from '../components/Trajectory3D';
import { generateCurvedTrajectory } from '../components/WellMap';
import {
  MapPin,
  Maximize2,
  Crosshair,
  Plus,
  Minus,
  Layers,
  Globe,
  Sliders,
  AlertTriangle,
  Compass,
  Radio,
  Box
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Circle, Polyline, Polygon, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Leaflet mouse position tracker
function MouseCoordinatesTracker({ onMouseMove }) {
  useMapEvents({
    mousemove(e) {
      if (onMouseMove) {
        onMouseMove(e.latlng);
      }
    }
  });
  return null;
}

function MapViewController({ center, zoom, onMount }) {
  const map = useMap();
  React.useEffect(() => {
    if (center) map.setView(center, zoom || 8);
  }, [center, zoom, map]);
  React.useEffect(() => {
    if (onMount) onMount(map);
  }, [map, onMount]);
  return null;
}

export default function MapsVisualizationView({
  basinData,
  selectedWell,
  onSelectWell,
  isDarkMode = true
}) {
  const [layerSatellite, setLayerSatellite] = useState(true);
  const [layerBuffers, setLayerBuffers] = useState(true);
  const [layerFaults, setLayerFaults] = useState(true);
  const [layerTrajectories, setLayerTrajectories] = useState(true);
  const [layerCones, setLayerCones] = useState(true);
  const [layerRiskHeatmap, setLayerRiskHeatmap] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);
  const [viewMode, setViewMode] = useState('2D');
  const [mouseCoords, setMouseCoords] = useState({ lat: 19.350, lng: 71.300 });

  const mapInstanceRef = useRef(null);

  const targetWell = selectedWell || (basinData.wells && basinData.wells[0]);

  const createWellIcon = (name, color, isCenter = false) => {
    const colorHex = {
      orange: '#f97316',
      green: '#22c55e',
      blue: '#38bdf8',
      red: '#ef4444'
    }[color] || '#38bdf8';

    return L.divIcon({
      className: 'custom-gis-marker',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: pointer;">
          <span style="background: rgba(15, 23, 42, 0.85); color: #fff; padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; border: 1px solid rgba(255,255,255,0.2); white-space: nowrap; margin-bottom: 3px;">
            ${name}
          </span>
          <div style="width: 14px; height: 14px; border-radius: 50%; background: ${colorHex}; border: 2px solid #ffffff; box-shadow: 0 0 10px ${colorHex};"></div>
        </div>
      `,
      iconSize: [60, 40],
      iconAnchor: [30, 40]
    });
  };

  return (
    <div className="p-4 max-w-[1600px] w-full mx-auto space-y-3 flex flex-col h-[calc(100vh-5rem)]">
      {/* Top GIS Toolbar */}
      <div className="bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-3 shrink-0 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Full-Screen GIS Spatial Intelligence System
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Active Basin: <strong className="text-blue-600 dark:text-sky-300">{basinData.region || basinData.name || 'Arabian Sea'}</strong> &bull; Multi-layer borehole collision and fault zone evaluation
            </p>
          </div>
        </div>

        {/* View Mode Switcher: 2D GIS Map vs 3D Subsurface Model */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('2D')}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                viewMode === '2D' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              2D GIS Map
            </button>
            <button
              onClick={() => setViewMode('3D')}
              className={`px-3 py-1 rounded-md font-semibold transition flex items-center gap-1.5 ${
                viewMode === '3D' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-blue-500 dark:text-sky-400" />
              3D Subsurface Model
            </button>
          </div>

          {/* Live Coordinate Display */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Crosshair className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              <span>Lat: <strong className="text-slate-900 dark:text-white">{mouseCoords.lat.toFixed(4)}°N</strong></span>
              <span className="text-slate-400 dark:text-slate-600">|</span>
              <span>Lng: <strong className="text-slate-900 dark:text-white">{mouseCoords.lng.toFixed(4)}°E</strong></span>
            </div>

            {viewMode === '2D' && (
              <button
                onClick={() => setPanelOpen(!panelOpen)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
                  panelOpen ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>GIS Layer Drawer</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Map Canvas with GIS Floating Controls or 3D Trajectory Model */}
      <div className="relative flex-1 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#070b14] min-h-[480px]">
        {viewMode === '3D' ? (
          <Trajectory3D currentDepth={targetWell?.depth_num || 2450} />
        ) : (
          <>
            <MapContainer
              center={basinData.center || [19.30, 71.70]}
              zoom={basinData.zoom || 8}
              zoomControl={false}
              scrollWheelZoom={true}
              className="w-full h-full z-10"
            >
              <MapViewController
                center={basinData.center}
                zoom={basinData.zoom}
                onMount={(map) => { mapInstanceRef.current = map; }}
              />
              <MouseCoordinatesTracker onMouseMove={(latlng) => setMouseCoords(latlng)} />

              {/* Base Tile Layer Switch */}
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

              {/* Proximity Buffers (1km, 3km, 5km) */}
              {layerBuffers && targetWell && (
                <>
                  <Circle
                    center={[targetWell.lat, targetWell.lng]}
                    radius={16000}
                    pathOptions={{ color: '#f59e0b', weight: 1.5, dashArray: '4, 4', fillColor: '#f59e0b', fillOpacity: 0.05 }}
                  />
                  <Circle
                    center={[targetWell.lat, targetWell.lng]}
                    radius={36000}
                    pathOptions={{ color: '#f59e0b', weight: 1.5, dashArray: '4, 4', fillColor: '#f59e0b', fillOpacity: 0.03 }}
                  />
                  <Circle
                    center={[targetWell.lat, targetWell.lng]}
                    radius={62000}
                    pathOptions={{ color: '#f59e0b', weight: 1.5, dashArray: '5, 5', fillColor: '#f59e0b', fillOpacity: 0.02 }}
                  />
                </>
              )}

              {/* Subsurface Fault Lines */}
              {layerFaults && (basinData.faultLines || []).map((fault, idx) => (
                <Polyline
                  key={`fault-${idx}`}
                  positions={fault}
                  pathOptions={{ color: '#ef4444', weight: 2.5, dashArray: '6, 6', opacity: 0.9 }}
                />
              ))}

              {/* Subsurface Inter-Well Lines */}
              {(basinData.trajectories || []).map((traj, idx) => (
                <Polyline
                  key={`inter-${idx}`}
                  positions={traj.coords}
                  pathOptions={{ color: '#475569', weight: 1.5, dashArray: '4, 6', opacity: 0.5 }}
                />
              ))}

              {/* 2D Subterranean Well Trajectory Layer: Neon Orange for Active Well-03, Cyan for Offset Wells */}
              {layerTrajectories && (basinData.wells || []).map((well, idx) => {
                const isActiveWell03 = well.name?.toLowerCase().includes('well-03') ||
                                       well.id?.toLowerCase().includes('well-03') ||
                                       well.type === 'active' ||
                                       well.id === targetWell?.id;
                const coords = generateCurvedTrajectory(well.lat, well.lng, isActiveWell03, idx + 1);
                return (
                  <Polyline
                    key={`curved-traj-${well.id}`}
                    positions={coords}
                    pathOptions={{
                      color: isActiveWell03 ? '#ff6b00' : '#00f0ff',
                      weight: isActiveWell03 ? 3.5 : 2.5,
                      dashArray: isActiveWell03 ? '6, 6' : '5, 5',
                      opacity: isActiveWell03 ? 0.95 : 0.85
                    }}
                  />
                );
              })}

          {/* Offset Cones of Uncertainty */}
          {layerCones && targetWell && (
            <Polygon
              positions={[
                [targetWell.lat, targetWell.lng],
                [targetWell.lat + 0.35, targetWell.lng - 0.25],
                [targetWell.lat + 0.38, targetWell.lng + 0.25]
              ]}
              pathOptions={{ color: '#38bdf8', weight: 1, fillColor: '#38bdf8', fillOpacity: 0.08, dashArray: '3, 3' }}
            />
          )}

          {/* Risk Heatmaps / Hazard Concentration */}
          {layerRiskHeatmap && (
            <>
              <Circle
                center={[19.35, 71.30]}
                radius={24000}
                pathOptions={{ color: '#ef4444', weight: 0, fillColor: '#ef4444', fillOpacity: 0.15 }}
              />
              <Circle
                center={[19.00, 71.65]}
                radius={20000}
                pathOptions={{ color: '#ef4444', weight: 0, fillColor: '#ef4444', fillOpacity: 0.12 }}
              />
            </>
          )}

          {/* Well Markers */}
          {(basinData.wells || []).map((well) => {
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
                  click: () => onSelectWell(well)
                }}
              />
            );
          })}
        </MapContainer>

        {/* Collapsible Layer Drawer Panel */}
        {panelOpen && (
          <div className="absolute top-4 right-4 z-30 bg-white/95 dark:bg-[#0d1424]/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-2xl text-xs space-y-3 w-64 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" /> GIS Layer Stack
              </span>
              <button onClick={() => setPanelOpen(false)} className="text-slate-400 hover:text-slate-800 dark:hover:text-white text-xs">&times;</button>
            </div>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="text-slate-700 dark:text-slate-200">Proximity Buffers (1/3/5km)</span>
                <input
                  type="checkbox"
                  checked={layerBuffers}
                  onChange={(e) => setLayerBuffers(e.target.checked)}
                  className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-blue-500 focus:ring-0 w-3.5 h-3.5"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-rose-500"></span> Subsurface Fault Lines
                </span>
                <input
                  type="checkbox"
                  checked={layerFaults}
                  onChange={(e) => setLayerFaults(e.target.checked)}
                  className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-blue-500 focus:ring-0 w-3.5 h-3.5"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-sky-400 border-b border-dashed"></span> Trajectory Projections
                </span>
                <input
                  type="checkbox"
                  checked={layerTrajectories}
                  onChange={(e) => setLayerTrajectories(e.target.checked)}
                  className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-blue-500 focus:ring-0 w-3.5 h-3.5"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="text-slate-700 dark:text-slate-200">Offset Collision Cones</span>
                <input
                  type="checkbox"
                  checked={layerCones}
                  onChange={(e) => setLayerCones(e.target.checked)}
                  className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-blue-500 focus:ring-0 w-3.5 h-3.5"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500/80"></span> Risk Heatmap Density
                </span>
                <input
                  type="checkbox"
                  checked={layerRiskHeatmap}
                  onChange={(e) => setLayerRiskHeatmap(e.target.checked)}
                  className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-blue-500 focus:ring-0 w-3.5 h-3.5"
                />
              </label>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> {layerSatellite ? 'Satellite View' : 'Standard Map'}
                </span>
                <input
                  type="checkbox"
                  checked={layerSatellite}
                  onChange={(e) => setLayerSatellite(e.target.checked)}
                  className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-blue-500 focus:ring-0 w-3.5 h-3.5"
                />
              </div>
            </div>
          </div>
        )}

        {/* Map Control Tools on Bottom-Right */}
        <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-1.5">
          <button
            onClick={() => {
              if (mapInstanceRef.current && basinData.center) {
                mapInstanceRef.current.setView(basinData.center, basinData.zoom || 8);
              }
            }}
            className="w-8 h-8 rounded-lg bg-white/90 dark:bg-[#0d1424]/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-lg"
            title="Recenter Map"
          >
            <Crosshair className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
            }}
            className="w-8 h-8 rounded-lg bg-white/90 dark:bg-[#0d1424]/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-lg"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
            }}
            className="w-8 h-8 rounded-lg bg-white/90 dark:bg-[#0d1424]/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-lg"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-white/90 dark:bg-[#0d1424]/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex flex-col items-center justify-center text-[10px] font-bold shadow-lg">
            <span className="text-rose-500 text-[10px]">▲</span>
            <span>N</span>
          </div>
        </div>
      </>
    )}
      </div>
    </div>
  );
}
