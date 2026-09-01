'use client';

import React, { useState } from 'react';
import { Sliders, Play, RotateCcw, AlertTriangle, TrendingUp, Layers, CheckCircle2 } from 'lucide-react';
import { SimulationResult } from '../../types/city';
import { runCitySimulation } from '../../services/api';

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
  const [selectedClosures, setSelectedClosures] = useState<string[]>(['Ring Road']);
  const [trafficIncrease, setTrafficIncrease] = useState<number>(30);
  const [weatherSeverity, setWeatherSeverity] = useState<string>('Heavy Rain');
  const [eventAttendance, setEventAttendance] = useState<number>(30000);
  const [eventVenue, setEventVenue] = useState<string>('JLN Stadium');
  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);

  const ROAD_OPTIONS = [
    'Ring Road',
    'Outer Ring Road',
    'NH-48 (Dhaula Kuan)',
    'Mathura Road',
    'Connaught Place Circle'
  ];

  const WEATHER_OPTIONS = ['Clear', 'Light Rain', 'Moderate Rain', 'Heavy Rain', 'Fog'];

  const toggleClosure = (road: string) => {
    if (selectedClosures.includes(road)) {
      setSelectedClosures(selectedClosures.filter(r => r !== road));
    } else {
      setSelectedClosures([...selectedClosures, road]);
    }
  };

  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await runCitySimulation({
        road_closures: selectedClosures,
        traffic_increase_pct: trafficIncrease,
        weather_severity: weatherSeverity,
        event_location_name: eventVenue,
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
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-brand/30 text-purple-glow font-bold border border-purple-brand/50">
                  FLAGSHIP #2
                </span>
              </div>
              <p className="text-[11px] text-dark-muted">What-If Multi-Condition Scenario Network Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="text-xs text-dark-muted hover:text-white px-2 py-1 rounded bg-dark-card">
            Close
          </button>
        </div>

        {/* Multi-Condition Controls */}
        <div className="py-4 space-y-3.5 border-b border-dark-border">
          {/* Road Closures Selector */}
          <div>
            <label className="text-[11px] font-mono text-dark-muted block mb-1">SELECT HYPOTHETICAL ROAD CLOSURES</label>
            <div className="flex flex-wrap gap-1.5">
              {ROAD_OPTIONS.map((road) => {
                const isSelected = selectedClosures.includes(road);
                return (
                  <button
                    key={road}
                    onClick={() => toggleClosure(road)}
                    className={`py-1 px-2.5 rounded text-[11px] border transition-all ${
                      isSelected
                        ? 'bg-status-danger/20 border-status-danger text-status-danger font-bold'
                        : 'bg-dark-card border-dark-border text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {road} {isSelected && '✕'}
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

          {/* Event Insertion */}
          <div>
            <div className="flex justify-between text-[11px] font-mono mb-1">
              <span className="text-dark-muted">MAJOR EVENT ATTENDANCE ({eventVenue})</span>
              <span className="text-pink-400 font-bold">{eventAttendance.toLocaleString()} spectators</span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="5000"
              value={eventAttendance}
              onChange={(e) => setEventAttendance(Number(e.target.value))}
              className="w-full accent-pink-400 bg-dark-card cursor-pointer"
            />
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={handleRun}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-purple-brand to-pink-600 hover:from-purple-glow hover:to-pink-500 text-white font-bold text-xs shadow-glow-purple flex items-center justify-center space-x-2 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{loading ? 'RUNNING NETWORK SIMULATION...' : 'RUN WHAT-IF SIMULATION'}</span>
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
              <span className="font-mono font-semibold text-slate-300">SIMULATION METRIC DELTAS</span>
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
              <div className="text-[11px] font-mono text-purple-glow font-bold mb-1">AI SCENARIO ANALYSIS</div>
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
