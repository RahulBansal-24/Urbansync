from fastapi import APIRouter, Request
from app.schemas.city_schemas import GeoJsonFeatureCollection, GeoJsonFeature, GeoJsonProperties

router = APIRouter(prefix="/api/weather", tags=["Weather"])

@router.get("/grid", response_model=GeoJsonFeatureCollection)
async def get_weather_grid(request: Request):
    """Returns spatial weather grid polygons over Delhi as GeoJSON FeatureCollection."""
    scheduler = request.app.state.scheduler
    raw_cells = scheduler.weather_cells if scheduler else []

    features = []
    for cell in raw_cells:
        features.append(GeoJsonFeature(
            type="Feature",
            geometry=cell["bounds_geojson"],
            properties=GeoJsonProperties(
                id=cell["id"],
                type="WEATHER",
                title=cell["region_name"],
                description=f"Condition: {cell['condition_text']}. Risk Score: {cell.get('weather_traffic_risk', 0.0)}%",
                severity="HIGH" if cell.get("weather_traffic_risk", 0.0) > 50 else "MEDIUM",
                status="ACTIVE",
                data_state=cell.get("data_state", "LIVE"),
                source_name=cell.get("source_name", "WeatherAPI"),
                source_timestamp="2026-09-01T15:00:00Z",
                impact_scores={
                    "weather_traffic_risk": cell.get("weather_traffic_risk", 0.0)
                },
                extra_metadata={
                    "temperature_c": cell["temperature_c"],
                    "humidity_pct": cell["humidity_pct"],
                    "precipitation_mm": cell["precipitation_mm"],
                    "rain_probability_pct": cell.get("rain_probability_pct", 60.0),
                    "wind_kph": cell["wind_kph"],
                    "visibility_km": cell["visibility_km"],
                    "condition_text": cell["condition_text"]
                }
            )
        ))

    return GeoJsonFeatureCollection(features=features)
