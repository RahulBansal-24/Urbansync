from fastapi import APIRouter, Request
from app.schemas.city_schemas import GeoJsonFeatureCollection, GeoJsonFeature, GeoJsonProperties

router = APIRouter(prefix="/api/weather", tags=["Weather"])

def calculate_weather_advisories(cell: dict) -> dict:
    precip = float(cell.get("precipitation_mm", 0.0))
    vis = float(cell.get("visibility_km", 10.0))
    wind = float(cell.get("wind_kph", 10.0))
    temp = float(cell.get("temperature_c", 30.0))
    cond = (cell.get("condition_text") or "").lower()

    reasons = []
    avoid_transport = []
    avoid_people = []

    risk_score = 10.0

    if precip >= 15.0 or "heavy rain" in cond or "torrential" in cond:
        risk_score += 55.0
        reasons.append("Severe Waterlogging & Underpass Inundation Danger")
        avoid_transport.extend(["Two-Wheelers & E-Rickshaws", "Low-Clearance Sedans", "Auto-Rickshaws"])
        avoid_people.extend(["Pedestrians", "Daily Commuters"])
    elif precip >= 5.0 or "rain" in cond or "shower" in cond:
        risk_score += 30.0
        reasons.append("Road Hydroplaning & Reduced Braking Efficiency")
        avoid_transport.extend(["Two-Wheelers", "Heavy Freight Trucks"])
        avoid_people.extend(["Outdoor Delivery Agents"])

    if vis <= 2.0 or "fog" in cond or "mist" in cond or "smog" in cond:
        risk_score += 40.0
        reasons.append("Critical Low Visibility & Collision Hazard")
        avoid_transport.extend(["High-Speed Highway Trucks", "Interstate Express Buses"])
        avoid_people.extend(["Senior Citizens", "Asthma & Cardiac Patients"])
    elif vis <= 5.0:
        risk_score += 15.0
        reasons.append("Hazy Distance Perception & Slow Lane Speeds")

    if wind >= 35.0:
        risk_score += 25.0
        reasons.append("High Wind Gusts & Overhead Tree/Billboard Fall Risk")
        avoid_transport.extend(["Light Two-Wheelers", "Double-Decker Buses"])

    if temp >= 40.0:
        risk_score += 20.0
        reasons.append("Extreme Thermal Heat Stress & Asphalt Softening")
        avoid_people.extend(["Outdoor Construction Laborers", "Elderly Citizens"])

    risk_score = min(98.0, max(12.0, round(risk_score, 1)))

    if risk_score >= 65.0:
        severity = "CRITICAL"
        color_hex = "#EF4444"
        color_name = "Red Alert (Severe Danger)"
    elif vis <= 3.0 or "fog" in cond or "smog" in cond:
        severity = "HIGH"
        color_hex = "#A855F7"
        color_name = "Purple Alert (Dense Fog/Smog)"
    elif risk_score >= 40.0:
        severity = "HIGH"
        color_hex = "#F59E0B"
        color_name = "Amber Alert (Moderate Delay)"
    elif risk_score >= 25.0:
        severity = "MEDIUM"
        color_hex = "#3B82F6"
        color_name = "Blue Watch (Light Rain)"
    else:
        severity = "LOW"
        color_hex = "#00F0FF"
        color_name = "Cyan Clear (Optimal)"

    if not reasons:
        reasons.append("Optimal Atmospheric Driving Conditions")

    avoid_transport = list(dict.fromkeys(avoid_transport))
    avoid_people = list(dict.fromkeys(avoid_people))

    return {
        "weather_traffic_risk": risk_score,
        "risk_level": severity,
        "color_hex": color_hex,
        "color_name": color_name,
        "risk_reasons": reasons,
        "avoid_transport": avoid_transport if avoid_transport else ["None (Safe for All Modes)"],
        "avoid_people_groups": avoid_people if avoid_people else ["None (Safe Conditions)"]
    }

@router.get("/grid", response_model=GeoJsonFeatureCollection)
async def get_weather_grid(request: Request):
    """Returns spatial weather grid polygons over Delhi with dynamic risk advisories."""
    scheduler = request.app.state.scheduler
    raw_cells = scheduler.weather_cells if scheduler else []

    features = []
    for cell in raw_cells:
        adv = calculate_weather_advisories(cell)
        features.append(GeoJsonFeature(
            type="Feature",
            geometry=cell["bounds_geojson"],
            properties=GeoJsonProperties(
                id=cell["id"],
                type="WEATHER",
                title=cell["region_name"],
                description=f"Condition: {cell['condition_text']}. Risk Level: {adv['color_name']} ({adv['weather_traffic_risk']}%)",
                severity=adv["risk_level"],
                status="ACTIVE",
                data_state=cell.get("data_state", "LIVE"),
                source_name=cell.get("source_name", "WeatherAPI"),
                source_timestamp="2026-09-01T15:00:00Z",
                impact_scores={
                    "weather_traffic_risk": adv["weather_traffic_risk"]
                },
                extra_metadata={
                    "temperature_c": cell["temperature_c"],
                    "humidity_pct": cell["humidity_pct"],
                    "precipitation_mm": cell["precipitation_mm"],
                    "rain_probability_pct": cell.get("rain_probability_pct", 60.0),
                    "wind_kph": cell["wind_kph"],
                    "visibility_km": cell["visibility_km"],
                    "condition_text": cell["condition_text"],
                    "color_hex": adv["color_hex"],
                    "color_name": adv["color_name"],
                    "risk_reasons": adv["risk_reasons"],
                    "avoid_transport": adv["avoid_transport"],
                    "avoid_people_groups": adv["avoid_people_groups"]
                }
            )
        ))

    return GeoJsonFeatureCollection(features=features)
