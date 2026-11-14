import os
import json
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))

        # Running header (on pages > 1)
        if self._pageNumber > 1:
            self.drawString(40, 755, "AETHER — NASA Earth System Trend Detective | Official Technical Documentation")
            self.drawRightString(572, 755, "NASA Space Apps 2026")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(40, 748, 572, 748)

        # Running footer
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawString(40, 28, "Author: Gabriel Martinez Portillo  |  Live App: https://aether-nasa.vercel.app")
        self.drawRightString(572, 28, page_text)
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(40, 38, 572, 38)

        self.restoreState()

def build_pdf(filename="c:/Users/porti/Aether/presentation/AETHER_NASA_Formal_Documentation.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=50,
        bottomMargin=50
    )

    styles = getSampleStyleSheet()

    # Custom typography styles
    navy = colors.HexColor("#0c1b33")
    cyan = colors.HexColor("#0284c7")
    slate_dark = colors.HexColor("#1e293b")
    slate_muted = colors.HexColor("#64748b")
    bg_light = colors.HexColor("#f8fafc")
    border_color = colors.HexColor("#e2e8f0")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=navy,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=cyan,
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=navy,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=cyan,
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=slate_dark,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=slate_dark,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=4
    )

    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#0f172a")
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=slate_dark
    )

    meta_label = ParagraphStyle(
        'MetaLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=navy
    )

    meta_val = ParagraphStyle(
        'MetaVal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=slate_dark
    )

    story = []

    # ==================== HEADER BLOCK ====================
    story.append(Paragraph("AETHER: PLANETARY & EARTH SYSTEM TREND DETECTIVE", title_style))
    story.append(Paragraph("Official Project & Technical Documentation • NASA Space Apps Challenge 2026", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=cyan, spaceBefore=0, spaceAfter=10))

    # Metadata Table
    meta_data = [
        [
            Paragraph("<b>Challenge:</b>", meta_label), Paragraph("Be An Earth System Trend Detective! (2026)", meta_val),
            Paragraph("<b>Live Demo:</b>", meta_label), Paragraph("<u>https://aether-nasa.vercel.app</u> (Public, Zero Passwords)", meta_val)
        ],
        [
            Paragraph("<b>Lead Architect:</b>", meta_label), Paragraph("Gabriel Martinez Portillo", meta_val),
            Paragraph("<b>GitHub Repository:</b>", meta_label), Paragraph("<u>https://github.com/GabrielCodexxx/AetherNasa</u>", meta_val)
        ],
        [
            Paragraph("<b>Team Name:</b>", meta_label), Paragraph("Aether Detective Team", meta_val),
            Paragraph("<b>Google Drive Folder:</b>", meta_label), Paragraph("<u>https://drive.google.com/drive/folders/1oRw8zpRyT1J7JADlQ4jd8hSAmxBh6LgW</u>", meta_val)
        ],
        [
            Paragraph("<b>License:</b>", meta_label), Paragraph("MIT License (Gabriel Martinez Portillo)", meta_val),
            Paragraph("<b>Database:</b>", meta_label), Paragraph("Supabase PostgreSQL (toakvrrofklcjwyjahcp)", meta_val)
        ]
    ]

    meta_table = Table(meta_data, colWidths=[80, 185, 95, 172])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg_light),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 14))

    # ==================== SECTION 1 ====================
    story.append(Paragraph("1. Executive Summary & Challenge Mission", h1_style))
    
    challenge_callout = [
        [Paragraph(
            "<b>NASA Challenge Statement:</b> <i>\"Change is always occurring in the Earth’s interconnected environmental system, and when it runs in a consistent direction – rising or falling, increasing or decreasing, thickening or thinning – measured variables reflect it. But a measured Earth science data variable can trend one way in one region and the opposite way in another, even when the same process drives both... Your challenge is to create a tool that can select variables measured by Earth science missions or produced by Earth science models, visualize how they change over time, and determine what is changing, where it is changing, how much it is changing, and if these changes are what scientists call 'significant.'\"</i>",
            callout_style
        )]
    ]
    t_callout = Table(challenge_callout, colWidths=[532])
    t_callout.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f1f5f9")),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('LINELEFT', (0,0), (0,0), 3.5, cyan),
    ]))
    story.append(t_callout)
    story.append(Spacer(1, 8))

    story.append(Paragraph(
        "<b>Aether</b> is an interactive 3D planetary digital twin that synthesizes <b>40 years of calibrated NASA satellite telemetry</b> (GISTEMP v4, GRACE-FO, Sentinel-6, OCO-2, MODIS) into an accessible forensic investigation workstation. Designed to resolve the environmental \"signal vs. noise\" dilemma, Aether empowers citizens, students, and scientists to discover what is changing, where it is changing, how much it is changing, and whether changes meet statistical significance (<i>p</i> &lt; 0.001). Featuring real-time 60 FPS Three.js orbital mechanics, 3D internal structural cutaways, dual-pole divergence thermal heatmaps, and cloud-synchronized case logging via Supabase, Aether turns complex satellite telemetry into defensible planetary intelligence.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # ==================== SECTION 2 ====================
    story.append(Paragraph("2. The 4-Question Forensic Sieve Engine", h1_style))
    story.append(Paragraph(
        "Aether specifically addresses the four core investigative questions outlined in NASA's challenge prompt for every primary Earth system variable:",
        body_style
    ))

    four_q_data = [
        [Paragraph("Forensic Inquiry", table_header_style), Paragraph("Scientific Methodology & Implementation in Aether", table_header_style)],
        [
            Paragraph("<b>1. WHAT is changing?</b>", table_cell_style),
            Paragraph("Isolates physical measured parameters across atmosphere, cryosphere, hydrosphere, and biosphere. Compares observed telemetry against historical baselines (e.g., GISTEMP 1951–1980 baseline delta, equivalent water thickness in Gt, and atmospheric CO₂ in ppm).", table_cell_style)
        ],
        [
            Paragraph("<b>2. WHERE is it changing?</b>", table_cell_style),
            Paragraph("Projects interactive 3D coordinate pins onto the planetary sphere and renders dual-pole regional divergence heatmaps, highlighting localized hotspots (e.g., Greenland Ice Sheet, Thwaites Glacier, Amazon Basin, Arctic Ocean).", table_cell_style)
        ],
        [
            Paragraph("<b>3. HOW MUCH is it changing?</b>", table_cell_style),
            Paragraph("Quantifies exact multi-decadal rates of change and cumulative anomalies: Arctic sea ice loss (-12.6% per decade), Greenland gravimetric ice loss (-270 Gt/yr), global mean sea level rise (+4.2 mm/yr), and atmospheric warming (+1.39°C).", table_cell_style)
        ],
        [
            Paragraph("<b>4. IS IT SIGNIFICANT?</b>", table_cell_style),
            Paragraph("Applies non-parametric <b>Mann-Kendall monotonic trend tests</b> and Sen's slope estimators to prove non-random trajectories at <b><i>p</i> &lt; 0.001</b> (99.9% scientific confidence), mathematically separating genuine long-term signal from cyclical weather noise (ENSO, seasonal storms).", table_cell_style)
        ],
    ]
    t_4q = Table(four_q_data, colWidths=[150, 382])
    t_4q.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), navy),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_4q)
    story.append(Spacer(1, 14))

    # ==================== SECTION 3 ====================
    story.append(Paragraph("3. Official Judging Responses (\"Questions to Consider\")", h1_style))

    story.append(Paragraph("<b>Q1: What does your project do, and how does it work?</b>", h2_style))
    story.append(Paragraph(
        "Aether bridges the divide between raw NASA Earth science telemetry and public understanding through an immersive, browser-based WebGL/Three.js digital twin running at a constant 60 FPS without GPU thermal throttling:",
        body_style
    ))
    story.append(Paragraph("• <b>Multi-Decadal Chronological Scrubber (1980–2026):</b> Users scrub through four decades of calibrated satellite telemetry, observing procedural planetary responses on the 3D globe—such as Arctic ice retreat, albedo shifts, and vegetation dynamics.", bullet_style))
    story.append(Paragraph("• <b>Forensic HUD & Sieve:</b> Evaluates physical variables through the 4-Question sieve and filters transient oscillations using statistical significance thresholds (<i>p</i> &lt; 0.05, <i>p</i> &lt; 0.01, <i>p</i> &lt; 0.001).", bullet_style))
    story.append(Paragraph("• <b>3D Planetary Interior Cutaway:</b> Reveals internal geodynamic layers (Crust, Mantle, Outer Core, Inner Core) to illustrate how deep-Earth convective mechanics generate the magnetic shield protecting our atmosphere.", bullet_style))
    story.append(Paragraph("• <b>Cloud Case Logbook:</b> Connects to a live Supabase PostgreSQL backend with Row-Level Security, allowing students and detectives to record and sync empirical case files worldwide.", bullet_style))

    story.append(Paragraph("<b>Q2: What benefits does it have?</b>", h2_style))
    story.append(Paragraph("• <b>Eliminates Data Fragmentation:</b> NASA telemetry is traditionally divided across disparate repositories (PODAAC, GES DISC, Earthdata, NSIDC). Aether synthesizes atmospheric, oceanic, cryospheric, and biospheric data in a single viewport.", bullet_style))
    story.append(Paragraph("• <b>Separates Signal from Environmental Noise:</b> Distinguishes genuine multi-decadal trends from temporary cyclical events like El Niño-Southern Oscillation (ENSO), volcanic aerosols, and seasonal variability.", bullet_style))
    story.append(Paragraph("• <b>Visualizes Regional Divergence:</b> Explains how a single global driver (thermal warming) creates opposing regional trends simultaneously (e.g. Arctic greening vs. Amazon drying; tropical sea level inundation vs. post-glacial land uplift).", bullet_style))
    story.append(Paragraph("• <b>Universal Frictionless Access:</b> Zero installation, zero downloads, and zero login barriers—running smoothly on mobile, tablet, laptop, and 4K displays.", bullet_style))

    story.append(Paragraph("<b>Q3: What is the intended impact?</b>", h2_style))
    story.append(Paragraph("• <b>STEM Education:</b> Transforms classrooms into active forensic labs where students formulate hypotheses and test satellite observations.", bullet_style))
    story.append(Paragraph("• <b>Journalism & Communication:</b> Supplies scientifically validated, mathematically vetted charts and 3D animations to counter misinformation with empirical NASA records.", bullet_style))
    story.append(Paragraph("• <b>Citizen Science & Stewardship:</b> Democratizes access to primary climate records, fostering distributed research and evidence-based environmental policy.", bullet_style))

    story.append(Paragraph("<b>Q4: What tools did you use?</b>", h2_style))
    story.append(Paragraph("• <b>Frontend Framework:</b> React 19, TypeScript, Vite build tool.", bullet_style))
    story.append(Paragraph("• <b>3D Visualization Engine:</b> Three.js, WebGL, custom Rayleigh atmospheric scattering shaders, instanced particle systems (2,000 asteroids), NASA Blue Marble 2K textures.", bullet_style))
    story.append(Paragraph("• <b>UI & Styling:</b> Tailwind CSS v4, Lucide Icons, glassmorphism light-mode interface with geometric precision diamond markers (strictly zero circular pin dots).", bullet_style))
    story.append(Paragraph("• <b>Audio Sonification:</b> Native Web Audio API procedural synthesizers converting anomaly rates into harmonic audio frequencies.", bullet_style))
    story.append(Paragraph("• <b>Cloud Database & Edge:</b> Supabase PostgreSQL with Row-Level Security; hosted on Vercel Global Edge Network.", bullet_style))
    story.append(Paragraph("• <b>Primary NASA Telemetry:</b> NASA GISTEMP v4, GRACE & GRACE-FO Tellus, Sentinel-6 / Jason-3 altimetry, OCO-2 Keeling data, and MODIS Terra/Aqua NDVI.", bullet_style))

    story.append(Paragraph("<b>Q5: How is your project creative?</b>", h2_style))
    story.append(Paragraph("• <b>Solar System Scope:</b> Places Earth in its celestial context with true astronomical light orientation, Moon orbit, and comparative planetology (comparing Earth's greenhouse guardrails against runaway Venus and Mars).", bullet_style))
    story.append(Paragraph("• <b>Core-to-Atmosphere Integration:</b> Couples 3D internal geodynamics with surface observations, explaining how core convection powers the magnetosphere preventing atmospheric stripping.", bullet_style))
    story.append(Paragraph("• <b>Procedural Audio Translation:</b> Converts abstract rate metrics into intuitive soundscapes, creating multi-sensory accessibility for auditory learners.", bullet_style))
    story.append(Paragraph("• <b>Gamified Forensic Case Missions:</b> Replaces static dashboards with interactive detective missions (e.g. \"The Vanishing Arctic Mirror\", \"The 1.5°C Planetary Thermometer\").", bullet_style))

    story.append(Paragraph("<b>Q6: What factors did your team consider?</b>", h2_style))
    story.append(Paragraph("• <b>Scientific Rigor vs. Cognitive Load:</b> Preserved formal statistical measures (Mann-Kendall τ, <i>p</i>-values, decadal slopes) while maintaining an intuitive, uncluttered UI.", bullet_style))
    story.append(Paragraph("• <b>Rendering Performance:</b> Built frustum culling, instanced meshes, and throttled projection updates (75ms) to guarantee a locked 60 FPS on standard hardware without overheating.", bullet_style))
    story.append(Paragraph("• <b>NASA Challenge Eligibility:</b> Ensured 100% open-source licensing (MIT), removed all login or permission walls, and strictly adhered to the demonstration limits.", bullet_style))
    story.append(Paragraph("• <b>Offline Resilience:</b> Integrated automatic fallback to browser <code>localStorage</code> so field researchers can log findings with zero network connectivity.", bullet_style))
    story.append(Spacer(1, 12))

    # ==================== SECTION 4 ====================
    story.append(Paragraph("4. Primary NASA Satellite Telemetry & Data Citations", h1_style))
    story.append(Paragraph(
        "Aether integrates multi-decadal observations from five flagship NASA Earth science missions and distributed sensor networks:",
        body_style
    ))

    nasa_data = [
        [Paragraph("NASA Mission", table_header_style), Paragraph("Instrument / Source", table_header_style), Paragraph("Physical Parameter", table_header_style), Paragraph("Role in Aether", table_header_style)],
        [
            Paragraph("<b>NASA GISTEMP v4</b>", table_cell_style),
            Paragraph("GHCN-v4 / ERSSTv5 (GISS)", table_cell_style),
            Paragraph("Surface Air & Ocean Anomaly (°C)", table_cell_style),
            Paragraph("Multi-decadal global mean warming (+1.39°C) & regional thermal heatmaps", table_cell_style)
        ],
        [
            Paragraph("<b>GRACE & GRACE-FO</b>", table_cell_style),
            Paragraph("KBR & Accelerometers (JPL)", table_cell_style),
            Paragraph("Equivalent Water Thickness / Mass", table_cell_style),
            Paragraph("Greenland (-270 Gt/yr) & Antarctic (-135 Gt/yr) ice sheet mass collapse", table_cell_style)
        ],
        [
            Paragraph("<b>Sentinel-6 / Jason-3</b>", table_cell_style),
            Paragraph("Poseidon-4 Radar Altimeter", table_cell_style),
            Paragraph("Sea Surface Height (SSH, mm)", table_cell_style),
            Paragraph("Global mean sea level acceleration (+4.2 mm/yr) & coastal vulnerability", table_cell_style)
        ],
        [
            Paragraph("<b>NASA OCO-2 & NOAA</b>", table_cell_style),
            Paragraph("High-Res Grating Spectrometer", table_cell_style),
            Paragraph("Atmospheric CO₂ Column (ppm)", table_cell_style),
            Paragraph("Keeling Curve time series (426 ppm) & greenhouse gas radiative forcing", table_cell_style)
        ],
        [
            Paragraph("<b>MODIS Terra / Aqua</b>", table_cell_style),
            Paragraph("36-Band Spectroradiometer", table_cell_style),
            Paragraph("NDVI Vegetation Index", table_cell_style),
            Paragraph("Arctic shrub greening vs. Amazon canopy moisture desiccation", table_cell_style)
        ],
    ]
    t_nasa = Table(nasa_data, colWidths=[105, 120, 135, 172])
    t_nasa.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), navy),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_nasa)
    story.append(Spacer(1, 14))

    # ==================== SECTION 5 ====================
    story.append(Paragraph("5. Breakthrough Innovations in Planetary Visualization", h1_style))
    
    story.append(Paragraph("<b>5.1 3D Planetary Interior Geodynamics Cutaway ([STRUCTURE] Mode)</b>", h2_style))
    story.append(Paragraph(
        "Aether features a 3/4 cutaway cross-section of Earth detailing the planet's geodynamic layers: <b>Crust</b> (0–35 km), <b>Mantle</b> (35–2,890 km), <b>Outer Core</b> (2,890–5,150 km, liquid iron-nickel convective dynamo generating the planetary magnetic field shielding our atmosphere from solar wind sputtering), and <b>Inner Core</b> (5,150–6,370 km, solid crystalline iron sphere). This connects deep-Earth mantle plumes with surface atmospheric retention.",
        body_style
    ))

    story.append(Paragraph("<b>5.2 Dual-Pole Regional Divergence Thermal Heatmap ([LENS] Mode)</b>", h2_style))
    story.append(Paragraph(
        "Addresses the critical challenge criterion where a single climate driver causes opposing regional outcomes: <b>Arctic Amplification</b> illustrates polar warming accelerating at 4× the global mean rate; <b>Vegetation Divergence</b> contrasts Siberian tundra greening against simultaneous Amazon canopy dieback; and <b>Altimetry Divergence</b> explains how tropical Pacific atolls face flooding while rebounding Scandinavian coastlines experience falling relative sea levels.",
        body_style
    ))

    story.append(Paragraph("<b>5.3 Procedural Multi-Harmonic Climate Sonification</b>", h2_style))
    story.append(Paragraph(
        "Utilizing the browser's native Web Audio API, Aether proceduralizes rate trajectories into acoustic frequencies. Temperature anomalies modulate primary carrier frequencies while ice melt rates trigger resonant sub-bass drops, making climate velocity perceptible to auditory learners.",
        body_style
    ))
    story.append(Spacer(1, 12))

    # ==================== SECTION 6 ====================
    story.append(Paragraph("6. System Architecture & Technical Specifications", h1_style))
    story.append(Paragraph("• <b>Client-Side Rendering:</b> Built on React 19, TypeScript, and Three.js WebGL. Features procedural bump mapping, instanced asteroid particle fields, and custom Rayleigh atmospheric shaders.", bullet_style))
    story.append(Paragraph("• <b>Cloud Backend:</b> Connected to Supabase PostgreSQL (Project ID: <code>toakvrrofklcjwyjahcp</code>). Pre-configured with Row-Level Security (RLS) policies for anonymous detective case file submissions.", bullet_style))
    story.append(Paragraph("• <b>Offline-First Resilience:</b> Intelligent fallback automatically stores case investigations to browser <code>localStorage</code> when offline and syncs transparently when internet access is restored.", bullet_style))
    story.append(Paragraph("• <b>Global Edge Hosting:</b> Deployed on the Vercel Global Edge Network (<code>aether-nasa.vercel.app</code>) with continuous GitHub CI/CD integration.", bullet_style))
    story.append(Spacer(1, 12))

    # ==================== SECTION 7 ====================
    story.append(Paragraph("7. Dual Formal Presentation Summary (Google Drive)", h1_style))
    story.append(Paragraph(
        "Both presentation formats are hosted on Google Drive for immediate, permission-free access:",
        body_style
    ))

    pres_data = [
        [Paragraph("Presentation Format", table_header_style), Paragraph("Parameters & Limits", table_header_style), Paragraph("Direct Access Links", table_header_style)],
        [
            Paragraph("<b>Format A: Pitch Deck</b>", table_cell_style),
            Paragraph("Strictly 7 Slides maximum • Includes title, problem, solution, science, innovation, cloud sync, and global impact.", table_cell_style),
            Paragraph("• <u>Google Slides:</u> https://docs.google.com/presentation/d/1B2-Z6bPb98kSZnAZ7M3P_sJs-tFniLMJwZksukS8UYE/edit<br/>• <u>Drive PDF:</u> https://drive.google.com/file/d/1NW2awdL8lP6mNeak9VAaWz_lDoNhBAer/view", table_cell_style)
        ],
        [
            Paragraph("<b>Format B: Video Walkthrough</b>", table_cell_style),
            Paragraph("Strictly &le; 30.0 seconds (29.5s) • 74 spoken words (~148 wpm) • Complete 4-step screen recording storyboard.", table_cell_style),
            Paragraph("• <u>Drive Submission Folder:</u> https://drive.google.com/drive/folders/1oRw8zpRyT1J7JADlQ4jd8hSAmxBh6LgW<br/>(Recorded .mp4 uploaded directly in folder)", table_cell_style)
        ],
    ]
    t_pres = Table(pres_data, colWidths=[130, 180, 222])
    t_pres.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), navy),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_pres)
    story.append(Spacer(1, 14))

    # ==================== SECTION 8 ====================
    story.append(Paragraph("8. Eligibility, Compliance & Public Access Verification", h1_style))
    story.append(Paragraph("• [x] <b>Public Accessibility:</b> Verified worldwide at <code>https://aether-nasa.vercel.app</code> with zero passwords, registration, or login requirements.", bullet_style))
    story.append(Paragraph("• [x] <b>Open Source Codebase:</b> Fully published under MIT License at <code>https://github.com/GabrielCodexxx/AetherNasa</code>.", bullet_style))
    story.append(Paragraph("• [x] <b>NASA Data Resources:</b> Direct utilization of 5 primary NASA Earth observation data sources.", bullet_style))
    story.append(Paragraph("• [x] <b>Demonstration Limits:</b> Exactly 7 slides in presentation deck; video script clocked at 29.5 seconds.", bullet_style))
    story.append(Spacer(1, 12))

    # ==================== SECTION 9 ====================
    story.append(Paragraph("9. Lead Architect & Open Source License", h1_style))
    story.append(Paragraph("<b>Lead Architect & Project Author:</b> Gabriel Martinez Portillo", body_style))
    story.append(Paragraph("<b>Team:</b> Aether Detective Team", body_style))
    story.append(Paragraph("<b>License:</b> MIT License — Copyright (c) 2026 Gabriel Martinez Portillo", body_style))
    story.append(Paragraph(
        "<i>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software...</i>",
        callout_style
    ))

    # Build Document
    print("Building formal documentation PDF with NumberedCanvas...")
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Formal PDF successfully built at: {filename}")

if __name__ == "__main__":
    build_pdf()
