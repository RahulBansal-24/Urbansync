import datetime
from typing import List, Dict, Any

SEED_EVENTS = [
    {
        "id": "EVT-DEL-001",
        "title": "Delhi International Tech & AI Summit 2026",
        "description": "Major international conference at Bharat Mandapam. Expect heavy VIP movement and high traffic density on Mathura Road and Ring Road.",
        "category": "Event",
        "latitude": 28.6183,
        "longitude": 77.2415,
        "venue_name": "Bharat Mandapam (Pragati Maidan)",
        "expected_attendance": 25000,
        "severity": "HIGH",
        "status": "ACTIVE",
        "source_name": "Eventbrite Discovery",
        "source_url": "https://www.eventbrite.com",
        "traffic_impact_score": 78.5,
        "crowd_impact_score": 85.0,
        "parking_impact_score": 90.0,
        "transit_impact_score": 65.0,
        "emergency_impact_score": 40.0,
        "impact_radius_meters": 2000.0,
        "data_state": "LIVE"
    },
    {
        "id": "EVT-DEL-002",
        "title": "IPL T20 Cricket Match: Delhi Capitals vs Mumbai",
        "description": "High-attendance night sports event at Arun Jaitley Stadium. Severe congestion expected near ITO, Bahadur Shah Zafar Marg, and Delhi Gate.",
        "category": "Event",
        "latitude": 28.6379,
        "longitude": 77.2427,
        "venue_name": "Arun Jaitley Stadium (Kotla)",
        "expected_attendance": 42000,
        "severity": "CRITICAL",
        "status": "ACTIVE",
        "source_name": "Eventbrite / Delhi Traffic Police Advisory",
        "source_url": "https://traffic.delhipolice.gov.in",
        "traffic_impact_score": 92.0,
        "crowd_impact_score": 95.0,
        "parking_impact_score": 98.0,
        "transit_impact_score": 88.0,
        "emergency_impact_score": 55.0,
        "impact_radius_meters": 3000.0,
        "data_state": "LIVE"
    },
    {
        "id": "EVT-DEL-003",
        "title": "Delhi University Cultural Fest 'Antardhvani'",
        "description": "Annual university fest at North Campus. Moderate youth crowd movement on Mall Road and Vishwavidyalaya Metro Corridor.",
        "category": "Event",
        "latitude": 28.6890,
        "longitude": 77.2100,
        "venue_name": "DU North Campus",
        "expected_attendance": 12000,
        "severity": "MEDIUM",
        "status": "ACTIVE",
        "source_name": "Eventbrite DU Advisory",
        "source_url": "https://du.ac.in",
        "traffic_impact_score": 54.0,
        "crowd_impact_score": 72.0,
        "parking_impact_score": 60.0,
        "transit_impact_score": 75.0,
        "emergency_impact_score": 20.0,
        "impact_radius_meters": 1200.0,
        "data_state": "LIVE"
    }
]

SEED_TRAFFIC_INCIDENTS = [
    {
        "id": "INC-DEL-101",
        "incident_type": "ACCIDENT",
        "title": "Multi-Vehicle Collision near Dhaula Kuan Flyover",
        "description": "Commercial truck breakdown and 2 cars affected. Right lane blocked towards IGI Airport.",
        "latitude": 28.5910,
        "longitude": 77.1610,
        "road_name": "NH-48 (Dhaula Kuan)",
        "severity": "HIGH",
        "delay_seconds": 720,
        "status": "ACTIVE",
        "source_name": "TomTom Traffic Incidents API",
        "data_state": "LIVE"
    },
    {
        "id": "INC-DEL-102",
        "incident_type": "CONGESTION",
        "title": "Heavy Waterlogging Traffic Bottleneck under Moolchand Flyover",
        "description": "Pre-monsoon drainage overflow causing 1.5 km queue on Ring Road towards Lajpat Nagar.",
        "latitude": 28.5665,
        "longitude": 77.2340,
        "road_name": "South Ring Road (Moolchand)",
        "severity": "SEVERE",
        "delay_seconds": 1050,
        "status": "ACTIVE",
        "source_name": "TomTom Traffic / Delhi Traffic Police",
        "data_state": "LIVE"
    },
    {
        "id": "INC-DEL-103",
        "incident_type": "ROAD_WORK",
        "title": "Metro Line Expansion Excavation",
        "description": "Construction barrier blocking 2 lanes on Outer Ring Road near IIT Delhi Flyover.",
        "latitude": 28.5460,
        "longitude": 77.1940,
        "road_name": "Outer Ring Road (IIT Delhi)",
        "severity": "MEDIUM",
        "delay_seconds": 420,
        "status": "ACTIVE",
        "source_name": "DMRC / Delhi Traffic Police",
        "data_state": "LIVE"
    }
]

SEED_ROAD_BLOCKS = [
    {
        "id": "BLK-DEL-201",
        "title": "Official Traffic Closure & Diversion: Rajpath Outer Circle",
        "description": "Security rehearsal and ceremonial preparation. Complete barricading between Vijay Chowk and India Gate.",
        "road_name": "Kartavya Path (Rajpath)",
        "start_latitude": 28.6145,
        "start_longitude": 77.2085,
        "end_latitude": 28.6125,
        "end_longitude": 28.6125,
        "closure_type": "FULL_CLOSURE",
        "reason": "VVIP Security & Ceremonial Protocol",
        "severity": "CRITICAL",
        "status": "ACTIVE",
        "source_name": "Delhi Traffic Police Advisory Feed",
        "data_state": "LIVE"
    }
]

SEED_WEATHER_CELLS = [
    {
        "id": "WTH-DEL-CELL-1",
        "grid_cell_id": "CELL_SW_NCR",
        "region_name": "Gurgaon & South-West NCR Corridor",
        "latitude": 28.3500,
        "longitude": 76.8500,
        "bounds_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [76.7000, 28.2000],
                [77.0000, 28.2000],
                [77.0000, 28.5000],
                [76.7000, 28.5000],
                [76.7000, 28.2000]
            ]]
        },
        "temperature_c": 33.5,
        "humidity_pct": 72.0,
        "precipitation_mm": 16.5,
        "rain_probability_pct": 78.0,
        "wind_kph": 28.0,
        "visibility_km": 4.0,
        "condition_text": "Heavy Rain Shower",
        "weather_traffic_risk": 65.0,
        "source_name": "WeatherAPI.com / Open-Meteo",
        "data_state": "LIVE"
    },
    {
        "id": "WTH-DEL-CELL-2",
        "grid_cell_id": "CELL_SOUTH_NCR",
        "region_name": "Faridabad & South Delhi Border",
        "latitude": 28.3500,
        "longitude": 77.1500,
        "bounds_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [77.0000, 28.2000],
                [77.3000, 28.2000],
                [77.3000, 28.5000],
                [77.0000, 28.5000],
                [77.0000, 28.2000]
            ]]
        },
        "temperature_c": 32.5,
        "humidity_pct": 76.0,
        "precipitation_mm": 12.0,
        "rain_probability_pct": 70.0,
        "wind_kph": 22.0,
        "visibility_km": 5.0,
        "condition_text": "Moderate Rain",
        "weather_traffic_risk": 48.0,
        "source_name": "WeatherAPI.com / Open-Meteo",
        "data_state": "LIVE"
    },
    {
        "id": "WTH-DEL-CELL-3",
        "grid_cell_id": "CELL_SE_NCR",
        "region_name": "Greater Noida & SE Expressway Zone",
        "latitude": 28.3500,
        "longitude": 77.4500,
        "bounds_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [77.3000, 28.2000],
                [77.6000, 28.2000],
                [77.6000, 28.5000],
                [77.3000, 28.5000],
                [77.3000, 28.2000]
            ]]
        },
        "temperature_c": 31.0,
        "humidity_pct": 82.0,
        "precipitation_mm": 22.0,
        "rain_probability_pct": 88.0,
        "wind_kph": 32.0,
        "visibility_km": 2.5,
        "condition_text": "Torrential Rain & Thunderstorm",
        "weather_traffic_risk": 82.0,
        "source_name": "WeatherAPI.com / Open-Meteo",
        "data_state": "LIVE"
    },
    {
        "id": "WTH-DEL-CELL-4",
        "grid_cell_id": "CELL_WEST_DELHI",
        "region_name": "West Delhi, Dwarka & Airport Zone",
        "latitude": 28.5750,
        "longitude": 76.9100,
        "bounds_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [76.7000, 28.5000],
                [77.1200, 28.5000],
                [77.1200, 28.6500],
                [76.7000, 28.6500],
                [76.7000, 28.5000]
            ]]
        },
        "temperature_c": 33.0,
        "humidity_pct": 68.0,
        "precipitation_mm": 2.5,
        "rain_probability_pct": 35.0,
        "wind_kph": 14.0,
        "visibility_km": 7.0,
        "condition_text": "Partly Cloudy",
        "weather_traffic_risk": 22.0,
        "source_name": "WeatherAPI.com / Open-Meteo",
        "data_state": "LIVE"
    },
    {
        "id": "WTH-DEL-CELL-5",
        "grid_cell_id": "CELL_CENTRAL_DELHI",
        "region_name": "Central & South Delhi Hub (CP & Rajpath)",
        "latitude": 28.5750,
        "longitude": 77.1900,
        "bounds_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [77.1200, 28.5000],
                [77.2600, 28.5000],
                [77.2600, 28.6500],
                [77.1200, 28.6500],
                [77.1200, 28.5000]
            ]]
        },
        "temperature_c": 32.0,
        "humidity_pct": 74.0,
        "precipitation_mm": 8.0,
        "rain_probability_pct": 65.0,
        "wind_kph": 18.0,
        "visibility_km": 5.5,
        "condition_text": "Moderate Rain Showers",
        "weather_traffic_risk": 45.0,
        "source_name": "WeatherAPI.com / Open-Meteo",
        "data_state": "LIVE"
    },
    {
        "id": "WTH-DEL-CELL-6",
        "grid_cell_id": "CELL_EAST_NCR",
        "region_name": "East Delhi, Noida & Ghaziabad Zone",
        "latitude": 28.5750,
        "longitude": 77.4300,
        "bounds_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [77.2600, 28.5000],
                [77.6000, 28.5000],
                [77.6000, 28.6500],
                [77.2600, 28.6500],
                [77.2600, 28.5000]
            ]]
        },
        "temperature_c": 31.8,
        "humidity_pct": 79.0,
        "precipitation_mm": 14.0,
        "rain_probability_pct": 75.0,
        "wind_kph": 24.0,
        "visibility_km": 4.0,
        "condition_text": "Heavy Rain & Waterlogging",
        "weather_traffic_risk": 62.0,
        "source_name": "WeatherAPI.com / Open-Meteo",
        "data_state": "LIVE"
    },
    {
        "id": "WTH-DEL-CELL-7",
        "grid_cell_id": "CELL_NW_NCR",
        "region_name": "North-West Delhi & Rohini Belt",
        "latitude": 28.8750,
        "longitude": 76.8750,
        "bounds_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [76.7000, 28.6500],
                [77.0500, 28.6500],
                [77.0500, 29.1000],
                [76.7000, 28.6500],
                [76.7000, 28.6500]
            ]]
        },
        "temperature_c": 30.5,
        "humidity_pct": 85.0,
        "precipitation_mm": 0.5,
        "rain_probability_pct": 40.0,
        "wind_kph": 12.0,
        "visibility_km": 1.8,
        "condition_text": "Dense Smog & Fog Hazard",
        "weather_traffic_risk": 55.0,
        "source_name": "WeatherAPI.com / Open-Meteo",
        "data_state": "LIVE"
    },
    {
        "id": "WTH-DEL-CELL-8",
        "grid_cell_id": "CELL_NORTH_DELHI",
        "region_name": "North Delhi & DU Campus Belt",
        "latitude": 28.8750,
        "longitude": 77.1650,
        "bounds_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [77.0500, 28.6500],
                [77.2800, 28.6500],
                [77.2800, 29.1000],
                [77.0500, 29.1000],
                [77.0500, 28.6500]
            ]]
        },
        "temperature_c": 32.2,
        "humidity_pct": 71.0,
        "precipitation_mm": 4.0,
        "rain_probability_pct": 50.0,
        "wind_kph": 16.0,
        "visibility_km": 5.0,
        "condition_text": "Light Rain & Haze",
        "weather_traffic_risk": 32.0,
        "source_name": "WeatherAPI.com / Open-Meteo",
        "data_state": "LIVE"
    },
    {
        "id": "WTH-DEL-CELL-9",
        "grid_cell_id": "CELL_NE_NCR",
        "region_name": "North-East NCR & Trans-Yamuna Zone",
        "latitude": 28.8750,
        "longitude": 77.4400,
        "bounds_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [77.2800, 28.6500],
                [77.6000, 28.6500],
                [77.6000, 29.1000],
                [77.2800, 29.1000],
                [77.2800, 28.6500]
            ]]
        },
        "temperature_c": 31.5,
        "humidity_pct": 78.0,
        "precipitation_mm": 11.0,
        "rain_probability_pct": 68.0,
        "wind_kph": 20.0,
        "visibility_km": 3.8,
        "condition_text": "Moderate Rain & Fog Haze",
        "weather_traffic_risk": 50.0,
        "source_name": "WeatherAPI.com / Open-Meteo",
        "data_state": "LIVE"
    }
]

SEED_HOSPITALS = [
    {
        "id": "HSP-DEL-001",
        "name": "AIIMS (All India Institute of Medical Sciences)",
        "hospital_type": "Apex Government Super Specialty & Level-1 Trauma",
        "address": "Sri Aurobindo Marg, Ansari Nagar, New Delhi - 110029",
        "latitude": 28.5672,
        "longitude": 77.2090,
        "phone": "+91-11-26588500",
        "website": "https://www.aiims.edu",
        "has_emergency": True,
        "has_trauma_center": True,
        "has_cardiac_unit": True,
        "has_pediatric_icu": True,
        "reported_icu_beds": 34,
        "reported_general_beds": 240,
        "availability_status": "AVAILABLE",
        "rating": 4.8,
        "suitability_score": 96.5,
        "source_name": "OpenStreetMap / Overpass API",
        "data_state": "STATIC"
    },
    {
        "id": "HSP-DEL-002",
        "name": "Max Super Speciality Hospital, Saket",
        "hospital_type": "Private Multi-Specialty Hospital",
        "address": "1, 2 Press Enclave Marg, Saket Institutional Area, New Delhi - 110017",
        "latitude": 28.5284,
        "longitude": 77.2117,
        "phone": "+91-11-26515050",
        "website": "https://www.maxhealthcare.in",
        "has_emergency": True,
        "has_trauma_center": True,
        "has_cardiac_unit": True,
        "has_pediatric_icu": True,
        "reported_icu_beds": 18,
        "reported_general_beds": 140,
        "availability_status": "AVAILABLE",
        "rating": 4.6,
        "suitability_score": 91.0,
        "source_name": "OpenStreetMap / Overpass API",
        "data_state": "STATIC"
    },
    {
        "id": "HSP-DEL-003",
        "name": "Safdarjung Hospital",
        "hospital_type": "Government Central Hospital & Burns/Trauma Center",
        "address": "Ring Road, opposite AIIMS, Ansari Nagar West, New Delhi - 110029",
        "latitude": 28.5695,
        "longitude": 77.2065,
        "phone": "+91-11-26707444",
        "website": "http://vmmc-sjh.nic.in",
        "has_emergency": True,
        "has_trauma_center": True,
        "has_cardiac_unit": True,
        "has_pediatric_icu": True,
        "reported_icu_beds": 22,
        "reported_general_beds": 310,
        "availability_status": "HIGH",
        "rating": 4.4,
        "suitability_score": 93.0,
        "source_name": "OpenStreetMap / Overpass API",
        "data_state": "STATIC"
    },
    {
        "id": "HSP-DEL-004",
        "name": "Sir Ganga Ram Hospital",
        "hospital_type": "Multi-Specialty Tertiary Care Hospital",
        "address": "Rajinder Nagar, New Delhi - 110060",
        "latitude": 28.6385,
        "longitude": 77.1894,
        "phone": "+91-11-25750000",
        "website": "https://sgrh.com",
        "has_emergency": True,
        "has_trauma_center": True,
        "has_cardiac_unit": True,
        "has_pediatric_icu": True,
        "reported_icu_beds": 14,
        "reported_general_beds": 160,
        "availability_status": "AVAILABLE",
        "rating": 4.5,
        "suitability_score": 88.5,
        "source_name": "OpenStreetMap / Overpass API",
        "data_state": "STATIC"
    },
    {
        "id": "HSP-DEL-005",
        "name": "Fortis Escorts Heart Institute, Okhla",
        "hospital_type": "Super Specialty Cardiac & Emergency Care",
        "address": "Okhla Road, Sukhdev Vihar, New Delhi - 110025",
        "latitude": 28.5608,
        "longitude": 77.2755,
        "phone": "+91-11-47135000",
        "website": "https://www.fortishealthcare.com",
        "has_emergency": True,
        "has_trauma_center": False,
        "has_cardiac_unit": True,
        "has_pediatric_icu": True,
        "reported_icu_beds": 26,
        "reported_general_beds": 180,
        "availability_status": "AVAILABLE",
        "rating": 4.7,
        "suitability_score": 94.0,
        "source_name": "OpenStreetMap / Overpass API",
        "data_state": "STATIC"
    }
]

SEED_TRANSIT_STOPS = [
    {
        "id": "TRN-DEL-001",
        "name": "Rajiv Chowk Metro Interchange",
        "stop_code": "RCK",
        "transit_type": "METRO",
        "line_name": "Yellow Line / Blue Line Hub",
        "latitude": 28.6328,
        "longitude": 77.2195,
        "live_vehicle_count": 14,
        "status": "OPERATIONAL",
        "source_name": "Delhi OTD / DMRC",
        "data_state": "STATIC"
    },
    {
        "id": "TRN-DEL-002",
        "name": "Kashmere Gate Metro Hub",
        "stop_code": "KGT",
        "transit_type": "METRO",
        "line_name": "Red / Yellow / Violet Line Hub",
        "latitude": 28.6675,
        "longitude": 77.2280,
        "live_vehicle_count": 18,
        "status": "OPERATIONAL",
        "source_name": "Delhi OTD",
        "data_state": "STATIC"
    },
    {
        "id": "TRN-DEL-003",
        "name": "DTC Bus Terminal Connaught Place",
        "stop_code": "DTC-CP-01",
        "transit_type": "BUS",
        "line_name": "Routes 433, 522, 620",
        "latitude": 28.6305,
        "longitude": 77.2170,
        "live_vehicle_count": 8,
        "status": "OPERATIONAL",
        "source_name": "Delhi OTD",
        "data_state": "STATIC"
    }
]
