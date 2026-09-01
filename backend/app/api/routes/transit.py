from fastapi import APIRouter, Request
from app.schemas.city_schemas import GeoJsonFeatureCollection, GeoJsonFeature, GeoJsonProperties

router = APIRouter(prefix="/api/transit", tags=["Public Transit"])

@router.get("/stops", response_model=GeoJsonFeatureCollection)
async def get_transit_stops(request: Request):
    """Returns Delhi public transit stops and hubs as GeoJSON FeatureCollection."""
    scheduler = request.app.state.scheduler
    raw_stops = scheduler.transit_stops if scheduler else []

    features = []
    for s in raw_stops:
        features.append(GeoJsonFeature(
            type="Feature",
            geometry={
                "type": "Point",
                "coordinates": [s["longitude"], s["latitude"]]
            },
            properties=GeoJsonProperties(
                id=s["id"],
                type="TRANSIT",
                title=s["name"],
                description=f"{s.get('transit_type')} hub ({s.get('line_name')}).",
                severity="LOW",
                status=s.get("status", "OPERATIONAL"),
                data_state=s.get("data_state", "STATIC"),
                source_name=s.get("source_name", "Delhi OTD"),
                source_timestamp="2026-09-01T15:00:00Z",
                extra_metadata={
                    "stop_code": s.get("stop_code"),
                    "line_name": s.get("line_name"),
                    "transit_type": s.get("transit_type"),
                    "live_vehicle_count": s.get("live_vehicle_count", 0)
                }
            )
        ))

    return GeoJsonFeatureCollection(features=features)
