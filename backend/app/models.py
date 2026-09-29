from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from .database import Base


class Station(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, index=True)
    station_code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    basin = Column(String(100), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    status = Column(String(30), default="ACTIVE")  # ACTIVE, INACTIVE, MAINTENANCE
    created_at = Column(DateTime, default=datetime.utcnow)

    telemetry_records = relationship("TelemetryRecord", back_populates="station", cascade="all, delete-orphan")


class TelemetryRecord(Base):
    __tablename__ = "telemetry_records"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("stations.id"), nullable=False)
    water_level_m = Column(Float, nullable=True)
    discharge_cumec = Column(Float, nullable=True)
    water_temperature_c = Column(Float, nullable=True)
    battery_voltage_v = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    station = relationship("Station", back_populates="telemetry_records")
