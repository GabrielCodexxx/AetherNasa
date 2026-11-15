import React, { useState } from 'react';
import { Printer } from 'lucide-react';
import type { EarthSystemTrend, HotspotMarker } from '../types/earthSystem';
import { soundManager } from '../utils/soundEffects';
import { ModalShell } from './modals/ModalShell';
import { ForensicMemoBody } from './modals/ForensicMemoBody';

interface ForensicReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  trend: EarthSystemTrend;
  selectedHotspot: HotspotMarker | null;
  currentYear: number;
}

export const ForensicReportModal: React.FC<ForensicReportModalProps> = ({
  isOpen,
  onClose,
  trend,
  selectedHotspot,
  currentYear,
}) => {
  const [reportDate] = useState(() => new Date().toLocaleDateString());

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  const pt =
    trend.timeSeries.find((p) => p.year === currentYear) ||
    trend.timeSeries[trend.timeSeries.length - 1];

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      backdropClassName="bg-slate-950/70 select-none"
      panelClassName="w-full max-w-3xl bg-white border border-slate-300 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col gap-6 text-slate-800 max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-0"
      headerClassName="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden"
      closeButtonClassName="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all"
      closeIconClassName="w-4 h-4"
      headerContent={
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-orbitron font-bold uppercase bg-sky-100 text-[#0369A1] border border-sky-200">
            OFFICIAL TECHNICAL MEMO
          </span>
          <span className="text-xs font-space text-slate-400 font-medium">
            NASA Space Apps 2026 Investigation Briefing
          </span>
        </div>
      }
      headerActions={
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0369A1] hover:bg-[#025684] text-white text-xs font-orbitron font-bold transition-all shadow-sm"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save PDF</span>
        </button>
      }
      footerClassName="pt-2 border-t border-slate-200 flex justify-end gap-2 print:hidden"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-orbitron font-bold transition-all"
          >
            Close Memo
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-[#0369A1] hover:bg-[#025684] text-white text-xs font-orbitron font-bold transition-all shadow-sm"
          >
            Print Memo
          </button>
        </>
      }
    >
      <ForensicMemoBody
        trend={trend}
        selectedHotspot={selectedHotspot}
        currentYear={currentYear}
        point={pt}
        reportDate={reportDate}
      />
    </ModalShell>
  );
};

export default ForensicReportModal;
