import type { PlanetData } from '../../types/earthSystem';

export const CAPSULE_SURFACE_CLASS =
  'pointer-events-auto flex items-center bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl shadow-xl shadow-slate-200/50';

export const VIEWPORT_ICON_BTN_CLASS =
  'p-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 hover:text-[#0369A1] hover:bg-sky-50 transition-all shadow-xs';

export const VIEWPORT_TOGGLE_BASE_CLASS =
  'flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs transition-all';

export const VIEWPORT_TOGGLE_INACTIVE_CLASS =
  'bg-slate-50 text-slate-600 border border-slate-200/80 hover:text-slate-900';

export const PLANET_OPTION_LABELS: Record<string, string> = {
  sun: '☀️ Sun',
  earth: '🌍 Earth',
  mars: '🔴 Mars',
  jupiter: '🪐 Jupiter',
  saturn: '🪐 Saturn',
};

export function getPlanetOptionLabel(planet: PlanetData): string {
  return PLANET_OPTION_LABELS[planet.id] ?? planet.name;
}
