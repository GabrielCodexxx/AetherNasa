import type { CaseLogEntry, SyncMode } from '../../services/supabase';
import type { EarthSystemTrend } from '../../types/earthSystem';

export const LOGBOOK_MODE_META: Record<
  SyncMode,
  { badge: string; badgeClass: string; desc: string }
> = {
  cloud: {
    badge: 'CLOUD SYNC',
    badgeClass: 'bg-emerald-100 text-[#15803D]',
    desc: 'Connected to Supabase Cloud Database',
  },
  fallback: {
    badge: 'LOCAL FALLBACK',
    badgeClass: 'bg-amber-100 text-amber-800',
    desc: 'Cloud unreachable — using local cache',
  },
  local: {
    badge: 'LOCAL CACHE',
    badgeClass: 'bg-amber-100 text-amber-800',
    desc: 'Browser Local Storage Mode',
  },
};

export function buildCaseLogEntry(
  callsign: string,
  notes: string,
  trend: EarthSystemTrend,
  currentYear: number
): CaseLogEntry {
  return {
    id: `case-${Date.now()}`,
    callsign: callsign.trim(),
    variable_name: trend.name,
    year: currentYear,
    significance_verdict: trend.significance,
    notes: notes.trim() || `Verified ${trend.ratePerDecade} trend across satellite time-series.`,
    created_at: new Date().toISOString(),
  };
}
