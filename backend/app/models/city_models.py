import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, Text, JSON, Boolean
from app.database.connection import Base

class CityEvent(Base):
    __tablename__ = "city_events"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=False, default="Event") # Concert, Sports, Traffic Restriction, etc.
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    venue_name = Column(String, nullable=True)
    expected_attendance = Column(Integer, default=1000)
    severity = Column(String, default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    status = Column(String, default="ACTIVE")
    
    # Source grounding layer
    source_name = Column(String, nullable=False) # e.g. Ticketmaster, Delhi Police Advisory
    source_url = Column(String, nullable=True)
    source_id = Column(String, nullable=True)
    source_timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Impact scores (Layer 2 analysis)
    traffic_impact_score = Column(Float, default=0.0) # 0 - 100
    crowd_impact_score = Column(Float, default=0.0)
    parking_impact_score = Column(Float, default=0.0)
    transit_impact_score = Column(Float, default=0.0)
    emergency_impact_score = Column(Float, default=0.0)
    impact_radius_meters = Column(Float, default=1000.0)

    # Data state (Rule requirement)
    data_state = Column(String, nullable=False, default="LIVE") # LIVE, DERIVED, PREDICTED, SIMULATED, STATIC

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)


class TrafficIncident(Base):
    __tablename__ = "traffic_incidents"

    id = Column(String, primary_key=True)
    incident_type = Column(String, nullable=False) # ACCIDENT, CONGESTION, ROAD_WORK, HAZARD
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    road_name = Column(String, nullable=True)
    severity = Column(String, default="HIGH") # LOW, MEDIUM, HIGH, SEVERE
    delay_seconds = Column(Integer, default=300)
    status = Column(String, default="ACTIVE")
    
    source_name = Column(String, nullable=False, default="TomTom Traffic")
    source_url = Column(String, nullable=True)
    source_timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    data_state = Column(String, nullable=False, default="LIVE")

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class RoadBlock(Base):
    __tablename__ = "road_blocks"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    road_name = Column(String, nullable=False)
    start_latitude = Column(Float, nullable=False)
    start_longitude = Column(Float, nullable=False)
    end_latitude = Column(Float, nullable=False)
    end_longitude = Column(Float, nullable=False)
    closure_type = Column(String, default="FULL_CLOSURE") # FULL_CLOSURE, PARTIAL_CLOSURE, DIVERSION
    reason = Column(String, nullable=True)
    severity = Column(String, default="CRITICAL")
    status = Column(String, default="ACTIVE")
    
    source_name = Column(String, nullable=False, default="Delhi Traffic Police")
    source_url = Column(String, nullable=True)
    source_timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    data_state = Column(String, nullable=False, default="LIVE")

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)


class WeatherObservation(Base):
    __tablename__ = "weather_observations"

    id = Column(String, primary_key=True)
    grid_cell_id = Column(String, nullable=False) # e.g. CELL_SOUTH_DELHI_1
    region_name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    bounds_geojson = Column(JSON, nullable=False) # Polygon boundary for weather cell
    
    temperature_c = Column(Float, nullable=False)
    humidity_pct = Column(Float, nullable=False)
    precipitation_mm = Column(Float, default=0.0)
    rain_probability_pct = Column(Float, default=0.0)
    wind_kph = Column(Float, default=0.0)
    visibility_km = Column(Float, default=10.0)
    condition_text = Column(String, nullable=False, default="Clear")
    
    # Layer 2 risk score
    weather_traffic_risk = Column(Float, default=0.0) # 0 - 100
    
    source_name = Column(String, nullable=False, default="WeatherAPI")
    source_timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    data_state = Column(String, nullable=False, default="LIVE")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    hospital_type = Column(String, default="General Hospital") # Government, Private, Super Specialty
    address = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    phone = Column(String, nullable=True)
    website = Column(String, nullable=True)
    
    has_emergency = Column(Boolean, default=True)
    has_trauma_center = Column(Boolean, default=False)
    has_cardiac_unit = Column(Boolean, default=False)
    has_pediatric_icu = Column(Boolean, default=False)
    
    reported_icu_beds = Column(Integer, default=15)
    reported_general_beds = Column(Integer, default=100)
    availability_status = Column(String, default="AVAILABLE") # HIGH, MODERATE, CRITICAL
    
    rating = Column(Float, default=4.2)
    google_place_id = Column(String, nullable=True)
    
    suitability_score = Column(Float, default=85.0)
    source_name = Column(String, nullable=False, default="Delhi Health Services / OpenStreetMap")
    source_timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    data_state = Column(String, nullable=False, default="STATIC")


class TransitStop(Base):
    __tablename__ = "transit_stops"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    stop_code = Column(String, nullable=True)
    transit_type = Column(String, default="METRO") # METRO, BUS
    line_name = Column(String, nullable=True) # Yellow Line, Blue Line, Bus Route 534
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    live_vehicle_count = Column(Integer, default=0)
    status = Column(String, default="OPERATIONAL")
    
    source_name = Column(String, nullable=False, default="Delhi OTD")
    data_state = Column(String, nullable=False, default="STATIC")


class SimulationScenario(Base):
    __tablename__ = "simulation_scenarios"

    id = Column(String, primary_key=True)
    scenario_name = Column(String, nullable=False)
    params = Column(JSON, nullable=False)
    results = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ApiSyncStatus(Base):
    __tablename__ = "api_sync_status"

    provider = Column(String, primary_key=True)
    last_success = Column(DateTime, nullable=True)
    last_failure = Column(DateTime, nullable=True)
    records_fetched = Column(Integer, default=0)
    records_updated = Column(Integer, default=0)
    response_time_ms = Column(Float, default=0.0)
    status = Column(String, default="ONLINE") # ONLINE, DEGRADED, OFFLINE
    error_message = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
