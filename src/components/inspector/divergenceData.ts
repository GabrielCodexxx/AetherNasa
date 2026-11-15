import type { EarthTrendDomain } from '../../types/earthSystem';
import type { DivergenceMatrix } from './types';

const DEFAULT_DIVERGENCE: DivergenceMatrix = {
  regionA: {
    title: 'Urban / Industrial High-Emission Belts',
    change: '+3.2 ppm / year',
    type: 'concentrated_source',
    description:
      'Point-source industrial emissions and fossil combustion create dense regional plumes.',
  },
  regionB: {
    title: 'Southern Oceanic Sink Basins',
    change: '+1.9 ppm / year',
    type: 'oceanic_uptake',
    description:
      'Cold sub-Antarctic surface waters actively dissolve and draw carbon into deep layers.',
  },
  driver:
    'Well-mixed global greenhouse accumulation punctuated by intense regional source/sink gradients.',
};

const DIVERGENCE_BY_DOMAIN: Partial<Record<EarthTrendDomain, DivergenceMatrix>> = {
  biosphere: {
    regionA: {
      title: 'High-Latitude Arctic Tundra',
      change: '+8.4% / decade',
      type: 'rapid_greening',
      description:
        'Thermal expansion of growing seasons drives rapid shrub encroachment and tundra greening.',
    },
    regionB: {
      title: 'Amazon & Southeast Asia Basins',
      change: '-5.2% / decade',
      type: 'severe_browning',
      description:
        'Recurrent severe flash droughts trigger canopy fragmentation and forest drying.',
    },
    driver:
      'Shared Global Temperature Forcing (+1.38°C) producing polar-opposite regional biome trajectories.',
  },
  cryosphere: {
    regionA: {
      title: 'West Antarctic Ice Sheet (Thwaites)',
      change: '-148 Gt / year',
      type: 'shelf_collapse',
      description:
        'Warm Circumpolar Deep Water intrudes beneath ice tongues, driving grounding line retreat.',
    },
    regionB: {
      title: 'East Antarctic Plateau',
      change: '+42 Gt / year',
      type: 'mass_accumulation',
      description:
        'Higher atmospheric moisture holding capacity increases snowfall accumulation on high plateau.',
    },
    driver:
      'Polar jet stream shifts routing oceanic heat to coastal shelves while moisture falls inland.',
  },
  hydrosphere: {
    regionA: {
      title: 'Western Pacific (Philippines Basin)',
      change: '+4.8 mm / year',
      type: 'accelerated_rise',
      description:
        'Strengthened Pacific trade winds pile up warm upper-ocean water, multiplying sea rise.',
    },
    regionB: {
      title: 'Eastern Pacific (US West Coast)',
      change: '+1.6 mm / year',
      type: 'suppressed_rise',
      description:
        'Persistent coastal upwelling and wind circulation dampen local sea-surface height changes.',
    },
    driver:
      'Coupled thermosteric ocean expansion modulated by persistent basin-scale wind stress patterns.',
  },
  temperature: {
    regionA: {
      title: 'Arctic Polar Cap (North of 66°N)',
      change: '+0.84°C / decade',
      type: 'amplified_warming',
      description:
        'Loss of reflective sea ice replaces white albedo with dark ocean, absorbing 90% of solar flux.',
    },
    regionB: {
      title: 'Southern Ocean (Weddell Gyre)',
      change: '+0.08°C / decade',
      type: 'buffered_inertia',
      description:
        'Deep ocean upwelling draws ancient cold water to the surface, muting atmospheric warming.',
    },
    driver:
      'Planetary heat redistribution altered by ocean overturning circulation and albedo feedback.',
  },
};

/** Returns the regional bipolar divergence comparison data for an Earth domain. */
export function getDivergenceMatrix(domain: EarthTrendDomain): DivergenceMatrix {
  return DIVERGENCE_BY_DOMAIN[domain] ?? DEFAULT_DIVERGENCE;
}
