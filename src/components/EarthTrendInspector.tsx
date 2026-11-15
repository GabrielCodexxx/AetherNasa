import { type FC, useEffect, useRef, useState } from 'react';
import type { EarthSystemTrend, HotspotMarker } from '../types/earthSystem';
import { EARTH_SYSTEM_TRENDS } from '../utils/earthSystemData';
import { soundManager } from '../utils/soundEffects';
import { CorrelationTabPanel } from './inspector/CorrelationTabPanel';
import { DivergenceTabPanel } from './inspector/DivergenceTabPanel';
import { HotspotInspectorPanel } from './inspector/HotspotInspectorPanel';
import { InspectorActionBar } from './inspector/InspectorActionBar';
import { InspectorModeHeader } from './inspector/InspectorModeHeader';
import { getCurrentTrendPoint } from './inspector/inspectorMath';
import { SynthesisTabPanel } from './inspector/SynthesisTabPanel';
import type { InspectorTab, SignificanceAlpha } from './inspector/types';

interface EarthTrendInspectorProps {
  trend: EarthSystemTrend;
  selectedHotspot: HotspotMarker | null;
  currentYear: number;
  onClearHotspot: () => void;
  onOpenEncyclopedia: () => void;
  onOpenReportModal?: () => void;
}

export const EarthTrendInspector: FC<EarthTrendInspectorProps> = ({
  trend,
  selectedHotspot,
  currentYear,
  onClearHotspot,
  onOpenEncyclopedia,
  onOpenReportModal,
}) => {
  const [activeTab, setActiveTab] = useState<InspectorTab>('synthesis');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [significanceAlpha, setSignificanceAlpha] = useState<SignificanceAlpha>('0.001');
  const audioTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const otherTrends = EARTH_SYSTEM_TRENDS.filter((t) => t.id !== trend.id);
  const [compareTrendId, setCompareTrendId] = useState<string>(otherTrends[0]?.id || '');
  const compareTrend = otherTrends.find((t) => t.id === compareTrendId) || otherTrends[0];
  const currentPoint = getCurrentTrendPoint(trend.timeSeries, currentYear);

  useEffect(() => {
    return () => {
      if (audioTimerRef.current !== null) {
        clearTimeout(audioTimerRef.current);
      }
    };
  }, []);

  const handlePlaySonification = () => {
    if (audioTimerRef.current !== null) {
      clearTimeout(audioTimerRef.current);
    }
    setIsPlayingAudio(true);
    soundManager.sonifyTrend(currentPoint.value, trend.domain);
    audioTimerRef.current = setTimeout(() => {
      setIsPlayingAudio(false);
      audioTimerRef.current = null;
    }, 2400);
  };

  return (
    <div
      className="w-full lg:w-96 bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xl shadow-slate-200/60 flex flex-col justify-between text-slate-800 select-none animate-fade-in max-h-[calc(100vh-9.5rem)] overflow-y-auto font-sans"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {selectedHotspot ? (
        <HotspotInspectorPanel
          hotspot={selectedHotspot}
          currentValue={currentPoint.value}
          onClearHotspot={onClearHotspot}
        />
      ) : (
        <>
          <div className="space-y-3.5">
            <InspectorModeHeader
              trendName={trend.name}
              metricUnit={trend.metricUnit}
              currentYear={currentYear}
              activeTab={activeTab}
              significanceAlpha={significanceAlpha}
              onSelectTab={setActiveTab}
              onSelectAlpha={setSignificanceAlpha}
            />

            {activeTab === 'synthesis' && (
              <SynthesisTabPanel
                trend={trend}
                currentYear={currentYear}
                currentPoint={currentPoint}
                onOpenEncyclopedia={onOpenEncyclopedia}
              />
            )}

            {activeTab === 'divergence' && <DivergenceTabPanel trend={trend} />}

            {activeTab === 'correlation' && (
              <CorrelationTabPanel
                trend={trend}
                otherTrends={otherTrends}
                compareTrend={compareTrend}
                currentYear={currentYear}
                onSelectCompareTrend={setCompareTrendId}
              />
            )}
          </div>

          <InspectorActionBar
            isPlayingAudio={isPlayingAudio}
            onPlaySonification={handlePlaySonification}
            onOpenReportModal={onOpenReportModal}
          />
        </>
      )}
    </div>
  );
};

export default EarthTrendInspector;
