import type {
  SolHazard,
  OutpostMissionConfig,
  OutpostModule,
  CrisisEvent,
  CadetBadge,
  LunarCrisis,
  LunarCadetBadge,
} from '../types/trainer';

export const SOL_CAMPAIGN: SolHazard[] = [
  {
    type: 'clear_skies',
    title: 'Sol 1: Clear Lunar Skies',
    badge: '☀️ Normal Solar Generation (+20% Power)',
    description: 'Welcome Commander! Sunlight is strong at Shackleton Crater. Use + and - to send power to Oxygen and Shields, then click End Day.',
    solarGeneration: 20,
    o2Depletion: 10,
    shieldDepletion: 5,
    nasaFact: 'NASA’s Artemis Base Camp is located at the Lunar South Pole to take advantage of continuous sunlight on crater peaks.',
  },
  {
    type: 'clear_skies',
    title: 'Sol 2: Calm Surface Weather',
    badge: '☀️ Normal Solar Generation (+20% Power)',
    description: 'Another sunny day on the Moon. Consider saving surplus battery power for upcoming emergencies!',
    solarGeneration: 20,
    o2Depletion: 10,
    shieldDepletion: 5,
    nasaFact: 'Batteries and regenerative fuel cells store extra daytime solar power to keep habitats alive during lunar darkness.',
  },
  {
    type: 'solar_storm',
    title: 'Sol 3: Warning - Incoming Solar Flare!',
    badge: '⚡ DANGER: Shielding will take a massive 40% hit!',
    description: 'The Sun launched high-energy protons directly toward your sector. You must divert maximum power to Shields today!',
    solarGeneration: 20,
    o2Depletion: 10,
    shieldDepletion: 40,
    nasaFact: 'NASA’s Space Weather Prediction Center monitors coronal mass ejections 24/7 to warn astronauts before radiation strikes.',
  },
  {
    type: 'clear_skies',
    title: 'Sol 4: Post-Storm Recovery',
    badge: '☀️ Normal Solar Generation (+20% Power)',
    description: 'The solar storm passed. Your crew air may be low—replenish Oxygen before the next hazard hits!',
    solarGeneration: 20,
    o2Depletion: 10,
    shieldDepletion: 5,
    nasaFact: 'Astronauts on the International Space Station recycle 98% of their water and air using closed-loop life support machines.',
  },
  {
    type: 'dust_storm',
    title: 'Sol 5: Electrostatic Lunar Dust Squall',
    badge: '🌪️ ALERT: Solar Power drops from 20% to only 5%!',
    description: 'Abrasive moon dust is clinging to your solar panels, cutting sunlight power. You must run the base on battery reserves!',
    solarGeneration: 5,
    o2Depletion: 10,
    shieldDepletion: 5,
    nasaFact: 'NASA uses special transparent coatings and electric vibrations to shake razor-sharp moon dust off rover solar panels.',
  },
  {
    type: 'clear_skies',
    title: 'Sol 6: Dust Cleared & Sun Restored',
    badge: '☀️ Normal Solar Generation (+20% Power)',
    description: 'Dust vibrators cleared the panels. Full solar output is back. Plan carefully for tomorrow’s deep shadow!',
    solarGeneration: 20,
    o2Depletion: 10,
    shieldDepletion: 5,
    nasaFact: 'Because the Moon has no atmosphere or wind, dust only moves when electrostatically levitated by solar ultraviolet light.',
  },
  {
    type: 'eclipse',
    title: 'Sol 7: Lunar Shadow Eclipse',
    badge: '🌑 ZERO POWER GENERATION (0% Solar Input)!',
    description: 'The Earth passed between the Moon and Sun, casting a total shadow over your base. Tests if you saved enough battery reserves!',
    solarGeneration: 0,
    o2Depletion: 10,
    shieldDepletion: 5,
    nasaFact: 'During a lunar eclipse, surface temperatures plummet over 200 degrees within minutes, requiring strict thermal battery rationing.',
  },
  {
    type: 'solar_storm',
    title: 'Sol 8: Class X High-Energy Storm',
    badge: '⚡ DANGER: Shielding will take a massive 40% hit!',
    description: 'A second, more intense solar particle wave has arrived. Boost deflector shields to prevent hull integrity failure!',
    solarGeneration: 20,
    o2Depletion: 10,
    shieldDepletion: 40,
    nasaFact: 'During peak solar storms, astronauts seek refuge inside water-lined storm vaults because water molecules absorb radiation.',
  },
  {
    type: 'dust_storm',
    title: 'Sol 9: Low Sunlight Dust Occlusion',
    badge: '🌪️ ALERT: Solar Power reduced to only 5%!',
    description: 'Low-angle sunlight is scattered by crater rim dust. Only 1 Sol left until mission completion—manage power frugally!',
    solarGeneration: 5,
    o2Depletion: 10,
    shieldDepletion: 5,
    nasaFact: 'NASA lunar rovers use special brush seals and magnetic filters to keep abrasive regolith out of delicate motors and seals.',
  },
  {
    type: 'solar_storm',
    title: 'Sol 10: Final Solar Particle Barrage',
    badge: '⚡ THE FINAL TEST: 40% Shield Drainage!',
    description: 'Final Sol! The Sun unleashes its strongest flare yet. Route all available energy to survive until the relief shuttle arrives!',
    solarGeneration: 20,
    o2Depletion: 10,
    shieldDepletion: 40,
    nasaFact: 'Congratulations Commander! Real NASA mission directors face these exact trade-offs every day to keep humans safe in deep space.',
  },
];

export const LUNAR_CRISES: LunarCrisis[] = [
  {
    id: 'storm-class-x',
    title: 'NASA DONKI: Class X Solar Flare',
    description: 'Coronal mass ejection proton surge.',
    severity: 'extreme',
    radiationMultiplier: 8,
    durationSeconds: 25,
    nasaContext: 'Cosmic radiation surges during solar maximums.',
  },
];

export const LUNAR_BADGES: LunarCadetBadge[] = [
  {
    id: 'badge-first-sol',
    title: 'Lunar Pioneer',
    description: 'Maintained habitat stability for your first 60 seconds of lunar command.',
    unlocked: true,
    nasaPrinciple: 'Every junior astronaut begins with basic power grid orientation.',
  },
];

export const CADET_BADGES: CadetBadge[] = [
  {
    id: 'badge-first-sol',
    title: 'Artemis Cadet Wings',
    description: 'Took command of the Artemis Lunar Outpost.',
    unlocked: true,
    nasaPrinciple: 'Orientation and grid management.',
  },
];

export const MISSION_CONFIGS: Record<'lunar' | 'mars', OutpostMissionConfig> = {
  lunar: {
    name: 'Artemis Base Camp',
    location: 'lunar',
    siteName: 'Shackleton Crater Rim',
    coordinates: '89.9°S 0.0°E',
    temperature: '-130°C to +120°C',
    gravity: '0.166 g',
    dayLength: '708 hrs',
    solarFlux: '1,361 W/m²',
    primaryRisk: 'Solar Particle Events',
  },
  mars: {
    name: 'Ares Pioneer Hab',
    location: 'mars',
    siteName: 'Jezero Crater',
    coordinates: '18.38°N 77.58°E',
    temperature: '-63°C avg',
    gravity: '0.376 g',
    dayLength: '24h 39m',
    solarFlux: '590 W/m²',
    primaryRisk: 'Dust Storms',
  },
};

export const INITIAL_MODULES: OutpostModule[] = [];
export const CRISIS_CATALOG: CrisisEvent[] = [];
