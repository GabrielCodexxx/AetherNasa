import React from 'react';
import { BookOpen, ShieldCheck } from 'lucide-react';
import { NASA_FLEET } from '../../utils/earthSystemData';

export type EarthScienceTabId = 'divergence' | 'significance' | 'fleet';

interface EarthScienceTabsProps {
  activeTab: EarthScienceTabId;
}

const SIGNIFICANCE_CARDS = [
  {
    title: '1. The p-value',
    accent: 'text-[#0369A1]',
    body: (
      <>
        If <code className="text-[#0369A1] font-bold">p &lt; 0.05</code>, there is less than a 5% chance the trend is noise. All 5 Earth System Detective trends exceed{' '}
        <code className="text-[#15803D] font-bold">p &lt; 0.001</code> (99.9% confidence).
      </>
    ),
  },
  {
    title: '2. Mann-Kendall Test',
    accent: 'text-amber-700',
    body: 'A non-parametric statistical test that measures monotonic trends without assuming data is normally distributed.',
  },
  {
    title: '3. Signal-to-Noise (S/N)',
    accent: 'text-indigo-700',
    body: 'Filters out decadal ocean oscillations like El Niño (ENSO) and Pacific Decadal Oscillation (PDO) to isolate the true anthropogenic signal.',
  },
];

export const EarthScienceTabs: React.FC<EarthScienceTabsProps> = ({ activeTab }) => {
  return (
    <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed">
      {activeTab === 'divergence' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 flex items-start gap-3.5">
            <BookOpen className="w-5 h-5 text-[#0369A1] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                "A variable can trend one way in one region and the opposite in another..."
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Earth's environmental system is deeply interconnected. A single global forcing (such as greenhouse warming or ocean heat redistribution) creates contrasting regional footprints.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h4 className="font-extrabold text-[#0369A1] text-xs uppercase tracking-wide">
                Case Study A: Arctic Greening vs. Amazon Drying
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                MODIS NDVI satellite data detects <strong>increased greening in the Arctic tundra</strong> as melting permafrost and longer summers allow shrubs to spread. Meanwhile, the same warming trend accelerates <strong>canopy drying and severe wildfire loss in the Amazon rainforest</strong>. Both regional trends are driven by global atmospheric warming, yet move in completely opposite directions!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h4 className="font-extrabold text-amber-700 text-xs uppercase tracking-wide">
                Case Study B: Sea Level Rise vs. Post-Glacial Rebound
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                While global mean sea level is rising at 4.2 mm/year (submerging islands and coastal plains in the tropical Pacific), some high-latitude coastlines in Alaska and Scandinavia measure <em>falling relative sea levels</em> because land relieved of ancient ice weight is rebounding upwards faster than the water is rising!
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'significance' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
            <h3 className="font-extrabold text-[#15803D] text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#15803D]" />
              What Makes a Trend "Statistically Significant"?
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              In Earth science, weather is noisy. A single cold winter or rainy season does not mean climate has shifted. To prove a trend is scientifically significant, NASA scientists test whether the slope could have occurred purely by random chance.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            {SIGNIFICANCE_CARDS.map((card) => (
              <div key={card.title} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className={`font-extrabold block mb-1 uppercase text-[10px] ${card.accent}`}>
                  {card.title}
                </span>
                <p className="text-slate-600 text-xs">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'fleet' && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-xs text-slate-500 font-medium">
            NASA’s Earth Observing System (EOS) operates continuous constellations measuring the atmosphere, oceans, biosphere, and ice sheets:
          </p>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            {NASA_FLEET.map((sat) => (
              <div key={sat.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">{sat.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-[#15803D] border border-emerald-200">
                    {sat.status}
                  </span>
                </div>
                <p className="text-[#0369A1] text-[11px] font-semibold">
                  Launched {sat.launchYear} • Orbit {sat.orbitAltitudeKm} km
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {sat.primaryMission}
                </p>
                <p className="text-slate-400 text-[10px]">
                  Sensors: {sat.sensorPayload}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
