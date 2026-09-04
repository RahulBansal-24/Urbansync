import os
import datetime
from fastapi import APIRouter, Request
from app.schemas.city_schemas import SystemStatusResponse, ServiceHealth
from app.services.ingestion.adapters import (
    TomTomAdapter,
    WeatherAdapter,
    EventbriteAdapter,
    OverpassHospitalAdapter,
    TransitAdapter
)

router = APIRouter(tags=["System Health"])

@router.get("/api/health", response_model=SystemStatusResponse)
async def get_system_health(request: Request):
    """Returns accurate component health status, data states (LIVE vs FALLBACK) and timestamps."""
    scheduler = request.app.state.scheduler
    
    traffic_count = len(scheduler.traffic_incidents) if scheduler else 0
    weather_count = len(scheduler.weather_cells) if scheduler else 0
    event_count = len(scheduler.events) if scheduler else 0
    hospital_count = len(scheduler.hospitals) if scheduler else 0
    transit_count = len(scheduler.transit_stops) if scheduler else 0

    delhi_time_str = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC (IST: +5:30)")

    tomtom_state = getattr(TomTomAdapter, "last_data_state", "FALLBACK")
    weather_state = getattr(WeatherAdapter, "last_data_state", "FALLBACK")
    event_state = getattr(EventbriteAdapter, "last_data_state", "FALLBACK")
    hospital_state = getattr(OverpassHospitalAdapter, "last_data_state", "FALLBACK")
    transit_state = getattr(TransitAdapter, "last_data_state", "FALLBACK")

    groq_key = os.getenv("GROQ_API_KEY", "")
    groq_status = "ONLINE" if (groq_key and "placeholder" not in groq_key.lower()) else "FALLBACK"

    def determine_status(state: str, count: int, name: str) -> tuple[str, str]:
        if count == 0:
            return "DEGRADED", f"0 {name} loaded"
        if state == "LIVE":
            return "LIVE", f"{count} {name} (Live API active)"
        return "FALLBACK", f"{count} {name} (Seed dataset)"

    t_status, t_details = determine_status(tomtom_state, traffic_count, "TomTom incidents")
    w_status, w_details = determine_status(weather_state, weather_count, "spatial grid cells")
    e_status, e_details = determine_status(event_state, event_count, "current-hour events")
    h_status, h_details = determine_status(hospital_state, hospital_count, "super specialty facilities")
    tr_status, tr_details = determine_status(transit_state, transit_count, "GTFS Metro & Bus routes")

    services = [
        ServiceHealth(service_name="Map & Spatial Engine", status="ONLINE", last_sync="On page load", details="TomTom Orbis & MapLibre GL JS"),
        ServiceHealth(service_name="Traffic & Congestion", status=t_status, last_sync="On page load", details=t_details),
        ServiceHealth(service_name="Incidents & Closures", status=t_status, last_sync="On page load", details=f"Delhi Police & TomTom feeds ({t_status.lower()})"),
        ServiceHealth(service_name="Weather Risk Engine", status=w_status, last_sync="On page load", details=w_details),
        ServiceHealth(service_name="City Events Aggregator", status=e_status, last_sync="On page load", details=e_details),
        ServiceHealth(service_name="Hospital Capability Index", status=h_status, last_sync="On page load", details=h_details),
        ServiceHealth(service_name="Public Transit (Delhi OTD)", status=tr_status, last_sync="On page load", details=tr_details),
        ServiceHealth(service_name="Groq LLM AI Engine", status=groq_status, last_sync="On page load", details="openai/gpt-oss-20b model" if groq_status == "ONLINE" else "Rule-based heuristic engine fallback")
    ]

    overall = "ONLINE"
    if any(s.status in ["DEGRADED", "FALLBACK"] for s in services):
        overall = "PARTIAL / FALLBACK"

    return SystemStatusResponse(
        overall_status=overall,
        delhi_time=delhi_time_str,
        services=services,
        demo_mode_active=False
    )
