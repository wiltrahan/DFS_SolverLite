# DFS Solver-Lite

A React-based Daily Fantasy Sports lineup builder for DraftKings NFL contests.

## Features

- **Persistent CSV data** - Upload once, data saved in browser across sessions
- CSV import for player salaries and ownership data
- Position-based filtering
- Real-time salary cap tracking
- Lineup validation
- Edit and update saved lineups
- Local storage for saved lineups and player data
- Paste-based ownership data import

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will open at http://localhost:3000

### Build

```bash
npm run build
```

## Usage

1. Upload a DraftKings salaries CSV file
2. Optionally upload an ownership CSV or paste ownership data
3. Filter players by position
4. Click on players to add them to your lineup
5. Save completed lineups for later reference

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- PapaParse (CSV parsing)

## Backend (Kotlin + Spring Boot)

The repository includes a backend scaffold in `backend/` with:
- Spring Boot + Kotlin
- PostgreSQL
- Flyway migrations

### Security setup (required for local run)

Create local env files before running backend:

```bash
cp backend/.env.example backend/.env
cp .env.example .env.local
```

Then update `backend/.env` with your own `POSTGRES_PASSWORD` and `DB_PASSWORD`.

### Start PostgreSQL (Docker)

```bash
cd backend
docker compose up -d
```

### Run backend

```bash
cd backend
./gradlew bootRun
```

Backend defaults:
- API: `http://localhost:8080`
- Health: `GET /api/health`

Environment overrides:
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `APP_CORS_ORIGIN`

## Security Notes

- Do not commit `.env`, `.env.local`, or any credential files.
- This repository intentionally avoids hardcoded DB credentials in application config.
- For production: add authentication/authorization to backend endpoints before exposure.
