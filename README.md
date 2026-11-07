# AETHER: Junior Astronaut Mission Trainer 🚀
**2026 NASA Space Apps Challenge** | *Challenge: Build a Junior Astronaut Mission Trainer*  
**Database:** Supabase (PostgreSQL + Realtime) | **Deployment:** Vercel Edge

---

## 🌟 Mission Overview

Space-themed STEM tools for kids often fall into two traps: they either oversimplify real space missions into mindless arcades, or overwhelm students with dry textbook numbers.

**AETHER** bridges this gap. It places junior astronauts (ages 8–16) in the commander's seat of an **Artemis Lunar Base Camp** (*Shackleton Crater Rim*) or an **Ares Mars Pioneer Hab** (*Jezero Crater*). Cadets balance genuine Environmental Control & Life Support System (ECLSS) trade-offs, manage energy between Kilopower fission reactors and solar arrays, and resolve live space weather alerts from **NASA DONKI**.

---

## 🛰️ Key Features

1. **Dual Mission Theaters**:
   - **Artemis Lunar Base Camp**: Permanent crater ice extraction, peaks of eternal light solar tracking, and micrometeorite protection.
   - **Mars Jezero Hab**: 24h 39m Sol day cycles, thin $CO_2$ atmosphere, and dust storm solar occlusion.
2. **NASA ECLSS Simulation Engine**:
   - Closed-loop oxygen ($O_2$) & water ($H_2O$) regeneration mimicking the ISS 98% recycling standard.
   - Power grid balancing (Kilopower KRUSTY reactor + solar wings).
   - Hydroponic/aeroponic food production & regolith radiation shielding.
3. **NASA DONKI Space Weather Crisis Engine**:
   - Real-time sirens and automated emergency protocols.
   - Scenarios: Class X Solar Flares, Coronal Mass Ejections (CME), Martian dust squalls, ECLSS condenser clogs.
4. **EVA Spacewalk Mini-Drill**:
   - Interactive 60fps microgravity spacewalk drill using HTML5 Canvas.
   - Maneuver MMU thrusters to patch damaged exterior hull sensors and comms antennas before suit $O_2$ depletes.
5. **Cadet Flight Academy & Badge Shelf**:
   - Rank progression (*Junior Cadet* $\rightarrow$ *Mission Specialist* $\rightarrow$ *Systems Engineer* $\rightarrow$ *Base Commander*).
   - Unlockable digital mission patches and NASA scientific knowledge base.
6. **Supabase Cloud Database & Leaderboard**:
   - Persistent cadet records and global high-score transmission using Supabase PostgreSQL.
   - Offline-first fallback to ensure 100% judge uptime.

---

## 🏗️ Architecture & Code Splitting

Built according to Principal Engineering standards:
- **Clean Code Chunks**: Secondary modules (`OutpostMap`, `EvaMiniGame`, `CadetAcademy`, `LeaderboardModal`) are lazy-loaded on demand via `React.lazy` and `Suspense`.
- **Zero-Dependency Web Audio**: Procedural synthesized sound design (beeps, alarms, triumph chimes) using the browser's native Web Audio API.
- **Tailwind CSS v4 & Lucide Icons**: High-contrast, dark-mode NASA Mission Control HUD interface.

```
dist/
├── assets/
│   ├── index-Crq811jK.js            30.1 kB (10.3 kB gzipped) [Core Shell]
│   ├── OutpostMap-Dhwy8V5x.js        5.3 kB [Lazy Chunk]
│   ├── EvaMiniGame-d0odRyjw.js       7.7 kB [Lazy Chunk]
│   ├── CadetAcademy-BjvefW_Y.js     16.0 kB [Lazy Chunk]
│   ├── LeaderboardModal-BVcDkorI.js  6.0 kB [Lazy Chunk]
│   ├── vendor-icons-Bbmp0E2g.js     19.0 kB [Vendor Chunk]
│   ├── vendor-react-CM3h1Oa2.js    210.9 kB [Vendor Chunk]
│   └── vendor-supabase-D_8df79H.js 216.0 kB [Vendor Chunk]
```

---

## 🛠️ Quickstart

### 1. Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Production Build
```bash
npm run build
npm run preview
```

### 3. Deploy to Vercel
```bash
npx vercel
```
