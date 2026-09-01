# UrbanSync — AI-Powered Smart City Digital Twin (Delhi, India)

> **TAGLINE**: AI-Powered Smart City Digital Twin  
> **INITIAL CITY**: Delhi, India  
> **CORE PHILOSOPHY**: OBSERVE → UNDERSTAND → PREDICT → SIMULATE → OPTIMIZE → EXPLAIN

UrbanSync is an AI-powered Smart City Digital Twin representing live real-world happenings across Delhi on an interactive, dark city map powered by **TomTom Orbis Maps** and **MapLibre GL JS**.

---

## 🌟 Flagship AI Features

### 1. AI Smart Route Engine (Flagship #1)
Evaluates multi-candidate driving routes in Delhi using **TomTom Routing API** considering travel time, traffic congestion, active incidents, hard road closures, event crowd radii, and spatial weather risk.
- **Route Score**: Configurable weighted score (0–100).
- **Reasoning**: Factual explanation highlighting why a longer bypass is safer or faster under live city conditions.
- **Visuals**: Recommended route glows cyan/purple while alternative candidates render dimmed. Interactive factor chips highlight corresponding map segments.

### 2. AI What-If City Simulation Engine (Flagship #2)
Allows city planners and citizens to define hypothetical multi-condition city scenarios:
- **Inputs**: Road closures (e.g., Ring Road), traffic demand surge (+30%), weather severity (Heavy Rain/Fog), major spectator event insertion.
- **Network Perturbation**: Non-linear traffic redistribution across network edges and bottleneck congestion shifts.
- **Metrics**: Before vs. After Average ETA, Congestion Level, Top Impacted Corridors, and Grounded AI Summary.

---

## 🏗️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, MapLibre GL JS, Recharts, Lucide Icons.
- **Backend**: Python 3.11+, FastAPI, Async SQLAlchemy, GeoAlchemy2, PostGIS, NetworkX, Pandas, Scikit-Learn, Groq LLM API.
- **Base Map**: TomTom Orbis Vector Maps / Map Display API + 2.5D Perspective Camera.
- **Event Data**: INDTIX Events API.
- **Hospital Data**: OpenStreetMap via Overpass API (`https://overpass-api.de/api/interpreter`).
- **Database**: PostgreSQL with PostGIS spatial extension.
- **Real-Time**: WebSockets for live delta push updates.
- **Infrastructure**: Docker & Docker Compose setup (`docker-compose.yml`).

---

## 🚀 Quick Start (Local Setup)

### 1. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 2. Run via Docker Compose
```bash
docker-compose up --build
```
- Frontend available at: `http://localhost:3000`
- Backend API available at: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

### 3. Run Backend Verification Tests
```bash
cd backend
python run_tests.py
```
