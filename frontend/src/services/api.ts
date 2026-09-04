import axios from 'axios';
import {
  GeoJsonFeatureCollection,
  SmartRouteResponse,
  SimulationResult,
  HospitalRankItem,
  SystemStatusResponse
} from '../types/city';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const fetchEvents = async (): Promise<GeoJsonFeatureCollection> => {
  const res = await client.get('/api/events');
  return res.data;
};

export const fetchTrafficIncidents = async (): Promise<GeoJsonFeatureCollection> => {
  const res = await client.get('/api/traffic/incidents');
  return res.data;
};

export const fetchRoadBlocks = async (): Promise<GeoJsonFeatureCollection> => {
  const res = await client.get('/api/traffic/roadblocks');
  return res.data;
};

export const fetchWeatherGrid = async (): Promise<GeoJsonFeatureCollection> => {
  const res = await client.get('/api/weather/grid');
  return res.data;
};

export const fetchHospitals = async (): Promise<GeoJsonFeatureCollection> => {
  const res = await client.get('/api/hospitals');
  return res.data;
};

export const fetchTransitStops = async (): Promise<GeoJsonFeatureCollection> => {
  const res = await client.get('/api/transit/stops');
  return res.data;
};

export const calculateSmartRoute = async (payload: {
  origin: number[];
  destination: number[];
  origin_name?: string;
  destination_name?: string;
  preference?: string;
}): Promise<SmartRouteResponse> => {
  const res = await client.post('/api/routing/smart-route', payload);
  return res.data;
};

export const runCitySimulation = async (payload: {
  origin?: number[];
  destination?: number[];
  origin_name?: string;
  destination_name?: string;
  road_closures: string[];
  event_locations?: string[];
  traffic_increase_pct: number;
  weather_severity: string;
  affected_weather_region?: string;
  event_location_name?: string;
  event_attendance?: number;
}): Promise<SimulationResult> => {
  const res = await client.post('/api/simulation/run', payload);
  return res.data;
};

export const rankHospitals = async (payload: {
  user_location: number[];
  emergency_type: string;
}): Promise<{ recommended_hospital: HospitalRankItem; ranked_hospitals: HospitalRankItem[] }> => {
  const res = await client.post('/api/hospitals/rank', payload);
  return res.data;
};

export const chatWithAIAssistant = async (messages: { role: string; content: string }[]) => {
  const res = await client.post('/api/assistant/chat', { messages });
  return res.data;
};

export const fetchSystemHealth = async (): Promise<SystemStatusResponse> => {
  const res = await client.get('/api/health');
  return res.data;
};

// Real-Time WebSocket Connection Listener
export const connectWebSocket = (onMessage: (data: any) => void): WebSocket | null => {
  try {
    const ws = new WebSocket(WS_BASE_URL);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };
    ws.onerror = (err) => {
      // Suppress unhandled console noise during React StrictMode cleanup
      if (ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) return;
      console.warn('WebSocket connection notice:', err);
    };
    return ws;
  } catch (err) {
    console.warn('Could not connect WebSocket:', err);
    return null;
  }
};
