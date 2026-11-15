import { EARTH_SYSTEM_TRENDS, SOLAR_PLANETS } from '../../utils/earthSystemData';
import type { EarthTrendDomain, PlanetData } from '../../types/earthSystem';

export function getPlanetById(planetId: string): PlanetData {
  return SOLAR_PLANETS.find((p) => p.id === planetId) || SOLAR_PLANETS[3];
}

export function getAdjacentPlanet(selectedPlanetId: string, delta: 1 | -1): PlanetData {
  const currentIndex = SOLAR_PLANETS.findIndex((p) => p.id === selectedPlanetId);
  const nextIndex = (currentIndex + delta + SOLAR_PLANETS.length) % SOLAR_PLANETS.length;
  return SOLAR_PLANETS[nextIndex];
}

export function getTrendById(trendId: string) {
  return EARTH_SYSTEM_TRENDS.find((t) => t.id === trendId) || EARTH_SYSTEM_TRENDS[0];
}

export function findTrendIdByDomain(domain: EarthTrendDomain): string | null {
  if (domain === 'all') return null;
  return EARTH_SYSTEM_TRENDS.find((t) => t.domain === domain)?.id ?? null;
}
