# Fantasy F1 Project TODO

## 1. Database Setup
- [ ] Run the SQL commands in `schema.sql` inside the Supabase SQL Editor to create all the necessary tables.

done

## 2. OpenF1 Data Pipeline & Admin
- [x] Update `scripts/fetch_race.py` to actually save the fetched data to Supabase using the backend `db.py` connection.
- [x] Create an "Admin Dashboard" in the frontend (or a Python script) to let us manually input missing OpenF1 stats (Driver of the Day, DNF reasons, Teammate battles) before saving to the database.
- [x] Write logic to trigger the player score calculations (`scoring.py`) after the race results are saved.

## 3. Frontend: Design System & Foundation
- [x] Define the aesthetic (sleek dark mode, vibrant F1 colors, glassmorphism components).
- [x] Set up the main layout and navigation bar in `frontend/src/app/layout.tsx`.
- [x] Configure Supabase Authentication (Signup/Login) for players.
- [ ] Add Google and Apple OAuth sign-in options to the `/login` page.

## 4. Frontend: Reusable Components
- [x] Build **`DriverCard`**: Shows driver headshot, team, price, and recent stats.
- [ ] Build **`TeamSlot`**: The interactive slots where users pick their 5 drivers.
- [x] Build **`BudgetBar`**: A dynamic visual tracker ensuring users don't exceed the £100M budget.

## 5. Frontend: Core Pages
- [ ] **Landing Page (`/`)**: Stunning welcome page with F1 aesthetics and login prompt.
- [ ] **Team Selection (`/team`)**: Interface to draft 5 drivers. Validates budget and locks before qualifying.
- [ ] **Dashboard (`/dashboard`)**: The player's home page showing their current points, global rank, and selected team.
- [ ] **Leaderboard (`/leaderboard`)**: Live-updating ranking of all players in the league.

## 6. Integration (Frontend <-> Backend)
- [ ] Connect the Next.js frontend to fetch driver prices and data from our FastAPI backend.
- [ ] Wire up the "Save Team" button to securely submit rosters to the database.
- [ ] Ensure user sessions (Auth) are securely passed between Next.js and FastAPI.


Antonelli: 96 (95 + 1)

Verstappen: 78 (67 + 11)

Hamilton: 78 (51 + 27)

Gasly: 57 (42 + 15)

Norris: 55 (42 + 13)

Piastri: 54 (47 + 7)

Lawson: 54 (45 + 9)

Russell: 52 (39 + 13)

Sainz: 45 (37 + 8)

Lindblad: 39 (34 + 5)

Bortoleto: 38 (33 + 5)

Perez: 37 (30 + 7)

Ocon: 36 (29 + 7)

Leclerc: 33 (33 + 0)

Bearman: 31 (31 + 0)

Alonso: 29 (30 - 1)

Hadjar: 27 (23 + 4)

Colapinto: 23 (18 + 5)

Albon: 15 (27 - 12)

Hulkenburg: 14 (13 + 1)

Bottas: 6 (7 - 1)

Stroll: -17 (-16 - 1)