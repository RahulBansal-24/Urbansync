'use client';

import React, { useState } from 'react';
import { Navigation, ShieldCheck, AlertTriangle, CheckCircle2, Sliders, MapPin, Zap } from 'lucide-react';
import { SmartRouteResponse, RouteCandidate } from '../../types/city';
import { calculateSmartRoute } from '../../services/api';

interface SmartRoutePanelProps {
  onRouteCalculated: (result: SmartRouteResponse) => void;
  onSelectRouteCandidate: (route: RouteCandidate) => void;
  onHighlightFactor?: (factorTitle: string) => void;
  onClose: () => void;
}

export const SmartRoutePanel: React.FC<SmartRoutePanelProps> = ({
  onRouteCalculated,
  onSelectRouteCandidate,
  onHighlightFactor,
  onClose
}) => {
  const [originName, setOriginName] = useState('Connaught Place');
  const [destinationName, setDestinationName] = useState('IGI Airport');
  const [preference, setPreference] = useState('balanced');
  const [loading, setLoading] = useState(false);
  const [routeResult, setRouteResult] = useState<SmartRouteResponse | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');

  const PREFERENCES = [
    { id: 'balanced', label: 'Balanced' },
    { id: 'fastest', label: 'Fastest ETA' },
    { id: 'safer', label: 'Safer & Avoid Closures' },
    { id: 'avoid_events', label: 'Avoid Event Radii' }
  ];

  const handleCalculate = async () => {
    setLoading(true);
    try {
      // Coords: Connaught Place -> IGI Airport
      const result = await calculateSmartRoute({
        origin: [77.2197, 28.6315],
        destination: [77.1000, 28.5562],
        origin_name: originName,
        destination_name: destinationName,
        preference: preference
      });
      setRouteResult(result);
      setSelectedRouteId(result.recommended_route_id);
      onRouteCalculated(result);
    } catch (err) {
      console.error('Failed to calculate smart route:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-20 left-4 bottom-6 z-30 w-full max-w-md bg-dark-panel/95 backdrop-blur-md border border-dark-border rounded-xl p-5 shadow-panel-dark flex flex-col justify-between text-dark-text overflow-y-auto pointer-events-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-dark-border">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-cyan-brand/20 border border-cyan-brand/40 text-cyan-glow">
              <Navigation className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-mono font-bold text-base text-white">AI SMART ROUTE</h2>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-brand/30 text-cyan-glow font-bold border border-cyan-brand/50">
                  FLAGSHIP #1
                </span>
              </div>
              <p className="text-[11px] text-dark-muted">Multi-Candidate Spatial Route Scoring Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="text-xs text-dark-muted hover:text-white px-2 py-1 rounded bg-dark-card">
            Close
          </button>
        </div>

        {/* Inputs */}
        <div className="py-4 space-y-3 border-b border-dark-border">
          <div>
            <label className="text-[11px] font-mono text-dark-muted block mb-1">ORIGIN</label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-glow" />
              <input
                type="text"
                value={originName}
                onChange={(e) => setOriginName(e.target.value)}
                className="w-full bg-dark-card border border-dark-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:border-cyan-glow focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-dark-muted block mb-1">DESTINATION</label>
            <div className="relative">
              <Navigation className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-glow" />
              <input
                type="text"
                value={destinationName}
                onChange={(e) => setDestinationName(e.target.value)}
                className="w-full bg-dark-card border border-dark-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:border-cyan-glow focus:outline-none"
              />
            </div>
          </div>

          {/* Preferences */}
          <div>
            <label className="text-[11px] font-mono text-dark-muted block mb-1">ROUTING PREFERENCE</label>
            <div className="grid grid-cols-2 gap-1.5">
              {PREFERENCES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreference(p.id)}
                  className={`py-1 px-2 rounded text-[11px] border transition-all ${
                    preference === p.id
                      ? 'bg-cyan-brand/20 border-cyan-glow text-cyan-glow font-bold'
                      : 'bg-dark-card border-dark-border text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-brand to-purple-brand hover:from-cyan-glow hover:to-purple-glow text-black font-bold text-xs shadow-glow-cyan flex items-center justify-center space-x-2 transition-all mt-2"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>{loading ? 'SCORING CANDIDATE ROUTES...' : 'CALCULATE AI SMART ROUTE'}</span>
          </button>
        </div>

        {/* Results Candidate Cards */}
        {routeResult && (
          <div className="py-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-semibold text-slate-300">CANDIDATE ROUTES</span>
              <span className="text-[11px] text-cyan-glow font-mono font-bold">Confidence: {routeResult.confidence_pct}%</span>
            </div>

            <div className="space-y-2.5 max-h-[30vh] overflow-y-auto pr-1">
              {routeResult.routes.map((candidate) => {
                const isSelected = selectedRouteId === candidate.id;
                const isRecommended = candidate.id === routeResult.recommended_route_id;

                return (
                  <div
                    key={candidate.id}
                    onClick={() => {
                      setSelectedRouteId(candidate.id);
                      onSelectRouteCandidate(candidate);
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-dark-card border-cyan-glow shadow-glow-cyan'
                        : 'bg-dark-card/60 border-dark-border hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-sm text-white">{candidate.name}</span>
                        {isRecommended && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40 uppercase">
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-base text-cyan-glow">{candidate.urbansync_score}</span>
                        <span className="text-[10px] text-dark-muted block">Score / 100</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-slate-300 mt-2">
                      <span>ETA: <strong className="text-white">{candidate.eta_minutes} min</strong></span>
                      <span>Distance: <strong className="text-white">{candidate.distance_km} km</strong></span>
                      <span>Weather Risk: <strong className="text-amber-400">{candidate.weather_risk_level}</strong></span>
                    </div>

                    {/* Reasoning Chips */}
                    <div className="mt-2.5 pt-2 border-t border-dark-border/60 space-y-1">
                      {candidate.factors.map((f, i) => (
                        <div
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onHighlightFactor) onHighlightFactor(f.title);
                          }}
                          className="flex items-center space-x-1.5 text-[11px] text-slate-300 hover:text-cyan-glow cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3 text-cyan-glow shrink-0" />
                          <span className="truncate">{f.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
