from fastapi import APIRouter, Request
from app.schemas.city_schemas import SmartRouteRequest, SmartRouteResponse
from app.services.routing.smart_route_engine import SmartRouteEngine

router = APIRouter(prefix="/api/routing", tags=["Smart Route (Flagship #1)"])

@router.post("/smart-route", response_model=SmartRouteResponse)
async def calculate_smart_route(req: SmartRouteRequest, request: Request):
    """Evaluates multi-candidate routes in Delhi considering traffic, incidents, closures, event radii, and weather risk."""
    scheduler = request.app.state.scheduler
    
    incidents = scheduler.traffic_incidents if scheduler else []
    events = scheduler.events if scheduler else []
    weather_cells = scheduler.weather_cells if scheduler else []
    road_blocks = [] # road blocks from seed

    response = await SmartRouteEngine.evaluate_smart_routes(
        req=req,
        incidents=incidents,
        events=events,
        weather_cells=weather_cells,
        road_blocks=road_blocks
    )

    return response
