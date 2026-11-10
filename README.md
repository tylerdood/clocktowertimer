# Clocktower Timer

A game timer for [Blood on the Clocktower](https://bloodontheclocktower.com), built for Storytellers. It runs on **iOS** and in the **browser** from one Expo (React Native + TypeScript) codebase.

> Clocktower Timer is an unofficial fan project and is not affiliated with The Pandemonium Institute.

## Features

- **Big, centred clock** for discussion and nominations, with play/pause and a recall bell right beneath it.
- **Phase flow** from Day to Dusk to Night, with a single "Next: …" button. Timers shrink automatically as the game goes on, based on player count (or set your own).
- **Game info at a glance:** Townsfolk/Outsiders, Minions/Demons, Travellers, players alive and votes left. Tap any of them for its full name.
- **Options tray** (locked while the clock runs): reset, edit and nudge the timer, kill or revive a player, cast or re-add a vote, and step back a phase.
- **Sound effects, haptics and keep-awake**, all optional.
- **Works offline.** Your settings and the game in progress are saved on your device.
- **Web extras:** keyboard shortcuts, German translation, and optional Spotify volume control per phase.

## Run it

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

Space start/stop · Backspace reset · ↑/→/+ add time · ↓/←/− remove time · R recall · N/Enter next phase · P previous phase · Z/X players alive +/− · C/V votes +/− · Q settings

## Project layout

- `App.tsx` – screen layout
- `src/store.ts` – game state, settings (persisted), timer logic
- `src/logic.ts` – timer schedule maths, phase order, time parsing
- `src/sound.ts` – sound effects
- `src/i18n/` – translations (English, plus German on the web)
- `src/components/` – UI (`Roles`, `Timer`, `Phase`, `Tray`, `Settings`, …)
- `assets/` – images and sounds. Fonts come from `@expo-google-fonts` (Pirata One, Almendra, Xanh Mono).

`ios/` is generated (Continuous Native Generation) and git-ignored. Configure native settings in `app.json`.

## Contact & Contributions

For support, reporting bugs, or to contribute, please [open an issue](https://github.com/tylerdood/clocktowertimer/issues) or send a pull request.

## Privacy Policy

Clocktower Timer does not collect, store, track, or share any personal data.

The app works completely offline and does not require user accounts, analytics, advertising, or third-party services. Your settings and the game in progress are saved only on your own device.

The optional Spotify volume control exists only in the web version. If you turn it on, your browser signs in to Spotify directly and keeps its access token in your browser's local storage. That token is sent only to Spotify, never to us, and you can disconnect it in Settings at any time.

If you have any questions, please open an issue on [GitHub](https://github.com/tylerdood/clocktowertimer/issues).

## Credits

Forked from [dennisschuerholz/clocktowertimer](https://github.com/dennisschuerholz/clocktowertimer). Blood on the Clocktower is a trademark of The Pandemonium Institute.
