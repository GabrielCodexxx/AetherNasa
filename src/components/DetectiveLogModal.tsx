import React, { useState, useEffect, useRef } from 'react';
import { Database, ShieldCheck } from 'lucide-react';
import {
  isSupabaseConfigured,
  fetchInvestigationLogs,
  submitInvestigationLog,
  type CaseLogEntry,
  type SyncMode,
} from '../services/supabase';
import { soundManager } from '../utils/soundEffects';
import type { EarthSystemTrend } from '../types/earthSystem';
import { ModalShell } from './modals/ModalShell';
import { CaseLogForm, type SubmitFeedback } from './modals/CaseLogForm';
import { CaseLogHistory } from './modals/CaseLogHistory';
import { LOGBOOK_MODE_META, buildCaseLogEntry } from './modals/logbookMeta';

interface DetectiveLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTrend: EarthSystemTrend;
  currentYear: number;
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
  const [syncMode, setSyncMode] = useState<SyncMode>(isSupabaseConfigured ? 'cloud' : 'local');
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<SubmitFeedback | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current !== null) window.clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    void Promise.resolve().then(() => {
      if (!cancelled) setIsLoadingLogs(true);
    });

    fetchInvestigationLogs().then((result) => {
      if (cancelled) return;
      setLogs(result.logs);
      setSyncMode(result.mode);
      setIsLoadingLogs(false);
    });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callsign.trim() || !selectedTrend) return;

    setIsSubmitting(true);
    soundManager.playClick();

    const newEntry = buildCaseLogEntry(callsign, notes, selectedTrend, currentYear);
    const result = await submitInvestigationLog(newEntry);
    setLogs((prev) => [result.entry, ...prev.filter((item) => item.id !== result.entry.id)]);
    setSyncMode(result.mode);
    setIsSubmitting(false);

    if (result.success) {
      setNotes('');
      soundManager.playSignificanceAlert();
      setFeedback({
        kind: 'success',
        message:
          result.mode === 'cloud'
            ? 'Investigation Case Filed to Cloud!'
            : 'Investigation Saved to Local Cache!',
      });
    } else {
      setFeedback({
        kind: 'warning',
        message: `Cloud sync failed (${result.error ?? 'error'}) — cached locally.`,
      });
    }

    if (feedbackTimerRef.current !== null) window.clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = window.setTimeout(() => setFeedback(null), 4000);
  };

  const modeMeta = LOGBOOK_MODE_META[syncMode];

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      panelClassName="relative w-full max-w-3xl max-h-[90vh] bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800"
      headerClassName="p-6 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/70"
      closeIconClassName="w-6 h-6"
      headerMeta={{
        icon: <Database className="w-5 h-5" />,
        iconClassName:
          'w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#15803D]',
        title: 'TREND DETECTIVE CASE LOGBOOK',
        subtitle: (
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${modeMeta.badgeClass}`}>
              {modeMeta.badge}
            </span>
            <span className="text-xs text-slate-500 font-medium">{modeMeta.desc}</span>
          </div>
        ),
      }}
      footer={
        <>
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
        </>
      }
    >
      <CaseLogForm
        callsign={callsign}
        notes={notes}
        selectedTrend={selectedTrend}
        currentYear={currentYear}
        isSubmitting={isSubmitting}
        feedback={feedback}
        onChangeCallsign={setCallsign}
        onChangeNotes={setNotes}
        onSubmit={handleSubmit}
      />
      <CaseLogHistory logs={logs} isLoading={isLoadingLogs} />
    </ModalShell>
  );
};

export default DetectiveLogModal;
