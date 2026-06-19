# Project — Zenith (The Celestial Eye)

## Repository

Two packages at root:
- `frontend/` — Next.js 16 app (active development focus)
- `backend/` — Go 1.26 server with chi router on `:8080` (early stubs only)

## Frontend commands (run from `frontend/`)

| Command | Action |
|---------|--------|
| `npm run dev` | Dev server at `localhost:3000` |
| `npm run build` | Production build |
| `npm run lint` | ESLint 9 (flat config in `eslint.config.mjs`) |

No test, typecheck, or format commands exist yet.

## Critical version notes

Rules that differ from widely-known defaults:

- **Next.js 16** — breaking changes from v15 possible. Read `node_modules/next/dist/docs/` before authoring new patterns.
- **Tailwind CSS v4** — CSS-based config only (`@import "tailwindcss"` + `@theme` directives). No `tailwind.config.*` file. Border defaults changed to `currentColor`.
- **Zustand v5** — uses `create` from `zustand` (no named store creator change, but confirm API in docs).
- **ESLint v9** — flat config (`eslint.config.mjs`), no `.eslintrc`.
- **React 19 / TypeScript 5** — confirm any new patterns before assuming v18/v4 compat.

## Architecture (frontend)

- `@/*` path alias → `src/*`
- Folders: `src/app/`, `src/components/3d/`, `src/components/ui/`, `src/store/`
- CesiumJS + Resium for globe rendering
- Three.js + `@react-three/fiber` + `@react-three/drei` for starfield/cinematic scenes
- Framer Motion for UI transitions (installed)
- Anime.js listed in design docs for mechanical/calibration animations but **not yet installed**
- Only two components exist: `CesiumGlobe` (stub), `HUDControlPanel` (stub)
- Zustand store at `src/store/useStore.ts` — tracks `currentLocation` and `selectedObject`

## Design principles (do not violate)

- **Cinematic, not dashboard-like.** No data-table, card-grid, or GIS-map aesthetics.
- **Telescope-as-navigation.** The primary UX metaphor is operating a futuristic telescope.
- **Dark observatory.** Black/dark backgrounds, precise typography, subtle glow accents.
- **Motion-first.** Every interaction should feel mechanical, calibrated, deliberate.

## What is NOT here yet

- No CI, no Dockerfiles, no Prettier config
- Anime.js not in `package.json` (do not import it)
- No `opencode.json`
- No tests of any kind

## Backend

- Go 1.26.3, chi router, CORS open to `localhost:3000`
- Stub ingestion pipeline (`internal/ingestion/`) and ClickHouse storage (`internal/storage/`)
- `.env` at repo root — all values are commented-out placeholders
