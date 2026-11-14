import json
import subprocess
import time
import os

PRES_TITLE = "AETHER - NASA Space Apps Challenge 2026 Pitch Deck"

def run_gslides(cmd):
    for attempt in range(5):
        try:
            res = subprocess.check_output(f'gslides {cmd}', shell=True, stderr=subprocess.STDOUT, text=True)
            return res
        except subprocess.CalledProcessError as e:
            err = e.output.strip()
            print(f"Attempt {attempt+1} error: {err}")
            time.sleep(2)
    raise RuntimeError(f"Command failed after 5 attempts: {cmd}")

def build_batch_ops():
    ops = [
        # Slide 1 (slide ID "p" created automatically by create)
        {"op": "delete-element", "element": "i0"},
        {"op": "delete-element", "element": "i1"},
        {"op": "set-background", "slide": "p", "color": "#070d1e"},
        {"op": "add-textbox", "slide": "p", "text": "NASA SPACE APPS CHALLENGE 2026 • GLOBAL COMPETITION", "x": 60, "y": 25, "width": 600, "height": 25, "font_size": 11, "bold": True, "color": "#38bdf8", "alignment": "center"},
        {"op": "add-textbox", "slide": "p", "text": "AETHER", "x": 60, "y": 55, "width": 600, "height": 65, "font_size": 48, "bold": True, "color": "#ffffff", "alignment": "center"},
        {"op": "add-textbox", "slide": "p", "text": "Planetary & Earth System Trend Detective", "x": 60, "y": 120, "width": 600, "height": 30, "font_size": 18, "bold": True, "color": "#38bdf8", "alignment": "center"},
        {"op": "add-textbox", "slide": "p", "text": "Synthesizing 40 Years of NASA Earth Observation Telemetry into an Interactive 3D Digital Twin", "x": 80, "y": 155, "width": 560, "height": 40, "font_size": 13, "color": "#94a3b8", "alignment": "center"},
        {"op": "add-textbox", "slide": "p", "text": "FORENSIC ENGINE\n\n• Real-Time WebGL/Three.js at 60 FPS\n• 1980–2026 Multi-Decadal Scrubber\n• Mann-Kendall Statistical Sieve (p < 0.001)\n• 3D Planetary Internal Cutaways", "x": 60, "y": 205, "width": 290, "height": 130, "font_size": 11, "color": "#e2e8f0", "background_color": "#0f172a"},
        {"op": "add-textbox", "slide": "p", "text": "OFFICIAL SUBMISSION\n\n• Challenge: Be An Earth System Trend Detective!\n• Live Web App: https://aether-nasa.vercel.app\n• GitHub: github.com/GabrielCodexxx/AetherNasa\n• Team: Aether Detective Team (Gabriel Portillo)", "x": 370, "y": 205, "width": 290, "height": 130, "font_size": 11, "color": "#e2e8f0", "background_color": "#0f172a"},
        {"op": "add-textbox", "slide": "p", "text": "Publicly Accessible • Zero Registration Required • 100% Open Source", "x": 60, "y": 355, "width": 600, "height": 25, "font_size": 10, "color": "#64748b", "alignment": "center"},
        {"op": "set-notes", "slide": "p", "text": "Good day, judges. We are proud to present Aether — an interactive 3D planetary digital twin that transforms four decades of NASA Earth satellite observations into an open-access forensic investigation workstation."},

        # Slide 2: The Problem
        {"op": "add-slide", "layout": "BLANK", "id": "SLIDE_2"},
        {"op": "set-background", "slide": "SLIDE_2", "color": "#070d1e"},
        {"op": "add-textbox", "slide": "SLIDE_2", "text": "THE PROBLEM: DROWNING IN ENVIRONMENTAL NOISE", "x": 50, "y": 20, "width": 620, "height": 35, "font_size": 20, "bold": True, "color": "#ffffff"},
        {"op": "add-textbox", "slide": "SLIDE_2", "text": "Why Detecting Genuine Planetary Trajectories is Difficult for Citizens and Scientists", "x": 50, "y": 55, "width": 620, "height": 20, "font_size": 12, "color": "#38bdf8"},
        {"op": "add-textbox", "slide": "SLIDE_2", "text": "1. Data Fragmentation & Silos\nTerabytes of vital telemetry scattered across disparate databases (PODAAC, GES DISC, Earthdata, NSIDC), making holistic system analysis nearly impossible for non-specialists.", "x": 50, "y": 85, "width": 300, "height": 115, "font_size": 11, "color": "#e2e8f0", "background_color": "#0f172a"},
        {"op": "add-textbox", "slide": "SLIDE_2", "text": "2. Signal vs. Noise Dilemma\nShort-term weather oscillations (ENSO, seasonal anomalies, volcanic aerosols) mask authentic, decadal climate trends, leading to widespread misinterpretation.", "x": 370, "y": 85, "width": 300, "height": 115, "font_size": 11, "color": "#e2e8f0", "background_color": "#0f172a"},
        {"op": "add-textbox", "slide": "SLIDE_2", "text": "3. The Regional Divergence Paradox\nA single underlying forcing (global warming) causes opposite physical responses simultaneously (e.g. Arctic greening vs. Amazon drying; polar ice loss vs. post-glacial rebound).", "x": 50, "y": 215, "width": 300, "height": 115, "font_size": 11, "color": "#e2e8f0", "background_color": "#0f172a"},
        {"op": "add-textbox", "slide": "SLIDE_2", "text": "4. The Public Accessibility Barrier\nComplex mathematical formats and gated academic tools prevent students, educators, and journalists from verifying empirical climate evidence directly.", "x": 370, "y": 215, "width": 300, "height": 115, "font_size": 11, "color": "#e2e8f0", "background_color": "#0f172a"},
        {"op": "add-textbox", "slide": "SLIDE_2", "text": "NASA Space Apps 2026 Objective: Answer What, Where, How Much, and Is It Significant?", "x": 50, "y": 345, "width": 620, "height": 35, "font_size": 11, "bold": True, "color": "#38bdf8", "background_color": "#1e293b", "alignment": "center"},
        {"op": "set-notes", "slide": "SLIDE_2", "text": "Our planet's vital signs are changing, but raw telemetry is vast and fragmented. Citizen scientists and students often struggle to separate temporary weather noise from authentic, statistically significant planetary trends."},

        # Slide 3: The Solution
        {"op": "add-slide", "layout": "BLANK", "id": "SLIDE_3"},
        {"op": "set-background", "slide": "SLIDE_3", "color": "#070d1e"},
        {"op": "add-textbox", "slide": "SLIDE_3", "text": "THE SOLUTION: AETHER 3D DIGITAL TWIN", "x": 50, "y": 20, "width": 620, "height": 35, "font_size": 20, "bold": True, "color": "#ffffff"},
        {"op": "add-textbox", "slide": "SLIDE_3", "text": "Instant, Browser-Based 60 FPS Earth System Intelligence at aether-nasa.vercel.app", "x": 50, "y": 55, "width": 620, "height": 20, "font_size": 12, "color": "#38bdf8"},
        {"op": "add-textbox", "slide": "SLIDE_3", "text": "ORBITAL MECHANICS\n\n• High-fidelity Three.js WebGL at 60 FPS\n• Complete solar system context\n• Real-time orbital paths for Terra, Aqua, GRACE-FO, ICESat-2, Sentinel-6\n• NASA Blue Marble 2K textures", "x": 50, "y": 85, "width": 195, "height": 245, "font_size": 10, "color": "#e2e8f0", "background_color": "#0f172a"},
        {"op": "add-textbox", "slide": "SLIDE_3", "text": "40-YEAR SCRUBBER\n\n• Travel from 1980 to 2026\n• Procedural Earth response reflects decadal warming\n• Visual polar ice cap retreat (-12.6% per decade)\n• Albedo feedback and high-latitude vegetation shift simulation", "x": 260, "y": 85, "width": 200, "height": 245, "font_size": 10, "color": "#e2e8f0", "background_color": "#0f172a"},
        {"op": "add-textbox", "slide": "SLIDE_3", "text": "GEOMETRIC HUD\n\n• Precision glassmorphic HUD\n• Zero-circular-dot design rule: diamond telemetry pins\n• Real-time anomaly charts and decadal rate indicators\n• Procedural Web Audio API soundscape synthesis", "x": 475, "y": 85, "width": 195, "height": 245, "font_size": 10, "color": "#e2e8f0", "background_color": "#0f172a"},
        {"op": "add-textbox", "slide": "SLIDE_3", "text": "Zero Install • Zero Sign-Up • Runs on Mobile, Tablet, Laptop, and 4K Displays", "x": 50, "y": 345, "width": 620, "height": 35, "font_size": 11, "bold": True, "color": "#34d399", "background_color": "#1e293b", "alignment": "center"},
        {"op": "set-notes", "slide": "SLIDE_3", "text": "Aether solves this by unifying Earth's environmental systems in a fluid 3D digital twin. Users can scrub across 40 years of history, observing real-time physical responses across atmosphere, oceans, and ice caps."},

        # Slide 4: Scientific Rigor & NASA Data
        {"op": "add-slide", "layout": "BLANK", "id": "SLIDE_4"},
        {"op": "set-background", "slide": "SLIDE_4", "color": "#070d1e"},
        {"op": "add-textbox", "slide": "SLIDE_4", "text": "SCIENTIFIC RIGOR & NASA DATA INTEGRATION", "x": 50, "y": 20, "width": 620, "height": 35, "font_size": 20, "bold": True, "color": "#ffffff"},
        {"op": "add-textbox", "slide": "SLIDE_4", "text": "Primary Satellite Telemetry Validated Through Non-Parametric Statistics", "x": 50, "y": 55, "width": 620, "height": 20, "font_size": 12, "color": "#38bdf8"},
        {"op": "add-textbox", "slide": "SLIDE_4", "text": "PRIMARY NASA DATA STREAMS\n\n• NASA GISTEMP v4: Surface temperature anomalies (+1.39°C global mean warming)\n• NASA/GFZ GRACE & GRACE-FO: Gravimetric mass balance (-270 Gt/yr Greenland, -135 Gt/yr Antarctic ice loss)\n• Sentinel-6 & Jason-3: Radar altimetry (+4.2 mm/yr sea level rise)\n• NASA OCO-2 & NOAA GML: Atmospheric CO2 column densities (426 ppm)\n• NASA MODIS Terra/Aqua: NDVI vegetation greening/browning", "x": 50, "y": 85, "width": 300, "height": 245, "font_size": 10, "color": "#e2e8f0", "background_color": "#0f172a"},
        {"op": "add-textbox", "slide": "SLIDE_4", "text": "MATHEMATICAL FORENSIC SIEVE\n\n• Mann-Kendall Monotonic Test: Non-parametric rank correlation proving non-random trajectory (p < 0.001)\n• Sen's Slope Estimator: Robust median-based slope calculation resistant to sensor outliers\n• Statistical Significance Locks: Verified at p < 0.05, p < 0.01, and p < 0.001 levels\n• Noise Filtering: Prevents temporary seasonal anomalies from triggering false trend alarms", "x": 370, "y": 85, "width": 300, "height": 245, "font_size": 10, "color": "#e2e8f0", "background_color": "#0f172a"},
        {"op": "add-textbox", "slide": "SLIDE_4", "text": "100% Scientifically Vetted: Turning Raw Satellite Data into Defensible Climate Intelligence", "x": 50, "y": 345, "width": 620, "height": 35, "font_size": 11, "bold": True, "color": "#38bdf8", "background_color": "#1e293b", "alignment": "center"},
        {"op": "set-notes", "slide": "SLIDE_4", "text": "Every trend in Aether is mathematically validated. By implementing Mann-Kendall trend tests and Sen's slope calculations, Aether verifies non-random change with 99.9% scientific confidence."},

        # Slide 5: Breakthrough Innovation
        {"op": "add-slide", "layout": "BLANK", "id": "SLIDE_5"},
        {"op": "set-background", "slide": "SLIDE_5", "color": "#070d1e"},
        {"op": "add-textbox", "slide": "SLIDE_5", "text": "BREAKTHROUGH INNOVATION: CUTAWAYS & DIVERGENCE", "x": 50, "y": 20, "width": 620, "height": 35, "font_size": 20, "bold": True, "color": "#ffffff"},
        {"op": "add-textbox", "slide": "SLIDE_5", "text": "From Planetary Core Geodynamics to Polar Thermal Amplification", "x": 50, "y": 55, "width": 620, "height": 20, "font_size": 12, "color": "#38bdf8"},
        {"op": "add-textbox", "slide": "SLIDE_5", "text": "3D PLANETARY INTERIOR CUTAWAYS\n\n• 3/4 cutaway cross-section revealing Earth's Crust, Mantle, Outer Core, and Inner Core\n• Interactive geometric callout badges with depth kilometers\n• Geodynamic Connection: Illustrates how outer core convection drives the planetary geodynamo\n• Connects mantle plumes and tectonic plate boundaries with surface atmospheric retention", "x": 50, "y": 85, "width": 300, "height": 245, "font_size": 10, "color": "#e2e8f0", "background_color": "#0f172a"},
        {"op": "add-textbox", "slide": "SLIDE_5", "text": "DUAL-POLE DIVERGENCE THERMAL LENS\n\n• Visualizes Arctic Amplification: polar warming accelerating at 4x the global planetary average\n• Regional Divergence Mapping: contrasting Northern tundra greening against low-latitude forest desiccation\n• Altimetry Discrepancies: explains sea level rise in Pacific atolls vs. relative sea drop in post-glacial rebounding Scandinavia", "x": 370, "y": 85, "width": 300, "height": 245, "font_size": 10, "color": "#e2e8f0", "background_color": "#0f172a"},
        {"op": "add-textbox", "slide": "SLIDE_5", "text": "Comparative Planetology: Exploring Why Earth Remains Habitable While Venus and Mars Diverged", "x": 50, "y": 345, "width": 620, "height": 35, "font_size": 11, "bold": True, "color": "#34d399", "background_color": "#1e293b", "alignment": "center"},
        {"op": "set-notes", "slide": "SLIDE_5", "text": "Aether goes beyond typical surface maps. We introduce 3D interior cutaways to connect mantle convection with atmospheric retention, alongside a divergence lens that exposes Arctic amplification in real time."},

        # Slide 6: Citizen Science & Cloud Sync
        {"op": "add-slide", "layout": "BLANK", "id": "SLIDE_6"},
        {"op": "set-background", "slide": "SLIDE_6", "color": "#070d1e"},
        {"op": "add-textbox", "slide": "SLIDE_6", "text": "CITIZEN SCIENCE & SUPABASE CLOUD SYNC", "x": 50, "y": 20, "width": 620, "height": 35, "font_size": 20, "bold": True, "color": "#ffffff"},
        {"op": "add-textbox", "slide": "SLIDE_6", "text": "Empowering Distributed Global Climate Investigation and Classroom Collaboration", "x": 50, "y": 55, "width": 620, "height": 20, "font_size": 12, "color": "#38bdf8"},
        {"op": "add-textbox", "slide": "SLIDE_6", "text": "DETECTIVE LOGBOOK\n\n• Guided investigation workflow\n• Log callsign, variable, target year, and empirical verdict\n• Record observational notes directly against satellite data\n• Gamified case tracking inspires STEM classroom curiosity", "x": 50, "y": 85, "width": 195, "height": 245, "font_size": 10, "color": "#e2e8f0", "background_color": "#0f172a"},
        {"op": "add-textbox", "slide": "SLIDE_6", "text": "SUPABASE POSTGRESQL\n\n• Live PostgreSQL database on Supabase Edge infrastructure\n• Row-Level Security (RLS) protects data integrity\n• Global real-time sync across connected research stations\n• Instant schema migration with zero manual server maintenance", "x": 260, "y": 85, "width": 200, "height": 245, "font_size": 10, "color": "#e2e8f0", "background_color": "#0f172a"},
        {"op": "add-textbox", "slide": "SLIDE_6", "text": "OFFLINE-FIRST ENGINE\n\n• Graceful degradation to local browser storage\n• 100% resilient if internet drops during field expeditions\n• Procedural Web Audio anomaly synthesis for auditory learners\n• Frictionless export to research memos", "x": 475, "y": 85, "width": 195, "height": 245, "font_size": 10, "color": "#e2e8f0", "background_color": "#0f172a"},
        {"op": "add-textbox", "slide": "SLIDE_6", "text": "Live Cloud Endpoint: toakvrrofklcjwyjahcp.supabase.co • Fully Secured & Synchronized", "x": 50, "y": 345, "width": 620, "height": 35, "font_size": 11, "bold": True, "color": "#38bdf8", "background_color": "#1e293b", "alignment": "center"},
        {"op": "set-notes", "slide": "SLIDE_6", "text": "Aether transforms observation into collaboration. With our live Supabase database, students and citizen scientists file forensic logs, sharing real-time climate discoveries across global classrooms."},

        # Slide 7: Global Impact & Open Science
        {"op": "add-slide", "layout": "BLANK", "id": "SLIDE_7"},
        {"op": "set-background", "slide": "SLIDE_7", "color": "#070d1e"},
        {"op": "add-textbox", "slide": "SLIDE_7", "text": "GLOBAL IMPACT & OPEN SCIENCE SUBMISSION", "x": 50, "y": 20, "width": 620, "height": 35, "font_size": 20, "bold": True, "color": "#ffffff"},
        {"op": "add-textbox", "slide": "SLIDE_7", "text": "NASA Space Apps 2026 Submission Package • Deployed and Publicly Accessible", "x": 50, "y": 55, "width": 620, "height": 20, "font_size": 12, "color": "#38bdf8"},
        {"op": "add-textbox", "slide": "SLIDE_7", "text": "SUBMISSION VERIFICATION\n\n• Challenge: Be An Earth System Trend Detective!\n• Live Web App: https://aether-nasa.vercel.app\n  (No password, permission, or login required)\n• Open-Source Repo: github.com/GabrielCodexxx/AetherNasa\n  (MIT License, complete source code & schemas)\n• NASA Data Citation: GISTEMP, GRACE-FO, Sentinel-6, OCO-2, MODIS\n• Limits Adherence: Exactly 7 Slides / <= 30s Video Walkthrough", "x": 50, "y": 85, "width": 300, "height": 245, "font_size": 10, "color": "#e2e8f0", "background_color": "#0f172a"},
        {"op": "add-textbox", "slide": "SLIDE_7", "text": "INTENDED IMPACT & ROADMAP\n\n• Education: Turn every STEM student into an Earth Detective\n• Journalism: Provide fact-checked NASA telemetry briefing cards\n• Policy: Bridge the gap between complex science and decision-making\n• Roadmap Q1 2027: Integrate NASA SWOT surface water telemetry and live satellite pass alerts\n\n'Uncovering the Trends Shaping Our Living Planet.'", "x": 370, "y": 85, "width": 300, "height": 245, "font_size": 10, "color": "#e2e8f0", "background_color": "#0f172a"},
        {"op": "add-textbox", "slide": "SLIDE_7", "text": "Explore Aether Now at https://aether-nasa.vercel.app • Thank You, NASA Judges!", "x": 50, "y": 345, "width": 620, "height": 35, "font_size": 11, "bold": True, "color": "#34d399", "background_color": "#1e293b", "alignment": "center"},
        {"op": "set-notes", "slide": "SLIDE_7", "text": "Aether is deployed and publicly accessible right now. We invite judges and citizens worldwide to explore our living Earth at aether-nasa.vercel.app. Thank you."}
    ]
    return ops

def main():
    print(f"Creating fresh presentation: {PRES_TITLE}...")
    res = run_gslides(f'mutate create --title "{PRES_TITLE}" --json')
    print("Create response:", res.strip())
    # Extract ID
    # Response is typically: "Created: <title> (ID: <id>)"
    import re
    match = re.search(r'\(ID:\s*([a-zA-Z0-9_-]+)\)', res)
    if not match:
        raise ValueError(f"Could not extract presentation ID from: {res}")
    pres_id = match.group(1)
    print(f"Extracted presentation ID: {pres_id}")

    batch_file = "c:/Users/porti/Aether/presentation/batch_presentation.json"
    ops = build_batch_ops()
    with open(batch_file, "w", encoding="utf-8") as f:
        json.dump(ops, f, indent=2)
    print(f"Wrote batch operations to {batch_file}")

    print("Executing batch update on presentation...")
    batch_res = run_gslides(f'mutate batch {pres_id} -f "{batch_file}"')
    print("Batch result:", batch_res.strip())

    print("Verifying slide count...")
    slides_res = run_gslides(f'readonly list-slides {pres_id} --json')
    slides_data = json.loads(slides_res)
    print(f"Total slides in presentation: {len(slides_data)}")

    pdf_path = "c:/Users/porti/Aether/presentation/AETHER_NASA_Pitch_Deck.pdf"
    pptx_path = "c:/Users/porti/Aether/presentation/AETHER_NASA_Pitch_Deck.pptx"

    print("Exporting presentation to PDF...")
    run_gslides(f'readonly export {pres_id} "{pdf_path}" --format pdf')
    print("PDF exported successfully.")

    print("Exporting presentation to PPTX...")
    run_gslides(f'readonly export {pres_id} "{pptx_path}" --format pptx')
    print("PPTX exported successfully.")

    print(f"\nALL DONE! Presentation URL: https://docs.google.com/presentation/d/{pres_id}/edit")

if __name__ == "__main__":
    main()
