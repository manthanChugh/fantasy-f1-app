# Fantasy F1 Project TODO

## 1. Database Setup
- [ ] Run the SQL commands in `schema.sql` inside the Supabase SQL Editor to create all the necessary tables.

done

## 2. OpenF1 Data Pipeline & Admin
- [ ] Update `scripts/fetch_race.py` to actually save the fetched data to Supabase using the backend `db.py` connection.
- [ ] Create an "Admin Dashboard" in the frontend (or a Python script) to let us manually input missing OpenF1 stats (Driver of the Day, DNF reasons, Teammate battles) before saving to the database.
- [ ] Write logic to trigger the player score calculations (`scoring.py`) after the race results are saved.

## 3. Frontend: Design System & Foundation
- [ ] Define the aesthetic (sleek dark mode, vibrant F1 colors, glassmorphism components).
- [ ] Set up the main layout and navigation bar in `frontend/src/app/layout.tsx`.
- [x] Configure Supabase Authentication (Signup/Login) for players.
- [ ] Add Google and Apple OAuth sign-in options to the `/login` page.

## 4. Frontend: Reusable Components
- [ ] Build **`DriverCard`**: Shows driver headshot, team, price, and recent stats.
- [ ] Build **`TeamSlot`**: The interactive slots where users pick their 5 drivers.
- [ ] Build **`BudgetBar`**: A dynamic visual tracker ensuring users don't exceed the £100M budget.

## 5. Frontend: Core Pages
- [ ] **Landing Page (`/`)**: Stunning welcome page with F1 aesthetics and login prompt.
- [ ] **Team Selection (`/team`)**: Interface to draft 5 drivers. Validates budget and locks before qualifying.
- [ ] **Dashboard (`/dashboard`)**: The player's home page showing their current points, global rank, and selected team.
- [ ] **Leaderboard (`/leaderboard`)**: Live-updating ranking of all players in the league.

## 6. Integration (Frontend <-> Backend)
- [ ] Connect the Next.js frontend to fetch driver prices and data from our FastAPI backend.
- [ ] Wire up the "Save Team" button to securely submit rosters to the database.
- [ ] Ensure user sessions (Auth) are securely passed between Next.js and FastAPI.


1. Dan 43
2. Jonah 38
3. Nathan 36
4. Cameron 31
5. Reuben 24
6. Manthan 22
7. Jon 19
8. Steven 12
                                                                  Scoring system each week: 
10 
8
6
4
2
1
0

Play 5 drivers per week: 1 transfer per week. Bankable to 5
Q1: 0
Q2: 1
Q3: 2
Pole: 3

Positions gained: 1 per
Dotd: 10 points

Win: 7
Podium: 5
Points: 3
Beat teammate: 5
Fastest lap: 2
Fastest pitstop: 1

Mechanical DNF: -1
Crash in Race DNF -3
Crash (quali) -1
Lapped: -1 (per lap)
Penalty: -1 per penalty (all weekend) (only time pens and grid drops) 

Sprint Pole: 2
Sprint Win: 2
Sprint Points: 1

Prices: 
V. Bottas £11.5m
S. Perez £12.3m
F. Colapinto £11.4m
P. Gasly £13.8m
G. Bortoleto £12.7m
N. Hulkeburg £14.9m
E. Ocon £13.7m
O. Bearman £16.1m
L. Stroll £12.2m
F. Alonso £16.7m
A. Lindblad £12.0m
L. Lawson £14.4m
C. Sainz £18.1m
A. Albon £17.4m
L. Hamilton £25.3m
C. Leclerc £26.0m
I. Hadjar £21.8m
M. Verstappen £30.7m
K. Antonelli £26.0m                     
G. Russell £28.2m
O. Piastri £29.9m
L. Norris £31.3m
