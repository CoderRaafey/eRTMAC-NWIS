from datetime import datetime, timedelta
import random
from .database import SessionLocal, engine, Base
from . import models

SAMPLE_STATIONS = [
    {
        "station_code": "NWIS-DEL-01",
        "name": "Yamuna River Wazirabad Station",
        "basin": "Yamuna-Ganga Basin",
        "latitude": 28.7126,
        "longitude": 77.2315,
        "status": "ACTIVE",
    },
    {
        "station_code": "NWIS-HAR-02",
        "name": "Hathnikund Barrage Reservoir",
        "basin": "Yamuna-Ganga Basin",
        "latitude": 30.3117,
        "longitude": 77.5886,
        "status": "ACTIVE",
    },
    {
        "station_code": "NWIS-UK-03",
        "name": "Tehri Dam Inflow Monitoring",
        "basin": "Bhagirathi Basin",
        "latitude": 30.3783,
        "longitude": 78.4803,
        "status": "ACTIVE",
    },
    {
        "station_code": "NWIS-RAJ-04",
        "name": "Bisalpur Intake Site",
        "basin": "Banas River Basin",
        "latitude": 26.0461,
        "longitude": 75.4627,
        "status": "ACTIVE",
    },
    {
        "station_code": "NWIS-MAH-05",
        "name": "Koyna River Hydrological Station",
        "basin": "Krishna Basin",
        "latitude": 17.3995,
        "longitude": 73.7495,
        "status": "MAINTENANCE",
    },
]


def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing_stations = db.query(models.Station).count()
        if existing_stations > 0:
            print(f"Database already contains {existing_stations} stations. Skipping seed.")
            return

        print("Seeding stations and telemetry data...")
        created_stations = []
        for station_data in SAMPLE_STATIONS:
            station = models.Station(**station_data)
            db.add(station)
            created_stations.append(station)
        db.commit()

        # Seed recent telemetry records for each station
        now = datetime.utcnow()
        for station in created_stations:
            db.refresh(station)
            base_water_level = random.uniform(12.0, 48.0)
            base_discharge = random.uniform(80.0, 450.0)

            for i in range(24):
                ts = now - timedelta(hours=23 - i)
                rec = models.TelemetryRecord(
                    station_id=station.id,
                    water_level_m=round(base_water_level + random.uniform(-0.8, 1.2), 2),
                    discharge_cumec=round(base_discharge + random.uniform(-15.0, 20.0), 1),
                    water_temperature_c=round(random.uniform(18.5, 26.5), 1),
                    battery_voltage_v=round(random.uniform(12.1, 13.8), 2),
                    timestamp=ts,
                )
                db.add(rec)
        db.commit()
        print("Database seeded successfully with initial stations and telemetry history.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
