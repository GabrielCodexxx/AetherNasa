import React, { useState } from 'react';
import { X, GraduationCap, BookOpen, Users, HelpCircle, Printer, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface TeachersGuideModalProps {
  onClose: () => void;
}

export const TeachersGuideModal: React.FC<TeachersGuideModalProps> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'lesson_plan' | 'discussion' | 'curriculum'>('overview');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border-2 border-emerald-500/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-950 to-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 tracking-wider">
                NASA SPACE APPS EDUCATOR RESOURCE
              </span>
              <h2 className="text-lg font-black text-white tracking-wide">
                Teacher's Guide: Rover Route Planner
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              title="Print Curriculum Worksheet"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/60 px-6 gap-2">
          {[
            { id: 'overview', label: '1. Learning Goals', icon: BookOpen },
            { id: 'lesson_plan', label: '2. 45-Min Lesson Plan', icon: Users },
            { id: 'discussion', label: '3. Discussion Prompts', icon: HelpCircle },
            { id: 'curriculum', label: '4. STEM Standards', icon: CheckCircle2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundManager.playClickTile();
                  setActiveSection(tab.id as typeof activeSection);
                }}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all ${
                  isActive
                    ? 'border-emerald-400 text-emerald-300 bg-emerald-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-300">
          {activeSection === 'overview' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                  TARGET AUDIENCE: 4TH - 6TH GRADE SCIENCE & COMPUTER SCIENCE
                </span>
                <h3 className="text-base font-bold text-white mt-1 mb-2">
                  Algorithmic Thinking Meets Planetary Exploration
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Rover Route Planner</strong> turns abstract computer science concepts (algorithms, 
                  sequencing, optimization, and debugging) into an authentic aerospace mission. 
                  Students experience firsthand why rovers cannot be driven with a joystick in real-time, and 
                  must instead execute carefully pre-calculated command sequences.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-emerald-300 mb-1">1. Algorithmic Sequencing</h4>
                  <p className="text-slate-400">
                    Students construct step-by-step sequential programs, learning that the order of commands directly dictates the outcome.
                  </p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-emerald-300 mb-1">2. Resource Constraints & Math</h4>
                  <p className="text-slate-400">
                    Basic mental arithmetic: subtracting tile costs (-1, -2, -3) and calculating positive recharge bonuses (+2).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'lesson_plan' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">45-Minute Classroom Activity: "Mission Control & Rover"</h3>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Class Activity
                  </span>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 font-bold">
                      1
                    </span>
                    <div>
                      <strong>Solo Flight Training (15 mins):</strong> Students complete Levels 1–5 independently on laptops or tablets to master basalt, boulders, and loose regolith mechanics.
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 font-bold">
                      2
                    </span>
                    <div>
                      <strong>The Dual-Command Roleplay (20 mins):</strong> Students pair up for Level 6. Give each pair a printed grid:
                      <ul className="list-disc list-inside text-slate-400 mt-1 space-y-1">
                        <li><strong>Student A acts as "Houston Mission Control"</strong>: Solves the route on paper, writing down coordinates and battery math.</li>
                        <li><strong>Student B acts as the "Autonomous Lunar Rover"</strong>: Inputs Mission Control’s code sequence on the screen and presses Transmit to see if the math was correct.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 font-bold">
                      3
                    </span>
                    <div>
                      <strong>Engineering Debrief (10 mins):</strong> Discuss which routes succeeded, why battery brownouts happened, and how teams iterated after system failures.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'discussion' && (
            <div className="space-y-3">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white">Classroom Discussion Questions</h4>

                <div className="space-y-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <strong className="text-amber-300 block mb-1">Q1: "Why doesn't NASA just drive rovers in a straight line to their destination?"</strong>
                    <p className="text-slate-400">
                      <em>Expected Insight:</em> Straight lines often cross dangerous boulder fields or deep loose regolith where wheels can get stuck forever. NASA uses LRO satellite maps to plan circuitous, safe paths.
                    </p>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <strong className="text-amber-300 block mb-1">Q2: "Why can't astronauts on Earth steer a rover with a joystick in real-time?"</strong>
                    <p className="text-slate-400">
                      <em>Expected Insight:</em> Radio signals travel at the speed of light. On the Moon, there is a ~2.6-second round-trip delay; on Mars, it takes 5 to 20 minutes! Driving with a joystick would cause rovers to crash before engineers saw the rock.
                    </p>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <strong className="text-amber-300 block mb-1">Q3: "When is it worth risking battery power to take a detour for Water Ice?"</strong>
                    <p className="text-slate-400">
                      <em>Expected Insight:</em> Evaluating risk vs. reward. If you only have just enough battery to reach the lander, taking the detour causes mission failure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'curriculum' && (
            <div className="space-y-3">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-white">Educational Standards Alignment</h4>

                <div className="space-y-2 text-xs">
                  <div className="border-b border-slate-800/80 pb-2">
                    <span className="font-bold text-emerald-400">CSTA K-12 Computer Science Standards:</span>
                    <p className="text-slate-400 mt-0.5">
                      <strong>1B-AP-10:</strong> Create programs with sequences and simple loops to express ideas or address problems.
                    </p>
                  </div>
                  <div className="border-b border-slate-800/80 pb-2">
                    <span className="font-bold text-emerald-400">Next Generation Science Standards (NGSS):</span>
                    <p className="text-slate-400 mt-0.5">
                      <strong>3-5-ETS1-2:</strong> Generate and compare multiple possible solutions to a problem based on how well each is likely to meet the criteria and constraints.
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-400">Constructive Failure Principle:</span>
                    <p className="text-slate-400 mt-0.5">
                      Emphasizes iterative design—analyzing why an algorithm failed and refining the sequence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Designed for 4th - 6th Grade Science & Coding
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            Return to Mission
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeachersGuideModal;
