// Central fallback & domain intelligence data for eRTMAC-NWIS

export const BASINS_CONFIG = {
  "Arabian Sea (Offshore)": {
    name: "Arabian Sea (Offshore)",
    center: [19.30, 71.70],
    zoom: 8,
    faultLines: [
      [[19.80, 71.10], [19.45, 71.35], [19.10, 71.50], [18.70, 71.80]],
      [[19.60, 71.60], [19.30, 71.75], [18.90, 72.00]]
    ],
    wells: [
      { id: 'well-03', name: 'Well-03', code: 'ARB-MH-W03', field: 'Mumbai High South', status: 'ACTIVE', type: 'active', risk_badge: 'High Risk', risk_color: 'red', risk_score: 84, formation: 'Miocene', depth: '2450 m', depth_num: 2450, rop: 104, last_event: 'Loss circulation', lat: 19.35, lng: 71.30, is_center: true, rings_meters: [16000, 36000, 62000] },
      { id: 'well-01', name: 'Well-01', code: 'ARB-MH-W01', field: 'Bassein Gas Field', status: 'SAFE', type: 'safe', risk_badge: 'Safe', risk_color: 'green', risk_score: 28, formation: 'Pliocene', depth: '2180 m', depth_num: 2180, rop: 136, last_event: 'Normal drilling', lat: 19.82, lng: 71.38, is_center: false },
      { id: 'well-02', name: 'Well-02', code: 'ARB-MH-W02', field: 'Heera Field', status: 'NEARBY', type: 'nearby', risk_badge: 'Nearby Well', risk_color: 'blue', risk_score: 45, formation: 'Miocene', depth: '2390 m', depth_num: 2390, rop: 82, last_event: 'Logging complete', lat: 19.38, lng: 70.82, is_center: false },
      { id: 'well-04', name: 'Well-04', code: 'ARB-MH-W04', field: 'Neelam Offshore', status: 'HIGH_RISK', type: 'risk', risk_badge: 'High Risk', risk_color: 'red', risk_score: 79, formation: 'Oligocene', depth: '2780 m', depth_num: 2780, rop: 65, last_event: 'Kick detected', lat: 19.00, lng: 71.65, is_center: false },
      { id: 'well-05', name: 'Well-05', code: 'ARB-MH-W05', field: 'Ratna Deep', status: 'NEARBY', type: 'nearby', risk_badge: 'Nearby Well', risk_color: 'blue', risk_score: 38, formation: 'Eocene', depth: '3120 m', depth_num: 3120, rop: 44, last_event: 'Casing set', lat: 18.70, lng: 71.95, is_center: false },
      { id: 'well-06', name: 'Well-06', code: 'ARB-MH-W06', field: 'D-1 Field', status: 'SAFE', type: 'safe', risk_badge: 'Safe', risk_color: 'green', risk_score: 22, formation: 'Pliocene', depth: '1940 m', depth_num: 1940, rop: 145, last_event: 'Coring run 1', lat: 19.60, lng: 71.10, is_center: false }
    ],
    platforms: [
      { id: 'plat-01', name: 'Alpha Platform', lat: 19.72, lng: 70.75 },
      { id: 'plat-02', name: 'Beta Platform', lat: 18.90, lng: 70.92 },
      { id: 'plat-03', name: 'Gamma Platform', lat: 18.82, lng: 72.15 },
      { id: 'plat-04', name: 'Delta Platform', lat: 19.55, lng: 71.92 }
    ],
    trajectories: [
      { from: 'well-03', to: 'well-01', coords: [[19.35, 71.30], [19.82, 71.38]] },
      { from: 'well-03', to: 'well-02', coords: [[19.35, 71.30], [19.38, 70.82]] },
      { from: 'well-03', to: 'well-04', coords: [[19.35, 71.30], [19.00, 71.65]] },
      { from: 'well-04', to: 'well-05', coords: [[19.00, 71.65], [18.70, 71.95]] }
    ]
  },
  "Assam Shelf (Onshore)": {
    name: "Assam Shelf (Onshore)",
    center: [26.85, 94.60],
    zoom: 9,
    faultLines: [
      [[27.10, 94.40], [26.85, 94.60], [26.60, 94.80]]
    ],
    wells: [
      { id: 'well-as-01', name: 'Nahorkatiya-14', code: 'ASM-NHK-14', field: 'Nahorkatiya', status: 'ACTIVE', type: 'active', risk_badge: 'High Risk', risk_color: 'red', risk_score: 76, formation: 'Barail Sandstone', depth: '3200 m', depth_num: 3200, rop: 24, last_event: 'Stuck pipe', lat: 26.88, lng: 94.62, is_center: true, rings_meters: [4000, 8000, 14000] },
      { id: 'well-as-02', name: 'Moran-08', code: 'ASM-MRN-08', field: 'Moran Oilfield', status: 'SAFE', type: 'safe', risk_badge: 'Safe', risk_color: 'green', risk_score: 30, formation: 'Tipam Sandstone', depth: '2650 m', depth_num: 2650, rop: 45, last_event: 'Production test', lat: 27.02, lng: 94.75, is_center: false },
      { id: 'well-as-03', name: 'Digboi Deep-02', code: 'ASM-DGB-02', field: 'Digboi Anticline', status: 'NEARBY', type: 'nearby', risk_badge: 'Nearby Well', risk_color: 'blue', risk_score: 52, formation: 'Surma Group', depth: '2850 m', depth_num: 2850, rop: 32, last_event: 'Gas seep', lat: 26.70, lng: 94.48, is_center: false }
    ],
    platforms: [],
    trajectories: [
      { from: 'well-as-01', to: 'well-as-02', coords: [[26.88, 94.62], [27.02, 94.75]] },
      { from: 'well-as-01', to: 'well-as-03', coords: [[26.88, 94.62], [26.70, 94.48]] }
    ]
  },
  "Rajasthan Basin": {
    name: "Rajasthan Basin",
    center: [25.75, 71.40],
    zoom: 9,
    faultLines: [
      [[26.05, 71.30], [25.75, 71.45], [25.45, 71.60]]
    ],
    wells: [
      { id: 'well-raj-01', name: 'Mangala-22', code: 'RAJ-MNG-22', field: 'Barmer Basin', status: 'ACTIVE', type: 'active', risk_badge: 'High Risk', risk_color: 'red', risk_score: 68, formation: 'Fatehgarh Sandstone', depth: '1850 m', depth_num: 1850, rop: 85, last_event: 'Loss of circulation', lat: 25.78, lng: 71.42, is_center: true, rings_meters: [3000, 7000, 12000] },
      { id: 'well-raj-02', name: 'Bhagyam-05', code: 'RAJ-BGM-05', field: 'Northern Barmer', status: 'SAFE', type: 'safe', risk_badge: 'Safe', risk_color: 'green', risk_score: 19, formation: 'Barmer Hill', depth: '1420 m', depth_num: 1420, rop: 120, last_event: 'Normal drilling', lat: 25.92, lng: 71.55, is_center: false },
      { id: 'well-raj-03', name: 'Aishwarya-11', code: 'RAJ-ASH-11', field: 'Central Barmer', status: 'NEARBY', type: 'nearby', risk_badge: 'Nearby Well', risk_color: 'blue', risk_score: 42, formation: 'Dharvi Dungar', depth: '2100 m', depth_num: 2100, rop: 70, last_event: 'Torque fluctuation', lat: 25.62, lng: 71.30, is_center: false }
    ],
    platforms: [],
    trajectories: [
      { from: 'well-raj-01', to: 'well-raj-02', coords: [[25.78, 71.42], [25.92, 71.55]] },
      { from: 'well-raj-01', to: 'well-raj-03', coords: [[25.78, 71.42], [25.62, 71.30]] }
    ]
  },
  "KG Deepwater": {
    name: "KG Deepwater",
    center: [16.40, 82.30],
    zoom: 9,
    faultLines: [
      [[16.60, 82.10], [16.40, 82.30], [16.15, 82.55]]
    ],
    wells: [
      { id: 'well-kg-01', name: 'KG-D6-R1', code: 'KG-DW-R01', field: 'KG-DWN-98/3', status: 'ACTIVE', type: 'active', risk_badge: 'High Risk', risk_color: 'red', risk_score: 91, formation: 'Godavari Clay & Channel Sands', depth: '4150 m', depth_num: 4150, rop: 18, last_event: 'Gas kick', lat: 16.38, lng: 82.32, is_center: true, rings_meters: [5000, 10000, 18000] },
      { id: 'well-kg-02', name: 'KG-DWN-98/2-A', code: 'KG-ONGC-982', field: 'Cluster-2 Deepwater', status: 'SAFE', type: 'safe', risk_badge: 'Safe', risk_color: 'green', risk_score: 35, formation: 'Pliocene Turbidites', depth: '3600 m', depth_num: 3600, rop: 28, last_event: 'LWD telemetry good', lat: 16.55, lng: 82.45, is_center: false }
    ],
    platforms: [
      { id: 'fpso-01', name: 'Ruby FPSO', lat: 16.45, lng: 82.25 }
    ],
    trajectories: [
      { from: 'well-kg-01', to: 'well-kg-02', coords: [[16.38, 82.32], [16.55, 82.45]] }
    ]
  }
};

export const FORMATIONS_DETAIL = [
  {
    name: "Sandstone",
    color: "#f59e0b",
    depth_interval: "0m - 800m",
    porosity_pct: "24.5%",
    permeability_md: "450 mD",
    fracture_gradient: "0.72 psi/ft (13.8 ppg)",
    pore_pressure: "0.44 psi/ft (Normal hydrostatic)",
    mineralogy: "82% Quartz, 10% Feldspar, 8% Clay Matrix",
    compressive_strength: "4,200 psi (Medium ductile)",
    risk_warning: "High differential sticking hazard when overbalanced (>150 psi). Maintain minimal filter cake thickness."
  },
  {
    name: "Shale",
    color: "#64748b",
    depth_interval: "800m - 1,700m",
    porosity_pct: "8.2%",
    permeability_md: "0.02 mD",
    fracture_gradient: "0.81 psi/ft (15.6 ppg)",
    pore_pressure: "0.58 psi/ft (Overpressure ramp)",
    mineralogy: "48% Illite-Smectite, 32% Quartz, 20% Kaolinite",
    compressive_strength: "2,800 psi (Prone to sloughing)",
    risk_warning: "Miocene Shale: High swelling & pipe sticking vulnerability. Maintain KCl/glycol mud chemistry."
  },
  {
    name: "Limestone",
    color: "#38bdf8",
    depth_interval: "1,700m - 2,400m",
    porosity_pct: "14.8%",
    permeability_md: "180 mD",
    fracture_gradient: "0.78 psi/ft (15.0 ppg)",
    pore_pressure: "0.47 psi/ft (Depleted reservoir zone)",
    mineralogy: "91% Calcite, 6% Dolomite, 3% Siderite",
    compressive_strength: "8,600 psi (Brittle & fractured)",
    risk_warning: "Fractured vugular carbonate: Severe loss of circulation hazard. Pre-treat active pits with LCM fibers."
  },
  {
    name: "Reservoir (Pay Zone)",
    color: "#ef4444",
    depth_interval: "2,400m - 2,980m",
    porosity_pct: "28.4%",
    permeability_md: "820 mD",
    fracture_gradient: "0.85 psi/ft (16.3 ppg)",
    pore_pressure: "0.62 psi/ft (Hydrocarbon cap pressure)",
    mineralogy: "78% Coarse Sand, 14% Calcareous cement, 8% Silt",
    compressive_strength: "5,400 psi (Porous hydrocarbon bearing)",
    risk_warning: "High Gas Kick Potential: Live oil/gas influx alert. Ensure dual barrier envelope & verify IBOP."
  },
  {
    name: "Other (Basement / Silt)",
    color: "#14b8a6",
    depth_interval: "2,980m - 4,000m+",
    porosity_pct: "3.1%",
    permeability_md: "0.005 mD",
    fracture_gradient: "0.94 psi/ft (18.1 ppg)",
    pore_pressure: "0.45 psi/ft",
    mineralogy: "55% Basalt / Crystalline Feldspar, 45% Micro-quartz",
    compressive_strength: "16,500 psi (Extremely hard abrasive)",
    risk_warning: "Abrasive hard chert nodules: High bit wear and severe PDC cutter spalling. Limit RPM < 85."
  }
];

export const HISTORICAL_EVENTS_DATA = [
  {
    id: "EVT-2026-081",
    well_id: "Well-03",
    well_name: "ARB-MH-W03",
    event_type: "Loss of circulation",
    severity: "High",
    severity_color: "red",
    depth: "2450 m",
    depth_num: 2450,
    formation: "Miocene Carbonate",
    impact_npt_hrs: 38.5,
    impact_cost_usd: "₹2,45,000",
    root_cause: "Subsurface microfractures encountered in under-compacted reefal limestone with 400 bbl/hr mud loss.",
    mitigation: "Spotted 60 bbl LCM pill (medium/coarse nutshell & cellulosic fibers), reduced pump rate by 20%."
  },
  {
    id: "EVT-2026-064",
    well_id: "Well-04",
    well_name: "ARB-MH-W04",
    event_type: "Gas kick",
    severity: "High",
    severity_color: "red",
    depth: "2780 m",
    depth_num: 2780,
    formation: "Oligocene Sandstone",
    impact_npt_hrs: 26.0,
    impact_cost_usd: "₹1,80,000",
    root_cause: "Abnormal pore pressure ramp (0.64 psi/ft) causing 35 bbl pit gain with 1,200 ppm background gas spike.",
    mitigation: "Shut in annular BOP, circulated kick out via choke manifold using Wait and Weight method (MW raised to 12.4 ppg)."
  },
  {
    id: "EVT-2026-052",
    well_id: "Well-02",
    well_name: "ARB-MH-W02",
    event_type: "Stuck pipe",
    severity: "Medium",
    severity_color: "orange",
    depth: "2390 m",
    depth_num: 2390,
    formation: "Miocene Shale",
    impact_npt_hrs: 17.5,
    impact_cost_usd: "₹1,15,000",
    root_cause: "Reactive smectite shale swelling during connection time resulting in mechanical packing off above BHA.",
    mitigation: "Jarred down with 80 klbs overpull, pumped 40 bbl glycol-weighted sweep and reamed back to bottom."
  },
  {
    id: "EVT-2026-039",
    well_id: "Well-01",
    well_name: "ARB-MH-W01",
    event_type: "Torque spike",
    severity: "Low",
    severity_color: "yellow",
    depth: "2180 m",
    depth_num: 2180,
    formation: "Pliocene Sandstone",
    impact_npt_hrs: 4.0,
    impact_cost_usd: "₹28,000",
    root_cause: "Hard stringer transition causing severe stick-slip and motor stall with torque peaking at 28 kft-lbs.",
    mitigation: "Reduced WOB from 35 to 20 klbs, increased rotary table RPM to 110 to stabilize drillstring vibration."
  },
  {
    id: "EVT-2026-021",
    well_id: "Well-05",
    well_name: "ARB-MH-W05",
    event_type: "Cementing failure",
    severity: "Medium",
    severity_color: "orange",
    depth: "3120 m",
    depth_num: 3120,
    formation: "Eocene Basal Sand",
    impact_npt_hrs: 21.0,
    impact_cost_usd: "₹1,60,000",
    root_cause: "Channeling in micro-annulus due to inadequate mud displacement efficiency behind 9-5/8 casing shoe.",
    mitigation: "Performed squeeze cementing with micro-fine slurry, verified pressure integrity test (PIT) to 14.2 ppg EMW."
  },
  {
    id: "EVT-2026-014",
    well_id: "Well-03",
    well_name: "ARB-MH-W03",
    event_type: "Loss of circulation",
    severity: "High",
    severity_color: "red",
    depth: "2410 m",
    depth_num: 2410,
    formation: "Miocene Carbonate",
    impact_npt_hrs: 19.0,
    impact_cost_usd: "₹1,35,000",
    root_cause: "Seepage loss in upper fractured dolomite layer leading to total hydrostatic drop of 45 psi.",
    mitigation: "Pumped high-viscosity bentonite pill with cross-linked polymer squeeze."
  }
];
