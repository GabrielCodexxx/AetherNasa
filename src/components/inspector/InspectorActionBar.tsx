import type { FC } from 'react';
import { FileText, Volume2 } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface InspectorActionBarProps {
  isPlayingAudio: boolean;
  onPlaySonification: () => void;
  onOpenReportModal?: () => void;
}

/** Bottom action bar for acoustic trend sonification and NASA briefing report export. */
export const InspectorActionBar: FC<InspectorActionBarProps> = ({
  isPlayingAudio,
  onPlaySonification,
  onOpenReportModal,
}) => {
  return (
    <div className="pt-4 border-t border-slate-200 space-y-2">
      <div className="flex items-center gap-2">
        <button
          onClick={onPlaySonification}
          className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-[#0369A1] to-[#15803D] hover:opacity-95 text-white font-orbitron font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-900/15 active:scale-98"
        >
          <Volume2 className="w-4 h-4" />
          <span>{isPlayingAudio ? 'Synthesizing...' : 'Acoustic Sonification'}</span>
          {isPlayingAudio && (
            <div className="flex items-center gap-0.5 ml-1">
              <span className="w-1 h-3 bg-white animate-pulse" />
              <span className="w-1 h-4 bg-white animate-pulse delay-75" />
              <span className="w-1 h-2 bg-white animate-pulse delay-150" />
            </div>
          )}
        </button>

        {onOpenReportModal && (
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenReportModal();
            }}
            className="p-2.5 rounded-2xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#0369A1] border border-slate-200 hover:border-sky-300 transition-all shadow-xs"
            title="Generate Official NASA Technical Briefing Memo"
          >
            <FileText className="w-4 h-4 text-[#0369A1]" />
          </button>
        )}
      </div>
    </div>
  );
};
