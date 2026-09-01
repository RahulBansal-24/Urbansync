# UrbanSync AI System Specification

UrbanSync enforces a strict separation between quantitative spatial/ml intelligence engines and LLM natural-language explanations:

## AI Layering Architecture

1. **Deterministic & Spatial Engines (Python / PostGIS / NetworkX / Scikit-Learn)**
   - Smart Route candidate evaluator and scoring engine
   - What-If City Simulation perturbation engine
   - Weather Impact risk calculator
   - Hospital Emergency Suitability ranker
   - Spatial join & PostGIS proximity queries

2. **Grounded LLM Layer (Groq API / `openai/gpt-oss-20b`)**
   - Tool calling over FastAPI endpoints (`get_current_weather`, `get_active_incidents`, `get_major_events`, `find_best_hospital`, `run_simulation_summary`).
   - Translates structured analysis into clear, natural language explanations.
   - Rule: LLM never invents source facts or fake measurements.
