'use client';

import React from 'react';
import { LayerCategory } from '../../types/city';
import {
  Layers,
  Navigation,
  CloudRain,
  Car,
  Calendar,
  AlertTriangle,
  Flame,
  Hospital,
  Bus,
  Brain,
  Sliders
} from 'lucide-react';

interface CategoryBarProps {
  activeCategory: LayerCategory;
  onSelectCategory: (cat: LayerCategory) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({ activeCategory, onSelectCategory }) => {
  const CATEGORIES: { name: LayerCategory; icon: React.ReactNode; color: string; flagship?: boolean }[] = [
    { name: 'ALL', icon: <Layers className="w-3.5 h-3.5" />, color: 'text-slate-300' },
    { name: 'SMART ROUTE', icon: <Navigation className="w-3.5 h-3.5" />, color: 'text-cyan-glow', flagship: true },
    { name: 'SIMULATION', icon: <Sliders className="w-3.5 h-3.5" />, color: 'text-purple-glow', flagship: true },
    { name: 'TRAFFIC', icon: <Car className="w-3.5 h-3.5" />, color: 'text-amber-400' },
    { name: 'WEATHER', icon: <CloudRain className="w-3.5 h-3.5" />, color: 'text-blue-400' },
    { name: 'EVENTS', icon: <Calendar className="w-3.5 h-3.5" />, color: 'text-pink-400' },
    { name: 'ROAD BLOCKS', icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-red-400' },
    { name: 'ACCIDENTS', icon: <Flame className="w-3.5 h-3.5" />, color: 'text-red-500' },
    { name: 'HOSPITALS', icon: <Hospital className="w-3.5 h-3.5" />, color: 'text-cyan-400' },
    { name: 'PUBLIC TRANSIT', icon: <Bus className="w-3.5 h-3.5" />, color: 'text-emerald-400' }
  ];

  return (
    <nav className="absolute top-20 left-4 right-4 z-30 flex items-center space-x-2 overflow-x-auto scrollbar-none py-1 pointer-events-auto">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.name;
        return (
          <button
            key={cat.name}
            onClick={() => onSelectCategory(cat.name)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shadow-md ${
              isActive
                ? cat.flagship
                  ? 'bg-gradient-to-r from-cyan-brand/30 to-purple-brand/30 border border-cyan-glow text-white shadow-glow-cyan font-bold scale-105'
                  : 'bg-dark-hover border border-slate-500 text-white font-semibold'
                : 'bg-dark-card/90 backdrop-blur-md border border-dark-border text-slate-300 hover:bg-dark-hover hover:border-slate-600'
            }`}
          >
            <span className={cat.color}>{cat.icon}</span>
            <span>{cat.name}</span>
            {cat.flagship && (
              <span className="text-[9px] font-mono px-1 rounded bg-cyan-brand/40 text-cyan-glow uppercase tracking-wider">
                FLAGSHIP AI
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
