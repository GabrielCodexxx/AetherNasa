import type { ComponentType } from 'react';
import { Globe, Flame, Snowflake } from 'lucide-react';

export interface PlanetologyWorld {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  icon: ComponentType<{ className?: string }>;
  temp: string;
  pressure: string;
  co2: string;
  coreState: string;
  lesson: string;
}

export const PLANETOLOGY_WORLDS: PlanetologyWorld[] = [
  {
    id: 'venus',
    name: 'VENUS',
    badge: 'RUNAWAY GREENHOUSE',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    icon: Flame,
    temp: '465°C (Surface Melting)',
    pressure: '92 Bar (Deep Submarine Depth)',
    co2: '96.5% Carbon Dioxide',
    coreState: 'Sluggish Convection • No Dynamo',
    lesson:
      'Without liquid ocean carbon sinks, volcanic CO₂ built up relentlessly, turning a once-habitable sister world into a 465°C planetary furnace.',
  },
  {
    id: 'earth',
    name: 'EARTH',
    badge: 'STABILIZED BIOSPHERE',
    badgeColor: 'bg-emerald-100 text-[#15803D] border-emerald-300',
    icon: Globe,
    temp: '15°C (Water Triple Point)',
    pressure: '1.01 Bar (Life Support Standard)',
    co2: '427 ppm (0.0427% Gas Fraction)',
    coreState: 'Active Liquid Iron Dynamo • 0.5 Gauss',
    lesson:
      'Oceans dissolve CO₂ and deposit it as carbonate limestone via marine organisms, while plate tectonics recycles carbon, preserving climate equilibrium for billions of years.',
  },
  {
    id: 'mars',
    name: 'MARS',
    badge: 'FROZEN THIN RESIDUE',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: Snowflake,
    temp: '-60°C (Polar Dry Ice Glaciers)',
    pressure: '0.006 Bar (1% Earth Density)',
    co2: '95.3% Carbon Dioxide (Thin Trace)',
    coreState: 'Solidified Core • Dynamo Collapsed',
    lesson:
      'Smaller planetary mass allowed its iron core to cool and solidify 4 billion years ago. Without a protective magnetic shield, solar wind stripped its atmosphere into space.',
  },
];
