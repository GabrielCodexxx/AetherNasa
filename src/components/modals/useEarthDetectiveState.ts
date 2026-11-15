import { useState, useRef } from 'react';
import { EARTH_SYSTEM_TRENDS } from '../../utils/earthSystemData';
import type {
  SystemViewMode,
  PlanetData,
  EarthTrendDomain,
  HotspotMarker,
  DetectiveScenario,
} from '../../types/earthSystem';
import {
  getPlanetById,
  getAdjacentPlanet,
  getTrendById,
  findTrendIdByDomain,
} from './appNavigation';

export type ActiveModalType =
  | 'briefing'
  | 'logbook'
  | 'scenarios'
  | 'planetology'
  | 'report'
  | null;

export function useEarthDetectiveState() {
  const [viewMode, setViewMode] = useState<SystemViewMode>('solar_system');
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('earth');
  const [selectedTrendId, setSelectedTrendId] = useState<string>(EARTH_SYSTEM_TRENDS[0].id);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotMarker | null>(null);
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [selectedDomain, setSelectedDomain] = useState<EarthTrendDomain>('all');

  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  const [isPlanetHudOpen, setIsPlanetHudOpen] = useState<boolean>(false);

  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showDivergenceLens, setShowDivergenceLens] = useState<boolean>(false);
  const zoomInRef = useRef<(() => void) | null>(null);
  const zoomOutRef = useRef<(() => void) | null>(null);

  const currentPlanet = getPlanetById(selectedPlanetId);
  const currentTrend = getTrendById(selectedTrendId);

  const handleSelectPlanet = (planet: PlanetData) => {
    setSelectedPlanetId(planet.id);
    setIsPlanetHudOpen(true);
    if (planet.id === 'earth' && viewMode !== 'structure') {
      setViewMode('earth_focus');
    }
  };

  const handleStepPlanet = (delta: 1 | -1) => {
    setSelectedPlanetId(getAdjacentPlanet(selectedPlanetId, delta).id);
    setIsPlanetHudOpen(true);
  };

  const handleSelectHotspot = (hotspot: HotspotMarker) => {
    setSelectedHotspot(hotspot);
    const trendId = findTrendIdByDomain(hotspot.domain);
    if (trendId) setSelectedTrendId(trendId);
  };

  const handleSelectScenario = (scenario: DetectiveScenario) => {
    setSelectedPlanetId('earth');
    setViewMode('earth_focus');
    const trendId = findTrendIdByDomain(scenario.domain);
    if (trendId) setSelectedTrendId(trendId);
    setCurrentYear(scenario.focusYear);
  };

  const handleSelectDomain = (domain: EarthTrendDomain) => {
    setSelectedDomain(domain);
    const trendId = findTrendIdByDomain(domain);
    if (trendId) setSelectedTrendId(trendId);
  };

  const handleHeaderViewMode = (mode: SystemViewMode) => {
    setViewMode(mode);
    if (mode === 'earth_focus') setSelectedPlanetId('earth');
  };

  const handleHudClose = () => {
    setIsPlanetHudOpen(false);
    if (viewMode === 'structure') {
      setViewMode(selectedPlanetId === 'earth' ? 'earth_focus' : 'planet_focus');
    }
  };

  const handleHudViewMode = (mode: SystemViewMode) => {
    setViewMode(mode);
    setIsPlanetHudOpen(mode !== 'solar_system');
  };

  const handlePlanetologySelect = (planetId: string) => {
    setSelectedPlanetId(planetId);
    setViewMode(planetId === 'earth' ? 'earth_focus' : 'planet_focus');
  };

  return {
    viewMode,
    setViewMode,
    selectedPlanetId,
    setSelectedTrendId,
    selectedHotspot,
    setSelectedHotspot,
    currentYear,
    setCurrentYear,
    selectedDomain,
    activeModal,
    setActiveModal,
    isPlanetHudOpen,
    setIsPlanetHudOpen,
    autoRotate,
    setAutoRotate,
    showGrid,
    setShowGrid,
    showDivergenceLens,
    setShowDivergenceLens,
    zoomInRef,
    zoomOutRef,
    currentPlanet,
    currentTrend,
    handleSelectPlanet,
    handleStepPlanet,
    handleSelectHotspot,
    handleSelectScenario,
    handleSelectDomain,
    handleHeaderViewMode,
    handleHudClose,
    handleHudViewMode,
    handlePlanetologySelect,
  };
}
