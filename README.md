# Rover Route Planner 🚀
**2026 NASA Space Apps Challenge** | *Challenge: Build a Junior Astronaut Mission Trainer*  
**Category:** Logic, Algorithmic Pathfinding & Resource Management  
**Database:** Supabase (PostgreSQL) | **Deployment:** Vercel Edge

---

## 🌟 The Concept

**Rover Route Planner** is a grid-based, top-down algorithmic pathfinding puzzle game where players program a lunar rover's command sequence before it starts moving. 

Mimicking authentic NASA rover operations (such as the **VIPER lunar rover** and **Mars Perseverance**), players cannot steer the rover in real-time with a joystick due to space communication latency. Instead, they must analyze orbital satellite maps (from the **Lunar Reconnaissance Orbiter**), calculate terrain friction, plan an optimal route, and transmit the command sequence.

---

## 🎮 Core Gameplay Loop

1. **Command Phase (Planning)**:
   - Survey the top-down 8x8 or 10x10 lunar grid map.
   - Click adjacent tiles to draw a continuous route from the **Landing Zone 🚀** to the **Primary Target 🎯**.
   - Watch the colorful **Battery Meter** physically drain in real-time, giving immediate visual feedback on the power budget.
   - Use **Undo Step ↩️** or **Clear Route 🔄** to iterate and optimize freely.
2. **Commitment**:
   - Press **"Transmit Sequence to Rover 🚀"** to lock the path.
3. **Execution Phase**:
   - The rover physically executes the route tile-by-tile.
   - Battery points and Science Stars are dynamically updated with audio-visual feedback.
4. **Mission Debrief**:
   - **Mission Success**: Reached target with battery remaining (+ bonus for Water Ice scans).
   - **System Failure**: Explains the exact engineering root cause (e.g., ran out of battery in Loose Sand) with an immediate **"🔄 Retry Route"** button.

---

## 🪨 Terrain Mechanics & Engineering Trade-Offs

| Tile Type | Terrain | Battery Cost / Effect | Engineering Trade-off |
| :--- | :--- | :--- | :--- |
| 🌑 | **Smooth Basalt Plains** | **-1 Battery Point** | Fast, standard travel across lunar volcanic plains. |
| 🏜️ | **Loose Regolith (Sand)** | **-2 Battery Points** | Abrasive sand causes wheel slippage, requiring high motor torque. |
| 🪨 | **Crater Rim / Boulders** | **Impassable Obstacle** | Must route around, forcing players into potential sand traps. |
| ☀️ | **Solar Ridge (Sunlight Zone)** | **+2 Battery Points** | High peaks of eternal light recharge solar panels. |
| 🧊 | **Water Ice Deposit** | **-3 Battery Points & +1 Star ⭐** | Secondary science scan. Can you afford the battery detour? |

---

## 🗺️ Progressive 10-Sector Campaign (Real NASA Topography)

1. **Sector 1: Shackleton Crater Rim** (8x8) – Tutorial: Basic movement & boulder avoidance.
2. **Sector 2: Malapert Mountain Summit** (8x8) – Serpentine path through high impact rocks.
3. **Sector 3: Nobile Crater Rim** (8x8) – Introduction of Water Ice detour decisions.
4. **Sector 4: Faustini Trench** (8x8) – Crossing loose regolith sand traps.
5. **Sector 5: Haworth Crater Slopes** (8x8) – Safe long basalt vs. risky short regolith route.
6. **Sector 6: Shoemaker Crater Ridge** (8x8) – Introduction of Solar Ridge recharge mechanics.
7. **Sector 7: Amundsen Crater Plains** (8x8) – Tight power budget requiring solar recharge.
8. **Sector 8: Oceanus Procellarum** (10x10) – Large plain with multiple Water Ice deposits.
9. **Sector 9: Mare Tranquillitatis Heritage** (10x10) – Apollo 11 historical landing site maze.
10. **Sector 10: South Pole-Aitken Grand Basin** (10x10) – The ultimate test: chaining solar ridges to gather 3 Science Stars!

---

## 🍎 Teacher's Guide Tab (Hackathon Winner Feature)

Click the **"Teacher's Guide"** button on the main navigation for a complete **4th–6th Grade STEM & Computer Science Lesson Plan**:
- **Core Standard**: CSTA K-12 Computer Science (1B-AP-10: Algorithmic Sequencing) & NGSS (3-5-ETS1-2).
- **45-Minute Classroom Activity ("Mission Control & Rover")**: Pair students where one acts as **Houston Mission Control** (calculating the code on paper) and the other acts as the **Autonomous Rover** (transmitting the code).
- **Discussion Prompts**: *"Why doesn't NASA just drive rovers in a straight line?"* and *"Why can't we drive space rovers with a joystick?"*
- **Printable Curriculum**: One-click print-ready worksheet.

---

## 🛠️ Quickstart

```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
