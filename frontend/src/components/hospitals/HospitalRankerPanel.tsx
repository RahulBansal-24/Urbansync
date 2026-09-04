'use client';

import React, { useState } from 'react';
import { Hospital, Navigation, HeartPulse, Activity, ExternalLink, ShieldCheck } from 'lucide-react';
import { HospitalRankItem } from '../../types/city';
import { rankHospitals } from '../../services/api';

interface HospitalRankerPanelProps {
  onClose: () => void;
}

export const HospitalRankerPanel: React.FC<HospitalRankerPanelProps> = ({ onClose }) => {
  const [emergencyType, setEmergencyType] = useState('Trauma');
  const [loading, setLoading] = useState(false);
  const [rankedList, setRankedList] = useState<HospitalRankItem[]>([]);

  const EMERGENCY_TYPES = [
    'General Emergency',
    'Trauma',
    'Accident',
    'Cardiac',
    'Pediatric'
  ];

  const handleRank = async () => {
    setLoading(true);
    try {
      // Coords near South Delhi / AIIMS
      const res = await rankHospitals({
        user_location: [77.2090, 28.5672],
        emergency_type: emergencyType
      });
      setRankedList(res.ranked_hospitals);
    } catch (err) {
      console.error('Failed to rank hospitals:', err);
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
              <Hospital className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-mono font-bold text-base text-white">FIND BEST HOSPITAL</h2>
              <p className="text-[11px] text-dark-muted">Delhi Emergency Suitability & Capability Index</p>
            </div>
          </div>
          <button onClick={onClose} className="text-xs text-dark-muted hover:text-white px-2 py-1 rounded bg-dark-card">
            Close
          </button>
        </div>

        {/* Emergency Filters */}
        <div className="py-4 space-y-3 border-b border-dark-border">
          <label className="text-[11px] font-mono text-dark-muted block">SELECT EMERGENCY TYPE</label>
          <div className="grid grid-cols-2 gap-1.5">
            {EMERGENCY_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setEmergencyType(t)}
                className={`py-1.5 px-2 rounded text-xs border transition-all ${
                  emergencyType === t
                    ? 'bg-cyan-brand/20 border-cyan-glow text-cyan-glow font-bold'
                    : 'bg-dark-card border-dark-border text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleRank}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-brand to-blue-600 hover:from-cyan-glow hover:to-blue-500 text-black font-bold text-xs shadow-glow-cyan flex items-center justify-center space-x-2 transition-all mt-2"
          >
            <HeartPulse className="w-4 h-4 fill-black" />
            <span>{loading ? 'RANKING HOSPITALS...' : 'FIND OPTIMAL HOSPITAL'}</span>
          </button>
        </div>

        {/* Ranked Results List */}
        {rankedList.length > 0 && (
          <div className="py-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-semibold text-slate-300">RANKED DELHI HOSPITALS</span>
              <span className="text-[10px] text-cyan-glow font-mono font-bold">Matched for {emergencyType}</span>
            </div>

            <div className="space-y-2.5 max-h-[35vh] overflow-y-auto pr-1">
              {rankedList.map((h, idx) => (
                <div key={h.id} className="p-3 rounded-lg bg-dark-card border border-dark-border space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-cyan-glow">#{idx + 1}</span>
                        <h3 className="font-bold text-xs text-white leading-snug">{h.name}</h3>
                      </div>
                      <span className="text-[10px] text-dark-muted block mt-0.5">{h.hospital_type}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-sm text-cyan-glow">{h.suitability_score}</span>
                      <span className="text-[9px] text-dark-muted block">Suitability / 100</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-dark-border/50">
                    <span>ETA: <strong className="text-white">{h.eta_minutes} min</strong> ({h.distance_km} km)</span>
                    <span className="text-emerald-400 font-mono font-bold">{h.reported_general_beds || 100} Total Hospital Beds</span>
                  </div>

                  <a
                    href={h.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded bg-cyan-brand/20 hover:bg-cyan-brand/30 border border-cyan-brand/40 text-cyan-glow text-xs font-bold transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 fill-cyan-glow" />
                    <span>NAVIGATE IN GOOGLE MAPS</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
