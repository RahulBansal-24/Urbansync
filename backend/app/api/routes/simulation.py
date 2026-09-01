from fastapi import APIRouter
from app.schemas.city_schemas import SimulationScenarioInput, SimulationResult
from app.services.simulation.city_simulation_engine import CitySimulationEngine

router = APIRouter(prefix="/api/simulation", tags=["AI City Simulation (Flagship #2)"])

@router.post("/run", response_model=SimulationResult)
async def run_city_simulation(scenario: SimulationScenarioInput):
    """Executes What-If City Simulation perturbation on Delhi road network flow and returns metrics deltas."""
    result = CitySimulationEngine.run_simulation(scenario)
    return result
