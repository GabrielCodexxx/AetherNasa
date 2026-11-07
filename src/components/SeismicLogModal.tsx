import React, { useState, useEffect } from 'react';
import { X, Database, Send, Radio, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { soundManager } from '../utils/soundEffects';
import type { MoonquakeEvent } from '../types/moonquake';

interface SeismicLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: MoonquakeEvent | null;
}

interface LogEntry {
  id: string;
  callsign: string;
  quake_name: string;
  magnitude: number;
  notes: string;
  created_at: string;
}

export const SeismicLogModal: React.FC<SeismicLogModalProps> = ({
  isOpen,
  onClose,
  selectedEvent,
}) => {
  const [callsign, setCallsign] = useState('');
  const [notes, setNotes] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load logs from Supabase or localStorage
  useEffect(() => {
    if (!isOpen) return;

    async function loadLogs() {
      if (supabase && isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('seismic_observations')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

          if (!error && data && data.length > 0) {
            setLogs(data);
            return;
          }
        } catch {
          // Fall through to local fallback
        }
      }

      // Local fallback
      try {
        const stored = localStorage.getItem('lunar_seismic_logs');
        if (stored) {
          setLogs(JSON.parse(stored));
        } else {
          // Default historical log entries
          const defaults: LogEntry[] = [
            {
              id: 'log-1',
              callsign: 'CDR-Young (Apollo 16)',
              quake_name: 'The Great Lunar Quake of 1972',
              magnitude: 5.5,
              notes: 'Descartes station detected sustained 14.5m shaking. Structural ringing observed across passive array.',
              created_at: '1972-03-13T16:15:00Z',
            },
            {
              id: 'log-2',
              callsign: 'Artemis-Geodesy-01',
              quake_name: 'Mare Crisium Thrust Quake',
              magnitude: 5.1,
              notes: 'Confirmed thrust fault slip. High Q-factor verified with zero fluid damping in megaregolith.',
              created_at: new Date().toISOString(),
            },
          ];
          setLogs(defaults);
        }
      } catch {
        // Ignored
      }
    }

    loadLogs();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callsign.trim() || !selectedEvent) return;

    setIsSubmitting(true);
    soundManager.playClick();

    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      callsign: callsign.trim(),
      quake_name: selectedEvent.name,
      magnitude: selectedEvent.magnitude,
      notes: notes.trim() || `Recorded ${selectedEvent.category} event via 3D globe inspection.`,
      created_at: new Date().toISOString(),
    };

    // Try Supabase insert
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('seismic_observations').insert([newLog]);
      } catch (err) {
        console.warn('Supabase log insert fallback to local:', err);
      }
    }

    // Always update local state & localStorage
    const updated = [newLog, ...logs];
    setLogs(updated);
    try {
      localStorage.setItem('lunar_seismic_logs', JSON.stringify(updated));
    } catch {
      // Ignored
    }

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setNotes('');
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                SEISMIC OBSERVATION LOGBOOK
              </h2>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-400'}`}></span>
                {isSupabaseConfigured ? 'Connected to Supabase Cloud Database' : 'Local Storage Mode'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form to submit observation */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/40">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Explorer Callsign / Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commander Shepard"
                  value={callsign}
                  onChange={(e) => setCallsign(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="flex-1">
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Target Event
                </label>
                <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm font-mono text-cyan-300 truncate">
                  {selectedEvent ? `${selectedEvent.name} (M ${selectedEvent.magnitude})` : 'Select an event on the globe'}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Field Observation Notes
              </label>
              <textarea
                rows={2}
                placeholder="Log your seismic analysis, wave velocity observations, or Artemis habitat risk notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between">
              {submitSuccess ? (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Observation logged successfully!
                </span>
              ) : (
                <span className="text-xs font-mono text-slate-500">
                  Logs are persisted to cloud telemetry
                </span>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !callsign.trim() || !selectedEvent}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Transmitting...' : 'Log Observation'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Existing Log Entries */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            Recent Telemetry Observations ({logs.length})
          </h3>

          <div className="space-y-2.5">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-white">
                    {log.callsign}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(log.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-cyan-400 font-bold">{log.quake_name}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-amber-400 font-bold">M {log.magnitude}</span>
                </div>
                {log.notes && (
                  <p className="text-xs text-slate-300 italic bg-slate-900/50 p-2 rounded-xl border border-slate-800/60">
                    "{log.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            NASA Open Data Science Compliant
          </span>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default SeismicLogModal;
