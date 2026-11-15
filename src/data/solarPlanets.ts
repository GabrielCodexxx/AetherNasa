import type { PlanetData } from '../types/earthSystem';
import { INNER_SOLAR_PLANETS } from './planets/innerPlanets';
import { OUTER_SOLAR_PLANETS } from './planets/outerPlanets';

export {
  EARTH_LAYERS,
  MARS_LAYERS,
  MERCURY_LAYERS,
  SUN_LAYERS,
  VENUS_LAYERS,
} from './planets/innerLayers';
export {
  JUPITER_LAYERS,
  NEPTUNE_LAYERS,
  SATURN_LAYERS,
  URANUS_LAYERS,
} from './planets/outerLayers';
export { INNER_SOLAR_PLANETS } from './planets/innerPlanets';
export { OUTER_SOLAR_PLANETS } from './planets/outerPlanets';

/** Authentic solar system planetary hierarchy with dispersed orbital angles and interior layers. */
export const SOLAR_PLANETS: PlanetData[] = [
  ...INNER_SOLAR_PLANETS,
  ...OUTER_SOLAR_PLANETS,
];
