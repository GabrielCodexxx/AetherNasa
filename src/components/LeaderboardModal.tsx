import React, { useState, useEffect } from 'react';
import { X, Trophy, Send, Check, Loader2 } from 'lucide-react';
import { fetchLeaderboard, submitLeaderboardScore, type LeaderboardEntry } from '../services/supabase';
import { soundManager } from '../utils/soundEffects';

interface LeaderboardModalProps {
  onClose: () => void;
  currentScore: {
    outpostType: 'lunar' | 'mars';
    survivalTime: number;
    crisesResolved: number;
    stabilityScore: number;
  };
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  onClose,
  currentScore,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [callsign, setCallsign] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchLeaderboard();
      setEntries(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callsign.trim() || submitting || submitted) return;

    setSubmitting(true);
    soundManager.playClickTile();

    await submitLeaderboardScore({
      cadet_callsign: callsign.trim().toUpperCase(),
      outpost_type: currentScore.outpostType,
      survival_time_seconds: currentScore.survivalTime,
      crises_resolved: currentScore.crisesResolved,
      final_stability_score: currentScore.stabilityScore,
    });

    soundManager.playSuccess();
    setSubmitted(true);
    setSubmitting(false);

    // Refresh rankings
    const updated = await fetchLeaderboard();
    setEntries(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-yellow-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950/60 to-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-yellow-400">
                SUPABASE POWERED LEADERBOARD
              </span>
              <h2 className="text-lg font-bold text-white">Global Cadet Rankings</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Submit Run Form */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-950/50">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full">
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Transmit Current Score to NASA Supabase Database:
                </label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="ENTER CALLSIGN (e.g. ARTEMIS-1)"
                  value={callsign}
                  onChange={(e) => setCallsign(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={!callsign.trim() || submitting}
                className="w-full sm:w-auto mt-4 sm:mt-5 flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-md transition-all font-mono"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>TRANSMIT SCORE</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
              <Check className="w-5 h-5" /> Score transmitted successfully to Supabase!
            </div>
          )}
        </div>

        {/* Rankings Table */}
        <div className="p-6 max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
              <span>Fetching live rankings from Supabase...</span>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No flight records found. Be the first cadet to submit your score!
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry, idx) => (
                <div
                  key={entry.id || idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 text-center font-bold ${
                        idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-500' : 'text-slate-500'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-white tracking-wide">{entry.cadet_callsign}</span>
                      <span className="text-[10px] text-slate-400 block uppercase">
                        {entry.outpost_type} OUTPOST &bull; {entry.crises_resolved} CRISES
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-emerald-400 font-bold text-sm">{entry.final_stability_score}%</span>
                    <span className="text-[10px] text-slate-500 block">
                      {Math.floor(entry.survival_time_seconds / 60)}m {entry.survival_time_seconds % 60}s
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;
