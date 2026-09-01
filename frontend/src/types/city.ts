export type LayerCategory = 
  | 'ALL'
  | 'SMART ROUTE'
  | 'WEATHER'
  | 'TRAFFIC'
  | 'EVENTS'
  | 'ROAD BLOCKS'
  | 'ACCIDENTS'
  | 'HOSPITALS'
  | 'PUBLIC TRANSIT'
  | 'PREDICTIONS'
  | 'SIMULATION';

export type DataState = 'LIVE' | 'DERIVED' | 'PREDICTED' | 'SIMULATED' | 'STATIC';

export interface GeoJsonProperties {
  id: string;
  type: string;
  title: string;
  description?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'SEVERE';
  status: string;
  data_state: DataState;
  source_name: string;
  source_url?: string;
  source_timestamp?: string;
  impact_scores?: Record<string, number>;
  extra_metadata?: Record<string, any>;
}

export interface GeoJsonFeature {
  type: 'Feature';
  geometry: {
    type: string;
    coordinates: any;
  };
  properties: GeoJsonProperties;
}

export interface GeoJsonFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
}

export interface RouteFactor {
  type: string;
  severity: string;
  title: string;
  penalty?: number;
  bonus?: number;
}

export interface RouteCandidate {
  id: string;
  name: string;
  eta_minutes: number;
  distance_km: number;
  urbansync_score: number;
  geometry: any;
  avoided_incidents_count: number;
  passed_events_count: number;
  closures_intersected: number;
  weather_risk_level: string;
  factors: RouteFactor[];
  explanation: string;
}

export interface SmartRouteResponse {
  recommended_route_id: string;
  routes: RouteCandidate[];
  confidence_pct: number;
  timestamp: string;
}

export interface TopCorridorImpact {
  road_name: string;
  baseline_speed_kph: number;
  simulated_speed_kph: number;
  congestion_increase_pct: number;
  status: string;
}

export interface SimulationResult {
  scenario_id: string;
  data_state: DataState;
  baseline_metrics: {
    average_eta_minutes: number;
    congestion_level_pct: number;
    affected_corridors_count: number;
  };
  simulated_metrics: {
    average_eta_minutes: number;
    congestion_level_pct: number;
    affected_corridors_count: number;
  };
  metric_deltas: {
    eta_delta_pct: number;
    congestion_delta_pct: number;
    impact_multiplier: number;
  };
  top_impacted_corridors: TopCorridorImpact[];
  top_alternative_detours: string[];
  ai_summary: string;
  timestamp: string;
}

export interface HospitalRankItem {
  id: string;
  name: string;
  hospital_type: string;
  address: string;
  distance_km: number;
  eta_minutes: number;
  suitability_score: number;
  has_emergency: boolean;
  has_trauma_center: boolean;
  reported_icu_beds: number;
  availability_status: string;
  google_maps_url: string;
  reasoning: string;
  source_name: string;
  data_state: DataState;
}

export interface ServiceHealth {
  service_name: string;
  status: 'ONLINE' | 'LIVE' | 'DEGRADED' | 'OFFLINE';
  last_sync: string;
  details?: string;
}

export interface SystemStatusResponse {
  overall_status: string;
  delhi_time: string;
  services: ServiceHealth[];
  demo_mode_active: boolean;
}
