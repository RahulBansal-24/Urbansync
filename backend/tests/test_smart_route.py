from app.schemas.city_schemas import SmartRouteRequest
from app.services.routing.smart_route_engine import SmartRouteEngine
from app.database.seed_data import SEED_TRAFFIC_INCIDENTS, SEED_EVENTS, SEED_WEATHER_CELLS, SEED_ROAD_BLOCKS

async def test_smart_route_evaluation():
    req = SmartRouteRequest(
        origin=[77.2197, 28.6315], # Connaught Place
        destination=[77.1000, 28.5562], # IGI Airport
        preference="balanced"
    )
    
    response = await SmartRouteEngine.evaluate_smart_routes(
        req=req,
        incidents=SEED_TRAFFIC_INCIDENTS,
        events=SEED_EVENTS,
        weather_cells=SEED_WEATHER_CELLS,
        road_blocks=SEED_ROAD_BLOCKS
    )

    assert response is not None
    assert len(response.routes) >= 2
    assert response.recommended_route_id in ["ROUTE-A", "ROUTE-B", "ROUTE-C"]
    
    # Verify candidate scores and reasoning factors
    rec_route = next(r for r in response.routes if r.id == response.recommended_route_id)
    assert rec_route.urbansync_score > 0.0
    assert len(rec_route.factors) > 0
    assert rec_route.explanation != ""
