'use client';

import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { LayerCategory } from '../../types/city';

interface MapLegendProps {
  activeCategory: LayerCategory;
}

export const MapLegend: React.FC<MapLegendProps> = ({ activeCategory }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Hide legend completely for tabs where popup is unnecessary
  if (
    activeCategory === 'SMART ROUTE' ||
    activeCategory === 'SIMULATION' ||
    activeCategory === 'HOSPITALS'
  ) {
    return null;
  }

  return (
    <div
      className={`absolute bottom-6 left-4 transition-all duration-200 pointer-events-auto ${
        isOpen
          ? 'z-50 bg-[#0F172A] border border-slate-700 shadow-2xl rounded-xl p-3.5 min-w-[240px] max-w-xs'
          : 'z-30 bg-[#0F172A] border border-slate-700 rounded-xl shadow-panel-dark py-2.5 px-3.5 min-w-[150px]'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full space-x-2 text-xs font-mono text-slate-300 hover:text-white py-0.5"
      >
        <div className="flex items-center space-x-1.5">
          <Info className="w-4 h-4 text-cyan-glow shrink-0" />
          <span className="font-bold tracking-wider text-white">MAP LEGEND</span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-cyan-glow" />
        ) : (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-slate-700/80 space-y-3 text-xs">
          {/* ALL CATEGORIES LEGEND */}
          {activeCategory === 'ALL' && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">
                DIGITAL TWIN OVERLAYS
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-yellow-500 border border-yellow-300 flex items-center justify-center text-[10px]">
                    🚗
                  </div>
                  <span className="text-slate-200">Traffic Congestion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-pink-500 border border-pink-300 flex items-center justify-center text-white text-[10px]">
                    ★
                  </div>
                  <span className="text-slate-200">Public Event</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-amber-600 border border-amber-300 flex items-center justify-center text-[10px]">
                    🚧
                  </div>
                  <span className="text-slate-200">Road Block / Construction</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-red-600 border border-red-400 flex items-center justify-center font-bold text-white text-[10px]">
                    ⚠
                  </div>
                  <span className="text-slate-200">Accident</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-cyan-500 border border-cyan-300 flex items-center justify-center font-bold text-white text-[10px]">
                    ✚
                  </div>
                  <span className="text-slate-200">Hospital Facility</span>
                </div>
              </div>
            </div>
          )}

          {/* WEATHER TAB LEGEND */}
          {activeCategory === 'WEATHER' && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">
                WEATHER RISK SPATIAL GRID
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded bg-[#00F0FF]/60 border border-[#00F0FF]"></span>
                  <span className="text-slate-200">Normal / Clear Conditions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded bg-blue-500/60 border border-blue-400"></span>
                  <span className="text-slate-200">Light Rain / Low Hazard</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded bg-amber-500/60 border border-amber-400"></span>
                  <span className="text-slate-200">Moderate Precipitation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded bg-red-500/60 border border-red-400"></span>
                  <span className="text-slate-200">Heavy Rain & Waterlogging</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded bg-purple-500/60 border border-purple-400"></span>
                  <span className="text-slate-200">Dense Smog / Low Visibility</span>
                </div>
              </div>
            </div>
          )}

          {/* PUBLIC TRANSIT TAB LEGEND */}
          {activeCategory === 'PUBLIC TRANSIT' && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">
                DMRC METRO & BUS NETWORKS
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-[#FFCC00] text-black border border-white flex items-center justify-center font-bold text-[10px]">
                    🚅
                  </div>
                  <span className="text-slate-200 font-semibold">Metro Station</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-sky-500 border border-sky-300 flex items-center justify-center text-[10px]">
                    🚌
                  </div>
                  <span className="text-slate-200 font-semibold">Bus Stop / Terminal</span>
                </div>

                <div className="pt-2 border-t border-slate-700/60 space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">
                    METRO & BUS ROUTE LINES
                  </span>
                  <div className="space-y-1 pl-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-1.5 rounded bg-[#FFCC00]"></span>
                      <span className="text-slate-200 text-[10px]">Yellow Line</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-1.5 rounded bg-[#0066FF]"></span>
                      <span className="text-slate-200 text-[10px]">Blue Line</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-1.5 rounded bg-[#D32F2F]"></span>
                      <span className="text-slate-200 text-[10px]">Red Line</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-1.5 rounded bg-[#E91E63]"></span>
                      <span className="text-slate-200 text-[10px]">Pink Line</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-1.5 rounded bg-[#9C27B0]"></span>
                      <span className="text-slate-200 text-[10px]">Magenta Line</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-1.5 rounded bg-[#673AB7]"></span>
                      <span className="text-slate-200 text-[10px]">Violet Line</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-1.5 rounded bg-[#2E7D32]"></span>
                      <span className="text-slate-200 text-[10px]">Green Line</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-1.5 rounded bg-[#FF6F00]"></span>
                      <span className="text-slate-200 text-[10px]">Airport Express</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-1.5 rounded bg-[#0EA5E9]"></span>
                      <span className="text-slate-200 text-[10px]">DTC Bus Corridor</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TRAFFIC TAB LEGEND */}
          {activeCategory === 'TRAFFIC' && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">
                REAL-TIME TRAFFIC FLOW
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-yellow-500 border border-yellow-300 flex items-center justify-center text-[10px]">
                    🚗
                  </div>
                  <span className="text-slate-200">Traffic Incident / Slowdown</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded bg-amber-500"></span>
                  <span className="text-slate-200">Moderate Slowdown (20–35 km/h)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded bg-red-600"></span>
                  <span className="text-slate-200">Heavy Bottleneck (&lt;20 km/h)</span>
                </div>
              </div>
            </div>
          )}

          {/* ROAD BLOCKS TAB LEGEND */}
          {activeCategory === 'ROAD BLOCKS' && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">
                BARRICADES & CONSTRUCTION
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-amber-600 border border-amber-300 flex items-center justify-center text-[10px]">
                    🚧
                  </div>
                  <span className="text-slate-200">Road Blockade / Repair Work</span>
                </div>
              </div>
            </div>
          )}

          {/* ACCIDENTS TAB LEGEND */}
          {activeCategory === 'ACCIDENTS' && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">
                ACCIDENTS & HAZARDS
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-red-600 border border-red-400 flex items-center justify-center font-bold text-white text-[10px]">
                    ⚠
                  </div>
                  <span className="text-slate-200">Vehicle Crash / Emergency Obstruction</span>
                </div>
              </div>
            </div>
          )}

          {/* EVENTS TAB LEGEND */}
          {activeCategory === 'EVENTS' && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">
                PUBLIC EVENTS & CROWD VENUES
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-pink-500 border border-pink-300 flex items-center justify-center text-white text-[10px]">
                    ★
                  </div>
                  <span className="text-slate-200">Event Venue Gathering</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
