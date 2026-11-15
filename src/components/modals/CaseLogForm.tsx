import React from 'react';
import { Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { EarthSystemTrend } from '../../types/earthSystem';

export interface SubmitFeedback {
  kind: 'success' | 'warning';
  message: string;
}

interface CaseLogFormProps {
  callsign: string;
  notes: string;
  selectedTrend: EarthSystemTrend;
  currentYear: number;
  isSubmitting: boolean;
  feedback: SubmitFeedback | null;
  onChangeCallsign: (value: string) => void;
  onChangeNotes: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CaseLogForm: React.FC<CaseLogFormProps> = ({
  callsign,
  notes,
  selectedTrend,
  currentYear,
  isSubmitting,
  feedback,
  onChangeCallsign,
  onChangeNotes,
  onSubmit,
}) => {
  return (
    <div className="p-6 border-b border-slate-200/80 bg-slate-50/40">
      <form onSubmit={onSubmit} className="space-y-4">
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
              onChange={(e) => onChangeCallsign(e.target.value)}
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
            onChange={(e) => onChangeNotes(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0369A1]"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          {feedback ? (
            <span
              className={`text-xs font-bold flex items-center gap-1.5 ${
                feedback.kind === 'success' ? 'text-[#15803D]' : 'text-amber-700'
              }`}
            >
              {feedback.kind === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-400">
              Case telemetry is permanently logged
            </span>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !callsign.trim()}
            className="px-5 py-2 rounded-xl bg-[#15803D] hover:bg-[#116630] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm shadow-emerald-900/15 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Transmitting...' : 'File Detective Case'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
