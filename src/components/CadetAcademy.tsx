import React from 'react';
import { X, Award, CheckCircle2, Lock, BookOpen } from 'lucide-react';
import type { CadetBadge } from '../types/trainer';
import confetti from 'canvas-confetti';

interface CadetAcademyProps {
  badges: CadetBadge[];
  crisesResolved: number;
  missionTime: number;
  onClose: () => void;
}

export const CadetAcademy: React.FC<CadetAcademyProps> = ({
  badges,
  crisesResolved,
  missionTime,
  onClose,
}) => {
  // Determine cadet rank based on achievements
  const unlockedCount = badges.filter((b) => b.unlocked).length;
  let rank = 'Junior Cadet';
  if (unlockedCount >= 4) rank = 'Base Commander';
  else if (unlockedCount >= 3) rank = 'Systems Engineer';
  else if (unlockedCount >= 2) rank = 'Mission Specialist';

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 to-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                ASTRONAUT STEM ACADEMY
              </span>
              <h2 className="text-lg font-bold text-white">Cadet Flight Log & Achievement Badges</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Cadet Rank Card */}
          <div className="bg-gradient-to-r from-slate-950 to-slate-900 border border-cyan-500/30 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">CURRENT NASA FLIGHT RANK</span>
              <h3 className="text-2xl font-black text-white mt-0.5">{rank}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Crises Safely Handled: <span className="text-emerald-400 font-bold">{crisesResolved}</span> &bull; 
                Total Time in Space: <span className="text-cyan-300 font-bold">{Math.floor(missionTime / 60)}m {missionTime % 60}s</span>
              </p>
            </div>

            <button
              onClick={triggerConfetti}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white text-xs font-bold rounded-lg shadow-md transition-all"
            >
              Celebrate Progress 🎉
            </button>
          </div>

          {/* Badges Shelf */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>NASA Mission Badges ({unlockedCount}/{badges.length} Unlocked)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    b.unlocked
                      ? 'bg-slate-950/80 border-amber-500/40 shadow-sm'
                      : 'bg-slate-950/30 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        b.unlocked ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {b.unlocked ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                    </div>

                    <div>
                      <h5 className="text-sm font-bold text-white">{b.title}</h5>
                      <p className="text-xs text-slate-400 mt-0.5">{b.description}</p>
                      <div className="mt-2 text-[11px] text-cyan-400/90 italic bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
                        NASA Principle: {b.nasaPrinciple}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NASA STEM Knowledge Base */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>NASA Artemis & Mars Mission Concepts</span>
            </h4>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="border-b border-slate-800/80 pb-2">
                <span className="font-bold text-cyan-300">ECLSS (Life Support):</span>
                <p className="text-slate-400 mt-0.5">
                  The Environmental Control and Life Support System recycles human water and breath into fresh oxygen, enabling sustained human habitation without constant Earth resupply.
                </p>
              </div>
              <div className="border-b border-slate-800/80 pb-2">
                <span className="font-bold text-cyan-300">ISRU (In-Situ Resource Utilization):</span>
                <p className="text-slate-400 mt-0.5">
                  "Living off the land" by mining lunar crater ice for water and rocket fuel, and 3D printing habitats out of sintered planetary soil (regolith).
                </p>
              </div>
              <div>
                <span className="font-bold text-cyan-300">NASA DONKI (Space Weather Alerts):</span>
                <p className="text-slate-400 mt-0.5">
                  The Space Weather Database Of Notifications, Knowledge, Information tracks solar flares and coronal mass ejections that pose radiation risks to astronauts in deep space.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadetAcademy;
