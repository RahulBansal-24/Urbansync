from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime

# Layer 1 / Layer 2 GeoJSON Feature Schema
class GeoJsonProperties(BaseModel):
    id: str
    type: str # TRAFFIC, EVENT, ACCIDENT, ROAD_BLOCK, HOSPITAL, TRANSIT, WEATHER, PREDICTION
    title: str
    description: Optional[str] = None
    severity: str = "MEDIUM" # LOW, MEDIUM, HIGH, CRITICAL, SEVERE
    status: str = "ACTIVE"
    data_state: str = "LIVE" # LIVE, DERIVED, PREDICTED, SIMULATED, STATIC
    
    source_name: str = "UrbanSync System"
    source_url: Optional[str] = None
    source_timestamp: Optional[str] = None
    
    # Layer 2 Calculated Scores
    impact_scores: Optional[Dict[str, float]] = None
    extra_metadata: Optional[Dict[str, Any]] = None

class GeoJsonFeature(BaseModel):
    type: str = "Feature"
    geometry: Dict[str, Any]
    properties: GeoJsonProperties

class GeoJsonFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[GeoJsonFeature]

# Smart Route Schemas
class SmartRouteRequest(BaseModel):
    origin: List[float] = Field(..., description="[longitude, latitude]")
    destination: List[float] = Field(..., description="[longitude, latitude]")
    origin_name: Optional[str] = "Connaught Place"
    destination_name: Optional[str] = "IGI Airport"
    preference: str = Field("balanced", description="fastest, safer, avoid_events, avoid_closures, balanced")

class RouteCandidate(BaseModel):
    id: str
    name: str
    eta_minutes: float
    distance_km: float
    urbansync_score: float # 0 - 100
    geometry: Dict[str, Any] # LineString GeoJSON
    avoided_incidents_count: int
    passed_events_count: int
    closures_intersected: int
    weather_risk_level: str # LOW, MODERATE, HIGH
    factors: List[Dict[str, Any]]
    explanation: str

class SmartRouteResponse(BaseModel):
    recommended_route_id: str
    routes: List[RouteCandidate]
    confidence_pct: float = 92.0
    timestamp: str

# Simulation Schemas
class SimulationScenarioInput(BaseModel):
    origin: Optional[List[float]] = Field(default_factory=lambda: [77.2197, 28.6315], description="Origin [lon, lat]")
    destination: Optional[List[float]] = Field(default_factory=lambda: [77.1000, 28.5562], description="Destination [lon, lat]")
    origin_name: Optional[str] = "Connaught Place (Rajiv Chowk)"
    destination_name: Optional[str] = "IGI Airport Terminal 3"
    road_closures: List[str] = Field(default_factory=list, description="List of closed road corridors")
    event_locations: List[str] = Field(default_factory=list, description="List of active event venues")
    traffic_increase_pct: float = Field(default=0.0, description="Traffic surge percentage")
    weather_severity: str = Field(default="Clear", description="Weather condition")
    affected_weather_region: Optional[str] = "South Delhi"
    event_location_name: Optional[str] = None
    event_coordinates: Optional[List[float]] = None
    event_attendance: Optional[int] = 0

class TopCorridorImpact(BaseModel):
    road_name: str
    baseline_speed_kph: float
    simulated_speed_kph: float
    congestion_increase_pct: float
    status: str

class SimulationResult(BaseModel):
    scenario_id: str
    data_state: str = "SIMULATED"
    baseline_metrics: Dict[str, Any]
    simulated_metrics: Dict[str, Any]
    metric_deltas: Dict[str, Any] # e.g. avg_eta_delta_pct, congestion_delta_pct
    top_impacted_corridors: List[TopCorridorImpact]
    top_alternative_detours: List[str]
    ai_summary: str
    optimal_reroute: Optional[RouteCandidate] = None
    reroute_reasoning: Optional[Dict[str, Any]] = None
    timestamp: str

# Hospital Ranker Schemas
class HospitalRankRequest(BaseModel):
    user_location: List[float] = Field(..., description="[longitude, latitude]")
    emergency_type: str = Field("General Emergency", description="General Emergency, Trauma, Accident, Cardiac, Pediatric")

class HospitalRankItem(BaseModel):
    id: str
    name: str
    hospital_type: str
    address: str
    distance_km: float
    eta_minutes: float
    suitability_score: float # 0 - 100
    has_emergency: bool
    has_trauma_center: bool
    reported_icu_beds: int = 0
    reported_general_beds: int = 100
    availability_status: str
    google_maps_url: str
    reasoning: str
    source_name: str
    data_state: str

class HospitalRankResponse(BaseModel):
    recommended_hospital: HospitalRankItem
    ranked_hospitals: List[HospitalRankItem]
    timestamp: str

# AI Assistant Chat Schema
class AssistantChatMessage(BaseModel):
    role: str # user or assistant
    content: str

class AssistantChatRequest(BaseModel):
    messages: List[AssistantChatMessage]
    user_location: Optional[List[float]] = None

class AssistantChatResponse(BaseModel):
    message: str
    tool_calls_executed: Optional[List[str]] = None
    source_grounded: bool = True
    timestamp: str

# System Status Schema
class ServiceHealth(BaseModel):
    service_name: str
    status: str # ONLINE, LIVE, DEGRADED, OFFLINE
    last_sync: str
    details: Optional[str] = None

class SystemStatusResponse(BaseModel):
    overall_status: str = "ONLINE"
    delhi_time: str
    services: List[ServiceHealth]
    demo_mode_active: bool = False
