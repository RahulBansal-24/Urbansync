# 🏙️ UrbanSync — AI-Powered Smart City Digital Twin

> **City Focus**: Delhi, India 🇮🇳  
> **Core Philosophy**: `OBSERVE` 👁️ ➔ `UNDERSTAND` 🧠 ➔ `PREDICT` 🔮 ➔ `SIMULATE` 🧪 ➔ `OPTIMIZE` ⚡ ➔ `EXPLAIN` 🗣️

---

## 🌟 Project Overview

**UrbanSync** is a cutting-edge **AI-Powered Smart City Digital Twin** for Delhi, India. It aggregates multi-source urban data streams—including real-time traffic incidents, extreme weather cells, spectator events, open transit stops, and emergency hospitals—into a dynamic 2.5D interactive dark map interface. 

Powered by **MapLibre GL JS** and **TomTom APIs**, UrbanSync goes beyond passive monitoring by delivering real-time decision-support tools:
- **Flagship #1: AI Smart Route Engine**: Computes safest and fastest routes by dynamically scoring traffic delays, weather risks, spectator crowd radii, and road blockades.
- **Flagship #2: What-If City Simulation Engine**: Enables urban planners to simulate complex multi-variable scenarios (e.g., major road closures, monsoon downpours, traffic surges) and observe non-linear network impact.
- **Emergency Hospital Suitability Ranker**: Ranks hospitals dynamically based on real-time traffic corridor delays, specialization fit, and ICU bed availability.
- **AI City Assistant**: Grounded natural language assistant powered by **Groq (`llama-3.3-70b-versatile`)** capable of answering urban telemetry queries and recommending tactical actions.

---

## ✨ Features & Highlights

### 🎯 1. Flagship AI Smart Route Engine
- **Multi-Route Evaluation**: Evaluates primary and alternative travel corridors using TomTom's Routing API.
- **Comprehensive Risk Scoring**: Factors in live traffic delays, active accident reports, event crowd buffer zones, and localized precipitation/fog.
- **Explainable AI**: Provides plain-language explanations detailing why a specific route was recommended over others.

### 🧪 2. What-If City Simulation Engine
- **Custom Scenario Builder**: Inject hypothetical road closures (e.g., Ring Road blockage), traffic surges (+50%), heavy rain/fog, or massive spectator events.
- **Network Perturbation**: Simulates non-linear traffic shifts across Delhi's arterial network.
- **Impact Metrics**: Generates before-vs-after ETA impact percentages, bottleneck shift analysis, and high-risk corridor warnings.

### 🏥 3. Emergency Hospital Suitability Ranker
- **Multi-Criteria Ranking**: Scores regional hospitals based on real-time transit accessibility, emergency department specialization (Trauma, Cardiac, Pediatric ICU), and live bed capacity.
- **Instant Route Integration**: Automatically computes the fastest emergency navigation corridor directly to the recommended hospital.

### 📡 4. Real-Time City Data Visualization
- **Interactive 2.5D Vector Map**: Built with MapLibre GL JS featuring pitch control, camera fly-to animations, and custom pulsating status markers.
- **Multi-Layer Category Filtering**: Instantly filter between Events, Traffic Incidents, Road Blocks, Weather Grids, OSM Hospitals, and Public Transit.
- **Live Delta WebSocket Updates**: Subscribes to real-time city updates via WebSockets with zero page reloading.

---

## 🛠️ Tech Stack

### 🎨 Frontend
- **Framework**: Next.js 14 (App Router, React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **Mapping Engine**: MapLibre GL JS (`^4.1.0`)
- **Animations**: Framer Motion
- **Icons & UI**: Lucide React, Headless UI, Recharts

### ⚙️ Backend
- **Framework**: Python 3.11+, FastAPI, Uvicorn
- **Async Networking**: Aiohttp, Asyncio
- **Data Science & Graph Math**: NetworkX, Pandas, NumPy, Scikit-Learn
- **Database & Spatial ORM**: PostgreSQL, PostGIS, SQLAlchemy (Async), GeoAlchemy2
- **Real-Time Communication**: WebSockets (FastAPI WebSocket Router)
- **LLM Engine**: Groq API using **`llama-3.3-70b-versatile`**

---

## 🌐 External APIs & Data Sources

| API / Service | Description | Integration Use Case |
| :--- | :--- | :--- |
| **TomTom Traffic API** | Live Traffic Incidents & Bounding Box Details | Real-time traffic delays, accidents, and corridor congestion in Delhi |
| **TomTom Routing API** | Route Calculation Engine | Multi-candidate route geometry, travel times, and distance calculations |
| **OpenStreetMap / Overpass API** | Open Spatial Queries (`overpass-api.de`) | Live retrieval of verified hospital locations, addresses, and emergency facilities |
| **INDTIX API** | Live Regional Event Feed | Spectator gathering locations, attendance bounds, and crowd radius calculation |
| **WeatherAPI.com / Open-Meteo** | Live Weather & Forecast API | Localized precipitation, visibility, and weather cell overlay |
| **Delhi Open Transit Data** | GTFS Delhi Metro & Bus Feed | Public transit stop locations and multi-modal transit interchange markers |

---

## 🧠 Technical Implementations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          URBANSYNC DATA PIPELINE                            │
└─────────────────────────────────────────────────────────────────────────────┘
  │
  ├── 🛰️ INGESTION ADAPTERS (TomTom, Overpass OSM, INDTIX, WeatherAPI)
  │     └─► Asynchronous fetch with fallback seeds for 100% uptime
  │
  ├── 🧮 SPATIAL & GRAPH PROCESSING ENGINES
  │     ├── 🛣️ Smart Route Engine: Multi-factor cost weighting on NetworkX graph
  │     ├── 🧪 City Simulator: Network perturbation & flow redistribution algorithms
  │     └── 🏥 Hospital Ranker: Weighted distance-decay & specialization score
  │
  ├── ⚡ FASTAPI API & WEBSOCKET ROUTER
  │     └─► Exposes RESTful GeoJSON endpoints & live WebSocket delta streams
  │
  └── 🖥️ NEXT.JS 14 DASHBOARD & MAPLIBRE CANVAS
        └─► Renders 2.5D map layers, custom markers, and AI drawer panels
```

---

## 📁 Project Structure

```text
urbansync/
├── backend/
│   ├── app/
│   │   ├── ai/                     # AI Assistant grounded chat integration (Groq Llama-3.3)
│   │   ├── api/
│   │   │   └── routes/             # FastAPI REST endpoints & WebSockets
│   │   ├── database/               # PostgreSQL / PostGIS connection & seed stores
│   │   ├── models/                 # SQLAlchemy & Pydantic schemas
│   │   └── services/
│   │       ├── hospital/           # Emergency hospital ranking engine
│   │       ├── ingestion/          # Data adapters (TomTom, OSM, INDTIX, Weather)
│   │       ├── routing/            # Smart Route scoring & NetworkX graph engine
│   │       └── simulation/         # What-If city scenario simulator
│   ├── run_tests.py                # Backend automated verification suite
│   ├── requirements.txt            # Python dependencies
│   └── main.py                     # Entry point for FastAPI application
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js 14 App Router (page.tsx, layout.tsx)
│   │   ├── components/
│   │   │   ├── assistant/          # Floating AI Assistant widget
│   │   │   ├── hospitals/          # Emergency Hospital ranker drawer
│   │   │   ├── map/                # MapLibre GL JS CityMap & Controls
│   │   │   ├── navigation/         # Command header TopBar & CategoryBar
│   │   │   ├── panels/             # Feature DetailPanel
│   │   │   ├── routing/            # AI Smart Route drawer
│   │   │   └── simulation/         # What-If City Simulation drawer
│   │   ├── services/               # Axios API client & WebSocket connector
│   │   └── types/                  # TypeScript interface definitions
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.local                  # Next.js client environment keys
├── .env.example                    # Baseline environment template
└── README.md
```

---

## ⚡ How to Run (Setup Instructions)

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Python**: `v3.11` or higher
- **Package Managers**: `npm` (or `yarn` / `pnpm`) and `pip`

---

### 2. Environment Configuration

You can create your local configuration by copying `.env.example` to `.env` in the root folder and replacing the placeholders with your actual API keys:

```bash
cp .env.example .env
```

#### Root `.env` (Backend Configuration)
```env
# TOMTOM SERVICES (Map Display, Traffic, Routing - https://developer.tomtom.com/)
TOMTOM_API_KEY=YOUR_TOMTOM_API_KEY_HERE

# WEATHERAPI.COM (https://www.weatherapi.com/)
WEATHERAPI_KEY=YOUR_WEATHERAPI_KEY_HERE
OPEN_METEO_ENABLED=true

# INDTIX EVENTS API (https://www.indtix.com/)
INDTIX_API_KEY=YOUR_INDTIX_API_KEY_HERE
INDTIX_API_URL=https://api.indtix.com/v1/events

# OPENSTREETMAP OVERPASS API (No API key required)
OVERPASS_API_URL=https://overpass-api.de/api/interpreter

# GROQ LLM API (https://console.groq.com/)
GROQ_API_KEY=YOUR_GROQ_API_KEY_HERE
GROQ_MODEL=llama-3.3-70b-versatile
```

#### Frontend `frontend/.env.local` (Client-Side Configuration)
Create `.env.local` inside the `frontend/` directory:
```env
NEXT_PUBLIC_TOMTOM_API_KEY=YOUR_TOMTOM_API_KEY_HERE
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

---

### 3. Backend Setup

```powershell
# 1. Navigate to backend folder
cd backend

# 2. Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate      # On Windows
# source venv/bin/activate # On Linux/macOS

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Run automated backend verification tests
python run_tests.py

# 5. Start the FastAPI server
python app/main.py
```
> Server will be running at `http://localhost:8000` (Interactive API Docs at `http://localhost:8000/docs`).

---

### 4. Frontend Setup

Open a new terminal window:

```powershell
# 1. Navigate to frontend folder
cd frontend

# 2. Install Node dependencies
npm install

# 3. Start the Next.js development server
npm run dev
```
> Frontend application will be running at `http://localhost:3000`.

---

## 🔮 Future Scope

- 🚥 **Dynamic Traffic Signal Synchronization**: Integrating real-world IoT traffic signals to adjust green light durations dynamically based on simulated bottlenecks.
- ⚡ **EV Charging Corridor Routing**: Smart route calculation tailored for Electric Vehicles (EVs), factoring in dynamic battery drain and charging station queues.
- 🛸 **Drone & Air Mobility Airspaces**: Extending 2.5D Digital Twin camera rendering to model low-altitude UAV air corridors across metropolitan regions.
- 🏙️ **Multi-City Expansion**: Scaling the digital twin architecture to Mumbai, Bengaluru, and international Smart Cities.

---

## 👨‍💻 Authors & Maintainers

<table align="center">
  <tr>
    <td align="center" width="50%">
      <a href="https://github.com/RahulBansal-24">
        <img src="https://github.com/RahulBansal-24.png" width="120px;" style="border-radius: 50%;" alt="Rahul Bansal"/><br />
        <sub><b>👨‍💻 Rahul Bansal</b></sub>
      </a><br />
      <p>🚀 Full-Stack Developer | 🤖 AI Developer</p>
      <a href="mailto:itzrahulbansal24@gmail.com">📧 Email</a> • 
      <a href="https://github.com/RahulBansal-24">🔗 GitHub</a> • 
      <a href="https://www.linkedin.com/in/itsrahulbansal24">💼 LinkedIn</a>
    </td>
    <td align="center" width="50%">
      <a href="https://github.com/mahi040-pixel">
        <img src="https://github.com/mahi040-pixel.png" width="120px;" style="border-radius: 50%;" alt="Mahi Varshney"/><br />
        <sub><b>👩‍💻 Mahi Varshney</b></sub>
      </a><br />
      <p>🌐 Web Developer | 🧠 Applied AI Specialist</p>
      <a href="mailto:mahivarshney08@gmail.com">📧 Email</a> • 
      <a href="https://github.com/mahi040-pixel">🔗 GitHub</a> • 
      <a href="https://www.linkedin.com/in/mahi-varshney-ba76ab378/">💼 LinkedIn</a>
    </td>
  </tr>
</table>

---
<p align="center">Made with ❤️ for Smart Cities & Urban Innovation</p>
