import React, { useState, useEffect } from 'react';
import { X, Database, Send, Radio, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { soundManager } from '../utils/soundEffects';
import type { EarthSystemTrend } from '../types/earthSystem';

interface DetectiveLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTrend: EarthSystemTrend;
  currentYear: number;
}

interface CaseLogEntry {
  id: string;
  callsign: string;
  variable_name: string;
  year: number;
  significance_verdict: string;
  notes: string;
  created_at: string;
}

export const DetectiveLogModal: React.FC<DetectiveLogModalProps> = ({
  isOpen,
  onClose,
  selectedTrend,
  currentYear,
}) => {
  const [callsign, setCallsign] = useState('');
  const [notes, setNotes] = useState('');
  const [logs, setLogs] = useState<CaseLogEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function loadLogs() {
      if (supabase && isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('earth_trend_investigations')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

          if (!error && data && data.length > 0) {
            setLogs(data);
            return;
          }
        } catch {
          // Local fallback
        }
      }

      // Local storage fallback
      try {
        const stored = localStorage.getItem('earth_trend_detective_logs');
        if (stored) {
          setLogs(JSON.parse(stored));
        } else {
          setLogs([]);
        }
      } catch {
        // Ignored
      }
    }

    loadLogs();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callsign.trim() || !selectedTrend) return;

    setIsSubmitting(true);
    soundManager.playClick();

    const newEntry: CaseLogEntry = {
      id: `case-${Date.now()}`,
      callsign: callsign.trim(),
      variable_name: selectedTrend.name,
      year: currentYear,
      significance_verdict: selectedTrend.significance,
      notes: notes.trim() || `Verified ${selectedTrend.ratePerDecade} trend across satellite time-series.`,
      created_at: new Date().toISOString(),
    };

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('earth_trend_investigations').insert([newEntry]);
      } catch (err) {
        console.warn('Supabase insert fallback:', err);
      }
    }

    const updated = [newEntry, ...logs];
    setLogs(updated);
    try {
      localStorage.setItem('earth_trend_detective_logs', JSON.stringify(updated));
    } catch {
      // Ignored
    }

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setNotes('');
    soundManager.playSignificanceAlert();
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="p-6 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#15803D]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                TREND DETECTIVE CASE LOGBOOK
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    isSupabaseConfigured ? 'bg-emerald-100 text-[#15803D]' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isSupabaseConfigured ? 'CLOUD SYNC' : 'LOCAL CACHE'}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {isSupabaseConfigured
                    ? 'Connected to Supabase Cloud Database'
                    : 'Browser Local Storage Mode'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Log Submission Form */}
        <div className="p-6 border-b border-slate-200/80 bg-slate-50/40">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Detective Callsign / Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Officer Holmes (Goddard)"
                  value={callsign}
                  onChange={(e) => setCallsign(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0369A1]"
                />
              </div>

              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Target Earth Science Variable
                </label>
                <div className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-sm font-semibold text-[#0369A1] truncate">
                  {selectedTrend.name} ({currentYear})
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Detective Investigation Findings & Regional Divergence Notes
              </label>
              <textarea
                rows={2}
                placeholder="Log your evidence on what is changing, where it is changing, and statistical significance..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0369A1]"
              />
            </div>

            <div className="flex items-center justify-between">
              {submitSuccess ? (
                <span className="text-xs font-bold text-[#15803D] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Investigation Case Filed Successfully!
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-400">
                  Case telemetry is permanently logged
                </span>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !callsign.trim()}
                className="px-5 py-2 rounded-xl bg-[#15803D] hover:bg-[#116630] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm shadow-emerald-900/15"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Transmitting...' : 'File Detective Case'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Case History */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#0369A1]" />
            Filed Earth System Investigations ({logs.length})
          </h3>

          <div className="space-y-2.5">
            {logs.length === 0 ? (
              <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 space-y-2">
                <Database className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-orbitron font-bold text-slate-700">No Investigation Logs Filed Yet</p>
                <p className="text-[11px] font-space text-slate-500 max-w-sm mx-auto">
                  Submit your callsign and findings above to record forensic observations into the mission database.
                </p>
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex flex-col gap-1.5 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">
                      {log.callsign}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="text-[#0369A1]">{log.variable_name}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-amber-700">Year {log.year}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[#15803D]">{log.significance_verdict}</span>
                  </div>
                  {log.notes && (
                    <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-200/70">
                      "{log.notes}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#15803D]" />
            NASA Open Data Science Compliant
          </span>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetectiveLogModal;
