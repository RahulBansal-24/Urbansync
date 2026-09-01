# AI What-If City Simulation Engine (Flagship #2 Specification)

The Simulation Engine models Delhi's major road network corridors as an interactive spatial network graph:

## Features
- Multi-Condition Combinations: Road segment closures + Traffic multiplier + Weather severity + Spectator event insertion.
- Traffic Flow Redistribution: Recalculates non-linear traffic spillover onto adjacent arterial roads.
- Before vs. After Metrics: Average ETA, Congestion Level, Top Impacted Corridors, and Grounded AI Summary.
- State Tagging: All outputs strictly carry `data_state = SIMULATED`.
