import React from 'react';
import { Sun, AlertTriangle, CloudSun, Moon, Lightbulb } from 'lucide-react';
import type { SolHazard } from '../types/trainer';

interface HazardBriefingBannerProps {
  hazard: SolHazard;
  solNumber: number;
}

export const HazardBriefingBanner: React.FC<HazardBriefingBannerProps> = ({
  hazard,
  solNumber,
}) => {
  const getHazardTheme = () => {
    switch (hazard.type) {
      case 'solar_storm':
        return {
          icon: AlertTriangle,
          border: 'border-red-500/70',
          bg: 'bg-red-950/40',
          text: 'text-red-400',
          accent: 'bg-red-900/60 text-red-200 border-red-500',
        };
      case 'dust_storm':
        return {
          icon: CloudSun,
          border: 'border-amber-500/70',
          bg: 'bg-amber-950/40',
          text: 'text-amber-400',
          accent: 'bg-amber-900/60 text-amber-200 border-amber-500',
        };
      case 'eclipse':
        return {
          icon: Moon,
          border: 'border-indigo-500/70',
          bg: 'bg-indigo-950/40',
          text: 'text-indigo-400',
          accent: 'bg-indigo-900/60 text-indigo-200 border-indigo-500',
        };
      default:
        return {
          icon: Sun,
          border: 'border-cyan-500/50',
          bg: 'bg-slate-900/80',
          text: 'text-cyan-400',
          accent: 'bg-cyan-950/60 text-cyan-200 border-cyan-500',
        };
    }
  };

  const theme = getHazardTheme();
  const Icon = theme.icon;

  return (
    <div className={`rounded-2xl p-4 sm:p-5 border-2 ${theme.border} ${theme.bg} shadow-xl backdrop-blur-md transition-all animate-fade-in`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${theme.accent}`}>
            <Icon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              PHASE 1 &bull; DAILY MISSION BRIEFING (SOL {solNumber}/10)
            </div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
              {hazard.title}
            </h2>
          </div>
        </div>

        {/* Hazard Alert Badge */}
        <div className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border shadow-sm ${theme.accent}`}>
          {hazard.badge}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">
        {hazard.description}
      </p>

      {/* One-Sentence NASA Fact Snippet */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex items-start gap-2.5 text-xs text-cyan-300">
        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong className="text-white font-mono">NASA Space Fact:</strong> {hazard.nasaFact}
        </p>
      </div>
    </div>
  );
};
