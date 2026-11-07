# MOONQUAKE MAP 2.0 🌕
**NASA Space Apps Challenge 2026** | *Challenge: Make a Moonquake Map 2.0*  
**Interactive 3D Lunar Seismic Telemetry & Planetary Exploration Platform**  
**Database:** Supabase (PostgreSQL) | **Deployment:** Vercel Edge | **Graphics:** Three.js / WebGL

---

## 🌟 Overview & Scientific Motivation

Between 1969 and 1972, Apollo astronauts hand-deployed the **Apollo Passive Seismic Experiment Package (APSE)** across the lunar nearside (Apollo 12, 14, 15, and 16). For 8 continuous years until 1977, these instruments recorded over 12,000 seismic events—the only direct seismic observations ever gathered from another planetary body.

Unlike Earth quakes, which extinguish in 30–60 seconds due to water damping in rock pores, the Moon is bone-dry and fractured by billions of years of impacts. Without water absorption, seismic energy scatters endlessly, causing the Moon to **"ring like a bell"** for 10 to 30+ minutes (and over 3 hours for artificial rocket booster crashes!).

**Moonquake Map 2.0** brings this historic NASA dataset to life with:
1. **Interactive 3D Lunar Globe (Three.js)** with accurate lunar coordinates, Apollo station beacons, color-coded epicenters, and animated propagating seismic wavefronts.
2. **The 4 Primary Moonquake Classes**: Shallow tectonic thrusts, deep tidal mantle clusters, thermal day/night shocks, and artificial rocket calibration impacts.
3. **Procedural Web Audio Seismic Sonifier**: Real-time acoustic synthesis translating deep lunar crustal vibrations into audible human sound.
4. **Live Seismograph Waveform Display**: Continuous trace analysis comparing Earth vs. Moon seismic attenuation.
5. **Artemis Base Camp Science Briefing**: Engineering hazard analysis for permanent human habitats near South Pole active lobate scarps.
6. **Cloud Telemetry Logbook**: Persisted observations powered by **Supabase**.

---

## 🚀 Key Features

### 1. Interactive 3D Lunar Globe (`ThreeMoonGlobe.tsx`)
- **Authentic Planetary Topography**: Procedural lunar canvas texture rendering major basaltic maria (*Oceanus Procellarum, Mare Crisium*), heavily cratered highlands (*Descartes*), and bright impact rays (*Copernicus*).
- **Apollo Station Beacons**: Interactive pyramids marking Apollo 12, 14, 15, and 16 landing sites with coordinates and sensor specs.
- **Wavefront Propagation Waves**: Dynamic pulsating expanding concentric wave rings radiating across the lunar sphere from epicenters.
- **Raycasting Interaction**: Click or hover any moonquake marker or Apollo station to orbit the camera and inspect telemetry.
- **Visual Controls**: Auto-rotation toggle and High-Contrast night vision mode for mission control readability.

### 2. Live Seismograph & Sonification (`SeismographVisualizer.tsx`)
- **Animated Canvas Seismogram**: Real-time rendering of authentic Apollo decaying waveform traces.
- **Physical Readouts**: Peak Ground Acceleration ($\mu\text{m/s}^2$), focal depth, magnitude, and signal duration.
- **Web Audio Seismic Sonifier**: Procedural synthesis converting Richter magnitude and event physics into acoustic sound:
  - *Shallow quakes*: Deep, sub-bass 40–80 Hz saw-wave tectonic rumble.
  - *Apollo Booster Impacts*: High-frequency 320 Hz metallic reverberation.
  - *Deep Tidal quakes*: Low 60 Hz sinusoidal mantle hum.

### 3. Multi-Parameter Filtering (`MoonquakeFilterBar.tsx`)
- Category pill filters: All, Shallow (Tectonic), Deep (Tidal), Apollo Impacts, Thermal.
- Magnitude slider: Filter events from $M_L \ge 1.0$ up to $M_L \ge 5.5$.
- Instant text search across event titles, geological formations, and science notes.
- Horizontal scrollable quick-selection cards.

### 4. Artemis Science Briefing (`ArtemisScienceModal.tsx`)
- **Why the Moon Rings Like a Bell**: Contrast between Earth's wet absorption ($Q \approx 100$) and the Moon's dry scattering megaregolith ($Q > 3,000$).
- **The 4 Moonquake Classes**: Geological mechanics behind each class.
- **Apollo Seismic Network History**: Details on the SNAP-27 RTG nuclear power and 1977 shutdown.
- **Artemis South Pole Hazards**: Structural fatigue and regolith landslide risks for Shackleton Crater habitats near active lobate scarps (Watters et al., 2024).

### 5. Persistent Observation Logbook (`SeismicLogModal.tsx`)
- Field observations recorded by astronauts and researchers.
- Seamlessly synced with **Supabase Cloud Database** (`seismic_observations`), with automatic offline local storage fallback.

---

## 📐 The Physics: Earth vs. Moon Seismic Attenuation

$$\text{Lunar Attenuation Quality Factor } Q \approx 3,000 - 5,000 \quad \text{vs.} \quad \text{Earth Crust } Q \approx 100 - 300$$

Due to the total lack of water and volatile fluid damping in the lunar megaregolith, seismic waves experience near-zero frictional dissipation. Scattering from ancient impact fractures traps acoustic waves, causing the Moon to vibrate as a single resonant bell.

---

## 🛠️ Architecture & Tech Stack

- **Frontend Framework**: React 19, TypeScript
- **3D Graphics Engine**: Three.js (WebGL)
- **Styling**: Tailwind CSS v4, Lucide Icons
- **Audio Synthesis**: Native Web Audio API (procedural oscillators and gain envelopes)
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel Edge Platform
- **Code-Splitting**: Manual Rollup chunking (`vendor-three`, `vendor-react`, `vendor-supabase`, `vendor-icons`) and lazy-loaded modals via `React.Suspense`.

---

## 💻 Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables (Optional Supabase Sync)
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://wqfhjalavgyobyvbikhy.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
*(If omitted, the platform automatically runs in Local Storage mode).*

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 📜 Scientific References & Acknowledgments

- **Apollo Passive Seismic Experiment (APSE)**: NASA Planetary Data System (PDS) Geosciences Node.
- **Nakamura, Y., et al. (1979)**: *High-frequency lunar seismic events*. Physics of the Earth and Planetary Interiors.
- **Watters, T. R., et al. (2024)**: *Tectonics and Seismicity of the Lunar South Polar Region*. The Planetary Science Journal.
- **Latham, G., et al. (1970)**: *Apollo 11 Passive Seismic Experiment*. Science.
