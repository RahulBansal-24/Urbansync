import math
from typing import List, Dict, Any

class WeatherImpactEngine:
    """Calculates spatial weather traffic risk score (0-100) based on precipitation, visibility, and wind."""

    @staticmethod
    def calculate_risk(precipitation_mm: float, visibility_km: float, rain_probability_pct: float, wind_kph: float) -> float:
        # Base risk calculation factors
        precip_factor = min(100.0, (precipitation_mm / 30.0) * 50.0) # Up to 50 points
        vis_factor = max(0.0, (10.0 - visibility_km) / 10.0) * 35.0 # Up to 35 points
        wind_factor = min(15.0, (wind_kph / 60.0) * 15.0) # Up to 15 points

        risk = precip_factor + vis_factor + wind_factor
        return round(min(100.0, max(0.0, risk)), 1)


class EventImpactEngine:
    """Calculates event impact severity and spatial impact radius."""

    @staticmethod
    def calculate_impacts(attendance: int, venue_capacity: int = 30000, category: str = "Concert") -> Dict[str, float]:
        ratio = min(1.5, attendance / max(1000, venue_capacity))
        
        traffic_score = round(min(100.0, ratio * 75.0 + 10.0), 1)
        crowd_score = round(min(100.0, ratio * 85.0), 1)
        parking_score = round(min(100.0, ratio * 90.0), 1)
        transit_score = round(min(100.0, ratio * 70.0), 1)
        emergency_score = round(min(100.0, ratio * 45.0), 1)

        # Radius scales from 500m up to 3500m
        radius_meters = round(min(3500.0, max(500.0, ratio * 2500.0 + 500.0)), 0)

        return {
            "traffic_impact_score": traffic_score,
            "crowd_impact_score": crowd_score,
            "parking_impact_score": parking_score,
            "transit_impact_score": transit_score,
            "emergency_impact_score": emergency_score,
            "impact_radius_meters": radius_meters
        }


class HospitalRankingEngine:
    """Ranks hospitals by distance, traffic ETA, emergency type capability, and bed availability."""

    @staticmethod
    def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        R = 6371.0 # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2.0) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(R * c, 2)

    @classmethod
    def rank_hospitals(cls, user_location: List[float], emergency_type: str, hospitals: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        user_lon, user_lat = user_location[0], user_location[1]
        ranked = []

        for h in hospitals:
            dist_km = cls.calculate_haversine_distance(user_lat, user_lon, h["latitude"], h["longitude"])
            # Estimate ETA considering baseline speed ~30 km/h in Delhi + traffic noise
            eta_min = round((dist_km / 30.0) * 60.0 + (dist_km * 0.8), 1)

            # Capability matching score (0 to 40 pts)
            capability_score = 20.0
            if emergency_type.lower() == "trauma" and h.get("has_trauma_center"):
                capability_score = 40.0
            elif emergency_type.lower() == "cardiac" and h.get("has_cardiac_unit"):
                capability_score = 40.0
            elif emergency_type.lower() == "pediatric" and h.get("has_pediatric_icu"):
                capability_score = 40.0
            elif emergency_type.lower() in ["general emergency", "accident"] and h.get("has_emergency"):
                capability_score = 35.0

            # Distance score (0 to 30 pts)
            dist_score = max(0.0, 30.0 - (dist_km * 1.5))

            # Total Hospital Bed Capacity score (0 to 20 pts)
            gen_beds = h.get("reported_general_beds", 100)
            bed_score = min(20.0, (gen_beds / 300.0) * 20.0)

            # Rating score (0 to 10 pts)
            rating = h.get("rating", 4.0)
            rating_score = (rating / 5.0) * 10.0

            suitability = round(min(100.0, capability_score + dist_score + bed_score + rating_score), 1)

            h_copy = dict(h)
            h_copy["distance_km"] = dist_km
            h_copy["eta_minutes"] = eta_min
            h_copy["suitability_score"] = suitability
            h_copy["reported_general_beds"] = gen_beds
            h_copy["google_maps_url"] = f"https://www.google.com/maps/dir/?api=1&destination={h['latitude']},{h['longitude']}"
            h_copy["reasoning"] = f"Distance: {dist_km} km ({eta_min} min ETA). Matched emergency care for {emergency_type} with {gen_beds} Total Hospital Beds."
            ranked.append(h_copy)

        # Sort descending by suitability score
        ranked.sort(key=lambda x: x["suitability_score"], reverse=True)
        return ranked
