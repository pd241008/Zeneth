<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:phase-1-complete -->
# Phase 1 — Observatory Identity (implemented 2026-06-19)

## Architecture

- **Store**: `src/store/observatoryStore.ts` — Zustand state machine. Tracks `power`, `mode` (`orbit`/`stellar`/`survey`), `target`, `trackingStatus`, `focus`, `zoom`, `telemetry`, `panel`. Actions: `cycleMode`, `setFocus`, `setTrackingStatus`, `updateTelemetry`.
- **All telescope frame components** are `'use client'` and live in `src/components/telescope/`.
- **Anime.js v4.4.1** is the animation engine. Import as `import { animate, timeline, stagger } from 'animejs'`.
- **Three.js** starfield uses `@react-three/fiber` v9 with imperative `BufferGeometry` creation (not JSX `<bufferAttribute>` — that has typing issues in R3F v9).
- **Cesium** is not wired yet — `EarthOrbitScene` is a CSS mockup with satellite dots.

## Components built

| Path | Anime.js usage |
|---|---|
| `telescope/Crosshairs.tsx` | Breathing loop (scale 1↔1.02), lock ring contraction (elastic) |
| `telescope/Rangefinder.tsx` | Object animation with `round: true` for mechanical counter roll |
| `telescope/ApertureRing.tsx` | Rotation animation via `outElastic` on mode change |
| `telescope/FocusIndicator.tsx` | Top-position tween on focus value |
| `telescope/TrackingStatus.tsx` | CSS pulse only (no animejs) |
| `telescope/SignalStrength.tsx` | Opacity stagger loop on `.signal-bar` elements |
| `telescope/CalibrationMarker.tsx` | translateX sine oscillation loop |
| `telescope/CoordinationReadout.tsx` | No animejs — plain React interval clock |
| `telescope/TelescopeFrame.tsx` | Composes all rails + bottom bar with "ZENITH" monogram |
| `viewport/Starfield.tsx` | Three.js 12K-star particle system, slow rotation in `useFrame` |
| `viewport/OpticalEffects.tsx` | CSS vignette, mouse-driven glass reflection, chromatic aberration, noise grain |
| `scenes/EarthOrbitScene.tsx` | Mock Earth + 3 satellite dots, only renders in `orbit` mode |

## Critical notes for future work

- **Anime.js cleanup pattern**: Always wrap `anim.cancel()` in a block `() => { anim.cancel(); }` — animejs returns `this` from `cancel()`, which TypeScript rejects as non-void in `useEffect` destructor position.
- **`bufferAttribute` JSX pattern broken in R3F v9**: Use imperative `new THREE.BufferGeometry()` + `geo.setAttribute()` instead.
- **ESLint crashes** with a pre-existing `eslint-plugin-react` / ESLint 9 incompatibility (error: `Side channel does not contain the given object key`). Not caused by any Phase 1 code. Lint fix deferred.
- **No Cesium viewer connected** — `CesiumGlobe.tsx` is still the original placeholder.
- **No Zustand subscribe-with-selector pattern yet** — components use individual selectors `useObservatoryStore((s) => s.mode)` for granular re-renders.
<!-- END:phase-1-complete -->
