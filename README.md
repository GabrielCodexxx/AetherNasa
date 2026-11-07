# Lunar Resource Manager 🚀
**2026 NASA Space Apps Challenge** | *Challenge: Build a Junior Astronaut Mission Trainer*  
**Database:** Supabase (PostgreSQL) | **Deployment:** Vercel Edge

---

## 🌟 Game Objective

The player acts as the Commander of **Artemis Outpost** at Shackleton Crater. The goal is to **survive 10 "Sols" (lunar days)** by balancing three critical resources while responding to environmental hazards. If any resource drops to zero, the mission pauses, explains the engineering root cause, and allows the player to **retry the day**, reinforcing the fundamental NASA concept that **engineers learn from failure**.

---

## 🎮 Core Game Mechanics

### 1. The Resource Economy (3 Core Lifelines)
- **Solar Power (Battery Level 0–100%) [Yellow]**: The primary currency. Generates +20% per turn under clear skies.
- **Oxygen (Life Support 0–100%) [Blue]**: Depletes by -10% naturally every turn. Player spends 10% Solar Power to generate +15% Oxygen.
- **Radiation Shielding (Base Integrity 0–100%) [Green]**: Depletes by -5% naturally every turn. Player spends 15% Solar Power to charge shields by +20%.

### 2. The 3-Phase Turn-Based Loop
A turn-based structure allows students (ages 7–14, 2nd–3rd grade through middle school) to calmly analyze trade-offs without the panic of real-time decay:
1. **Phase 1: Daily Mission Briefing**: Daily weather announcement (Clear Skies, Solar Flare, Moon Dust Squall, Eclipse) with real NASA fact snippets.
2. **Phase 2: Power Allocation**: Simple, large touch-friendly `+` and `-` buttons to allocate available battery power to Oxygen and Shields.
3. **Phase 3: Execute Sol**: Click "Execute Sol (End Day)". Animate resource dynamics, apply daily hazard damage, and evaluate base survival.

### 3. Environmental Hazards (The Trade-offs)
- **Clear Skies**: +20% solar power. Natural -10% Oxygen and -5% Shields.
- **Solar Storm**: Radiation Shielding takes a massive **-40% damage hit**! Player must divert maximum power to shields, meaning they cannot afford to make oxygen that Sol.
- **Lunar Dust Storm**: Electrostatic dust coats solar arrays. Power generation drops from **20% to only 5%**. Player must survive on stored battery reserves.
- **Eclipse**: Zero (0%) power generation for one Sol. Tests if the player has been storing excess battery power or spending it all every day.

### 4. Constructive Failure
- Replaces generic "Game Over" with **"SYSTEM FAILURE"**.
- Provides an authentic engineering post-mortem: *"Your batteries completely drained because you charged shields during a dust storm when solar input was low."*
- Features a **"🔄 Retry Sol [X] (Engineers Learn From Failure)"** button that restores the day's starting conditions so cadets can iterate and solve the problem.

---

## 🏆 Why It Wins
- **NASA Challenge Guideline Alignment**: The challenge explicitly states that focusing on **two or three core resources** is significantly more pedagogically effective for this age group than overwhelming them with 5 or 6 meters.
- **Direct Consequence Learning**: Clear, visual cues alongside numbers (e.g. astronaut face smiles at >50% O₂, looks worried at <30%, and turns red at <10%).
- **Zero-Install & Touch Friendly**: Runs instantly on laptops, tablets, and Chromebooks via standard browser URL.
- **Clean Code Chunks**: Sub-40kB initial payload with lazy-loaded modals.

---

## 🛠️ Quickstart

```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
