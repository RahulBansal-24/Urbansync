'use client';

import React from 'react';
import { X, Activity, Server, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { SystemStatusResponse } from '../../types/city';

interface SystemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemHealth: SystemStatusResponse | null;
}

export const SystemStatusModal: React.FC<SystemStatusModalProps> = ({ isOpen, onClose, systemHealth }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-dark-panel border border-dark-border rounded-xl p-5 shadow-panel-dark text-dark-text">
        <div className="flex items-center justify-between pb-4 border-b border-dark-border">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-cyan-glow" />
            <h2 className="font-mono font-bold text-base text-white">URBANSYNC SYSTEM HEALTH</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-dark-muted hover:text-white hover:bg-dark-hover">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          <div className="flex items-center justify-between p-3 rounded-lg bg-dark-card border border-dark-border">
            <span className="text-xs text-slate-300 font-mono">DELHI TIME</span>
            <span className="text-xs text-cyan-glow font-mono font-semibold">{systemHealth?.delhi_time || 'Syncing...'}</span>
          </div>

          <div className="space-y-2">
            {systemHealth?.services.map((svc) => (
              <div key={svc.service_name} className="flex items-center justify-between p-3 rounded-lg bg-dark-card border border-dark-border text-xs">
                <div>
                  <div className="font-semibold text-slate-200">{svc.service_name}</div>
                  {svc.details && <div className="text-[11px] text-dark-muted">{svc.details}</div>}
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-[11px] text-dark-muted font-mono">{svc.last_sync}</span>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                    svc.status === 'LIVE' || svc.status === 'ONLINE'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : svc.status.includes('STATIC')
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                      : svc.status.includes('FALLBACK')
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-red-500/20 text-red-400 border border-red-500/40'
                  }`}>
                    ● {svc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
