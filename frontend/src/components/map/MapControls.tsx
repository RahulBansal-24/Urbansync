'use client';

import React from 'react';
import { Plus, Minus, Compass, Navigation2, RefreshCw } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onLocateMe: () => void;
  onTogglePitch: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetView,
  onLocateMe,
  onTogglePitch
}) => {
  return (
    <div className="absolute bottom-20 left-4 z-30 flex flex-col space-y-1.5 pointer-events-auto">
      <button
        onClick={onZoomIn}
        className="p-2 rounded-lg bg-dark-panel/90 hover:bg-dark-hover border border-dark-border text-slate-200 hover:text-cyan-glow shadow-panel-dark transition-colors"
        title="Zoom In"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        onClick={onZoomOut}
        className="p-2 rounded-lg bg-dark-panel/90 hover:bg-dark-hover border border-dark-border text-slate-200 hover:text-cyan-glow shadow-panel-dark transition-colors"
        title="Zoom Out"
      >
        <Minus className="w-4 h-4" />
      </button>
      <button
        onClick={onTogglePitch}
        className="p-2 rounded-lg bg-dark-panel/90 hover:bg-dark-hover border border-dark-border text-slate-200 hover:text-purple-glow shadow-panel-dark transition-colors"
        title="Toggle 3D Pitch View"
      >
        <Compass className="w-4 h-4" />
      </button>
      <button
        onClick={onLocateMe}
        className="p-2 rounded-lg bg-dark-panel/90 hover:bg-dark-hover border border-dark-border text-slate-200 hover:text-emerald-400 shadow-panel-dark transition-colors"
        title="My Location"
      >
        <Navigation2 className="w-4 h-4" />
      </button>
      <button
        onClick={onResetView}
        className="p-2 rounded-lg bg-dark-panel/90 hover:bg-dark-hover border border-dark-border text-slate-200 hover:text-white shadow-panel-dark transition-colors"
        title="Reset Delhi Command Center View"
      >
        <RefreshCw className="w-4 h-4" />
      </button>
    </div>
  );
};
