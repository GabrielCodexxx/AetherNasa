import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, X, Waves, Volume2 } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import type { GlobeViewMode } from './ThreeMoonGlobe';
import type { MoonquakeEvent } from '../types/moonquake';

export interface ScenarioStep {
  id: string;
  title: string;
  subtitle: string;
  targetEventId: string;
  viewMode: GlobeViewMode;
  year: string;
  magnitude: string;
  duration: string;
  highlightText: string;
  explanation: string[];
  takeaway: string;
  badgeColor: string;
  audioCategory: 'shallow' | 'artificial_impact' | 'deep';
  audioMag: number;
}

export const SCENARIOS: ScenarioStep[] = [
  {
    id: 'scenario-1',
    title: 'The Great Lunar Quake of 1972',
    subtitle: 'Shallow Tectonic Crust Contraction',
    targetEventId: 'mq-1972-03-13',
    viewMode: 'surface',
    year: 'March 13, 1972',
    magnitude: 'M 5.5',
    duration: '14.5 minutes',
    highlightText: 'The Moon is shrinking and cracking!',
    explanation: [
      'Over the last few billion years, the Moon’s interior slowly cooled. As it cooled, the entire Moon shrunk by about 100 meters (300 feet).',
      'This shrinkage forces brittle surface crust rocks to buckle and shove over one another, forming massive thrust cliffs called "lobate scarps".',
      'On March 13, 1972, one of these thrust faults ruptured, producing the largest moonquake ever recorded. It shook the Moon for almost 15 minutes straight!',
    ],
    takeaway: 'Key Lesson: Earthquakes stop in ~60 seconds because groundwater absorbs the shock. The Moon has no water, so it rings for 15+ minutes!',
    badgeColor: 'border-red-500 bg-red-950/80 text-red-300',
    audioCategory: 'shallow',
    audioMag: 5.5,
  },
  {
    id: 'scenario-2',
    title: 'The Apollo 13 Rocket Crash',
    subtitle: 'Artificial Kinetic Impact Experiment',
    targetEventId: 'mq-apollo13-sivb',
    viewMode: 'surface',
    year: 'April 14, 1970',
    magnitude: 'M 3.2',
    duration: '200 minutes (3.3 hrs!)',
    highlightText: '"The Moon was ringing like a bell for over 3 hours"',
    explanation: [
      'To calibrate the Apollo 12 seismometer, NASA mission control deliberately targeted the giant spent Saturn V third stage (S-IVB) to crash into the Moon.',
      'Weighing 14 tons and traveling at 5,600 mph (2.5 km/s), the rocket slammed into the surface 137 km from the Apollo 12 landing site.',
      'Scientists were stunned: the signal grew for 7 minutes, and vibrations reverberated across the bone-dry megaregolith for 3 hours and 20 minutes!',
    ],
    takeaway: 'Key Lesson: Human calibration impacts revealed that the lunar crust is a giant acoustic resonant cavity with near-zero attenuation (Q > 3,000).',
    badgeColor: 'border-cyan-500 bg-cyan-950/80 text-cyan-300',
    audioCategory: 'artificial_impact',
    audioMag: 3.2,
  },
  {
    id: 'scenario-3',
    title: 'Deep Tidal Gravitational Pull',
    subtitle: 'Earth-Moon Gravitational Tug-of-War',
    targetEventId: 'mq-deep-a1-1971',
    viewMode: 'structure',
    year: 'Recurring Monthly Cycle',
    magnitude: 'M 2.4',
    duration: '22.0 minutes',
    highlightText: 'Quakes triggered 800 km below the surface',
    explanation: [
      'Unlike shallow quakes that happen near the surface, deep moonquakes happen halfway to the center of the Moon (700 to 900 km down!).',
      'The Moon orbits Earth in an elliptical (oval) shape. Every 27 days, when the Moon reaches its closest point to Earth (perigee), Earth’s tidal gravity stretches the Moon’s deep molten boundary.',
      'Over 300 recurring deep "nests" fire moonquakes like clockwork every month in sync with Earth’s tidal pull.',
    ],
    takeaway: 'Key Lesson: By looking at the 3D internal cutaway, we see that deep quakes probe the boundary of the Moon’s ancient mantle and metallic core.',
    badgeColor: 'border-purple-500 bg-purple-950/80 text-purple-300',
    audioCategory: 'deep',
    audioMag: 2.4,
  },
  {
    id: 'scenario-4',
    title: 'Artemis Base Camp Seismic Hazard',
    subtitle: 'Engineering Risks for South Pole Astronauts',
    targetEventId: 'mq-artemis-southpole-2023',
    viewMode: 'surface',
    year: 'Artemis III Candidate Zone',
    magnitude: 'M 4.5',
    duration: '11.0 minutes',
    highlightText: 'Active thrust faults near Shackleton Crater',
    explanation: [
      'NASA’s Artemis program plans to build permanent human habitats at the lunar South Pole to harvest ice from dark craters.',
      'However, recent 2024 Lunar Reconnaissance Orbiter (LRO) imagery discovered young, active thrust fault scarps cutting right through candidate landing zones!',
      'A magnitude 5.0 quake shaking for 15 minutes could cause steep 30° crater walls to collapse in regolith landslides and fatigue habitat pressure seals.',
    ],
    takeaway: 'Key Lesson: Future Artemis habitats cannot be rigidly bolted to rock—they require flexible pneumatic damping isolation pads!',
    badgeColor: 'border-rose-500 bg-rose-950/80 text-rose-300',
    audioCategory: 'shallow',
    audioMag: 4.5,
  },
];

interface ScenarioWalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEvent: (event: MoonquakeEvent) => void;
  onChangeViewMode: (mode: GlobeViewMode) => void;
  events: MoonquakeEvent[];
}

export const ScenarioWalkthrough: React.FC<ScenarioWalkthroughProps> = ({
  isOpen,
  onClose,
  onSelectEvent,
  onChangeViewMode,
  events,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!isOpen) return null;

  const current = SCENARIOS[currentIdx];

  const handleApplyStep = (index: number) => {
    setCurrentIdx(index);
    const step = SCENARIOS[index];
    onChangeViewMode(step.viewMode);

    const target = events.find((e) => e.id === step.targetEventId);
    if (target) {
      onSelectEvent(target);
    }
    soundManager.sonifyMoonquake(step.audioMag, step.audioCategory);
  };

  const handleNext = () => {
    if (currentIdx < SCENARIOS.length - 1) {
      handleApplyStep(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      handleApplyStep(currentIdx - 1);
    }
  };

  return (
    <div className="fixed inset-x-4 bottom-4 md:inset-x-auto md:left-8 md:bottom-8 md:w-[540px] z-40 animate-fade-in select-none">
      <div className="bg-slate-950/90 backdrop-blur-2xl border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl shadow-cyan-950/50 flex flex-col gap-4 text-slate-100">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Scenario Walkthrough
            </span>
            <span className="text-xs font-mono text-slate-400">
              {currentIdx + 1} of {SCENARIOS.length}
            </span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenario Title & Metrics */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-lg font-bold font-mono text-white leading-tight">
              {current.title}
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${current.badgeColor}`}>
              {current.magnitude}
            </span>
          </div>
          <p className="text-xs font-mono text-cyan-400">
            {current.subtitle} • <span className="text-slate-400">{current.year}</span>
          </p>
        </div>

        {/* High-Impact Highlight Callout */}
        <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 flex items-center gap-3">
          <Waves className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="text-xs font-mono font-bold text-cyan-200">
            {current.highlightText}
          </span>
        </div>

        {/* Bullet Explanations */}
        <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans max-h-48 overflow-y-auto pr-1">
          {current.explanation.map((para, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
              <p>{para}</p>
            </div>
          ))}
        </div>

        {/* Key Educational Takeaway */}
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-amber-300/90">
          {current.takeaway}
        </div>

        {/* Bottom Actions: Sonify Button & Navigation Controls */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              soundManager.sonifyMoonquake(current.audioMag, current.audioCategory);
            }}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            title="Play authentic seismic acoustic translation"
          >
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>Play Audio</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
              aria-label="Previous Scenario"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Stepper Dots */}
            <div className="flex items-center gap-1.5 px-2">
              {SCENARIOS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyStep(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIdx ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Jump to Scenario ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentIdx === SCENARIOS.length - 1}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold disabled:opacity-30 disabled:pointer-events-none transition-all shadow-md shadow-cyan-500/20"
              aria-label="Next Scenario"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ScenarioWalkthrough;
