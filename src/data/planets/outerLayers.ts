import type { PlanetLayer } from '../../types/earthSystem';

export const JUPITER_LAYERS: PlanetLayer[] = [
  {
    name: 'ATMOSPHERE & CLOUD DECKS',
    subtitle: 'AMMONIA & WATER VAPOR BELTS',
    description: 'Dynamic alternating belts and zones driven by 400 km/h jet streams, topped by the Great Red Spot.',
    composition: 'Gaseous Hydrogen & Helium',
    color: '#d97706',
    thicknessRadius: 1.0,
  },
  {
    name: 'MOLECULAR HYDROGEN MANTLE',
    subtitle: 'COMPRESSED FLUID HYDROGEN',
    description: 'Gas compresses smoothly into a supercritical fluid ocean of liquid molecular hydrogen.',
    composition: 'Liquid Hydrogen Fluid',
    color: '#b45309',
    thicknessRadius: 0.84,
  },
  {
    name: 'METALLIC HYDROGEN LAYER',
    subtitle: 'ELECTRICAL CONDUCTOR',
    description: 'Extreme pressure strips electrons from protons, turning hydrogen into a liquid metal conductor.',
    composition: 'Liquid Metallic Hydrogen',
    color: '#ea580c',
    thicknessRadius: 0.60,
  },
  {
    name: 'DENSE ROCKY CORE',
    subtitle: 'DILUTE HEAVY ELEMENT CORE',
    description: 'NASA Juno probe revealed a fuzzy, diffuse core of heavy rocks, iron, and dissolved hydrogen.',
    composition: 'Silicates, ices, and metallic elements',
    color: '#fef08a',
    thicknessRadius: 0.28,
  },
];

export const SATURN_LAYERS: PlanetLayer[] = [
  {
    name: 'ATMOSPHERE & RING SYSTEM',
    subtitle: 'GOLDEN CLOUD DECKS & ICY RINGS',
    description: 'Thick hydrogen haze bands surrounded by billion-year-old water ice rings spanning 280,000 km.',
    composition: 'Hydrogen, Ammonia, Ice Ring Particles',
    color: '#fef08a',
    thicknessRadius: 1.0,
  },
  {
    name: 'LIQUID HYDROGEN MANTLE',
    subtitle: 'HIGH PRESSURE FLUID',
    description: 'Warm liquid hydrogen layer where helium droplets condense and fall as "helium rain".',
    composition: 'Fluid Molecular Hydrogen',
    color: '#ca8a04',
    thicknessRadius: 0.82,
  },
  {
    name: 'METALLIC HYDROGEN',
    subtitle: 'MAGNETIC ENGINE',
    description: 'Conductive metallic hydrogen generating Saturn’s symmetric dipolar magnetic field.',
    composition: 'Liquid Metallic Hydrogen',
    color: '#d97706',
    thicknessRadius: 0.54,
  },
  {
    name: 'ROCKY ICE CORE',
    subtitle: 'DENSE HEAVY CORE',
    description: 'Heavy element core of iron, nickel, silicates, and high-pressure water ice.',
    composition: 'Silicate Rock & Metallic Iron',
    color: '#fef08a',
    thicknessRadius: 0.25,
  },
];

export const URANUS_LAYERS: PlanetLayer[] = [
  {
    name: 'CYAN ATMOSPHERE',
    subtitle: 'METHANE GAS CLOUDS',
    description: 'Methane absorbs red light, giving Uranus its distinctive calm aquamarine hue.',
    composition: 'Hydrogen, Helium, Methane Gas',
    color: '#38bdf8',
    thicknessRadius: 1.0,
  },
  {
    name: 'ICY MANTLE',
    subtitle: 'SUPERCRITICAL WATER-AMMONIA SLUSH',
    description: 'A vast, dense fluid ocean of water, ammonia, and methane ices under extreme heat and pressure.',
    composition: 'Superheated Water, Ammonia, Methane',
    color: '#0284c7',
    thicknessRadius: 0.78,
  },
  {
    name: 'ROCKY CORE',
    subtitle: 'SILICATE-IRON CORE',
    description: 'Earth-sized core composed of silicate rock and iron-nickel minerals.',
    composition: 'Silicate Rock & Iron',
    color: '#fef08a',
    thicknessRadius: 0.28,
  },
];

export const NEPTUNE_LAYERS: PlanetLayer[] = [
  {
    name: 'COBALT ATMOSPHERE',
    subtitle: 'SUPERSONIC CIRRUS CLOUDS',
    description: 'Deep vivid blue atmosphere driven by supersonic winds and high-altitude white methane clouds.',
    composition: 'Hydrogen, Helium, Methane',
    color: '#1d4ed8',
    thicknessRadius: 1.0,
  },
  {
    name: 'IONIC WATER MANTLE',
    subtitle: 'SUPERHEATED ICY OCEAN',
    description: 'An electrically conductive slush of superionized water where molecules break into hydrogen and oxygen ions.',
    composition: 'Water, Ammonia, Methane Ionic Slush',
    color: '#1e3a8a',
    thicknessRadius: 0.76,
  },
  {
    name: 'ROCK-METAL CORE',
    subtitle: 'SOLID SILICATE CORE',
    description: 'Dense rocky core containing roughly 1.2 Earth masses of silicate and iron minerals.',
    composition: 'Silicate Rock, Iron & Nickel',
    color: '#fef08a',
    thicknessRadius: 0.26,
  },
];
