from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class TelemetryBase(BaseModel):
    water_level_m: Optional[float] = None
    discharge_cumec: Optional[float] = None
    water_temperature_c: Optional[float] = None
    battery_voltage_v: Optional[float] = None
    timestamp: Optional[datetime] = None


class TelemetryCreate(TelemetryBase):
    station_id: int


class TelemetryResponse(TelemetryBase):
    id: int
    station_id: int
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)


class StationBase(BaseModel):
    station_code: str
    name: str
    basin: Optional[str] = None
    latitude: float
    longitude: float
    status: Optional[str] = "ACTIVE"


class StationCreate(StationBase):
    pass


class StationResponse(StationBase):
    id: int
    created_at: datetime
    telemetry_records: List[TelemetryResponse] = []

    model_config = ConfigDict(from_attributes=True)


class SystemHealthResponse(BaseModel):
    status: str
    app_name: str
    version: str
    stations_count: int
    telemetry_records_count: int
