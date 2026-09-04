'use client';

import React from 'react';
import { X, ExternalLink, Navigation, ShieldCheck, Clock, Layers, AlertTriangle, CloudRain, ShieldAlert, Users, Car } from 'lucide-react';
import { GeoJsonFeature } from '../../types/city';

interface DetailPanelProps {
  feature: GeoJsonFeature | null;
  onClose: () => void;
  isLocked?: boolean;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ feature, onClose, isLocked }) => {
  if (!feature) return null;

  const { properties, geometry } = feature;

  const extractLatLng = (geom: any): { lat: number; lon: number } => {
    if (!geom || !geom.coordinates) return { lat: 28.6139, lon: 77.2090 };
    let c = geom.coordinates;
    while (Array.isArray(c) && c.length > 0 && Array.isArray(c[0])) {
      c = c[0];
    }
    if (Array.isArray(c) && c.length >= 2) {
      const lonNum = Number(c[0]);
      const latNum = Number(c[1]);
      return {
        lon: isNaN(lonNum) ? 77.2090 : lonNum,
        lat: isNaN(latNum) ? 28.6139 : latNum
      };
    }
    return { lat: 28.6139, lon: 77.2090 };
  };

  const { lat, lon } = extractLatLng(geometry);

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
    <aside className="absolute top-20 right-4 bottom-6 z-50 w-full max-w-sm bg-dark-panel/95 backdrop-blur-md border border-dark-border rounded-xl p-5 shadow-panel-dark flex flex-col justify-between text-dark-text overflow-y-auto pointer-events-auto">
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

        {/* WEATHER DYNAMIC ADVISORY SECTION */}
        {properties.type === 'WEATHER' && properties.extra_metadata && (
          <div className="py-3 space-y-3 border-b border-dark-border">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-400">
              <span className="flex items-center space-x-1.5">
                <CloudRain className="w-4 h-4 text-blue-400" />
                <span>WEATHER ADVISORY & HAZARDS</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-semibold text-white border" style={{ backgroundColor: properties.extra_metadata.color_hex || '#3B82F6', borderColor: '#FFFFFF33' }}>
                {properties.extra_metadata.color_name || 'Risk Analysis'}
              </span>
            </div>

            {/* Telemetry Metrics 2x3 Grid */}
            <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
              <div className="bg-dark-card p-2 rounded border border-dark-border text-center">
                <span className="text-dark-muted block text-[9px] uppercase">Temp</span>
                <span className="font-bold text-slate-100">{properties.extra_metadata.temperature_c}°C</span>
              </div>
              <div className="bg-dark-card p-2 rounded border border-dark-border text-center">
                <span className="text-dark-muted block text-[9px] uppercase">Precip</span>
                <span className="font-bold text-blue-400">{properties.extra_metadata.precipitation_mm} mm</span>
              </div>
              <div className="bg-dark-card p-2 rounded border border-dark-border text-center">
                <span className="text-dark-muted block text-[9px] uppercase">Visibility</span>
                <span className="font-bold text-amber-300">{properties.extra_metadata.visibility_km} km</span>
              </div>
              <div className="bg-dark-card p-2 rounded border border-dark-border text-center">
                <span className="text-dark-muted block text-[9px] uppercase">Wind</span>
                <span className="font-bold text-cyan-300">{properties.extra_metadata.wind_kph} km/h</span>
              </div>
              <div className="bg-dark-card p-2 rounded border border-dark-border text-center">
                <span className="text-dark-muted block text-[9px] uppercase">Humidity</span>
                <span className="font-bold text-slate-200">{properties.extra_metadata.humidity_pct}%</span>
              </div>
              <div className="bg-dark-card p-2 rounded border border-dark-border text-center">
                <span className="text-dark-muted block text-[9px] uppercase">Rain Prob</span>
                <span className="font-bold text-purple-300">{properties.extra_metadata.rain_probability_pct}%</span>
              </div>
            </div>

            {/* Primary Hazard Reasons */}
            {properties.extra_metadata.risk_reasons?.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-dark-muted uppercase block">Primary Hazard Reasons</span>
                <div className="space-y-1">
                  {properties.extra_metadata.risk_reasons.map((reason: string, idx: number) => (
                    <div key={idx} className="flex items-start space-x-1.5 text-xs text-amber-200 bg-amber-950/30 p-2 rounded border border-amber-500/30">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transport to Avoid */}
            {properties.extra_metadata.avoid_transport?.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-dark-muted uppercase flex items-center space-x-1">
                  <Car className="w-3 h-3 text-red-400" />
                  <span>Transport Modes to Avoid</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {properties.extra_metadata.avoid_transport.map((mode: string, idx: number) => (
                    <span key={idx} className="text-[11px] bg-red-950/40 text-red-300 px-2 py-0.5 rounded border border-red-500/30">
                      ⛔ {mode}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Vulnerable People Groups */}
            {properties.extra_metadata.avoid_people_groups?.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-dark-muted uppercase flex items-center space-x-1">
                  <Users className="w-3 h-3 text-purple-400" />
                  <span>Vulnerable Groups Advisory</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {properties.extra_metadata.avoid_people_groups.map((grp: string, idx: number) => (
                    <span key={idx} className="text-[11px] bg-purple-950/40 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                      ⚠️ {grp}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
