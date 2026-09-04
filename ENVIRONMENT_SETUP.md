# Environment Setup & API Configuration Guide

UrbanSync integrates third-party API adapters with zero-key fallback capabilities. If external API keys are not supplied, the system automatically runs using verified baseline Delhi data tagged appropriately (`LIVE`, `DERIVED`, `PREDICTED`, `SIMULATED`, `STATIC`).

## Required Environment Variables (`.env`)

```env
# DATABASE
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/urbansync
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=urbansync

# TOMTOM SERVICES (Map Display, Traffic, Routing)
TOMTOM_API_KEY=your_tomtom_key_here
NEXT_PUBLIC_TOMTOM_API_KEY=your_tomtom_key_here

# WEATHER
WEATHERAPI_KEY=your_weatherapi_key_here
OPEN_METEO_ENABLED=true

# EVENTBRITE PUBLIC INGESTION (No API key required)
# Ingests live public events from Eventbrite listing pages

# OPENSTREETMAP OVERPASS API (No API key required)
OVERPASS_API_URL=https://overpass-api.de/api/interpreter

# DELHI OTD
DELHI_OTD_REALTIME_KEY=your_delhi_otd_key_here

# GROQ LLM API
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-20b

# APPLICATION URLS
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```
