import { lazy, Suspense } from 'react';
import { EarthSystemHeader } from './components/EarthSystemHeader';
import { PlanetHUD } from './components/PlanetHUD';
import { EarthTimelineScrubber } from './components/EarthTimelineScrubber';
import { EARTH_SYSTEM_TRENDS } from './utils/earthSystemData';
import {
  SpaceViewportFallback,
  InspectorFallback,
  ModalLoadingFallback,
} from './components/modals/AppFallbacks';
import { useEarthDetectiveState } from './components/modals/useEarthDetectiveState';

const ThreeSpaceSystem = lazy(() =>
  import('./components/ThreeSpaceSystem').then((m) => ({ default: m.ThreeSpaceSystem }))
);
const EarthTrendInspector = lazy(() =>
  import('./components/EarthTrendInspector').then((m) => ({ default: m.EarthTrendInspector }))
);
const DetectiveScenariosModal = lazy(() => import('./components/DetectiveScenariosModal'));
const EarthScienceModal = lazy(() => import('./components/EarthScienceModal'));
const DetectiveLogModal = lazy(() => import('./components/DetectiveLogModal'));
const ComparativePlanetologyModal = lazy(() => import('./components/ComparativePlanetologyModal'));
const ForensicReportModal = lazy(() => import('./components/ForensicReportModal'));

export function App() {
  const s = useEarthDetectiveState();
  const closeModal = () => s.setActiveModal(null);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#f8fafc] text-slate-800 select-none font-sans">
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<SpaceViewportFallback />}>
          <ThreeSpaceSystem
            viewMode={s.viewMode}
            selectedPlanetId={s.selectedPlanetId}
            selectedHotspotId={s.selectedHotspot ? s.selectedHotspot.id : null}
            currentYear={s.currentYear}
            onSelectPlanet={s.handleSelectPlanet}
            onSelectHotspot={s.handleSelectHotspot}
            onSelectSatellite={() => s.setActiveModal('briefing')}
            autoRotate={s.autoRotate}
            showGrid={s.showGrid}
            showDivergenceLens={s.showDivergenceLens}
            zoomInRef={s.zoomInRef}
            zoomOutRef={s.zoomOutRef}
          />
        </Suspense>
      </div>

      <EarthSystemHeader
        viewMode={s.viewMode}
        selectedPlanetId={s.selectedPlanetId}
        onChangeViewMode={s.handleHeaderViewMode}
        onSelectPlanet={s.handleSelectPlanet}
        onOpenBriefing={() => s.setActiveModal('briefing')}
        onOpenLogbook={() => s.setActiveModal('logbook')}
        onOpenScenarios={() => s.setActiveModal('scenarios')}
        onOpenPlanetology={() => s.setActiveModal('planetology')}
        onOpenReport={() => s.setActiveModal('report')}
        planetName={s.currentPlanet.name}
        isPlanetHudOpen={s.isPlanetHudOpen}
        onTogglePlanetHud={() => s.setIsPlanetHudOpen(!s.isPlanetHudOpen)}
        onZoomIn={() => s.zoomInRef.current?.()}
        onZoomOut={() => s.zoomOutRef.current?.()}
        autoRotate={s.autoRotate}
        onToggleAutoRotate={() => s.setAutoRotate(!s.autoRotate)}
        showGrid={s.showGrid}
        onToggleGrid={() => s.setShowGrid(!s.showGrid)}
        showDivergenceLens={s.showDivergenceLens}
        onToggleDivergenceLens={() => s.setShowDivergenceLens(!s.showDivergenceLens)}
      />

      <PlanetHUD
        planet={s.currentPlanet}
        viewMode={s.viewMode}
        isOpen={s.isPlanetHudOpen}
        onClose={s.handleHudClose}
        onChangeViewMode={s.handleHudViewMode}
        onNextPlanet={() => s.handleStepPlanet(1)}
        onPrevPlanet={() => s.handleStepPlanet(-1)}
        onOpenEncyclopedia={() => s.setActiveModal('briefing')}
      />

      {s.viewMode !== 'structure' && (
        <div className="absolute top-20 right-4 sm:right-6 z-20 pointer-events-auto hidden md:block">
          <Suspense fallback={<InspectorFallback />}>
            <EarthTrendInspector
              trend={s.currentTrend}
              selectedHotspot={s.selectedHotspot}
              currentYear={s.currentYear}
              onClearHotspot={() => s.setSelectedHotspot(null)}
              onOpenEncyclopedia={() => s.setActiveModal('briefing')}
              onOpenReportModal={() => s.setActiveModal('report')}
            />
          </Suspense>
        </div>
      )}

      <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 z-30 pointer-events-none flex flex-col items-center">
        <div className="pointer-events-auto w-full max-w-4xl">
          <EarthTimelineScrubber
            currentYear={s.currentYear}
            onSetYear={s.setCurrentYear}
            selectedDomain={s.selectedDomain}
            onSelectDomain={s.handleSelectDomain}
            currentTrend={s.currentTrend}
          />
        </div>
      </div>

      <Suspense fallback={<ModalLoadingFallback />}>
        {s.activeModal === 'scenarios' && (
          <DetectiveScenariosModal
            isOpen
            onClose={closeModal}
            onSelectScenario={s.handleSelectScenario}
            onSelectTrend={s.setSelectedTrendId}
            onChangeViewMode={s.setViewMode}
            trends={EARTH_SYSTEM_TRENDS}
          />
        )}
        {s.activeModal === 'briefing' && <EarthScienceModal isOpen onClose={closeModal} />}
        {s.activeModal === 'logbook' && (
          <DetectiveLogModal
            isOpen
            onClose={closeModal}
            selectedTrend={s.currentTrend}
            currentYear={s.currentYear}
          />
        )}
        {s.activeModal === 'planetology' && (
          <ComparativePlanetologyModal
            isOpen
            onClose={closeModal}
            onSelectPlanet={s.handlePlanetologySelect}
          />
        )}
        {s.activeModal === 'report' && (
          <ForensicReportModal
            isOpen
            onClose={closeModal}
            trend={s.currentTrend}
            selectedHotspot={s.selectedHotspot}
            currentYear={s.currentYear}
          />
        )}
      </Suspense>
    </div>
  );
}

export default App;
