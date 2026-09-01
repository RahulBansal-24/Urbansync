'use client';

import React from 'react';
import { X, ExternalLink, Navigation, ShieldCheck, Clock, Layers, AlertTriangle } from 'lucide-react';
import { GeoJsonFeature } from '../../types/city';

interface DetailPanelProps {
  feature: GeoJsonFeature | null;
  onClose: () => void;
  isLocked?: boolean;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ feature, onClose, isLocked }) => {
  if (!feature) return null;

  const { properties, geometry } = feature;
  const coords = geometry.coordinates;
  const lat = Array.isArray(coords[0]) ? coords[0][1] : coords[1];
  const lon = Array.isArray(coords[0]) ? coords[0][0] : coords[0];

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;

  // Data state color pill
  const dataStateColors: Record<string, string> = {
    LIVE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    DERIVED: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    PREDICTED: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    SIMULATED: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    STATIC: 'bg-slate-500/20 text-slate-400 border-slate-500/40'
  };

  return (
    <aside className="absolute top-20 right-4 bottom-6 z-30 w-full max-w-sm bg-dark-panel/95 backdrop-blur-md border border-dark-border rounded-xl p-5 shadow-panel-dark flex flex-col justify-between text-dark-text overflow-y-auto pointer-events-auto">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-dark-border">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-cyan-glow bg-cyan-brand/20 px-2 py-0.5 rounded border border-cyan-brand/40">
                {properties.type}
              </span>
              <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${dataStateColors[properties.data_state] || dataStateColors.LIVE}`}>
                ● {properties.data_state}
              </span>
            </div>
            <h2 className="font-bold text-base text-white mt-1.5 leading-snug">{properties.title}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-dark-muted hover:text-white hover:bg-dark-hover">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LAYER 1: SOURCE FACTS */}
        <div className="py-4 space-y-3 border-b border-dark-border">
          <div className="flex items-center justify-between text-xs text-dark-muted">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SOURCE FACT LAYER</span>
            </span>
            <span className="font-mono text-[11px]">{properties.source_name}</span>
          </div>

          {properties.description && (
            <p className="text-xs text-slate-300 leading-relaxed bg-dark-card p-3 rounded-lg border border-dark-border">
              {properties.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-dark-card p-2.5 rounded-lg border border-dark-border">
              <span className="text-dark-muted text-[11px] block">Coordinates</span>
              <span className="font-mono text-slate-200 text-[11px]">{lat.toFixed(4)}, {lon.toFixed(4)}</span>
            </div>
            <div className="bg-dark-card p-2.5 rounded-lg border border-dark-border">
              <span className="text-dark-muted text-[11px] block">Severity</span>
              <span className="font-bold text-status-warning text-xs">{properties.severity}</span>
            </div>
          </div>
        </div>

        {/* LAYER 2: URBANSYNC CALCULATED ANALYSIS */}
        {properties.impact_scores && (
          <div className="py-4 space-y-3 border-b border-dark-border">
            <div className="flex items-center space-x-1.5 text-xs text-cyan-glow font-mono font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>URBANSYNC ANALYSIS</span>
            </div>

            <div className="space-y-2">
              {Object.entries(properties.impact_scores).map(([key, val]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 capitalize">{key.replace('_', ' ')}</span>
                    <span className="font-mono text-cyan-glow font-bold">{val}%</span>
                  </div>
                  <div className="w-full bg-dark-card h-1.5 rounded-full overflow-hidden border border-dark-border">
                    <div
                      className="bg-gradient-to-r from-cyan-brand to-purple-brand h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, val)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LAYER 3: AI EXPLANATION */}
        <div className="py-4 space-y-2">
          <div className="text-[11px] font-mono text-purple-glow font-semibold flex items-center space-x-1">
            <span>AI GROUNDED REASONING</span>
          </div>
          <p className="text-xs text-slate-300 italic bg-purple-brand/10 p-3 rounded-lg border border-purple-brand/30">
            "Directly grounded in verified {properties.source_name} feed. Object severity is tagged {properties.severity}."
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-dark-border space-y-2">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg bg-gradient-to-r from-cyan-brand to-blue-600 hover:from-cyan-glow hover:to-blue-500 text-black font-bold text-xs shadow-glow-cyan transition-all"
        >
          <Navigation className="w-4 h-4 fill-black" />
          <span>NAVIGATE IN GOOGLE MAPS</span>
        </a>

        {properties.source_url && (
          <a
            href={properties.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 py-1.5 px-4 rounded-lg bg-dark-card hover:bg-dark-hover border border-dark-border text-slate-300 text-xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>VIEW VERIFIED SOURCE</span>
          </a>
        )}
      </div>
    </aside>
  );
};
