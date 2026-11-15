import type { PlanetLayer } from '../../types/earthSystem';

export const SUN_LAYERS: PlanetLayer[] = [
  {
    name: 'PHOTOSPHERE & CORONA',
    subtitle: 'SURFACE & ATMOSPHERE',
    description: 'The visible 500 km thick glowing surface layer where solar flares and sunspots erupt.',
    composition: 'Superheated Hydrogen Plasma',
    color: '#ffaa00',
    thicknessRadius: 1.0,
  },
  {
    name: 'CONVECTIVE ZONE',
    subtitle: 'BOILING PLASMA',
    description: 'Hot plasma rises, cools at the surface, and plunges back down in giant convective granules.',
    composition: 'Turbulent Plasma Cells',
    color: '#f97316',
    thicknessRadius: 0.78,
  },
  {
    name: 'RADIATIVE ZONE',
    subtitle: 'PHOTON DIFFUSION',
    description: 'Energy generated in the core takes over 100,000 years to slowly diffuse outward as gamma rays.',
    composition: 'Dense Ionized Gas',
    color: '#dc2626',
    thicknessRadius: 0.52,
  },
  {
    name: 'SOLAR CORE',
    subtitle: 'NUCLEAR FUSION ENGINE',
    description: 'Enormous gravitational pressure fuses 600 million tons of hydrogen into helium every second.',
    composition: 'Extreme Density Plasma (150 g/cm³)',
    color: '#fef08a',
    thicknessRadius: 0.25,
  },
];

export const MERCURY_LAYERS: PlanetLayer[] = [
  {
    name: 'CRUST',
    subtitle: 'HEAVILY CRATERED BASALT',
    description: 'Silicate rock scarred by billions of years of impact craters and lobate thrust scarps.',
    composition: 'Silicate Rock & Basalt',
    color: '#94a3b8',
    thicknessRadius: 1.0,
  },
  {
    name: 'MANTLE',
    subtitle: 'THIN ROCKY SHELL',
    description: 'A surprisingly thin silicate mantle compressed by the massive central core.',
    composition: 'Solid Silicates',
    color: '#64748b',
    thicknessRadius: 0.85,
  },
  {
    name: 'METALLIC CORE',
    subtitle: 'ENORMOUS IRON CORE',
    description: 'Mercury’s iron core accounts for 85% of its planetary radius, partially liquid.',
    composition: 'Dense Metallic Iron & Nickel',
    color: '#e2e8f0',
    thicknessRadius: 0.72,
  },
];

export const VENUS_LAYERS: PlanetLayer[] = [
  {
    name: 'CRUST',
    subtitle: 'VOLCANIC BASALTIC PLAINS',
    description: 'Solid silicate rock reshaped by widespread volcanic flood plains and shield volcanoes.',
    composition: 'Basaltic Silicate Crust',
    color: '#ca8a04',
    thicknessRadius: 1.0,
  },
  {
    name: 'MANTLE',
    subtitle: 'CONVECTING ROCKY SHELL',
    description: 'Thick rocky mantle undergoing sluggish interior convective churn without plate tectonics.',
    composition: 'Silicate Olivine & Pyroxene',
    color: '#b45309',
    thicknessRadius: 0.88,
  },
  {
    name: 'CORE',
    subtitle: 'IRON-NICKEL CORE',
    description: 'Partially molten metallic core similar in size to Earth’s, but with no intrinsic magnetic field.',
    composition: 'Liquid Iron-Nickel Alloy',
    color: '#fbbf24',
    thicknessRadius: 0.48,
  },
];

export const EARTH_LAYERS: PlanetLayer[] = [
  {
    name: 'CRUST & LITHOSPHERE',
    subtitle: 'SOLID SILICATE ROCK, MOSTLY BASALT',
    description: 'Earth’s crust, together with the uppermost mantle, forms the lithosphere. Broken into tectonic plates that float on the upper mantle.',
    composition: 'Oceanic Basalt & Continental Granite',
    color: '#166534',
    thicknessRadius: 1.0,
  },
  {
    name: 'MANTLE',
    subtitle: 'SOLID SILICATE ROCK (84% VOLUME)',
    description: 'A dense rocky shell accounting for 84% of Earth’s volume. Convection currents drive continental drift and volcanic activity.',
    composition: 'Bridgmanite, Olivine & Silicates',
    color: '#c2410c',
    thicknessRadius: 0.82,
  },
  {
    name: 'OUTER CORE',
    subtitle: 'LIQUID IRON AND NICKEL',
    description: 'Vigorous thermal convection within the hot liquid outer core drives the planetary geodynamo, generating Earth’s magnetic shield.',
    composition: 'Molten Iron-Nickel Liquid (4,000°C)',
    color: '#f59e0b',
    thicknessRadius: 0.52,
  },
  {
    name: 'INNER CORE',
    subtitle: 'DENSE SOLID IRON AND NICKEL CRYSTAL',
    description: 'Crushing central pressures keep this 5,400°C metallic sphere in a solid crystalline state at the center of the world.',
    composition: 'Solid Metallic Iron Crystal',
    color: '#fef08a',
    thicknessRadius: 0.24,
  },
];

export const MARS_LAYERS: PlanetLayer[] = [
  {
    name: 'CRUST',
    subtitle: 'IRON-OXIDE BASALTIC CRUST',
    description: 'Rich in iron and magnesium basalt, oxidized to rust red at the surface. 50 km thick.',
    composition: 'Basalt & Iron Oxides',
    color: '#b45309',
    thicknessRadius: 1.0,
  },
  {
    name: 'MANTLE',
    subtitle: 'SILICATE ROCKY MANTLE',
    description: 'Stiff mantle with ancient inactive mantle plumes that built solar system giants like Olympus Mons.',
    composition: 'Peridotite & Silicates',
    color: '#9a3412',
    thicknessRadius: 0.84,
  },
  {
    name: 'CORE',
    subtitle: 'DENSE LIQUID IRON-SULFUR CORE',
    description: 'Liquid iron core enriched with lighter sulfur, measured precisely by NASA InSight seismometer.',
    composition: 'Iron, Nickel, Sulfur & Light Elements',
    color: '#f59e0b',
    thicknessRadius: 0.45,
  },
];
