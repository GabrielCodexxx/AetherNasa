# EARTH SYSTEM TREND DETECTIVE 🌍🔭
**2026 NASA Space Apps Challenge** | *Challenge: Be An Earth System Trend Detective!*  
**Interactive 3D Solar System Scope, Planetary Observatory & Earth System Science Platform**  
**Database:** Supabase (PostgreSQL) | **Deployment:** Vercel Edge | **Graphics:** Three.js / WebGL

---

## 🌟 Challenge Mission & Scientific Objective

> *"Change is always occurring in the Earth’s interconnected environmental system, and when it runs in a consistent direction – rising or falling, increasing or decreasing, thickening or thinning – measured variables reflect it. But a measured Earth science data variable can trend one way in one region and the opposite way in another, even when the same process drives both. The multitude of Earth science data variables makes it difficult to select variables that could indicate change, and to then perform an analysis on the selected variables. Your challenge is to create a tool that can select variables measured by Earth science missions or produced by Earth science models, visualize how they change over time, and determine what is changing, where it is changing, how much it is changing, and if these changes are what scientists call 'significant.'"*

**Earth System Trend Detective** solves this challenge by pairing an immersive **Solar System Scope 3D space engine** with a forensic Earth science analytics workbench answering the 4 core investigative questions for every variable:
1. **WHAT is changing?** (The measured satellite variable, baseline, and physical unit)
2. **WHERE is it changing?** (3D geographic hotspots and regional divergence analysis)
3. **HOW MUCH is it changing?** (Decadal rate of change and cumulative anomaly)
4. **IS IT WHAT SCIENTISTS CALL "SIGNIFICANT"?** (Mann-Kendall trend tests and statistical $p$-values $< 0.001$, proving non-random change)

---

## 🚀 Key Features

### 1. Full-Screen 3D Cosmos & Solar System Engine (`ThreeSpaceSystem.tsx`)
- **Central Radiant Sun**: Emissive solar body with animated corona shader, solar light casting, and lens flare.
- **Planetary Orbits**: Mercury, Venus, Earth with its Moon, Mars, Jupiter with atmospheric cloud bands, Saturn with particle rings, Uranus, and Neptune.
- **The Asteroid Belt**: 2,000 instanced 3D rocky asteroid particles orbiting between Mars and Jupiter.
- **Deep Space Universe**: Spiraling Milky Way galaxy dust band and a 3,500-star multi-spectral celestial sphere.
- **Ecliptic Coordinate Grid**: Toggleable polar orbital plane coordinate grid.

### 2. Earth System Trend Detective Mode
- **Procedural 3D Earth**: Landmasses, oceans, swirling atmospheric cloud layer, and Rayleigh scattering blue rim glow.
- **Dynamic Polar Ice Caps**: Arctic sea ice and Antarctic ice sheets that physically shrink/expand on the 3D globe as the user scrubs through time from **1980 to 2026**!
- **Regional Hotspot Pins**: Interactive 3D pins marking critical observation zones:
  - *Arctic Ocean*: Sea ice collapse & albedo feedback ($-12.6\%$ / decade).
  - *Greenland Ice Sheet*: $-270\text{ Billion Tons}$ mass loss per year via GRACE-FO gravimeters.
  - *Amazon Basin*: Severe canopy drought and carbon sink-to-source transition.
  - *Great Barrier Reef*: Thermal marine heatwaves and mass coral bleaching.
  - *Thwaites Glacier*: Grounding line retreat into deep Antarctic marine basins.
  - *Sahel-Sahara Corridor*: Hydroclimatic volatility and shifting rainfall belts.

### 3. Regional Trend Divergence Engine
Addresses the critical challenge criterion: *"a variable can trend one way in one region and the opposite in another, even when the same process drives both."*
- **Arctic Greening vs. Amazon Drying**: Atmospheric warming causes high-latitude Arctic tundra to green (shrub encroachment), while simultaneously accelerating canopy moisture loss and mega-fires in the tropical Amazon.
- **Sea Level Rise vs. Glacial Rebound**: Tropical Pacific islands experience accelerating inundation ($+4.2\text{ mm/yr}$), while parts of Alaska and Scandinavia measure falling relative sea level due to post-glacial land uplift.

### 4. 3D Earth Interior Structure Cutaway (`[STRUCTURE]` View)
- Explores Earth's internal layers in a 3/4 cutaway cross-section:
  - **Crust** ($0\text{--}35\text{ km}$)
  - **Mantle** ($35\text{--}2,890\text{ km}$)
  - **Outer Core** ($2,890\text{--}5,150\text{ km}$, liquid iron-nickel convective dynamo generating Earth's protective magnetic shield)
  - **Inner Core** ($5,150\text{--}6,370\text{ km}$, solid crystal iron sphere)

### 5. Interactive Detective Case Files (`DetectiveScenariosModal.tsx`)
Four guided forensic investigations answering the 4 NASA challenge questions:
- **Case 01: The Vanishing Arctic Mirror** (Cryosphere & Albedo Feedback)
- **Case 02: The 1.5°C Planetary Thermometer** (Atmospheric Temperature Anomaly)
- **Case 03: The Rising Ocean Shoreline** (Satellite Altimetry & Ice Melt)
- **Case 04: The Amazon Rain-Pump Under Siege** (Tropical Canopy Degradation)

### 6. Timeline Scrubber (1980 to 2026) (`EarthTimelineScrubber.tsx`)
- Animated chronological playback with $1\times$, $2\times$, and $5\times$ speeds.
- Interactive slider updating Earth's 3D polar ice coverage, temperature metrics, and time-series graphs in real-time.
- Category filters: *Temperature, Cryosphere, Hydrosphere, Atmosphere, Biosphere*.

### 7. NASA Earth Science Fleet & Statistical Manual (`EarthScienceModal.tsx`)
- Detailed specifications for flagship NASA Earth observation satellites: **Terra, Aqua, GRACE-FO, ICESat-2, Landsat 9, Sentinel-6 Michael Freilich, and SWOT**.
- Deep dive into Mann-Kendall trend tests, $p$-value significance thresholds, and signal-to-noise separation.

### 8. Cloud Telemetry Case Logbook (`DetectiveLogModal.tsx`)
- Allows detectives and researchers to file investigation findings.
- Synced directly to **Supabase Cloud Database** (`earth_trend_investigations`), with automatic offline local storage fallback.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript
- **3D Graphics Engine**: Three.js (WebGL, procedural bump mapping, custom Fresnel Rayleigh atmospheric shaders, instanced asteroid particle system)
- **Styling**: Tailwind CSS v4, Lucide Icons
- **Audio Synthesis**: Native Web Audio API (procedural oscillators, frequency modulation for temperature and ice melt signals)
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel Edge Platform
- **Code-Splitting**: Modular Rollup chunks (`vendor-three`, `vendor-react`, `vendor-supabase`, `vendor-icons`) and lazy-loaded modals via `React.Suspense`.

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
Open **`http://localhost:5173`** in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 📜 Scientific Data Sources & Citations

- **NASA GISTEMP v4**: Surface Temperature Analysis (Goddard Institute for Space Studies).
- **NASA NSIDC**: Sea Ice Index & Satellite Microwave Altimetry.
- **NASA/CNES Ocean Surface Topography**: TOPEX/Poseidon, Jason-1/2/3, and Sentinel-6 Michael Freilich.
- **NASA/GFZ GRACE & GRACE-FO**: Tellus Land Ice Mass Anomaly.
- **NASA Terra & Aqua MODIS / USGS Landsat**: Normalized Difference Vegetation Index (NDVI).
- **NOAA GML / NASA OCO-2**: Atmospheric Carbon Dioxide ($\text{CO}_2$) Keeling Curve.
