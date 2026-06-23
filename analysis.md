# Project Analysis — Zenith (The Celestial Eye)

## Repository Overview

```
Zeneth/
├── frontend/          # Next.js 16 App Router (active dev)
├── backend/           # Go 1.26 chi server on :8080 (early stubs)
├── Makefile           # Orchestrates dev/build/lint
├── .env               # Placeholder env vars (names mismatch Go code)
├── .gitignore         # Ignores .env files, docs/, logs, OS files
└── analysis.md        # This file
```

---

## Frontend (Next.js 16 + React 19 + TypeScript 5)

### Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.9 (App Router) |
| Language | TypeScript 5 (strict: true) |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`, CSS-based config) |
| 3D/Globe | CesiumJS 1.142 + Resium 1.23 |
| 3D/Scene | Three.js 0.184 + @react-three/fiber 9.6 + drei 10.7 |
| Animation | Framer Motion 12.40 + Anime.js 4.4 |
| State Mgmt | Zustand v5 (2 stores: `useStore`, `observatoryStore`) |
| Linting | ESLint 9 (flat config, `eslint.config.mjs`) |

### Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (Geist fonts, metadata)
│   ├── page.tsx            # Home page (scroll-driven scene + mask)
│   └── globals.css         # Tailwind v4 + @theme custom tokens
├── components/
│   ├── 3d/
│   │   └── CesiumGlobe.tsx         # Stub (empty, imports CesiumJS bundle)
│   ├── scenes/
│   │   └── EarthOrbitScene.tsx     # Orbit mode scene (radial rings + satellite dots)
│   ├── telescope/
│   │   ├── ApertureRing.tsx        # Mode selector wheel (anime.js)
│   │   ├── CalibrationMarker.tsx   # Oscillating calibration dot (anime.js)
│   │   ├── CoordinationReadout.tsx # RA/DEC + UTC clock (1s interval)
│   │   ├── Crosshairs.tsx          # Eyepiece crosshairs + range ring (anime.js)
│   │   ├── FocusIndicator.tsx      # Focus slider bar (anime.js)
│   │   ├── Rangefinder.tsx         # Range display (anime.js)
│   │   ├── SignalStrength.tsx      # Animated bars (anime.js)
│   │   ├── TelescopeFrame.tsx      # Orchestrator for all telescope HUD components
│   │   └── TrackingStatus.tsx      # Status indicator (idle/scanning/locked)
│   ├── ui/
│   │   ├── OrbitDial.tsx           # Primary dial (anime.js motion path + CSS spin)
│   │   └── HUDControlPanel.tsx     # Stub control panel (legacy, unused)
│   └── viewport/
│       ├── Horizon.tsx             # Mountain ridgeline SVG + town light glow
│       ├── OpticalEffects.tsx      # Vignette + mouse-driven glass reflection + grain
│       ├── ScrollIntro.tsx         # 300vh scroll-driven zoom (stars → telescope → dial)
│       ├── Starfield.tsx           # Three.js layered starfield (12,800 pts, useFrame)
│       └── TelescopeSilhouette.tsx # SVG telescope illustration
├── lib/
│   └── starData.ts          # Seeded RNG star generation for ScrollIntro CSS stars
└── store/
    ├── useStore.ts          # Legacy store (currentLocation, selectedObject)
    └── observatoryStore.ts  # Primary store (mode, telemetry, tracking, focus, zoom)
```

### Component Count: 16 across 4 categories

---

## Backend (Go 1.26 + chi router + ClickHouse)

### Structure

```
backend/
├── cmd/api/main.go              # Entrypoint: wires config, DB, ingestion, router
├── internal/
│   ├── api/
│   │   ├── rest.go              # REST handlers: GET /health, /api/objects, /api/objects/{id}
│   │   └── websocket.go         # WebSocket hub: 1s broadcast of ISS telemetry
│   ├── config/config.go         # Env-based config (godotenv + os.Getenv)
│   ├── ingestion/
│   │   ├── celestrak.go         # CelesTrak TLE fetcher + parser (functional)
│   │   ├── horizons.go          # NASA Horizons stub (no-op)
│   │   └── pipeline.go          # Ingestion orchestrator (initial fetch + 6h ticker)
│   ├── models/models.go        # CelestialObject, TLEData, Telemetry structs
│   ├── propagation/propagator.go # SGP4 propagator (TLE → lat/lng/alt)
│   └── storage/clickhouse.go   # ClickHouse DDL + CRUD (ReplacingMergeTree)
├── go.mod / go.sum
└── main                        # 17MB compiled binary (committed — should be gitignored)
```

### API Surface

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Returns `"OK"` |
| `/api/objects?q=` | GET | Search objects by name (ILIKE, limit 100) |
| `/api/objects/{id}` | GET | Get single object by NORAD ID |
| `/ws` | GET | WebSocket — ISS telemetry every 1s |

### Status

- **CelesTrak ingestion**: Working — fetches TLE, parses, upserts to ClickHouse
- **NASA Horizons**: Stub — logs message, does nothing
- **Propagator**: Working — SGP4 via `go-satellite` lib, returns Telemetry with lat/lng/alt
- **WebSocket**: Working — broadcasts ISS position to all connected clients
- **REST API**: Working — search and single-object endpoints
- **Auth/Security**: None — CORS open to `localhost:3000`, no rate limiting
- **ClickHouse**: Schema created but no production connectivity configured

---

## Critical Issues Found

### Performance (Frontend)

| # | Issue | Severity | File |
|---|-------|----------|------|
| P1 | **3× OrbitDial renders simultaneously** — page.tsx, ScrollIntro, EarthOrbitScene all render OrbitDial instances that overlap | Critical | `page.tsx:54`, `ScrollIntro.tsx:150`, `EarthOrbitScene.tsx:82` |
| P2 | **Two independent useScroll hooks** — page.tsx and ScrollIntro each attach scroll listeners, computing overlapping transforms that fight for control | Critical | `page.tsx:12`, `ScrollIntro.tsx:49` |
| P3 | **Two concurrent starfields** — Three.js Starfield (12,800 points, useFrame) + ScrollIntro CSS starfield (250 stars) both render on overlapping sections | High | `Starfield.tsx`, `ScrollIntro.tsx:90-120` |
| P4 | **CesiumJS (~40MB) loaded in main bundle** but only used in an empty stub. Dynamic import not implemented | High | `CesiumGlobe.tsx` |
| P5 | **Continuous scroll transform string recomputation** — maskImage and rimBg generate full `radial-gradient(...)` strings on every scroll frame | High | `page.tsx:20-31` |
| P6 | **7 concurrent anime.js timelines** running continuously regardless of visibility | Medium | Telescope components |
| P7 | **OrbitDial CSS spin animation** runs 150s infinite rotation on tick marks, keeping compositor active | Medium | `OrbitDial.tsx:85-86` |

### Structural (Frontend)

| # | Issue | Severity | File |
|---|-------|----------|------|
| S1 | **ScrollIntro creates 300vh scroll trigger** but page.tsx has its own scroll-driven mask — sections overlap in z-index space (z-5 vs z-10 vs z-50) | High | `ScrollIntro.tsx:126`, `page.tsx:36-56` |
| S2 | **OpticalEffects mouse listener** recalculates gradient on every mousemove — no throttle | Low | `OpticalEffects.tsx:12-16` |
| S3 | **Crosshairs innerRingRef declared but never animated** — dead ref | Low | `Crosshairs.tsx:16,79` |
| S4 | **CoordinationReadout setInterval** (1s) runs for entire lifecycle — no pause when hidden | Low | `CoordinationReadout.tsx:15` |

### Backend

| # | Issue | Severity | File |
|---|-------|----------|------|
| B1 | **17MB compiled binary committed** — `backend/main` not in `.gitignore` | Medium | repo root |
| B2 | **`.env` variable names don't match Go code** — code reads `CLICKHOUSE_DSN`, `.env` has `CLICKHOUSE_URL/USER/PASSWORD/DATABASE` | High | `.env` vs `config.go` |
| B3 | **NASA Horizons ingestion is a stub** — no API call implemented | Low | `horizons.go` |
| B4 | **WebSocket broadcasts only ISS** — hardcoded NORAD-25544 | Low | `websocket.go` |
| B5 | **No graceful degradation without ClickHouse** — config fatally exits if DSN missing | Medium | `config.go` |
| B6 | **CORS allows any origin via `AllowAll`** — not localhost-only | Low | `main.go` |

### Design Notes

- The **telescope-as-navigation** metaphor is well-implemented qualitatively but the scroll-driven zoom transition (`ScrollIntro`) creates visual overlap with the page-level scroll mask — the user sees two conflicting "aperture closing" effects simultaneously
- The **Zustand store duplication** (`useStore` vs `observatoryStore`) suggests an unfinished migration — `useStore` tracks `currentLocation`/`selectedObject` while `observatoryStore` handles telescope state
- `HUDControlPanel.tsx` is a legacy placeholder with hardcoded ISS data — not integrated with observatoryStore

---

## Recommended Fix Priority

| Priority | Fix | Effort |
|----------|-----|--------|
| 1 | Remove duplicate OrbitDial instances (keep one in ScrollIntro) | Low |
| 2 | Defer CesiumJS via `next/dynamic` with `ssr: false` | Low |
| 3 | Consolidate `useScroll` into parent, simplify mask computation | Medium |
| 4 | Pause Starfield Three.js rendering when out of viewport | Medium |
| 5 | Memoize expensive scroll-derived string values | Low |
| 6 | Add `backend/main` to `.gitignore` | Trivial |
| 7 | Align `.env` variable names with Go config expectations | Low |
| 8 | Remove `HUDControlPanel` if unused; consolidate Zustand stores | Low |

