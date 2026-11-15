import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { readLocalJson, writeLocalJson } from './storage';

const DEFAULT_SUPABASE_URL = 'https://toakvrrofklcjwyjahcp.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_nNO4YyyJQVGY9avCYeeqSQ_R9TwwUDM';
const PLACEHOLDER_VALUES = new Set(['https://your-project.supabase.co', 'your-anon-key']);
const LEADERBOARD_KEY = 'aether_local_leaderboard';
const INVESTIGATIONS_KEY = 'earth_trend_detective_logs';
const INVESTIGATION_COLS = 'id, callsign, variable_name, year, significance_verdict, notes, created_at';

function resolveEnvValue(candidates: Array<string | undefined>, fallback: string): string {
  for (const raw of candidates) {
    const val = raw?.trim();
    if (val && !PLACEHOLDER_VALUES.has(val)) return val;
  }
  return fallback;
}

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

const supabaseUrl = resolveEnvValue(
  [import.meta.env.VITE_SUPABASE_URL, import.meta.env.NEXT_PUBLIC_SUPABASE_URL],
  DEFAULT_SUPABASE_URL
);
const supabaseAnonKey = resolveEnvValue(
  [
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  ],
  DEFAULT_SUPABASE_PUBLISHABLE_KEY
);

export const isSupabaseConfigured = Boolean(isValidHttpUrl(supabaseUrl) && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type SyncMode = 'cloud' | 'local' | 'fallback';

export interface CaseLogEntry {
  id: string;
  callsign: string;
  variable_name: string;
  year: number;
  significance_verdict: string;
  notes: string;
  created_at: string;
}

export interface LeaderboardEntry {
  id?: string;
  cadet_callsign: string;
  outpost_type: 'lunar' | 'mars';
  survival_time_seconds: number;
  crises_resolved: number;
  final_stability_score: number;
  submitted_at?: string;
}

function saveLocalInvestigation(entry: CaseLogEntry): void {
  const existing = readLocalJson<CaseLogEntry[]>(INVESTIGATIONS_KEY, []);
  const deduped = [entry, ...existing.filter((item) => item.id !== entry.id)].slice(0, 50);
  writeLocalJson(INVESTIGATIONS_KEY, deduped);
}

export async function fetchInvestigationLogs(): Promise<{
  logs: CaseLogEntry[];
  mode: SyncMode;
  error?: string;
}> {
  const localLogs = readLocalJson<CaseLogEntry[]>(INVESTIGATIONS_KEY, []);
  if (!supabase) return { logs: localLogs, mode: 'local' };

  try {
    const { data, error } = await supabase
      .from('earth_trend_investigations')
      .select(INVESTIGATION_COLS)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.warn('Supabase investigations fetch error:', error.message);
      return { logs: localLogs, mode: 'fallback', error: error.message };
    }
    return { logs: (data ?? []) as CaseLogEntry[], mode: 'cloud' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Network error';
    console.warn('Supabase investigations fetch exception:', msg);
    return { logs: localLogs, mode: 'fallback', error: msg };
  }
}

export async function submitInvestigationLog(entry: CaseLogEntry): Promise<{
  success: boolean;
  mode: SyncMode;
  entry: CaseLogEntry;
  error?: string;
}> {
  if (!supabase) {
    saveLocalInvestigation(entry);
    return { success: true, mode: 'local', entry };
  }

  try {
    const { data, error } = await supabase
      .from('earth_trend_investigations')
      .insert([entry])
      .select(INVESTIGATION_COLS)
      .single();

    if (error) {
      console.error('Supabase investigation insert error:', error.message);
      saveLocalInvestigation(entry);
      return { success: false, mode: 'fallback', entry, error: error.message };
    }

    const saved = (data as CaseLogEntry) ?? entry;
    saveLocalInvestigation(saved);
    return { success: true, mode: 'cloud', entry: saved };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Network error';
    console.error('Supabase investigation insert exception:', msg);
    saveLocalInvestigation(entry);
    return { success: false, mode: 'fallback', entry, error: msg };
  }
}

function saveLocalLeaderboard(entry: Omit<LeaderboardEntry, 'id' | 'submitted_at'>): void {
  const local = readLocalJson<LeaderboardEntry[]>(LEADERBOARD_KEY, []);
  local.push({ ...entry, id: `local-${Date.now()}`, submitted_at: new Date().toISOString() });
  local.sort((a, b) => b.final_stability_score - a.final_stability_score);
  writeLocalJson(LEADERBOARD_KEY, local.slice(0, 20));
}

export async function submitLeaderboardScore(entry: Omit<LeaderboardEntry, 'id' | 'submitted_at'>) {
  if (!supabase) {
    saveLocalLeaderboard(entry);
    return { success: true, mode: 'local' as const };
  }

  const { data, error } = await supabase.from('global_leaderboard').insert([entry]).select();
  if (error) {
    console.error('Supabase save error:', error);
    saveLocalLeaderboard(entry);
    return { success: false, mode: 'fallback' as const, error };
  }
  return { success: true, data, mode: 'supabase' as const };
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const local = readLocalJson<LeaderboardEntry[]>(LEADERBOARD_KEY, []);
  if (!supabase) return local;

  const { data, error } = await supabase
    .from('global_leaderboard')
    .select('*')
    .order('final_stability_score', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return local;
  }
  return data || [];
}
