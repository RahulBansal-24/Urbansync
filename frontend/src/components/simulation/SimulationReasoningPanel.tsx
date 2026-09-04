'use client';

import React from 'react';
import { Navigation, ShieldCheck, AlertCircle, CheckCircle2, Zap, X, MapPin } from 'lucide-react';
import { SimulationResult } from '../../types/city';

interface SimulationReasoningPanelProps {
  simulationResult: SimulationResult;
  onClose: () => void;
}

export const SimulationReasoningPanel: React.FC<SimulationReasoningPanelProps> = ({
  simulationResult,
  onClose
}) => {
  const reasoning = simulationResult.reroute_reasoning;
  const route = simulationResult.optimal_reroute;

  if (!reasoning || !route) return null;

  return (
    <div className="absolute top-20 right-4 bottom-6 z-50 w-full max-w-md bg-dark-panel/95 backdrop-blur-md border border-dark-border rounded-xl p-5 shadow-panel-dark flex flex-col justify-between text-dark-text overflow-y-auto pointer-events-auto border-l-2 border-l-cyan-glow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-dark-border">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-cyan-brand/20 border border-cyan-brand/40 text-cyan-glow">
              <Zap className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-mono font-bold text-sm text-white">AI REROUTING REASONING</h2>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-brand/30 text-cyan-glow font-bold border border-cyan-brand/50 uppercase">
                  SIMULATION REROUTE
                </span>
              </div>
              <p className="text-[11px] text-dark-muted">Optimal Path Decision & Disruption Avoidance</p>
            </div>
          </div>
          <button onClick={onClose} className="text-xs text-dark-muted hover:text-white p-1 rounded bg-dark-card">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Origin -> Destination Banner */}
        <div className="p-3 rounded-lg bg-dark-card border border-dark-border space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-mono">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-400">ORIGIN:</span>
            <span className="text-white font-bold truncate">{reasoning.origin_name}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <Navigation className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="text-slate-400">DESTINATION:</span>
            <span className="text-white font-bold truncate">{reasoning.destination_name}</span>
          </div>
        </div>

        {/* Primary Metric Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-dark-card p-2.5 rounded-lg border border-dark-border text-center">
            <span className="text-[10px] text-dark-muted block font-mono">REROUTE ETA</span>
            <span className="text-base font-mono font-extrabold text-cyan-glow block mt-0.5">{reasoning.simulated_eta} min</span>
            <span className="text-[9px] text-emerald-400 block font-mono">Optimal Path</span>
          </div>

          <div className="bg-dark-card p-2.5 rounded-lg border border-dark-border text-center">
            <span className="text-[10px] text-dark-muted block font-mono">SAFETY SCORE</span>
            <span className="text-base font-mono font-extrabold text-emerald-400 block mt-0.5">{reasoning.urbansync_safety_score} / 100</span>
            <span className="text-[9px] text-slate-400 block font-mono">Low Risk</span>
          </div>

          <div className="bg-dark-card p-2.5 rounded-lg border border-dark-border text-center">
            <span className="text-[10px] text-dark-muted block font-mono">DISTANCE</span>
            <span className="text-base font-mono font-extrabold text-white block mt-0.5">{route.distance_km} km</span>
            <span className="text-[9px] text-purple-glow block font-mono">Bypass Route</span>
          </div>
        </div>

        {/* AI Strategic Reasoning Box */}
        <div className="bg-cyan-brand/10 p-3.5 rounded-lg border border-cyan-glow/30 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-glow font-bold">
            <ShieldCheck className="w-4 h-4 text-cyan-glow" />
            <span>STRATEGIC AI REROUTING LOGIC</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed italic">
            {reasoning.strategic_explanation}
          </p>
        </div>

        {/* Avoided Disruptions Breakdown */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-mono text-dark-muted block uppercase">DISRUPTION MITIGATIONS ACTIVE</span>

          {/* Road Closures Avoided */}
          <div className="p-2.5 rounded-lg bg-dark-card border border-dark-border space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                <span>🚧</span> Avoided Road Closures
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/40">
                {reasoning.avoided_closures.length} DETOURED
              </span>
            </div>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {reasoning.avoided_closures.map((closure, idx) => (
                <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-800/50">
                  ✕ {closure}
                </span>
              ))}
            </div>
          </div>

          {/* Event Hotspots Avoided */}
          <div className="p-2.5 rounded-lg bg-dark-card border border-dark-border space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                <span>🎪</span> Avoided Event Hotspots
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-400 font-bold border border-pink-500/40">
                {reasoning.avoided_events.length} BYPASSED
              </span>
            </div>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {reasoning.avoided_events.map((event, idx) => (
                <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950/60 text-pink-300 border border-pink-800/50">
                  ★ {event}
                </span>
              ))}
            </div>
          </div>

          {/* Environmental & Surge Resilience */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-dark-card border border-dark-border">
              <span className="text-[10px] text-dark-muted block font-mono">TRAFFIC SURGE</span>
              <span className="text-xs font-mono font-bold text-amber-400 mt-0.5 block">{reasoning.traffic_surge}</span>
            </div>
            <div className="p-2 rounded bg-dark-card border border-dark-border">
              <span className="text-[10px] text-dark-muted block font-mono">WEATHER CONDITION</span>
              <span className="text-xs font-mono font-bold text-sky-400 mt-0.5 block">{reasoning.weather_condition}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
