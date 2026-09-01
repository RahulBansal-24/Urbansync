from app.schemas.city_schemas import SimulationScenarioInput
from app.services.simulation.city_simulation_engine import CitySimulationEngine

def test_city_simulation_engine():
    scenario = SimulationScenarioInput(
        road_closures=["Ring Road"],
        traffic_increase_pct=30.0,
        weather_severity="Heavy Rain",
        affected_weather_region="South Delhi",
        event_location_name="JLN Stadium",
        event_attendance=30000
    )

    result = CitySimulationEngine.run_simulation(scenario)

    assert result.scenario_id.startswith("SIM-")
    assert result.data_state == "SIMULATED"
    assert result.simulated_metrics["average_eta_minutes"] > result.baseline_metrics["average_eta_minutes"]
    assert result.simulated_metrics["congestion_level_pct"] > result.baseline_metrics["congestion_level_pct"]
    assert result.metric_deltas["eta_delta_pct"] > 0.0
    assert len(result.top_impacted_corridors) > 0
    assert result.ai_summary != ""
