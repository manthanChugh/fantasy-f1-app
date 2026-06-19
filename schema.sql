-- Players in the league
create table players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  created_at timestamptz default now()
);

-- F1 drivers with current price
create table drivers (
  id text primary key,          -- e.g. "norris", "verstappen"
  full_name text not null,
  team text not null,
  price_m numeric not null,     -- price in £M
  updated_at timestamptz default now()
);

-- A player's team selection for a specific race
create table team_selections (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players not null,
  race_id text not null,        -- e.g. "2025_monaco"
  driver_ids text[] not null,   -- array of 5 driver IDs
  submitted_at timestamptz default now(),
  is_locked boolean default false
);

-- Raw race result data (pulled from OpenF1)
create table race_results (
  id uuid primary key default gen_random_uuid(),
  race_id text not null,
  driver_id text references drivers not null,
  finish_position int,
  grid_position int,
  quali_segment int,            -- 1, 2, or 3 (Q1/Q2/Q3)
  is_pole boolean default false,
  beat_teammate boolean default false,
  dotd boolean default false,
  fastest_lap boolean default false,
  fastest_pitstop boolean default false,
  dnf_reason text,              -- null, "mechanical", "crash"
  laps_lapped int default 0,
  penalties int default 0,
  sprint_pole boolean default false,
  sprint_finish_position int,
  created_at timestamptz default now()
);

-- Calculated score per driver per race
create table driver_scores (
  id uuid primary key default gen_random_uuid(),
  race_id text not null,
  driver_id text references drivers not null,
  total_points int not null,
  breakdown jsonb not null,     -- {"finish": 10, "win_bonus": 7, ...}
  created_at timestamptz default now()
);

-- Calculated score per player per race
create table player_race_scores (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players not null,
  race_id text not null,
  total_points int not null,
  driver_breakdown jsonb not null,
  created_at timestamptz default now()
);

-- Transfer log
create table transfers (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players not null,
  race_id text not null,
  driver_out text not null,
  driver_in text not null,
  banked_before int not null,
  banked_after int not null,
  created_at timestamptz default now()
);

-- Enable RLS and setup basic policies if needed
-- (For MVP, since backend uses service role key for operations, we can leave RLS disabled or allow all for now)
