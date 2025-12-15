# Clocktower Timer - React + TypeScript Version

A beautiful, animated timer application for Blood on the Clocktower, rebuilt with React, TypeScript, and Framer Motion.

## Features

- ⏱️ **Timer Functionality**: Countdown timer with start/stop/reset controls
- 🌅 **Phase Management**: Smooth transitions between Day, End of Day, and Night phases
- 🎨 **Beautiful Animations**: Smooth background transitions, button interactions, and visual feedback
- 🎮 **Keyboard Shortcuts**: Fully customizable keybindings
- 🎵 **Sound Effects**: Immersive audio for phase changes and timer completion
- 🎧 **Spotify Integration**: Control Spotify volume based on game phase
- 📊 **Character Tracking**: Track townsfolk, evil roles, travelers, lives, and votes
- ⚙️ **Settings**: Comprehensive settings panel with timer configuration

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Framer Motion** - Animations
- **Zustand** - State management
- **Tailwind CSS** - Styling

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # React components
│   ├── Character/   # Character tracking components
│   ├── Controls/    # Control panel and buttons
│   ├── Phase/       # Phase indicator and background
│   ├── Settings/    # Settings modal
│   ├── Timer/       # Timer display and controls
│   └── UI/          # Reusable UI components
├── hooks/           # Custom React hooks
├── store/           # Zustand state stores
├── services/        # External service integrations
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Key Features Implementation

### Animations

- **Background Transitions**: Smooth 2.5s crossfade between phase backgrounds
- **Timer Display**: Pulse animation when time is low (< 30s), red glow when critical (< 10s)
- **Button Interactions**: Hover scale and tap feedback
- **Control Panel**: Slide-in/out animation
- **Number Changes**: Smooth count-up animations for tracker values

### State Management

- **Timer Store**: Manages timer state, countdown, and controls
- **Phase Store**: Handles phase transitions and day progression
- **Character Store**: Tracks role distribution and life/vote counts
- **Settings Store**: Persists settings to localStorage

### Keyboard Shortcuts

All keyboard shortcuts are customizable through the settings panel. Default bindings:
- `Space` - Start/Stop timer
- `N` or `Enter` - Next phase
- `R` - Recall townsfolk
- `Backspace` - Reset timer
- And many more...

## Migration from Vanilla JS

This React version maintains full feature parity with the original vanilla JavaScript version while adding:
- Better code organization
- Type safety
- Smooth animations
- Improved maintainability
- Modern development experience

## License

Open source - feel free to contribute!

