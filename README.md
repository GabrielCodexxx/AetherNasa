# AETHER: NASA Earth System Trend Detective 🌍🔭
**Official NASA Space Apps Challenge 2026 Submission** | *Challenge: Be An Earth System Trend Detective!*  
* **Live Web Application**: [https://aether-nasa.vercel.app](https://aether-nasa.vercel.app) *(No login, registration, or password required)*  
* **Open-Source GitHub Repository**: [https://github.com/GabrielCodexxx/AetherNasa](https://github.com/GabrielCodexxx/AetherNasa)  
* **Lead Detective / Team**: Gabriel Portillo (Aether Detective Team)  
* **Formal Presentation 1 (7-Slide Pitch Deck)**: [Google Slides Presentation](https://docs.google.com/presentation/d/1B2-Z6bPb98kSZnAZ7M3P_sJs-tFniLMJwZksukS8UYE/edit) | [Download PDF](presentation/AETHER_NASA_Pitch_Deck.pdf) | [Interactive Deck](presentation/index.html)  
* **Formal Presentation 2 (30-Second Video Walkthrough)**: [Interactive 30s Teleprompter & Storyboard](presentation/video_walkthrough.html)  

---

## 🌟 Mission Overview & Objective

> *"Change is always occurring in the Earth’s interconnected environmental system, and when it runs in a consistent direction – rising or falling, increasing or decreasing, thickening or thinning – measured variables reflect it. But a measured Earth science data variable can trend one way in one region and the opposite way in another, even when the same process drives both. The multitude of Earth science data variables makes it difficult to select variables that could indicate change, and to then perform an analysis on the selected variables. Your challenge is to create a tool that can select variables measured by Earth science missions or produced by Earth science models, visualize how they change over time, and determine what is changing, where it is changing, how much it is changing, and if these changes are what scientists call 'significant.'"*

**Aether** solves this challenge by pairing a high-performance **3D planetary digital twin running at 60 FPS** with an empirical forensic workstation answering the 4 foundational NASA challenge questions:
1. **WHAT is changing?** (The measured satellite variable, baseline, and physical unit)
2. **WHERE is it changing?** (3D geographic hotspots and dual-pole regional divergence analysis)
3. **HOW MUCH is it changing?** (Decadal rate of change and cumulative anomaly)
4. **IS IT WHAT SCIENTISTS CALL "SIGNIFICANT"?** (Mann-Kendall trend tests and statistical $p$-values $< 0.001$, mathematically isolating genuine signals from environmental noise)

---

## 🏆 Official Judging Responses ("Questions to Consider")

### 1. What does your project do, and how does it work?
Aether synthesizes 40 years of calibrated NASA Earth observation data into an accessible, 3D WebGL digital twin. Users travel through time using a 1980–2026 multi-decadal scrubber to observe physical planetary responses in real time—such as the $-12.6\%$ per decade retreat of Arctic sea ice and corresponding high-latitude albedo shifts. The system isolates the 4 key questions (What, Where, How Much, and Is It Significant) using non-parametric Mann-Kendall trend tests ($p < 0.001$). Additionally, users can explore internal 3D planetary cutaways (Crust, Mantle, Outer Core, Inner Core) to understand how deep-Earth geodynamics sustain our magnetosphere, and sync forensic case files to a live Supabase PostgreSQL cloud database.

### 2. What benefits does it have?
- **Breaks Down Data Silos**: Consolidates fragmented telemetry from NASA PODAAC, GES DISC, Earthdata, and NSIDC into a unified, interactive viewport.
- **Filters Noise from Signal**: Distinguishes authentic multi-decadal trajectories from short-term oscillations (ENSO, seasonal anomalies, volcanic aerosols).
- **Reveals Regional Divergence**: Demonstrates how a single underlying forcing (atmospheric warming) creates opposing regional trends simultaneously (e.g. Arctic greening vs. Amazon drying; tropical sea level inundation vs. post-glacial land uplift).
- **Universal Zero-Barrier Access**: Runs smoothly at 60 FPS on any browser without downloads, installation, or user registration.

### 3. What is the intended impact?
- **Classrooms & STEM Education**: Transforms students from passive textbook readers into active "Earth System Detectives" who formulate hypotheses and analyze real satellite evidence.
- **Journalism & Science Communication**: Provides empirically vetted charts and briefing cards to counter climate misinformation with verifiable NASA records.
- **Global Citizen Science**: Enables community-driven investigation logging and distributed climate monitoring via cloud-synced case records.

### 4. What tools did you use?
- **Frontend & Framework**: React 19, TypeScript, Vite.
- **3D Graphics Engine**: Three.js, WebGL, custom Rayleigh atmospheric scattering shaders, instanced asteroid particle system.
- **Design & UI**: Tailwind CSS v4, Lucide Icons, glassmorphism light-mode UI, geometric precision styling (strictly zero circular pin dots).
- **Database & Cloud Storage**: Supabase (PostgreSQL with Row-Level Security).
- **Audio Sonification**: Native Web Audio API procedural synthesizers converting decadal anomaly rates into harmonic audio frequencies.
- **Deployment**: Vercel Global Edge Network with continuous GitHub CI/CD integration.
- **NASA Data Sources**: NASA GISTEMP v4, GRACE & GRACE-FO Tellus, Sentinel-6 Michael Freilich / Jason-3, OCO-2 Keeling data, and MODIS Terra/Aqua NDVI.

### 5. How is your project creative?
- **Solar System Context**: Places Earth in its true celestial environment with real orbital physics, planetary comparisons (Venus, Mars), and the Asteroid Belt.
- **Internal-to-External Geodynamics**: Integrates 3D interior core cutaways with surface and atmospheric telemetry, connecting molten core convection to atmospheric protection.
- **Procedural Soundscapes**: Dynamically generates procedural audio that allows auditory learners to "hear" warming acceleration and ice loss trajectories.
- **Forensic Case Missions**: Replaces passive dashboards with interactive mystery scenarios ("The Vanishing Arctic Mirror", "The 1.5°C Planetary Thermometer").

### 6. What factors did your team consider?
- **Scientific Rigor vs. Cognitive Load**: Preserved mathematical depth (Mann-Kendall $\tau$, Sen's slopes, $p$-values) while keeping the visual interface intuitive and engaging.
- **Rendering Performance**: Implemented frustum culling, instanced meshes for 2,000 asteroids, and throttled projection updates to guarantee a locked 60 FPS without GPU thermal throttling.
- **NASA Challenge Eligibility**: Built strict adherence to the $\le 7$ slides or $\le 30$ seconds video limits, zero authentication gates, and open-source licensing.
- **Offline Resilience**: Built transparent fallback to browser `localStorage` ensuring uninterrupted field exploration even without an internet connection.

---

## 📊 Dual Formal Presentation Formats

### Format A: Official 7-Slide Pitch Deck (Strict $\le 7$ Limit)
* **Google Slides Link**: [View on Google Slides](https://docs.google.com/presentation/d/1B2-Z6bPb98kSZnAZ7M3P_sJs-tFniLMJwZksukS8UYE/edit)
* **Direct Downloads**: [presentation/AETHER_NASA_Pitch_Deck.pdf](presentation/AETHER_NASA_Pitch_Deck.pdf) | [presentation/AETHER_NASA_Pitch_Deck.pptx](presentation/AETHER_NASA_Pitch_Deck.pptx)
* **Interactive In-Browser Presentation**: Open [presentation/index.html](presentation/index.html) in any browser for a responsive 16:9 fullscreen presenter with speaker notes.

| Slide # | Title & Theme | Key Content |
| :---: | :--- | :--- |
| **Slide 1** | **Identity & Mission** | AETHER: Planetary & Earth System Trend Detective • 40 Years of NASA Telemetry • Live App & Repo Links |
| **Slide 2** | **The Problem** | Drowning in Environmental Noise • Data Silos • Signal vs. Noise • Regional Divergence Paradox |
| **Slide 3** | **The Solution** | 60 FPS Three.js Orbital Digital Twin • 40-Year Scrubber (1980–2026) • Zero-Dots Geometric HUD |
| **Slide 4** | **Scientific Rigor** | Primary NASA Streams (GISTEMP, GRACE, Sentinel-6, OCO-2, MODIS) • Mann-Kendall Sieve ($p < 0.001$) |
| **Slide 5** | **Breakthrough Innovation** | 3D Interior Geodynamics Cutaway (Core to Crust) • Dual-Pole Divergence Thermal Heatmap |
| **Slide 6** | **Citizen Science** | Detective Logbook • Supabase Cloud PostgreSQL Sync • Procedural Audio Sonification • Offline-First |
| **Slide 7** | **Global Impact** | Live Public Deployment • 100% Open Source • NASA Compliance Checklist • Roadmap Q1 2027 |

---

### Format B: Official 30-Second Video Presentation (Strict $\le 30.0$s Limit)
* **Interactive Rehearsal Studio**: Open [presentation/video_walkthrough.html](presentation/video_walkthrough.html) for a live 30.00s countdown timer and synchronized script prompter.
* **Duration**: Exactly **29.5 seconds**
* **Word Count**: Exactly **74 words** (~148 words/minute)

| Timestamp | Visual Action on `aether-nasa.vercel.app` | Spoken Voiceover Script |
| :---: | :--- | :--- |
| **0:00 – 0:05** | Start full screen on 3D cosmos. Click **Earth** to zoom into orbit with satellite constellation. | *"Our planet is changing, but across 40 years of satellite records, critical signals are drowned in noise."* |
| **0:05 – 0:13** | Drag **Timeline Scrubber** from 1980 to 2026. Right dossier graph animates temperature climbing $+1.39^\circ\text{C}$. | *"Meet **Aether** — the NASA Earth System Trend Detective, synthesizing four decades of GISTEMP, GRACE, and Sentinel telemetry into an interactive 3D digital twin."* |
| **0:13 – 0:22** | Click **"Structure"** to reveal Earth's 3D core cutaway. Toggle **"Lens"** to show Arctic thermal divergence heatmap. | *"Explore internal geodynamics through 3D structural cutaways, uncover localized regional divergence with thermal heatmaps, and isolate statistically significant trends with one click."* |
| **0:22 – 0:30** | Click **"Logbook"** showing live Supabase cloud sync. Zoom out to full cosmos with live URL card: **`aether-nasa.vercel.app`**. | *"Powered by open science and live cloud data, Aether turns complex telemetry into actionable planetary intelligence. Discover more at aether-nasa.vercel.app."* |

---

## 💾 Supabase Database Architecture

The application connects to a cloud-hosted PostgreSQL database on Supabase:
* **Project Reference**: `toakvrrofklcjwyjahcp`
* **Project URL**: `https://toakvrrofklcjwyjahcp.supabase.co`
* **Schema Definition**: See [supabase/schema.sql](supabase/schema.sql)
* **Tables**:
  * `earth_trend_investigations`: Stores detective investigation logs (callsign, variable, year, empirical verdict, notes).
  * `global_leaderboard`: Tracks gamified simulation survival, crisis resolution, and planetary stability metrics.
  * Secured via **Row-Level Security (RLS)** allowing public authenticated and anonymous investigation filing.

---

## 📜 Scientific Data Sources & NASA Citations

1. **NASA GISTEMP v4**: Surface Temperature Analysis (*Goddard Institute for Space Studies / GISS*).
2. **NASA / GFZ GRACE & GRACE-FO Tellus**: Gravimetric Mass Balance and Equivalent Water Thickness (*Jet Propulsion Laboratory*).
3. **NASA / CNES Sentinel-6 Michael Freilich & Jason-3**: Ocean Surface Topography and Global Mean Sea Level Radar Altimetry (*PO.DAAC*).
4. **NASA OCO-2 & NOAA GML**: Orbiting Carbon Observatory Column Densities & Global Monitoring Laboratory Keeling Curve.
5. **NASA Terra & Aqua MODIS / USGS Landsat**: Normalized Difference Vegetation Index (NDVI) and Surface Albedo.

---

## 💻 Local Development Setup

```bash
# Clone the repository
git clone https://github.com/GabrielCodexxx/AetherNasa.git
cd AetherNasa

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to explore Aether locally.
