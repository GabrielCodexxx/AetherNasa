-- Earth Trend Investigations (Case files filed from Detective Logbook)
CREATE TABLE IF NOT EXISTS public.earth_trend_investigations (
  id TEXT PRIMARY KEY,
  callsign TEXT NOT NULL,
  variable_name TEXT NOT NULL,
  year INTEGER NOT NULL,
  significance_verdict TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Global Mission Leaderboard
CREATE TABLE IF NOT EXISTS public.global_leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cadet_callsign TEXT NOT NULL,
  outpost_type TEXT NOT NULL,
  survival_time_seconds INTEGER NOT NULL,
  crises_resolved INTEGER NOT NULL,
  final_stability_score INTEGER NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.earth_trend_investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow public read & insert for open science detective contributions
CREATE POLICY "Allow public read access to investigations"
  ON public.earth_trend_investigations FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to investigations"
  ON public.earth_trend_investigations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read access to leaderboard"
  ON public.global_leaderboard FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to leaderboard"
  ON public.global_leaderboard FOR INSERT
  WITH CHECK (true);
