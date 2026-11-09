# Clocktower Timer

A game timer for Blood on the Clocktower, built with Expo (React Native + TypeScript). One codebase runs on iOS and on the web.

## Run

Needs Node 22.13+.

```bash
npm install
npm run web        # browser, http://localhost:8081
npm run ios        # iOS Simulator (needs Xcode); generates ios/ on first run
```

## Web build / deploy

```bash
npm run build      # static site in dist/
```

`wrangler.toml` serves `dist/` (Cloudflare), and `public/_redirects` handles the single-page fallback.

## Web keyboard shortcuts

Space start/stop · Backspace reset · ↑/→/+ add time · ↓/←/− remove time · R recall · N/Enter next phase · P previous phase · Z/X hearts +/− · C/V votes +/− · Q settings

## Layout

- `App.tsx` – screen layout
- `src/store.ts` – game state, settings (persisted), timer logic
- `src/logic.ts` – timer schedule maths, time parsing
- `src/sound.ts` – sound effects
- `src/components/` – UI
- `assets/` – fonts are loaded from `@expo-google-fonts`; images and sounds live here

`ios/` is generated (Continuous Native Generation) and git-ignored; configure native settings in `app.json`.
