import React from 'react';

export const SpaceViewportFallback: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-[#f8fafc] pointer-events-none select-none">
    <div className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-3 text-xs font-orbitron font-bold text-[#0369A1] tracking-wider uppercase">
      <span className="w-4 h-4 rounded-full border-2 border-[#0369A1] border-t-transparent animate-spin" />
      <span>Initializing 3D Telemetry Viewport...</span>
    </div>
  </div>
);

export const InspectorFallback: React.FC = () => (
  <div className="w-80 lg:w-96 glass-panel rounded-3xl p-5 space-y-3 animate-pulse">
    <div className="h-4 w-2/3 rounded bg-slate-200/80" />
    <div className="h-3 w-1/2 rounded bg-slate-200/60" />
    <div className="h-28 w-full rounded-2xl bg-slate-100/80" />
    <div className="h-16 w-full rounded-2xl bg-slate-100/70" />
  </div>
);

export const ModalLoadingFallback: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm pointer-events-none">
    <div className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-3 text-xs font-orbitron font-bold text-[#0369A1] uppercase tracking-wider">
      <span className="w-4 h-4 rounded-full border-2 border-[#0369A1] border-t-transparent animate-spin" />
      <span>Loading NASA Module...</span>
    </div>
  </div>
);
