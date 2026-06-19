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
- [ ] Configure Supabase Authentication (Signup/Login) for players.

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
