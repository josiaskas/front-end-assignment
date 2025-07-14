# Slot Machine Game

A slot machine game built with PixiJS and ES6.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## 📁 Project Structure

```
src/
├── core/           # Game logic
│   ├── Game.js     # Main game controller
│   ├── GameUI.js   # UI and interactions
│   ├── Preloader.js # Asset loading
│   └── ConfigLoader.js # Config validation
├── reels/          # Reel system
│   ├── Reel.js     # Individual reel logic
│   └── Symbol.js   # Symbol rendering
├── paylines/       # Win calculation
│   └── Paylines.js # Payline patterns
└── config/         # Game data
    ├── reels.json  # Reel definitions
    ├── symbols.json # Symbol payouts
    └── paylines.json # Payline patterns
```

## 💻 Code Overview

- **Game.js**: Main controller orchestrating all components
- **GameUI.js**: Handles UI interactions and win display
- **Reel.js**: Manages individual reels and symbol positioning
- **Symbol.js**: Symbol states and visual effects
- **Paylines.js**: Win calculation across 7 payline patterns

## 🛠️ Development

```bash
# Lint code
pnpm lint

# Start dev server
pnpm dev
```
