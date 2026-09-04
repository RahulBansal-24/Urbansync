from fastapi import APIRouter, Request
from app.schemas.city_schemas import (
    GeoJsonFeatureCollection, GeoJsonFeature, GeoJsonProperties,
    HospitalRankRequest, HospitalRankResponse, HospitalRankItem
)
from app.services.geospatial.impact_engines import HospitalRankingEngine

router = APIRouter(prefix="/api/hospitals", tags=["Hospitals"])

@router.get("", response_model=GeoJsonFeatureCollection)
async def get_hospitals(request: Request):
    """Returns Delhi hospital locations as GeoJSON FeatureCollection."""
    scheduler = request.app.state.scheduler
    raw_hospitals = scheduler.hospitals if scheduler else []

    features = []
    for h in raw_hospitals:
        features.append(GeoJsonFeature(
            type="Feature",
            geometry={
                "type": "Point",
                "coordinates": [h["longitude"], h["latitude"]]
            },
            properties=GeoJsonProperties(
                id=h["id"],
                type="HOSPITAL",
                title=h["name"],
                description=f"{h.get('hospital_type')}. Address: {h['address']}",
                severity="LOW",
                status="ACTIVE",
                data_state=h.get("data_state", "STATIC"),
                source_name=h.get("source_name", "OpenStreetMap / Overpass API"),
                source_url=h.get("website"),
                source_timestamp="2026-09-01T15:00:00Z",
                extra_metadata={
                    "phone": h.get("phone"),
                    "has_emergency": h.get("has_emergency", True),
                    "has_trauma_center": h.get("has_trauma_center", False),
                    "reported_icu_beds": h.get("reported_icu_beds", 10),
                    "reported_general_beds": h.get("reported_general_beds", 100),
                    "availability_status": h.get("availability_status", "AVAILABLE"),
                    "rating": h.get("rating", 4.5),
                    "google_maps_url": f"https://www.google.com/maps/dir/?api=1&destination={h['latitude']},{h['longitude']}"
                }
            )
        ))

    return GeoJsonFeatureCollection(features=features)

@router.post("/rank", response_model=HospitalRankResponse)
async def rank_hospitals(req: HospitalRankRequest, request: Request):
    """Ranks hospitals by distance, traffic ETA, emergency type capability, and bed availability."""
    scheduler = request.app.state.scheduler
    raw_hospitals = scheduler.hospitals if scheduler else []

    ranked = HospitalRankingEngine.rank_hospitals(req.user_location, req.emergency_type, raw_hospitals)
    
    items = []
    for h in ranked:
        items.append(HospitalRankItem(
            id=h["id"],
            name=h["name"],
            hospital_type=h.get("hospital_type", "Hospital"),
            address=h["address"],
            distance_km=h["distance_km"],
            eta_minutes=h["eta_minutes"],
            suitability_score=h["suitability_score"],
            has_emergency=h.get("has_emergency", True),
            has_trauma_center=h.get("has_trauma_center", False),
            reported_icu_beds=h.get("reported_icu_beds", 10),
            reported_general_beds=h.get("reported_general_beds", 100),
            availability_status=h.get("availability_status", "AVAILABLE"),
            google_maps_url=h["google_maps_url"],
            reasoning=h["reasoning"],
            source_name=h.get("source_name", "OpenStreetMap / Overpass API"),
            data_state=h.get("data_state", "STATIC")
        ))

    return HospitalRankResponse(
        recommended_hospital=items[0],
        ranked_hospitals=items,
        timestamp="2026-09-01T15:30:00Z"
    )
