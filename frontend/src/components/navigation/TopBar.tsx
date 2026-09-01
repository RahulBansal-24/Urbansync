'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Search, MapPin, Activity, Clock } from 'lucide-react';
import { SystemStatusResponse } from '../../types/city';

interface TopBarProps {
  onSearchSelect?: (coords: [number, number], title: string) => void;
  systemHealth: SystemStatusResponse | null;
  onOpenHealthModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onSearchSelect, systemHealth, onOpenHealthModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
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

  // Quick Delhi locations search dictionary
  const QUICK_PLACES: Record<string, [number, number]> = {
    'connaught place': [77.2197, 28.6315],
    'igi airport': [77.1000, 28.5562],
    'aiims': [77.2090, 28.5672],
    'jln stadium': [77.2343, 28.5828],
    'pragati maidan': [77.2415, 28.6183],
    'india gate': [77.2295, 28.6129],
    'dhaula kuan': [77.1610, 28.5910],
    'ito': [77.2427, 28.6379]
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.toLowerCase().trim();
    const match = Object.keys(QUICK_PLACES).find(key => key.includes(q));
    if (match && onSearchSelect) {
      onSearchSelect(QUICK_PLACES[match], match.toUpperCase());
    } else if (onSearchSelect) {
      // Default to Connaught Place if unlisted
      onSearchSelect([77.2197, 28.6315], searchQuery.toUpperCase());
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
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold tracking-wider text-lg text-white">URBANSYNC</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-brand/20 text-cyan-glow border border-cyan-brand/40 uppercase">
              Digital Twin v1.0
            </span>
          </div>
          <p className="text-[11px] text-dark-muted hidden sm:block">AI-Powered Smart City Command Center</p>
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
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Delhi places, roads, hospitals, venues..."
            className="w-full bg-dark-card border border-dark-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-dark-muted focus:outline-none focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow transition-all"
          />
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
