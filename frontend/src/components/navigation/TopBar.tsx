'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Search, MapPin, Activity, Clock } from 'lucide-react';
import { SystemStatusResponse } from '../../types/city';
import { DELHI_LOCATIONS, LocationItem } from '../routing/SmartRoutePanel';

interface TopBarProps {
  onSearchSelect?: (coords: [number, number], title: string) => void;
  systemHealth: SystemStatusResponse | null;
  onOpenHealthModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onSearchSelect, systemHealth, onOpenHealthModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [delhiTime, setDelhiTime] = useState<string>('');

  // Live Delhi clock ticker
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setDelhiTime(new Date().toLocaleTimeString('en-US', options) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredSuggestions = DELHI_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLocation = (loc: LocationItem) => {
    setSearchQuery(loc.name);
    setShowSuggestions(false);
    if (onSearchSelect) {
      onSearchSelect(loc.coords, loc.name);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const match = DELHI_LOCATIONS.find((loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
    if (match) {
      handleSelectLocation(match);
    } else if (onSearchSelect) {
      onSearchSelect([77.2197, 28.6315], searchQuery.trim());
      setShowSuggestions(false);
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-40 h-16 bg-dark-bg/90 backdrop-blur-md border-b border-dark-border px-4 flex items-center justify-between text-dark-text shadow-panel-dark">
      {/* Brand Logo & Tagline */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-brand to-purple-brand flex items-center justify-center shadow-glow-cyan">
          <Shield className="w-5 h-5 text-black stroke-[2.5]" />
        </div>
        <div>
          <span className="font-mono font-bold tracking-wider text-lg text-white">URBANSYNC</span>
          <p className="text-[11px] text-dark-muted hidden sm:block">AI-Powered Smart City Digital Twin</p>
        </div>
      </div>

      {/* City Selector & Search Bar */}
      <div className="flex items-center space-x-3 flex-1 max-w-md mx-4">
        {/* City Selector Dropdown */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border text-xs text-slate-200">
          <MapPin className="w-3.5 h-3.5 text-cyan-glow" />
          <span className="font-medium">Delhi, IN</span>
        </div>

        {/* Global Location Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search 275+ Delhi NCR locations, hubs, venues..."
            className="w-full bg-dark-card border border-dark-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow transition-all"
          />
          {showSuggestions && searchQuery.trim().length > 0 && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-dark-panel border border-cyan-glow/40 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-dark-border">
              {filteredSuggestions.map((loc) => (
                <div
                  key={loc.name}
                  onClick={() => handleSelectLocation(loc)}
                  className="p-2 text-xs text-slate-200 hover:bg-cyan-brand/20 hover:text-cyan-glow cursor-pointer transition-colors flex items-center space-x-2"
                >
                  <span className="text-red-500 font-bold">📍</span>
                  <span className="truncate">{loc.name}</span>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>

      {/* System Status & Delhi Clock */}
      <div className="flex items-center space-x-3">
        {/* Live Delhi Clock */}
        <div className="hidden md:flex items-center space-x-1.5 text-xs font-mono text-slate-300 bg-dark-card/80 px-2.5 py-1.5 rounded-lg border border-dark-border">
          <Clock className="w-3.5 h-3.5 text-cyan-glow" />
          <span>{delhiTime || '03:30:00 PM IST'}</span>
        </div>

        {/* System Health Pill */}
        <button
          onClick={onOpenHealthModal}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-dark-card hover:bg-dark-hover border border-dark-border transition-colors text-xs"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-live opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-status-live"></span>
          </span>
          <span className="font-mono text-status-live font-semibold">
            {systemHealth?.overall_status || 'ONLINE'}
          </span>
          <Activity className="w-3.5 h-3.5 text-dark-muted ml-1" />
        </button>
      </div>
    </header>
  );
};
