'use client';

import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

export const MapLegend: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute bottom-6 left-4 z-30 bg-dark-panel/95 backdrop-blur-md border border-dark-border rounded-xl shadow-panel-dark text-dark-text pointer-events-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-xs font-mono text-slate-300 hover:text-white"
      >
        <Info className="w-4 h-4 text-cyan-glow" />
        <span>MAP LEGEND</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>

      {isOpen && (
        <div className="p-3 border-t border-dark-border space-y-2.5 text-xs max-w-xs">
          <div>
            <span className="text-[10px] font-mono text-dark-muted block mb-1">TRAFFIC CONGESTION</span>
            <div className="flex items-center space-x-1.5 text-[11px]">
              <span className="w-3 h-3 rounded bg-emerald-500"></span>
              <span>Free</span>
              <span className="w-3 h-3 rounded bg-amber-500"></span>
              <span>Moderate</span>
              <span className="w-3 h-3 rounded bg-orange-500"></span>
              <span>Heavy</span>
              <span className="w-3 h-3 rounded bg-red-600"></span>
              <span>Severe</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono text-dark-muted block mb-1">CITY MARKERS</span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                <span>Events</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                <span>Hospitals</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span>Accidents</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                <span>Transit</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono text-dark-muted block mb-1">SPATIAL OVERLAYS</span>
            <div className="flex items-center space-x-2 text-[11px]">
              <span className="w-4 h-2.5 rounded bg-blue-500/40 border border-blue-400"></span>
              <span>Weather Risk Cells</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
