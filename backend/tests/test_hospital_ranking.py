from app.services.geospatial.impact_engines import HospitalRankingEngine
from app.database.seed_data import SEED_HOSPITALS

def test_hospital_ranking_engine():
    user_location = [77.2090, 28.5672] # Near AIIMS South Delhi
    emergency_type = "Trauma"

    ranked = HospitalRankingEngine.rank_hospitals(user_location, emergency_type, SEED_HOSPITALS)

    assert len(ranked) == len(SEED_HOSPITALS)
    assert ranked[0]["name"].startswith("AIIMS") # AIIMS should rank #1 for Trauma at AIIMS coords
    assert ranked[0]["suitability_score"] > 90.0
    assert "https://www.google.com/maps/dir/" in ranked[0]["google_maps_url"]
