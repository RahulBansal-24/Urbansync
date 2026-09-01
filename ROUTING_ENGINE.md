# AI Smart Route Scoring Engine (Flagship #1 Specification)

The Smart Route Engine goes beyond basic map routing by evaluating candidate paths against live spatial conditions across Delhi:

## Pipeline
1. Candidate Fetch: driving-traffic multi-routes from Mapbox or Delhi road network geometry.
2. Spatial Joins: Intersects route coordinates with active traffic incidents, road blocks, event crowd radii, and weather risk grid cells.
3. Scoring Algorithm:
   - Travel Time: 40%
   - Traffic Congestion: 20%
   - Incident Penalties: 15%
   - Closure Penalties: 10% (Hard closures invalidate or heavily penalize)
   - Event Impact: 8%
   - Weather Risk: 5%
   - Risk Margin: 2%
4. Reasoning Generation: Formulates structured factual explanation chips.
