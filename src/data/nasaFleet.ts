import type { NasaSatelliteMission } from '../types/earthSystem';

/** Active NASA Earth-observing satellite fleet rendered in orbit and mission encyclopedia. */
export const NASA_FLEET: NasaSatelliteMission[] = [
  {
    id: 'sat-terra',
    name: 'Terra (EOS AM-1)',
    launchYear: 1999,
    orbitAltitudeKm: 705,
    sensorPayload: 'MODIS, ASTER, CERES, MISR, MOPITT',
    primaryMission: 'Flagship Earth observing platform monitoring global biosphere greenness, cloud cover, and aerosols.',
    status: 'OPERATIONAL',
  },
  {
    id: 'sat-aqua',
    name: 'Aqua (EOS PM-1)',
    launchYear: 2002,
    orbitAltitudeKm: 705,
    sensorPayload: 'AIRS, AMSU, CERES, MODIS',
    primaryMission: 'Monitors the global water cycle: ocean evaporation, clouds, precipitation, and sea ice coverage.',
    status: 'OPERATIONAL',
  },
  {
    id: 'sat-grace',
    name: 'GRACE-FO',
    launchYear: 2018,
    orbitAltitudeKm: 490,
    sensorPayload: 'Microwave K-Band Ranging & Laser Interferometer',
    primaryMission: 'Measures variations in Earth’s gravity field to weigh global groundwater reserves and polar ice sheet melting.',
    status: 'OPERATIONAL',
  },
  {
    id: 'sat-icesat2',
    name: 'ICESat-2',
    launchYear: 2018,
    orbitAltitudeKm: 496,
    sensorPayload: 'ATLAS (Advanced Topographic Laser Altimeter System)',
    primaryMission: 'Fires 10,000 laser pulses/second to measure polar ice sheet elevation with millimeter precision.',
    status: 'OPERATIONAL',
  },
  {
    id: 'sat-landsat9',
    name: 'Landsat 9',
    launchYear: 2021,
    orbitAltitudeKm: 705,
    sensorPayload: 'OLI-2 (Operational Land Imager) & TIRS-2',
    primaryMission: '50-year unbroken land surface record mapping deforestation, urban sprawl, crop health, and coastal erosion.',
    status: 'OPERATIONAL',
  },
  {
    id: 'sat-sentinel6',
    name: 'Sentinel-6 Michael Freilich',
    launchYear: 2020,
    orbitAltitudeKm: 1336,
    sensorPayload: 'Poseidon-4 Radar Altimeter & AMR-C Radiometer',
    primaryMission: 'Global sea-level reference standard measuring ocean topography with sub-centimeter accuracy.',
    status: 'OPERATIONAL',
  },
];
