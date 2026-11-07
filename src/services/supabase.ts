import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Leaderboard entry type
export interface LeaderboardEntry {
  id?: string;
  cadet_callsign: string;
  outpost_type: 'lunar' | 'mars';
  survival_time_seconds: number;
  crises_resolved: number;
  final_stability_score: number;
  submitted_at?: string;
}

// Service helper to save scores to Supabase
export async function submitLeaderboardScore(entry: Omit<LeaderboardEntry, 'id' | 'submitted_at'>) {
  if (!supabase) {
    // Save to localStorage as fallback
    try {
      const local = JSON.parse(localStorage.getItem('aether_local_leaderboard') || '[]');
      local.push({ ...entry, id: `local-${Date.now()}`, submitted_at: new Date().toISOString() });
      local.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.final_stability_score - a.final_stability_score);
      localStorage.setItem('aether_local_leaderboard', JSON.stringify(local.slice(0, 20)));
    } catch {
      // Ignored
    }
    return { success: true, mode: 'local' };
  }

  const { data, error } = await supabase.from('global_leaderboard').insert([entry]).select();
  if (error) {
    console.error('Supabase save error:', error);
    return { success: false, error };
  }
  return { success: true, data, mode: 'supabase' };
}

// Fetch top scores
export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!supabase) {
    try {
      return JSON.parse(localStorage.getItem('aether_local_leaderboard') || '[]');
    } catch {
      return [];
    }
  }

  const { data, error } = await supabase
    .from('global_leaderboard')
    .select('*')
    .order('final_stability_score', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
  return data || [];
}
