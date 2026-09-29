from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any

from .database import engine, Base, get_db
from . import models, schemas, crud
from .seed import seed_database

# Create tables
Base.metadata.create_all(bind=engine)

# Automatically seed with default sample data if empty
try:
    seed_database()
except Exception as e:
    print(f"Seed note: {e}")

app = FastAPI(
    title="eRTMAC-NWIS API",
    description="Nearby Wells Intelligence System Backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASIN_DATA = {
    "Arabian Sea (Offshore)": {
        "region": "Arabian Sea (Offshore)",
        "center": [19.30, 71.70],
        "zoom": 8,
        "center_well": {
            "id": "well-03",
            "name": "Well-03",
            "code": "ARB-MH-W03",
            "field": "Mumbai High South",
            "type": "active",
            "status": "ACTIVE",
            "risk_badge": "High Risk",
            "risk_color": "red",
            "risk_score": 84,
            "formation": "Miocene",
            "depth": "2450 m",
            "depth_num": 2450,
            "rop": 104,
            "last_event": "Loss circulation",
            "lat": 19.35,
            "lng": 71.30,
            "is_center": True,
            "rings_meters": [16000, 36000, 62000],
        },
        "wells": [
            {
                "id": "well-03",
                "name": "Well-03",
                "code": "ARB-MH-W03",
                "field": "Mumbai High South",
                "type": "active",
                "status": "ACTIVE",
                "risk_badge": "High Risk",
                "risk_color": "red",
                "risk_score": 84,
                "formation": "Miocene",
                "depth": "2450 m",
                "depth_num": 2450,
                "rop": 104,
                "last_event": "Loss circulation",
                "lat": 19.35,
                "lng": 71.30,
                "is_center": True,
            },
            {
                "id": "well-01",
                "name": "Well-01",
                "code": "ARB-MH-W01",
                "field": "Bassein Gas Field",
                "type": "safe",
                "status": "SAFE",
                "risk_badge": "Safe",
                "risk_color": "green",
                "risk_score": 28,
                "formation": "Pliocene",
                "depth": "2180 m",
                "depth_num": 2180,
                "rop": 136,
                "last_event": "Normal drilling",
                "lat": 19.82,
                "lng": 71.38,
                "is_center": False,
            },
            {
                "id": "well-02",
                "name": "Well-02",
                "code": "ARB-MH-W02",
                "field": "Heera Field",
                "type": "nearby",
                "status": "NEARBY",
                "risk_badge": "Nearby Well",
                "risk_color": "blue",
                "risk_score": 45,
                "formation": "Miocene",
                "depth": "2390 m",
                "depth_num": 2390,
                "rop": 82,
                "last_event": "Logging complete",
                "lat": 19.38,
                "lng": 70.82,
                "is_center": False,
            },
            {
                "id": "well-04",
                "name": "Well-04",
                "code": "ARB-MH-W04",
                "field": "Neelam Offshore",
                "type": "risk",
                "status": "HIGH_RISK",
                "risk_badge": "High Risk",
                "risk_color": "red",
                "risk_score": 79,
                "formation": "Oligocene",
                "depth": "2780 m",
                "depth_num": 2780,
                "rop": 65,
                "last_event": "Kick detected",
                "lat": 19.00,
                "lng": 71.65,
                "is_center": False,
            },
            {
                "id": "well-05",
                "name": "Well-05",
                "code": "ARB-MH-W05",
                "field": "Ratna Deep",
                "type": "nearby",
                "status": "NEARBY",
                "risk_badge": "Nearby Well",
                "risk_color": "blue",
                "risk_score": 38,
                "formation": "Eocene",
                "depth": "3120 m",
                "depth_num": 3120,
                "rop": 44,
                "last_event": "Casing set",
                "lat": 18.70,
                "lng": 71.95,
                "is_center": False,
            },
            {
                "id": "well-06",
                "name": "Well-06",
                "code": "ARB-MH-W06",
                "field": "D-1 Field",
                "type": "safe",
                "status": "SAFE",
                "risk_badge": "Safe",
                "risk_color": "green",
                "risk_score": 22,
                "formation": "Pliocene",
                "depth": "1940 m",
                "depth_num": 1940,
                "rop": 145,
                "last_event": "Coring run 1",
                "lat": 19.60,
                "lng": 71.10,
                "is_center": False,
            }
        ],
        "platforms": [
            {"id": "plat-01", "name": "Alpha Platform", "lat": 19.72, "lng": 70.75},
            {"id": "plat-02", "name": "Beta Platform", "lat": 18.90, "lng": 70.92},
            {"id": "plat-03", "name": "Gamma Platform", "lat": 18.82, "lng": 72.15},
            {"id": "plat-04", "name": "Delta Platform", "lat": 19.55, "lng": 71.92},
        ],
        "trajectories": [
            {"from": "well-03", "to": "well-01", "coords": [[19.35, 71.30], [19.82, 71.38]]},
            {"from": "well-03", "to": "well-02", "coords": [[19.35, 71.30], [19.38, 70.82]]},
            {"from": "well-03", "to": "well-04", "coords": [[19.35, 71.30], [19.00, 71.65]]},
            {"from": "well-04", "to": "well-05", "coords": [[19.00, 71.65], [18.70, 71.95]]},
        ]
    },
    "Assam Shelf (Onshore)": {
        "region": "Assam Shelf (Onshore)",
        "center": [26.85, 94.60],
        "zoom": 9,
        "center_well": {
            "id": "well-as-01",
            "name": "Nahorkatiya-14",
            "code": "ASM-NHK-14",
            "field": "Nahorkatiya",
            "type": "active",
            "status": "ACTIVE",
            "risk_badge": "High Risk",
            "risk_color": "red",
            "risk_score": 76,
            "formation": "Barail Sandstone",
            "depth": "3200 m",
            "depth_num": 3200,
            "rop": 24,
            "last_event": "Stuck pipe",
            "lat": 26.88,
            "lng": 94.62,
            "is_center": True,
            "rings_meters": [3000, 7000, 12000],
        },
        "wells": [
            {
                "id": "well-as-01",
                "name": "Nahorkatiya-14",
                "code": "ASM-NHK-14",
                "field": "Nahorkatiya",
                "type": "active",
                "status": "ACTIVE",
                "risk_badge": "High Risk",
                "risk_color": "red",
                "risk_score": 76,
                "formation": "Barail Sandstone",
                "depth": "3200 m",
                "depth_num": 3200,
                "rop": 24,
                "last_event": "Stuck pipe",
                "lat": 26.88,
                "lng": 94.62,
                "is_center": True,
            },
            {
                "id": "well-as-02",
                "name": "Moran-08",
                "code": "ASM-MRN-08",
                "field": "Moran Oilfield",
                "type": "safe",
                "status": "SAFE",
                "risk_badge": "Safe",
                "risk_color": "green",
                "risk_score": 30,
                "formation": "Tipam Sandstone",
                "depth": "2650 m",
                "depth_num": 2650,
                "rop": 45,
                "last_event": "Production test",
                "lat": 27.02,
                "lng": 94.75,
                "is_center": False,
            },
            {
                "id": "well-as-03",
                "name": "Digboi Deep-02",
                "code": "ASM-DGB-02",
                "field": "Digboi Anticline",
                "type": "nearby",
                "status": "NEARBY",
                "risk_badge": "Nearby Well",
                "risk_color": "blue",
                "risk_score": 52,
                "formation": "Surma Group",
                "depth": "2850 m",
                "depth_num": 2850,
                "rop": 32,
                "last_event": "Gas seep",
                "lat": 26.70,
                "lng": 94.48,
                "is_center": False,
            }
        ],
        "platforms": [],
        "trajectories": [
            {"from": "well-as-01", "to": "well-as-02", "coords": [[26.88, 94.62], [27.02, 94.75]]},
            {"from": "well-as-01", "to": "well-as-03", "coords": [[26.88, 94.62], [26.70, 94.48]]}
        ]
    },
    "Rajasthan Basin": {
        "region": "Rajasthan Basin",
        "center": [25.75, 71.40],
        "zoom": 9,
        "center_well": {
            "id": "well-raj-01",
            "name": "Mangala-22",
            "code": "RAJ-MNG-22",
            "field": "Barmer Basin",
            "type": "active",
            "status": "ACTIVE",
            "risk_badge": "High Risk",
            "risk_color": "red",
            "risk_score": 68,
            "formation": "Fatehgarh Sandstone",
            "depth": "1850 m",
            "depth_num": 1850,
            "rop": 85,
            "last_event": "Loss of circulation",
            "lat": 25.78,
            "lng": 71.42,
            "is_center": True,
            "rings_meters": [2500, 6000, 10000],
        },
        "wells": [
            {
                "id": "well-raj-01",
                "name": "Mangala-22",
                "code": "RAJ-MNG-22",
                "field": "Barmer Basin",
                "type": "active",
                "status": "ACTIVE",
                "risk_badge": "High Risk",
                "risk_color": "red",
                "risk_score": 68,
                "formation": "Fatehgarh Sandstone",
                "depth": "1850 m",
                "depth_num": 1850,
                "rop": 85,
                "last_event": "Loss of circulation",
                "lat": 25.78,
                "lng": 71.42,
                "is_center": True,
            },
            {
                "id": "well-raj-02",
                "name": "Bhagyam-05",
                "code": "RAJ-BGM-05",
                "field": "Northern Barmer",
                "type": "safe",
                "status": "SAFE",
                "risk_badge": "Safe",
                "risk_color": "green",
                "risk_score": 19,
                "formation": "Barmer Hill",
                "depth": "1420 m",
                "depth_num": 1420,
                "rop": 120,
                "last_event": "Normal drilling",
                "lat": 25.92,
                "lng": 71.55,
                "is_center": False,
            },
            {
                "id": "well-raj-03",
                "name": "Aishwarya-11",
                "code": "RAJ-ASH-11",
                "field": "Central Barmer",
                "type": "nearby",
                "status": "NEARBY",
                "risk_badge": "Nearby Well",
                "risk_color": "blue",
                "risk_score": 42,
                "formation": "Dharvi Dungar",
                "depth": "2100 m",
                "depth_num": 2100,
                "rop": 70,
                "last_event": "Torque fluctuation",
                "lat": 25.62,
                "lng": 71.30,
                "is_center": False,
            }
        ],
        "platforms": [],
        "trajectories": [
            {"from": "well-raj-01", "to": "well-raj-02", "coords": [[25.78, 71.42], [25.92, 71.55]]},
            {"from": "well-raj-01", "to": "well-raj-03", "coords": [[25.78, 71.42], [25.62, 71.30]]}
        ]
    },
    "KG Deepwater": {
        "region": "KG Deepwater",
        "center": [16.40, 82.30],
        "zoom": 9,
        "center_well": {
            "id": "well-kg-01",
            "name": "KG-D6-R1",
            "code": "KG-DW-R01",
            "field": "KG-DWN-98/3",
            "type": "active",
            "status": "ACTIVE",
            "risk_badge": "High Risk",
            "risk_color": "red",
            "risk_score": 91,
            "formation": "Godavari Clay & Channel Sands",
            "depth": "4150 m",
            "depth_num": 4150,
            "rop": 18,
            "last_event": "Gas kick",
            "lat": 16.38,
            "lng": 82.32,
            "is_center": True,
            "rings_meters": [4000, 9000, 15000],
        },
        "wells": [
            {
                "id": "well-kg-01",
                "name": "KG-D6-R1",
                "code": "KG-DW-R01",
                "field": "KG-DWN-98/3",
                "type": "active",
                "status": "ACTIVE",
                "risk_badge": "High Risk",
                "risk_color": "red",
                "risk_score": 91,
                "formation": "Godavari Clay & Channel Sands",
                "depth": "4150 m",
                "depth_num": 4150,
                "rop": 18,
                "last_event": "Gas kick",
                "lat": 16.38,
                "lng": 82.32,
                "is_center": True,
            },
            {
                "id": "well-kg-02",
                "name": "KG-DWN-98/2-A",
                "code": "KG-ONGC-982",
                "field": "Cluster-2 Deepwater",
                "type": "safe",
                "status": "SAFE",
                "risk_badge": "Safe",
                "risk_color": "green",
                "risk_score": 35,
                "formation": "Pliocene Turbidites",
                "depth": "3600 m",
                "depth_num": 3600,
                "rop": 28,
                "last_event": "LWD telemetry good",
                "lat": 16.55,
                "lng": 82.45,
                "is_center": False,
            }
        ],
        "platforms": [
            {"id": "fpsO-01", "name": "Ruby FPSO", "lat": 16.45, "lng": 82.25}
        ],
        "trajectories": [
            {"from": "well-kg-01", "to": "well-kg-02", "coords": [[16.38, 82.32], [16.55, 82.45]]}
        ]
    }
}


@app.get("/", tags=["Health"])
def root():
    return {
        "message": "Welcome to eRTMAC-NWIS Nearby Wells Intelligence API",
        "docs_url": "/docs",
        "status": "healthy",
    }


@app.get("/api/health", response_model=schemas.SystemHealthResponse, tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    stations_count = db.query(models.Station).count()
    telemetry_count = db.query(models.TelemetryRecord).count()
    return {
        "status": "healthy",
        "app_name": "eRTMAC-NWIS",
        "version": "1.0.0",
        "stations_count": stations_count,
        "telemetry_records_count": telemetry_count,
    }


@app.get("/api/kpis", tags=["eRTMAC-NWIS"])
def get_kpis(role: str = "Drilling Engineer"):
    # Tailor alert counters based on user role
    risk_count = 12
    if role == "Lead Geoscientist":
        risk_count = 15
    elif role == "Risk Safety Officer":
        risk_count = 18

    return {
        "total_wells": {
            "value": "1,284",
            "trend": "↑ 12%",
            "is_positive": True,
            "sparkline": [1150, 1180, 1210, 1225, 1250, 1284]
        },
        "formations": {
            "value": "356",
            "trend": "↑ 8%",
            "is_positive": True,
            "sparkline": [320, 332, 340, 345, 350, 356]
        },
        "historical_events": {
            "value": "4,892",
            "trend": "↑ 15%",
            "is_positive": True,
            "sparkline": [4100, 4320, 4450, 4600, 4750, 4892]
        },
        "active_risk_alerts": {
            "value": str(risk_count),
            "trend": "↑ 3 new",
            "is_positive": False,
            "sparkline": [8, 9, 7, 10, 11, risk_count]
        }
    }


@app.get("/api/wells", tags=["eRTMAC-NWIS"])
def get_wells(basin: str = Query("Arabian Sea (Offshore)")):
    basin_key = basin if basin in BASIN_DATA else "Arabian Sea (Offshore)"
    return BASIN_DATA[basin_key]


@app.get("/api/well-correlation", tags=["eRTMAC-NWIS"])
def get_well_correlation():
    return {
        "strata_legend": [
            {"name": "Sandstone", "color": "#f59e0b", "description": "High porosity reservoir rock, coarse quartz grains"},
            {"name": "Shale", "color": "#64748b", "description": "Overpressured swelling claystone, high breakout risk"},
            {"name": "Limestone", "color": "#38bdf8", "description": "Fractured vugular carbonate, potential loss zone"},
            {"name": "Reservoir", "color": "#ef4444", "description": "Primary hydrocarbon pay zone with gas-oil contact"},
            {"name": "Other", "color": "#14b8a6", "description": "Basement igneous / dense tight siltstone"}
        ],
        "wells": [
            {
                "well": "Well-01",
                "Sandstone": 750,
                "Shale": 950,
                "Limestone": 650,
                "Reservoir": 550,
                "Other": 600,
            },
            {
                "well": "Well-03",
                "Sandstone": 800,
                "Shale": 900,
                "Limestone": 700,
                "Reservoir": 580,
                "Other": 620,
            },
            {
                "well": "Well-05",
                "Sandstone": 720,
                "Shale": 980,
                "Limestone": 680,
                "Reservoir": 520,
                "Other": 650,
            }
        ]
    }


@app.get("/api/risk-index", tags=["eRTMAC-NWIS"])
def get_risk_index():
    return {
        "score": 62,
        "label": "Moderate",
        "high_risk": 18,
        "medium_risk": 24,
        "low_risk": 20,
        "segments": [
            {"name": "High Risk", "value": 18, "color": "#ef4444"},
            {"name": "Medium Risk", "value": 24, "color": "#f59e0b"},
            {"name": "Low Risk", "value": 20, "color": "#0ea5e9"}
        ]
    }


@app.get("/api/drilling-trends", tags=["eRTMAC-NWIS"])
def get_drilling_trends(metric: str = "ROP"):
    multiplier = 1.0
    unit = "m/hr"
    if metric == "WOB":
        multiplier = 0.15
        unit = "klbs"
    elif metric == "RPM":
        multiplier = 1.2
        unit = "rpm"
    elif metric == "Torque":
        multiplier = 0.25
        unit = "kft-lbs"

    base_data = [
        {"date": "Jun 1", "Well-01": round(95 * multiplier, 1), "Well-03": round(58 * multiplier, 1), "Well-05": round(32 * multiplier, 1)},
        {"date": "Jun 3", "Well-01": round(110 * multiplier, 1), "Well-03": round(65 * multiplier, 1), "Well-05": round(38 * multiplier, 1)},
        {"date": "Jun 5", "Well-01": round(108 * multiplier, 1), "Well-03": round(74 * multiplier, 1), "Well-05": round(35 * multiplier, 1)},
        {"date": "Jun 7", "Well-01": round(125 * multiplier, 1), "Well-03": round(72 * multiplier, 1), "Well-05": round(45 * multiplier, 1)},
        {"date": "Jun 9", "Well-01": round(115 * multiplier, 1), "Well-03": round(88 * multiplier, 1), "Well-05": round(36 * multiplier, 1)},
        {"date": "Jun 10", "Well-01": round(138 * multiplier, 1), "Well-03": round(105 * multiplier, 1), "Well-05": round(42 * multiplier, 1)},
        {"date": "Jun 12", "Well-01": round(122 * multiplier, 1), "Well-03": round(98 * multiplier, 1), "Well-05": round(40 * multiplier, 1)},
        {"date": "Jun 14", "Well-01": round(142 * multiplier, 1), "Well-03": round(102 * multiplier, 1), "Well-05": round(48 * multiplier, 1)},
        {"date": "Jun 15", "Well-01": round(136 * multiplier, 1), "Well-03": round(104 * multiplier, 1), "Well-05": round(44 * multiplier, 1)},
    ]
    return {
        "metric": metric,
        "unit": unit,
        "data": base_data
    }


@app.get("/api/events", tags=["eRTMAC-NWIS"])
def get_historical_events(event_type: Optional[str] = None):
    events = [
        {
            "id": "EVT-2026-081",
            "well_id": "Well-03",
            "well_name": "ARB-MH-W03",
            "event_type": "Loss of circulation",
            "severity": "High",
            "severity_color": "red",
            "depth": "2450 m",
            "depth_num": 2450,
            "formation": "Miocene Carbonate",
            "impact_npt_hrs": 38.5,
            "impact_cost_usd": "₹2,45,000",
            "root_cause": "Subsurface microfractures encountered in under-compacted reefal limestone with 400 bbl/hr mud loss.",
            "mitigation": "Spotted 60 bbl LCM pill (medium/coarse nutshell & cellulosic fibers), reduced pump rate by 20%."
        },
        {
            "id": "EVT-2026-064",
            "well_id": "Well-04",
            "well_name": "ARB-MH-W04",
            "event_type": "Gas kick",
            "severity": "High",
            "severity_color": "red",
            "depth": "2780 m",
            "depth_num": 2780,
            "formation": "Oligocene Sandstone",
            "impact_npt_hrs": 26.0,
            "impact_cost_usd": "₹1,80,000",
            "root_cause": "Abnormal pore pressure ramp (0.64 psi/ft) causing 35 bbl pit gain with 1,200 ppm background gas spike.",
            "mitigation": "Shut in annular BOP, circulated kick out via choke manifold using Wait and Weight method (MW raised to 12.4 ppg)."
        },
        {
            "id": "EVT-2026-052",
            "well_id": "Well-02",
            "well_name": "ARB-MH-W02",
            "event_type": "Stuck pipe",
            "severity": "Medium",
            "severity_color": "orange",
            "depth": "2390 m",
            "depth_num": 2390,
            "formation": "Miocene Shale",
            "impact_npt_hrs": 17.5,
            "impact_cost_usd": "₹1,15,000",
            "root_cause": "Reactive smectite shale swelling during connection time resulting in mechanical packing off above BHA.",
            "mitigation": "Jarred down with 80 klbs overpull, pumped 40 bbl glycol-weighted sweep and reamed back to bottom."
        },
        {
            "id": "EVT-2026-039",
            "well_id": "Well-01",
            "well_name": "ARB-MH-W01",
            "event_type": "Torque spike",
            "severity": "Low",
            "severity_color": "yellow",
            "depth": "2180 m",
            "depth_num": 2180,
            "formation": "Pliocene Sandstone",
            "impact_npt_hrs": 4.0,
            "impact_cost_usd": "₹28,000",
            "root_cause": "Hard stringer transition causing severe stick-slip and motor stall with torque peaking at 28 kft-lbs.",
            "mitigation": "Reduced WOB from 35 to 20 klbs, increased rotary table RPM to 110 to stabilize drillstring vibration."
        },
        {
            "id": "EVT-2026-021",
            "well_id": "Well-05",
            "well_name": "ARB-MH-W05",
            "event_type": "Cementing failure",
            "severity": "Medium",
            "severity_color": "orange",
            "depth": "3120 m",
            "depth_num": 3120,
            "formation": "Eocene Basal Sand",
            "impact_npt_hrs": 21.0,
            "impact_cost_usd": "₹1,60,000",
            "root_cause": "Channeling in micro-annulus due to inadequate mud displacement efficiency behind 9-5/8 casing shoe.",
            "mitigation": "Performed squeeze cementing with micro-fine slurry, verified pressure integrity test (PIT) to 14.2 ppg EMW."
        },
        {
            "id": "EVT-2026-014",
            "well_id": "Well-03",
            "well_name": "ARB-MH-W03",
            "event_type": "Loss of circulation",
            "severity": "High",
            "severity_color": "red",
            "depth": "2410 m",
            "depth_num": 2410,
            "formation": "Miocene Carbonate",
            "impact_npt_hrs": 19.0,
            "impact_cost_usd": "₹1,35,000",
            "root_cause": "Seepage loss in upper fractured dolomite layer leading to total hydrostatic drop of 45 psi.",
            "mitigation": "Pumped high-viscosity bentonite pill with cross-linked polymer squeeze."
        }
    ]
    if event_type and event_type != "All":
        events = [e for e in events if e["event_type"].lower() == event_type.lower()]
    return events


@app.get("/api/formations", tags=["eRTMAC-NWIS"])
def get_formation_properties():
    return [
        {
            "name": "Sandstone",
            "color": "#f59e0b",
            "depth_interval": "0m - 800m",
            "porosity_pct": "24.5%",
            "permeability_md": "450 mD",
            "fracture_gradient": "0.72 psi/ft (13.8 ppg)",
            "pore_pressure": "0.44 psi/ft (Normal hydrostatic)",
            "risk_warning": "High differential sticking hazard when overbalanced (>150 psi). Maintain minimal filter cake thickness."
        },
        {
            "name": "Shale",
            "color": "#64748b",
            "depth_interval": "800m - 1,700m",
            "porosity_pct": "8.2%",
            "permeability_md": "0.02 mD",
            "fracture_gradient": "0.81 psi/ft (15.6 ppg)",
            "pore_pressure": "0.58 psi/ft (Overpressure ramp)",
            "risk_warning": "Miocene Shale: High swelling & pipe sticking vulnerability. Maintain KCl/glycol mud chemistry."
        },
        {
            "name": "Limestone",
            "color": "#38bdf8",
            "depth_interval": "1,700m - 2,400m",
            "porosity_pct": "14.8%",
            "permeability_md": "180 mD",
            "fracture_gradient": "0.78 psi/ft (15.0 ppg)",
            "pore_pressure": "0.47 psi/ft (Depleted reservoir zone)",
            "risk_warning": "Fractured vugular carbonate: Severe loss of circulation hazard. Pre-treat active pits with LCM fibers."
        },
        {
            "name": "Reservoir (Pay Zone)",
            "color": "#ef4444",
            "depth_interval": "2,400m - 2,980m",
            "porosity_pct": "28.4%",
            "permeability_md": "820 mD",
            "fracture_gradient": "0.85 psi/ft (16.3 ppg)",
            "pore_pressure": "0.62 psi/ft (Hydrocarbon cap pressure)",
            "risk_warning": "High Gas Kick Potential: Live oil/gas influx alert. Ensure dual barrier envelope & verify IBOP."
        },
        {
            "name": "Other (Basement / Silt)",
            "color": "#14b8a6",
            "depth_interval": "2,980m - 4,000m+",
            "porosity_pct": "3.1%",
            "permeability_md": "0.005 mD",
            "fracture_gradient": "0.94 psi/ft (18.1 ppg)",
            "pore_pressure": "0.45 psi/ft",
            "risk_warning": "Abrasive hard chert nodules: High bit wear and severe PDC cutter spalling. Limit RPM < 85."
        }
    ]


@app.get("/api/stations", response_model=List[schemas.StationResponse], tags=["Stations"])
def list_stations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_stations(db, skip=skip, limit=limit)
