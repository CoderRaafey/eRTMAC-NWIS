from typing import List, Optional
from sqlalchemy.orm import Session
from datetime import datetime

from . import models, schemas


def get_station(db: Session, station_id: int) -> Optional[models.Station]:
    return db.query(models.Station).filter(models.Station.id == station_id).first()


def get_station_by_code(db: Session, station_code: str) -> Optional[models.Station]:
    return db.query(models.Station).filter(models.Station.station_code == station_code).first()


def get_stations(db: Session, skip: int = 0, limit: int = 100) -> List[models.Station]:
    return db.query(models.Station).offset(skip).limit(limit).all()


def create_station(db: Session, station: schemas.StationCreate) -> models.Station:
    db_station = models.Station(
        station_code=station.station_code,
        name=station.name,
        basin=station.basin,
        latitude=station.latitude,
        longitude=station.longitude,
        status=station.status or "ACTIVE",
    )
    db.add(db_station)
    db.commit()
    db.refresh(db_station)
    return db_station


def get_telemetry_records(db: Session, station_id: Optional[int] = None, limit: int = 100) -> List[models.TelemetryRecord]:
    query = db.query(models.TelemetryRecord)
    if station_id:
        query = query.filter(models.TelemetryRecord.station_id == station_id)
    return query.order_by(models.TelemetryRecord.timestamp.desc()).limit(limit).all()


def create_telemetry_record(db: Session, telemetry: schemas.TelemetryCreate) -> models.TelemetryRecord:
    db_telemetry = models.TelemetryRecord(
        station_id=telemetry.station_id,
        water_level_m=telemetry.water_level_m,
        discharge_cumec=telemetry.discharge_cumec,
        water_temperature_c=telemetry.water_temperature_c,
        battery_voltage_v=telemetry.battery_voltage_v,
        timestamp=telemetry.timestamp or datetime.utcnow(),
    )
    db.add(db_telemetry)
    db.commit()
    db.refresh(db_telemetry)
    return db_telemetry
