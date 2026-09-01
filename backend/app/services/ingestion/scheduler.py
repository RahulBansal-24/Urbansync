import asyncio
import logging
from app.services.ingestion.adapters import (
    TomTomAdapter,
    WeatherAdapter,
    INDTIXAdapter,
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
        """Initializes caches and starts background ingestion loop."""
        self.is_running = True
        logger.info("Initializing baseline UrbanSync data stores...")
        
        # Run initial fetch
        self.traffic_incidents = await TomTomAdapter.fetch_incidents()
        self.weather_cells = await WeatherAdapter.fetch_weather_cells()
        self.events = await INDTIXAdapter.fetch_events()
        self.hospitals = await OverpassHospitalAdapter.fetch_hospitals()
        self.transit_stops = await TransitAdapter.fetch_transit_stops()
        
        logger.info(f"UrbanSync Initial Ingestion Complete: {len(self.traffic_incidents)} incidents, {len(self.events)} INDTIX events, {len(self.hospitals)} OSM hospitals, {len(self.weather_cells)} weather cells loaded.")
        
        # Launch background loop
        self._task = asyncio.create_task(self._ingestion_loop())

    async def stop(self):
        self.is_running = False
        if self._task:
            self._task.cancel()

    async def _ingestion_loop(self):
        """Periodic background refresh loop."""
        traffic_timer = 0
        weather_timer = 0
        
        while self.is_running:
            try:
                await asyncio.sleep(15) # Pulse every 15 seconds
                traffic_timer += 15
                weather_timer += 15
                
                # Refresh traffic incidents every 60 seconds
                if traffic_timer >= 60:
                    traffic_timer = 0
                    new_incidents = await TomTomAdapter.fetch_incidents()
                    if new_incidents:
                        self.traffic_incidents = new_incidents
                        if self.ws_manager:
                            await self.ws_manager.broadcast({
                                "event": "TRAFFIC_UPDATE",
                                "count": len(self.traffic_incidents),
                                "timestamp": asyncio.get_event_loop().time()
                            })
                
                # Refresh weather cells every 300 seconds (5 min)
                if weather_timer >= 300:
                    weather_timer = 0
                    new_weather = await WeatherAdapter.fetch_weather_cells()
                    if new_weather:
                        self.weather_cells = new_weather
                        if self.ws_manager:
                            await self.ws_manager.broadcast({
                                "event": "WEATHER_UPDATE",
                                "count": len(self.weather_cells),
                                "timestamp": asyncio.get_event_loop().time()
                            })
                            
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in background ingestion loop: {e}")
