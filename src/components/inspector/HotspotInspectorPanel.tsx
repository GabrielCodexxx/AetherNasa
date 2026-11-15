import type { FC } from 'react';
import { MapPin, Radio, Volume2 } from 'lucide-react';
import type { HotspotMarker } from '../../types/earthSystem';
import { soundManager } from '../../utils/soundEffects';

interface HotspotInspectorPanelProps {
  hotspot: HotspotMarker;
  currentValue: number;
  onClearHotspot: () => void;
}

/** Displays regional telemetry beacon details when a 3D globe hotspot needle is selected. */
export const HotspotInspectorPanel: FC<HotspotInspectorPanelProps> = ({
  hotspot,
  currentValue,
  onClearHotspot,
}) => {
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-orbitron font-bold bg-sky-50 text-[#0369A1] border border-sky-200 uppercase flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#0369A1]" />
            Regional Telemetry Beacon
          </span>
          <button
            onClick={onClearHotspot}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Close Beacon
          </button>
        </div>

        <div>
          <h3 className="text-lg font-orbitron font-extrabold text-slate-900 leading-tight">
            {hotspot.name}
          </h3>
          <p className="text-xs font-semibold text-[#0369A1] mt-1 flex items-center gap-1">
            <span>Coordinates:</span>
            <span className="font-mono">
              {hotspot.lat.toFixed(1)}°N, {hotspot.lon.toFixed(1)}°E
            </span>
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-sky-200/80">
          <span className="text-[10px] font-space font-bold text-[#0369A1] uppercase block mb-1">
            Field Telemetry Headline
          </span>
          <p className="text-sm font-bold text-slate-900 leading-snug">
            {hotspot.headline}
          </p>
          <p className="text-xs text-amber-700 font-bold mt-1.5 flex items-center gap-1">
            <span>Measured Rate:</span>
            <span className="font-mono">{hotspot.trendRate}</span>
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] font-space font-bold text-slate-500 uppercase block mb-1">
            NASA Science Investigation
          </span>
          <p className="text-xs font-space text-slate-600 leading-relaxed">
            {hotspot.observationNote}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-600 flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-[#0369A1] shrink-0" />
          <span>Telemetry: {hotspot.satelliteSource}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <button
          onClick={() => {
            soundManager.sonifyTrend(currentValue, hotspot.domain);
          }}
          className="w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100/70 text-[#0369A1] border border-sky-200 text-xs font-orbitron font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <Volume2 className="w-4 h-4" />
          <span>Play Acoustic Signature</span>
        </button>
      </div>
    </>
  );
};
