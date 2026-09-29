import React from 'react';
import Plot from 'react-plotly.js';

export default function Trajectory3D({ currentDepth = 2450 }) {
  const activeDepth = -Math.abs(currentDepth || 2450);

  // Active Well Trajectory (Surface to active depth)
  // X: Easting (m), Y: Northing (m), Z: TVD (m, negative)
  const activeWellData = {
    type: 'scatter3d',
    mode: 'lines+markers',
    name: 'Active Well',
    x: [0, 25, 75, 140, 220, 310, 420, 520, 630],
    y: [0, 15, 45, 95, 160, 245, 340, 445, 560],
    z: [0, -350, -750, -1200, -1650, -2000, -2250, -2350, activeDepth],
    line: {
      color: '#38bdf8',
      width: 6
    },
    marker: {
      size: [4, 4, 4, 4, 4, 4, 5, 5, 9],
      color: '#38bdf8',
      symbol: 'circle'
    },
    hoverinfo: 'text',
    text: [
      'Active Well - Surface (0m)',
      'Active Well - 350m',
      'Active Well - 750m',
      'Active Well - 1,200m',
      'Active Well - 1,650m',
      'Active Well - 2,000m',
      'Active Well - 2,250m',
      'Active Well - 2,350m',
      `Active Well - Current Bit Depth (${Math.abs(activeDepth)}m)`
    ]
  };

  // Offset Well-03 Trajectory (dashed gray line)
  const offsetWellData = {
    type: 'scatter3d',
    mode: 'lines',
    name: 'Offset Well-03',
    x: [180, 210, 260, 330, 410, 490, 560, 620, 670],
    y: [-80, -50, 0, 70, 155, 240, 330, 420, 510],
    z: [0, -380, -820, -1320, -1820, -2220, -2450, -2700, -2950],
    line: {
      color: '#94a3b8',
      width: 4,
      dash: 'dash'
    },
    hoverinfo: 'text',
    text: [
      'Offset Well-03 - Surface',
      'Offset Well-03 - 380m',
      'Offset Well-03 - 820m',
      'Offset Well-03 - 1,320m',
      'Offset Well-03 - 1,820m',
      'Offset Well-03 - 2,220m',
      'Offset Well-03 - 2,450m (Loss Circulation Event)',
      'Offset Well-03 - 2,700m',
      'Offset Well-03 - 2,950m (TD)'
    ]
  };

  // Hazard Zone (Loss Circulation) at -2450m - Glowing Red Sphere
  const hazardZoneData = {
    type: 'scatter3d',
    mode: 'markers+text',
    name: 'Hazard Zone (Loss Circulation)',
    x: [560],
    y: [330],
    z: [-2450],
    marker: {
      size: 16,
      color: '#ef4444',
      symbol: 'circle',
      opacity: 0.95,
      line: {
        color: '#fecaca',
        width: 3
      }
    },
    text: ['Hazard Zone: Loss Circulation (-2450m)'],
    textposition: 'top center',
    textfont: {
      color: '#f87171',
      size: 11,
      family: 'system-ui, sans-serif'
    },
    hoverinfo: 'text',
    hovertext: 'CRITICAL HAZARD: Loss Circulation encountered at -2,450m in Offset Well-03 (400 bbl/hr mud loss)'
  };

  const layout = {
    autosize: true,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    margin: { l: 0, r: 0, b: 0, t: 30 },
    showlegend: true,
    legend: {
      x: 0.02,
      y: 0.98,
      font: { color: '#e2e8f0', size: 11 },
      bgcolor: 'rgba(15, 23, 42, 0.75)',
      bordercolor: 'rgba(51, 65, 85, 0.8)',
      borderwidth: 1
    },
    scene: {
      bgcolor: 'rgba(0,0,0,0)',
      camera: {
        eye: { x: 1.6, y: -1.7, z: 1.2 }
      },
      xaxis: {
        title: { text: 'Easting (m)', font: { color: '#94a3b8', size: 10 } },
        color: '#94a3b8',
        gridcolor: 'rgba(51, 65, 85, 0.4)',
        zerolinecolor: '#475569',
        showbackground: true,
        backgroundcolor: 'rgba(15, 23, 42, 0.3)'
      },
      yaxis: {
        title: { text: 'Northing (m)', font: { color: '#94a3b8', size: 10 } },
        color: '#94a3b8',
        gridcolor: 'rgba(51, 65, 85, 0.4)',
        zerolinecolor: '#475569',
        showbackground: true,
        backgroundcolor: 'rgba(15, 23, 42, 0.3)'
      },
      zaxis: {
        title: { text: 'TVD Depth (m)', font: { color: '#94a3b8', size: 10 } },
        color: '#94a3b8',
        gridcolor: 'rgba(51, 65, 85, 0.4)',
        zerolinecolor: '#475569',
        showbackground: true,
        backgroundcolor: 'rgba(15, 23, 42, 0.3)'
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[460px] relative rounded-xl overflow-hidden bg-[#070b14]/70 border border-slate-800">
      <div className="absolute top-3 left-3 z-10 pointer-events-none flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700/80 text-[11px] font-bold text-sky-400">
          3D Borehole Trajectory Visualization
        </span>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40">
          Hazard Target: -2,450m TVD
        </span>
      </div>
      <Plot
        data={[activeWellData, offsetWellData, hazardZoneData]}
        layout={layout}
        config={{
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ['sendDataToCloud']
        }}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        className="w-full h-full"
      />
    </div>
  );
}
