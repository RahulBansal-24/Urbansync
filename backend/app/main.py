import sys
from pathlib import Path
# Ensure backend directory is on Python path for direct execution
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import init_db
from app.websocket.manager import WebSocketManager
from app.services.ingestion.scheduler import BackgroundIngestionScheduler

# Import API routers
from app.api.routes.events import router as events_router
from app.api.routes.traffic import router as traffic_router
from app.api.routes.weather import router as weather_router
from app.api.routes.hospitals import router as hospitals_router
from app.api.routes.transit import router as transit_router
from app.api.routes.routing import router as routing_router
from app.api.routes.simulation import router as simulation_router
from app.api.routes.assistant import router as assistant_router
from app.api.routes.health import router as health_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("urbansync.main")

ws_manager = WebSocketManager()
scheduler = BackgroundIngestionScheduler(ws_manager=ws_manager)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifecycle management."""
    logger.info("Initializing UrbanSync Backend Application...")
    # Initialize PostGIS / Database
    await init_db()
    # Store scheduler in app state
    app.state.scheduler = scheduler
    app.state.ws_manager = ws_manager
    # Start ingestion scheduler
    await scheduler.start()
    
    yield
    
    logger.info("Shutting down UrbanSync Background Scheduler...")
    await scheduler.stop()

app = FastAPI(
    title="UrbanSync API — AI-Powered Smart City Digital Twin",
    description="Backend API for UrbanSync Delhi digital twin: real-time spatial layers, Smart Route scoring, AI What-If Simulation, and grounded LLM Assistant.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(health_router)
app.include_router(events_router)
app.include_router(traffic_router)
app.include_router(weather_router)
app.include_router(hospitals_router)
app.include_router(transit_router)
app.include_router(routing_router)
app.include_router(simulation_router)
app.include_router(assistant_router)

# WebSocket Endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo or process incoming socket messages if needed
            await websocket.send_json({"status": "ACK", "payload": data})
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
