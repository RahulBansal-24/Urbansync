from fastapi import APIRouter, Request
from app.schemas.city_schemas import GeoJsonFeatureCollection, GeoJsonFeature, GeoJsonProperties

router = APIRouter(prefix="/api/transit", tags=["Public Transit"])

@router.get("/stops", response_model=GeoJsonFeatureCollection)
async def get_transit_stops(request: Request):
    """Returns 300+ Delhi Metro & Bus stops and colored route lines as GeoJSON FeatureCollection."""
    scheduler = request.app.state.scheduler
    raw_stops = scheduler.transit_stops if scheduler else []

    features = []
    for s in raw_stops:
        geom_type = s.get("geometry_type", "Point")
        if geom_type == "LineString":
            geometry = {
                "type": "LineString",
                "coordinates": s["coordinates"]
            }
            prop_type = "TRANSIT_ROUTE"
            desc = f"{s.get('line_name')} Transit Route Corridor."
        else:
            geometry = {
                "type": "Point",
                "coordinates": [s["longitude"], s["latitude"]]
            }
            prop_type = "TRANSIT"
            desc = f"{s.get('transit_type')} station/stop ({s.get('line_name')})."

        features.append(GeoJsonFeature(
            type="Feature",
            geometry=geometry,
            properties=GeoJsonProperties(
                id=s["id"],
                type=prop_type,
                title=s["name"],
                description=desc,
                severity="LOW",
                status=s.get("status", "OPERATIONAL"),
                data_state=s.get("data_state", "LIVE"),
                source_name=s.get("source_name", "Delhi OTD / DMRC"),
                source_timestamp="2026-09-01T15:00:00Z",
                extra_metadata={
                    "stop_code": s.get("stop_code"),
                    "line_name": s.get("line_name"),
                    "line_color": s.get("line_color", "#38BDF8"),
                    "transit_type": s.get("transit_type"),
                    "live_vehicle_count": s.get("live_vehicle_count", 0)
                }
            )
        ))

    return GeoJsonFeatureCollection(features=features)
