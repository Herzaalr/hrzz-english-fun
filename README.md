# HRZZ English Fun — Your English OS

> Learn English. Speak Freely. Have Fun.

A personal daily English coach for Indonesian learners: daily milestones, sentence building before speaking, guided → independent speaking, rule-based review, XP/streaks, and local-first progress.

## Stack (honest)
- Static web app: vanilla ES5/ES2020 JavaScript, no build step. (React/Vite was not possible in the original build environment; the code is organized like a React project: services in `assets/core.js`, content in `assets/data.js`, one module per page.)
- Tailwind preflight + a custom design system (`assets/theme.css`), light/dark themes.
- Bilingual UI (Bahasa Indonesia default, English toggle in header/Settings): `assets/i18n.js` holds the dictionary and `T()` helper; preference in localStorage (`hrzz-lang`). Lesson content stays in English by design (each lesson has its own 🇮🇩 translation toggle).
- PWA: installable on Android/desktop Chrome. The manifest is built at runtime in `assets/app.js` (absolute URLs, so it works on any domain); the icon is referenced as a hosted PNG in each page `<head>`. For self-hosting, swap those `href`s to `/assets/icon.svg` (included) or a PNG of your own, and add a root `sw.js` if you want offline support (Moda hosting cannot serve one).
- Storage: IndexedDB (all learning data), localStorage (theme + language only). Export/import JSON, delete-all.
- Browser Speech Synthesis (listen/shadowing) and Speech Recognition (mic, Chrome/Edge) with honest unsupported states.
- Optional AI through **your own authenticated proxy** (`POST {messages, mode} → {reply}`). No API keys in the client.
- Chart.js is loaded from `https://cdn.moda.app/runtime-libs/chartjs-4.5.1/chart.umd.min.js` on the Progress page; swap for any Chart.js 4 copy if you self-host.

## Deploy as an offline-first PWA
See `DEPLOY.md` (GitHub Pages via `build.py` + `pwa/sw.js` + `pwa/manifest.webmanifest`).

## Run locally
Any static server with the `pages/` directory-as-route layout, e.g.

```bash
# quick dev server (Python 3)
python3 -m http.server 8080
# then open http://localhost:8080/pages/  and http://localhost:8080/pages/mission/ etc.
```

For clean routes (`/mission/` instead of `/pages/mission/`) serve `pages/` as the web root and `assets/` at `/assets/`, e.g. with nginx, Netlify, Vercel, or GitHub Pages (copy `assets/` into `pages/` and set `pages/` as the Pages root).

Voice input needs **https** (or localhost) and microphone permission.

## Structure
```
pages/            index.html + <route>/index.html  (home, mission, speak, explore, progress, coach, settings, play)
assets/theme.css  design tokens + components
assets/data.js    lessons, scenarios, activities, error detectors, badges
assets/core.js    DB (IndexedDB), learning engine, speech, AI adapter, UI kit, onboarding
assets/app.js     page bootstrap + active-time tracker pill
assets/page-*.js  page renderers
```

## Tests
`test.js` and `walkthrough.js` (Node 18+) exercise the engine with an in-memory DB:
```bash
node tests/test.js
node tests/walkthrough.js
```
