# UrbanSync Database Schema & PostGIS Specifications

PostgreSQL with PostGIS extension serves as the single source of truth for UrbanSync.

## Key Tables

1. `city_events`: Dynamic Delhi event objects with spatial coordinates, category, attendance, impact scores, and data state.
2. `traffic_incidents`: Traffic congestion, accidents, and road hazards with delay magnitudes.
3. `road_blocks`: Barricaded closures and diversion geometry lines.
4. `weather_observations`: Spatial grid polygons over Delhi with temperature, rain probability, visibility, and weather traffic risk scores.
5. `hospitals`: Emergency medical facilities with PostGIS coordinates, trauma/ICU capabilities, bed availability, and suitability scores.
6. `transit_stops`: GTFS Metro and Bus stops.
7. `simulation_scenarios`: Stored What-If simulation parameters and result metrics.
8. `api_sync_status`: Third-party API provider sync tracking.
