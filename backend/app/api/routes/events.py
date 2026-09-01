from fastapi import APIRouter, Request
from app.schemas.city_schemas import GeoJsonFeatureCollection, GeoJsonFeature, GeoJsonProperties

router = APIRouter(prefix="/api/events", tags=["Events"])

@router.get("", response_model=GeoJsonFeatureCollection)
async def get_events(request: Request):
    """Returns normalized city events in Delhi as GeoJSON FeatureCollection."""
    scheduler = request.app.state.scheduler
    raw_events = scheduler.events if scheduler else []

    features = []
    for ev in raw_events:
        features.append(GeoJsonFeature(
            type="Feature",
            geometry={
                "type": "Point",
                "coordinates": [ev["longitude"], ev["latitude"]]
            },
            properties=GeoJsonProperties(
                id=ev["id"],
                type="EVENT",
                title=ev["title"],
                description=ev.get("description"),
                severity=ev.get("severity", "MEDIUM"),
                status=ev.get("status", "ACTIVE"),
                data_state=ev.get("data_state", "LIVE"),
                source_name=ev.get("source_name", "INDTIX API"),
                source_url=ev.get("source_url"),
                source_timestamp="2026-09-01T15:00:00Z",
                impact_scores={
                    "traffic_impact": ev.get("traffic_impact_score", 60.0),
                    "crowd_impact": ev.get("crowd_impact_score", 70.0),
                    "parking_impact": ev.get("parking_impact_score", 75.0),
                    "transit_impact": ev.get("transit_impact_score", 65.0),
                    "emergency_impact": ev.get("emergency_impact_score", 30.0)
                },
                extra_metadata={
                    "venue_name": ev.get("venue_name"),
                    "expected_attendance": ev.get("expected_attendance"),
                    "impact_radius_meters": ev.get("impact_radius_meters", 1000.0)
                }
            )
        ))

    return GeoJsonFeatureCollection(features=features)
