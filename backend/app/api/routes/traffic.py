from fastapi import APIRouter, Request
from app.schemas.city_schemas import GeoJsonFeatureCollection, GeoJsonFeature, GeoJsonProperties
from app.database.seed_data import SEED_ROAD_BLOCKS

router = APIRouter(prefix="/api/traffic", tags=["Traffic"])

@router.get("/incidents", response_model=GeoJsonFeatureCollection)
async def get_traffic_incidents(request: Request):
    """Returns active traffic incidents and accidents in Delhi as GeoJSON FeatureCollection."""
    scheduler = request.app.state.scheduler
    raw_incidents = scheduler.traffic_incidents if scheduler else []

    features = []
    for inc in raw_incidents:
        inc_type = inc.get("incident_type", "CONGESTION")
        features.append(GeoJsonFeature(
            type="Feature",
            geometry={
                "type": "Point",
                "coordinates": [inc["longitude"], inc["latitude"]]
            },
            properties=GeoJsonProperties(
                id=inc["id"],
                type="ACCIDENT" if inc_type == "ACCIDENT" else "TRAFFIC",
                title=inc["title"],
                description=inc.get("description"),
                severity=inc.get("severity", "HIGH"),
                status=inc.get("status", "ACTIVE"),
                data_state=inc.get("data_state", "LIVE"),
                source_name=inc.get("source_name", "TomTom Traffic"),
                source_timestamp="2026-09-01T15:00:00Z",
                extra_metadata={
                    "road_name": inc.get("road_name"),
                    "delay_seconds": inc.get("delay_seconds", 300),
                    "delay_minutes": round(inc.get("delay_seconds", 300) / 60.0, 1)
                }
            )
        ))

    return GeoJsonFeatureCollection(features=features)

@router.get("/roadblocks", response_model=GeoJsonFeatureCollection)
async def get_road_blocks(request: Request):
    """Returns official road closures and diversion barricades as GeoJSON FeatureCollection."""
    features = []
    for blk in SEED_ROAD_BLOCKS:
        features.append(GeoJsonFeature(
            type="Feature",
            geometry={
                "type": "LineString",
                "coordinates": [
                    [blk["start_longitude"], blk["start_latitude"]],
                    [blk["end_longitude"], blk["end_latitude"]]
                ]
            },
            properties=GeoJsonProperties(
                id=blk["id"],
                type="ROAD_BLOCK",
                title=blk["title"],
                description=blk.get("description"),
                severity=blk.get("severity", "CRITICAL"),
                status=blk.get("status", "ACTIVE"),
                data_state=blk.get("data_state", "LIVE"),
                source_name=blk.get("source_name", "Delhi Traffic Police"),
                source_timestamp="2026-09-01T15:00:00Z",
                extra_metadata={
                    "closure_type": blk.get("closure_type"),
                    "reason": blk.get("reason"),
                    "road_name": blk.get("road_name")
                }
            )
        ))
    return GeoJsonFeatureCollection(features=features)
