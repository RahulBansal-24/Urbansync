import logging
from typing import Dict, Any, List
from app.schemas.city_schemas import SimulationScenarioInput, SimulationResult, TopCorridorImpact

logger = logging.getLogger("urbansync.simulation")

class CitySimulationEngine:
    """Flagship AI Feature #2: UrbanSync What-If City Simulation Engine."""

    # Baseline Delhi Arterial Road Network Representation
    DELHI_CORRIDORS = [
        {"name": "Inner Ring Road (AIIMS - Moolchand)", "base_speed": 45.0, "capacity": 8000},
        {"name": "Outer Ring Road (IIT Delhi - Panchsheel)", "base_speed": 55.0, "capacity": 10000},
        {"name": "NH-48 / Gurgaon Expressway (Dhaula Kuan)", "base_speed": 65.0, "capacity": 12000},
        {"name": "Mathura Road (Pragati Maidan - Ashram)", "base_speed": 38.0, "capacity": 7000},
        {"name": "Vikas Marg (ITO - Laxmi Nagar)", "base_speed": 32.0, "capacity": 6500},
        {"name": "Barapullah Elevated Corridor", "base_speed": 60.0, "capacity": 9000}
    ]

    @classmethod
    def run_simulation(cls, scenario: SimulationScenarioInput) -> SimulationResult:
        """Executes multi-condition city flow perturbation and calculates metrics delta."""
        closures = scenario.road_closures
        traffic_pct = scenario.traffic_increase_pct
        weather = scenario.weather_severity
        event_attendance = scenario.event_attendance or 0
        event_venue = scenario.event_location_name or "JLN Stadium"

        # Baseline metrics
        base_avg_eta = 28.5 # minutes
        base_congestion_pct = 42.0 # %
        base_affected_segments = 4

        # Calculate Perturbation Multipliers
        traffic_mult = 1.0 + (traffic_pct / 100.0)
        
        weather_mult = 1.0
        if weather.lower() == "light rain":
            weather_mult = 1.15
        elif weather.lower() == "moderate rain":
            weather_mult = 1.30
        elif weather.lower() == "heavy rain":
            weather_mult = 1.55
        elif weather.lower() == "fog":
            weather_mult = 1.40

        closure_mult = 1.0 + (len(closures) * 0.25)
        
        event_mult = 1.0
        if event_attendance > 0:
            event_mult = 1.0 + min(0.6, (event_attendance / 50000.0) * 0.4)

        # Combined interaction multiplier
        combined_impact_factor = traffic_mult * weather_mult * closure_mult * event_mult

        # Simulated state metrics
        simulated_avg_eta = round(base_avg_eta * combined_impact_factor, 1)
        simulated_congestion_pct = round(min(98.5, base_congestion_pct * combined_impact_factor), 1)
        simulated_affected_segments = int(base_affected_segments * max(1.0, combined_impact_factor * 0.8))

        # Deltas
        eta_delta_pct = round(((simulated_avg_eta - base_avg_eta) / base_avg_eta) * 100.0, 1)
        congestion_delta_pct = round(simulated_congestion_pct - base_congestion_pct, 1)

        # Calculate top impacted road corridors
        top_impacted: List[TopCorridorImpact] = []
        for corridor in cls.DELHI_CORRIDORS:
            c_name = corridor["name"]
            c_base_speed = corridor["base_speed"]

            is_closed = any(c.lower() in c_name.lower() for c in closures)
            if is_closed:
                sim_speed = 0.0
                cong_inc = 100.0
                status = "CLOSED / BLOCKED"
            else:
                # Speed drops non-linearly with combined impact
                sim_speed = round(max(8.0, c_base_speed / (combined_impact_factor * 0.9)), 1)
                cong_inc = round(((c_base_speed - sim_speed) / c_base_speed) * 100.0, 1)
                status = "HEAVY CONGESTION" if sim_speed < 20.0 else "MODERATE SLOWDOWN"

            top_impacted.append(TopCorridorImpact(
                road_name=c_name,
                baseline_speed_kph=c_base_speed,
                simulated_speed_kph=sim_speed,
                congestion_increase_pct=cong_inc,
                status=status
            ))

        # Top alternative detours
        alternative_detours = [
            "Barapullah Elevated Corridor (Bypasses South Ring Road congestion)",
            "Outer Ring Road via Dhaula Kuan (Bypasses Central barricaded zones)",
            "Mathura Road Bypass via Ashram Underpass"
        ]

        # Formulate grounded AI Summary
        conditions_summary = []
        if closures:
            conditions_summary.append(f"closure of {', '.join(closures)}")
        if traffic_pct > 0:
            conditions_summary.append(f"+{traffic_pct}% traffic surge")
        if weather != "Clear":
            conditions_summary.append(f"{weather} weather conditions")
        if event_attendance > 0:
            conditions_summary.append(f"{event_attendance:,} spectator event at {event_venue}")

        cond_text = " + ".join(conditions_summary) if conditions_summary else "standard baseline scenario"

        ai_summary = (
            f"Under simulated conditions ({cond_text}), citywide average ETA increases by +{eta_delta_pct}% "
            f"(from {base_avg_eta} min to {simulated_avg_eta} min). Congestion rises to {simulated_congestion_pct}%. "
            f"Traffic flow heavily redistributes to Barapullah Elevated Corridor and Outer Ring Road."
        )

        return SimulationResult(
            scenario_id=f"SIM-{int(combined_impact_factor * 1000)}",
            data_state="SIMULATED",
            baseline_metrics={
                "average_eta_minutes": base_avg_eta,
                "congestion_level_pct": base_congestion_pct,
                "affected_corridors_count": base_affected_segments
            },
            simulated_metrics={
                "average_eta_minutes": simulated_avg_eta,
                "congestion_level_pct": simulated_congestion_pct,
                "affected_corridors_count": simulated_affected_segments
            },
            metric_deltas={
                "eta_delta_pct": eta_delta_pct,
                "congestion_delta_pct": congestion_delta_pct,
                "impact_multiplier": round(combined_impact_factor, 2)
            },
            top_impacted_corridors=top_impacted,
            top_alternative_detours=alternative_detours,
            ai_summary=ai_summary,
            timestamp="2026-09-01T15:30:00Z"
        )
