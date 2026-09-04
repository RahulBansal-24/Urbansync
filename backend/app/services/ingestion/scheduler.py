import asyncio
import logging
from app.services.ingestion.adapters import (
    TomTomAdapter,
    WeatherAdapter,
    EventbriteAdapter,
    OverpassHospitalAdapter,
    TransitAdapter
)

logger = logging.getLogger("urbansync.scheduler")

class BackgroundIngestionScheduler:
    def __init__(self, ws_manager=None):
        self.ws_manager = ws_manager
        self.is_running = False
        self._task = None
        
        # Cache stores
        self.traffic_incidents = []
        self.weather_cells = []
        self.events = []
        self.hospitals = []
        self.transit_stops = []

    async def start(self):
        """Initializes baseline UrbanSync data stores on server startup (no continuous polling loops)."""
        self.is_running = True
        logger.info("Initializing baseline UrbanSync data stores (on-demand mode)...")
        
        # Run initial fetch on server start
        self.traffic_incidents = await TomTomAdapter.fetch_incidents()
        self.weather_cells = await WeatherAdapter.fetch_weather_cells()
        self.events = await EventbriteAdapter.fetch_events()
        self.hospitals = await OverpassHospitalAdapter.fetch_hospitals()
        self.transit_stops = await TransitAdapter.fetch_transit_stops()
        
        logger.info(f"UrbanSync Initial Ingestion Complete: {len(self.traffic_incidents)} incidents, {len(self.events)} Eventbrite events, {len(self.hospitals)} OSM hospitals, {len(self.weather_cells)} weather cells loaded.")

    async def stop(self):
        self.is_running = False

