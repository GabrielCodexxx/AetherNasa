import React from 'react';
import { Database, Radio } from 'lucide-react';
import type { CaseLogEntry } from '../../services/supabase';

interface CaseLogHistoryProps {
  logs: CaseLogEntry[];
  isLoading: boolean;
}

export const CaseLogHistory: React.FC<CaseLogHistoryProps> = ({ logs, isLoading }) => {
  return (
    <div className="p-6 overflow-y-auto flex-1 space-y-3">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
        <Radio className="w-3.5 h-3.5 text-[#0369A1]" />
        Filed Earth System Investigations ({logs.length})
      </h3>

      <div className="space-y-2.5">
        {isLoading && logs.length === 0 ? (
          <div className="text-center py-8 text-xs font-space text-slate-500">
            Synchronizing investigation logbook...
          </div>
        ) : logs.length === 0 ? (
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
                <span className="font-extrabold text-sm text-slate-900">{log.callsign}</span>
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
  );
};
