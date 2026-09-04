'use client';

import React, { useState } from 'react';
import { Sliders, Play, RotateCcw, MapPin, Navigation, AlertTriangle, TrendingUp, CheckCircle2, Zap } from 'lucide-react';
import { SimulationResult } from '../../types/city';
import { runCitySimulation } from '../../services/api';
import { DELHI_LOCATIONS } from '../routing/SmartRoutePanel';

interface SimulationPanelProps {
  onSimulationRun: (result: SimulationResult) => void;
  onResetSimulation: () => void;
  onClose: () => void;
}

export const SimulationPanel: React.FC<SimulationPanelProps> = ({
  onSimulationRun,
  onResetSimulation,
  onClose
}) => {
  // Origin & Destination states
  const [originName, setOriginName] = useState('Connaught Place (Rajiv Chowk)');
  const [destinationName, setDestinationName] = useState('IGI Airport Terminal 3 International');
  const [originCoords, setOriginCoords] = useState<[number, number]>([77.2197, 28.6315]);
  const [destCoords, setDestCoords] = useState<[number, number]>([77.1000, 28.5562]);

  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  // Simulation parameters
  const [selectedClosures, setSelectedClosures] = useState<string[]>([
    'ITO Junction & Vikas Marg Barricades',
    'DND Flyway Maintenance Closure'
  ]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    'Bharat Mandapam (Pragati Maidan)'
  ]);
  const [trafficIncrease, setTrafficIncrease] = useState<number>(30);
  const [weatherSeverity, setWeatherSeverity] = useState<string>('Heavy Rain');
  const [eventAttendance, setEventAttendance] = useState<number>(45000);
  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);

  // 16 Realistic Road Closures in Delhi NCR
  const ROAD_CLOSURE_OPTIONS = [
    'ITO Junction & Vikas Marg Barricades',
    'DND Flyway Maintenance Closure',
    'Kashmere Gate ISBT Ring Road Block',
    'Dhaula Kuan Underpass Waterlogging Block',
    'NH-48 Delhi-Gurgaon Border Checkpoint',
    'India Gate C-Hexagon VIP Movement Closure',
    'Ashram Flyover Construction Barricade',
    'Rajouri Garden Ring Road Repair',
    'GT Karnal Road Singhu Border Block',
    'Noida Sec 62 Expressway Ramp Barricade',
    'Anand Vihar ISBT Terminal Gate Closure',
    'Mehrauli-Badarpur Road Waterlogging Block',
    'Punjabi Bagh Flyover Reconstruction',
    'Rohini Sec 18 Outer Ring Closure',
    'Lodhi Road JLN Tunnel Closure',
    'Mathura Road Pragati Maidan Repair'
  ];

  // 16 Popular Event Hotspot Venues in Delhi NCR
  const EVENT_HOTSPOT_OPTIONS = [
    'Bharat Mandapam (Pragati Maidan)',
    'Jawaharlal Nehru (JLN) Stadium',
    'Arun Jaitley Cricket Stadium (Feroz Shah Kotla)',
    'Major Dhyan Chand National Stadium',
    'Indira Gandhi Indoor Arena',
    'Dilli Haat INA Complex',
    'Connaught Place Central Park',
    'Cyber Hub Gurgaon',
    'Leisure Valley Park Sec 29 Gurgaon',
    'Noida Sector 18 Wave City Center',
    'Expocentre Noida Sector 62',
    'Siri Fort Auditorium Complex',
    'India Habitat Centre Lodhi Road',
    'Red Fort Grounds Chandni Chowk',
    'Kingdom of Dreams Gurgaon',
    'Talkatora Indoor Stadium'
  ];

  const WEATHER_OPTIONS = ['Clear', 'Light Rain', 'Moderate Rain', 'Heavy Rain', 'Fog', 'Dense Smog'];

  const filteredOriginSuggestions = DELHI_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(originName.toLowerCase())
  );

  const filteredDestSuggestions = DELHI_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(destinationName.toLowerCase())
  );

  const handleUseLiveLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setOriginName('My Live Location (GPS)');
          setOriginCoords([lon, lat]);
          setShowOriginSuggestions(false);
        },
        () => {
          alert('Could not retrieve live GPS location. Please select a location from suggestions.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const toggleClosure = (road: string) => {
    if (selectedClosures.includes(road)) {
      setSelectedClosures(selectedClosures.filter(r => r !== road));
    } else {
      setSelectedClosures([...selectedClosures, road]);
    }
  };

  const toggleEvent = (venue: string) => {
    if (selectedEvents.includes(venue)) {
      setSelectedEvents(selectedEvents.filter(v => v !== venue));
    } else {
      setSelectedEvents([...selectedEvents, venue]);
    }
  };

  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await runCitySimulation({
        origin: originCoords,
        destination: destCoords,
        origin_name: originName,
        destination_name: destinationName,
        road_closures: selectedClosures,
        event_locations: selectedEvents,
        traffic_increase_pct: trafficIncrease,
        weather_severity: weatherSeverity,
        event_attendance: eventAttendance
      });
      setSimResult(res);
      onSimulationRun(res);
    } catch (err) {
      console.error('Failed to run city simulation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSimResult(null);
    setSelectedClosures([]);
    setSelectedEvents([]);
    setTrafficIncrease(0);
    setWeatherSeverity('Clear');
    setEventAttendance(0);
    onResetSimulation();
  };

  return (
    <div className="absolute top-20 left-4 bottom-6 z-30 w-full max-w-md bg-dark-panel/95 backdrop-blur-md border border-dark-border rounded-xl p-5 shadow-panel-dark flex flex-col justify-between text-dark-text overflow-y-auto pointer-events-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-dark-border">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-purple-brand/20 border border-purple-brand/40 text-purple-glow">
              <Sliders className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-mono font-bold text-base text-white">AI CITY SIMULATION</h2>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-brand/30 text-purple-glow font-bold border border-purple-brand/50 uppercase">
                  FLAGSHIP #2
                </span>
              </div>
              <p className="text-[11px] text-dark-muted">What-If Multi-Disruption AI Flow & Reroute Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="text-xs text-dark-muted hover:text-white px-2 py-1 rounded bg-dark-card">
            Close
          </button>
        </div>

        {/* Multi-Condition Controls */}
        <div className="py-4 space-y-3.5 border-b border-dark-border">
          {/* Origin Autocomplete */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-mono text-dark-muted block">ORIGIN LOCATION</label>
              <button
                type="button"
                onClick={handleUseLiveLocation}
                className="text-[10px] font-mono text-purple-glow hover:text-white flex items-center space-x-1 bg-purple-brand/10 hover:bg-purple-brand/20 px-2 py-0.5 rounded border border-purple-brand/30 transition-colors"
              >
                <MapPin className="w-3 h-3 text-purple-glow" />
                <span>📍 Live Location</span>
              </button>
            </div>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-glow" />
              <input
                type="text"
                value={originName}
                onChange={(e) => {
                  setOriginName(e.target.value);
                  setShowOriginSuggestions(true);
                }}
                onFocus={() => setShowOriginSuggestions(true)}
                placeholder="Search origin in Delhi NCR..."
                className="w-full bg-dark-card border border-dark-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:border-purple-glow focus:outline-none"
              />
            </div>
            {showOriginSuggestions && filteredOriginSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-dark-panel border border-purple-glow/40 rounded-lg shadow-xl z-50 max-h-40 overflow-y-auto divide-y divide-dark-border">
                {filteredOriginSuggestions.map((loc) => (
                  <div
                    key={loc.name}
                    onClick={() => {
                      setOriginName(loc.name);
                      setOriginCoords(loc.coords);
                      setShowOriginSuggestions(false);
                    }}
                    className="p-2 text-xs text-slate-200 hover:bg-purple-brand/20 hover:text-purple-glow cursor-pointer transition-colors"
                  >
                    📍 {loc.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Destination Autocomplete */}
          <div className="relative">
            <label className="text-[11px] font-mono text-dark-muted block mb-1">DESTINATION LOCATION</label>
            <div className="relative">
              <Navigation className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-glow" />
              <input
                type="text"
                value={destinationName}
                onChange={(e) => {
                  setDestinationName(e.target.value);
                  setShowDestSuggestions(true);
                }}
                onFocus={() => setShowDestSuggestions(true)}
                placeholder="Search destination in Delhi NCR..."
                className="w-full bg-dark-card border border-dark-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:border-purple-glow focus:outline-none"
              />
            </div>
            {showDestSuggestions && filteredDestSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-dark-panel border border-purple-glow/40 rounded-lg shadow-xl z-50 max-h-40 overflow-y-auto divide-y divide-dark-border">
                {filteredDestSuggestions.map((loc) => (
                  <div
                    key={loc.name}
                    onClick={() => {
                      setDestinationName(loc.name);
                      setDestCoords(loc.coords);
                      setShowDestSuggestions(false);
                    }}
                    className="p-2 text-xs text-slate-200 hover:bg-cyan-brand/20 hover:text-cyan-glow cursor-pointer transition-colors"
                  >
                    🎯 {loc.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 16 Road Closure Barricade Options */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-mono text-dark-muted block">ROAD CLOSURE / BARRICADE OPTIONS</label>
              <span className="text-[10px] font-mono text-status-danger font-bold">{selectedClosures.length} selected</span>
            </div>
            <div className="max-h-36 overflow-y-auto p-2 rounded-lg bg-dark-card border border-dark-border flex flex-wrap gap-1.5">
              {ROAD_CLOSURE_OPTIONS.map((road) => {
                const isSelected = selectedClosures.includes(road);
                return (
                  <button
                    key={road}
                    onClick={() => toggleClosure(road)}
                    className={`py-1 px-2 rounded text-[10px] border transition-all font-mono text-left ${
                      isSelected
                        ? 'bg-status-danger/20 border-status-danger text-status-danger font-bold'
                        : 'bg-dark-panel border-dark-border text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🚧 {road} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Traffic Multiplier */}
          <div>
            <div className="flex justify-between text-[11px] font-mono mb-1">
              <span className="text-dark-muted">TRAFFIC DEMAND SURGE</span>
              <span className="text-purple-glow font-bold">+{trafficIncrease}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={trafficIncrease}
              onChange={(e) => setTrafficIncrease(Number(e.target.value))}
              className="w-full accent-purple-glow bg-dark-card cursor-pointer"
            />
          </div>

          {/* Weather Conditions */}
          <div>
            <label className="text-[11px] font-mono text-dark-muted block mb-1">WEATHER CONDITION</label>
            <div className="grid grid-cols-3 gap-1.5">
              {WEATHER_OPTIONS.map((w) => (
                <button
                  key={w}
                  onClick={() => setWeatherSeverity(w)}
                  className={`py-1 px-2 rounded text-[11px] border transition-all ${
                    weatherSeverity === w
                      ? 'bg-blue-500/20 border-blue-400 text-blue-400 font-bold'
                      : 'bg-dark-card border-dark-border text-slate-400'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Major Event Attendance & 16 Event Hotspots */}
          <div>
            <div className="flex justify-between text-[11px] font-mono mb-1">
              <span className="text-dark-muted font-mono">EVENT SPECTATOR CROWD ATTENDANCE</span>
              <span className="text-pink-400 font-bold">{eventAttendance.toLocaleString()} attendees</span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="5000"
              value={eventAttendance}
              onChange={(e) => setEventAttendance(Number(e.target.value))}
              className="w-full accent-pink-400 bg-dark-card cursor-pointer mb-2"
            />

            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-mono text-dark-muted block">EVENT HOTSPOT VENUE DESTINATIONS</label>
              <span className="text-[10px] font-mono text-pink-400 font-bold">{selectedEvents.length} selected</span>
            </div>
            <div className="max-h-36 overflow-y-auto p-2 rounded-lg bg-dark-card border border-dark-border flex flex-wrap gap-1.5">
              {EVENT_HOTSPOT_OPTIONS.map((venue) => {
                const isSelected = selectedEvents.includes(venue);
                return (
                  <button
                    key={venue}
                    onClick={() => toggleEvent(venue)}
                    className={`py-1 px-2 rounded text-[10px] border transition-all font-mono text-left ${
                      isSelected
                        ? 'bg-pink-500/20 border-pink-400 text-pink-300 font-bold'
                        : 'bg-dark-panel border-dark-border text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ★ {venue} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={handleRun}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-purple-brand to-pink-600 hover:from-purple-glow hover:to-pink-500 text-white font-bold text-xs shadow-glow-purple flex items-center justify-center space-x-2 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{loading ? 'RUNNING AI NETWORK SIMULATION...' : 'RUN WHAT-IF SIMULATION'}</span>
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 rounded-lg bg-dark-card border border-dark-border hover:bg-dark-hover text-dark-muted hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Simulation Output Cards */}
        {simResult && (
          <div className="py-4 space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-semibold text-slate-300">GENERIC CITYWIDE METRIC DELTAS</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40">
                ● SIMULATED SCENARIO
              </span>
            </div>

            {/* Before vs After Metric Cards */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-dark-card p-3 rounded-lg border border-dark-border">
                <span className="text-[11px] text-dark-muted block">Citywide Avg ETA</span>
                <div className="flex items-baseline space-x-1.5 mt-1">
                  <span className="text-lg font-mono font-bold text-white">{simResult.simulated_metrics.average_eta_minutes} min</span>
                  <span className="text-xs font-mono font-bold text-status-danger">+{simResult.metric_deltas.eta_delta_pct}%</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Baseline: {simResult.baseline_metrics.average_eta_minutes} min</span>
              </div>

              <div className="bg-dark-card p-3 rounded-lg border border-dark-border">
                <span className="text-[11px] text-dark-muted block">Congestion Index</span>
                <div className="flex items-baseline space-x-1.5 mt-1">
                  <span className="text-lg font-mono font-bold text-white">{simResult.simulated_metrics.congestion_level_pct}%</span>
                  <span className="text-xs font-mono font-bold text-status-danger">+{simResult.metric_deltas.congestion_delta_pct}%</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Baseline: {simResult.baseline_metrics.congestion_level_pct}%</span>
              </div>
            </div>

            {/* Grounded AI Summary */}
            <div className="bg-purple-brand/10 p-3 rounded-lg border border-purple-brand/30">
              <div className="text-[11px] font-mono text-purple-glow font-bold mb-1">AI SCENARIO IMPACT SUMMARY</div>
              <p className="text-xs text-slate-300 leading-relaxed italic">{simResult.ai_summary}</p>
            </div>

            {/* Top Impacted Corridors */}
            <div>
              <span className="text-[11px] font-mono text-dark-muted block mb-1.5">TOP IMPACTED ROAD CORRIDORS</span>
              <div className="space-y-1.5">
                {simResult.top_impacted_corridors.map((c) => (
                  <div key={c.road_name} className="flex items-center justify-between p-2 rounded bg-dark-card border border-dark-border text-xs">
                    <span className="font-semibold text-slate-200">{c.road_name}</span>
                    <div className="text-right">
                      <span className={`font-mono font-bold ${c.simulated_speed_kph === 0 ? 'text-status-danger' : 'text-amber-400'}`}>
                        {c.simulated_speed_kph} km/h
                      </span>
                      <span className="text-[10px] text-dark-muted block">Base: {c.baseline_speed_kph} km/h</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
