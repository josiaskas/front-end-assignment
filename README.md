# Slot Machine Game

A modern slot machine game built with PixiJS and ECMAScript 6, featuring a 5x3 reel layout with multiple paylines and comprehensive win calculations.

## 🎰 Features

- **5x3 Reel Layout**: Classic slot machine with 5 columns and 3 rows
- **Asset Preloader**: Loading screen with progress percentage display
- **Responsive Design**: Game area scales with window resizes
- **Multiple Paylines**: 7 different payline patterns for winning combinations
- **Real-time Win Calculation**: Instant win detection and payout display
- **Symbol Variety**: 8 different symbols (hv1-hv4, lv1-lv4) with varying payouts

## 🎮 Game Rules

### Reel Layout
The game features 5 reels with 20 symbols each, arranged in bands:

- **Band 1**: "hv2", "lv3", "lv3", "hv1", "hv1", "lv1", "hv1", "hv4", "lv1", "hv3", "hv2", "hv3", "lv4", "hv4", "lv1", "hv2", "lv4", "lv1", "lv3", "hv2"
- **Band 2**: "hv1", "lv2", "lv3", "lv2", "lv1", "lv1", "lv4", "lv1", "lv1", "hv4", "lv3", "hv2", "lv1", "lv3", "hv1", "lv1", "lv2", "lv4", "lv3", "lv2"
- **Band 3**: "lv1", "hv2", "lv3", "lv4", "hv3", "hv2", "lv2", "hv2", "hv2", "lv1", "hv3", "lv1", "hv1", "lv2", "hv3", "hv2", "hv4", "hv1", "lv2", "lv4"
- **Band 4**: "hv2", "lv2", "hv3", "lv2", "lv4", "lv4", "hv3", "lv2", "lv4", "hv1", "lv1", "hv1", "lv2", "hv3", "lv2", "lv3", "hv2", "lv1", "hv3", "lv2"
- **Band 5**: "lv3", "lv4", "hv2", "hv3", "hv4", "hv1", "hv3", "hv2", "hv2", "hv4", "hv4", "hv2", "lv2", "hv4", "hv1", "lv2", "hv1", "lv2", "hv4", "lv4"

### Paytable

| Symbol | 3 of a kind | 4 of a kind | 5 of a kind |
|--------|-------------|-------------|-------------|
| hv1    | 10          | 20          | 50          |
| hv2    | 5           | 10          | 20          |
| hv3    | 5           | 10          | 15          |
| hv4    | 5           | 10          | 15          |
| lv1    | 2           | 5           | 10          |
| lv2    | 1           | 2           | 5           |
| lv3    | 1           | 2           | 3           |
| lv4    | 1           | 2           | 3           |

### Paylines

The game features 7 different paylines that pay from left to right:

1. **Payline 1**: Top row (x x x x x)
2. **Payline 2**: Middle row (x x x x x)
3. **Payline 3**: Bottom row (x x x x x)
4. **Payline 4**: V-shape (x x - - - / - - x - - / - - - x x)
5. **Payline 5**: Inverted V-shape (- - - x x / - - x - - / x x - - -)
6. **Payline 6**: X-pattern (x - - - x / - x - x - / - - x - -)
7. **Payline 7**: Inverted X-pattern (- - x - - / - x - x - / x - - - x)

## 🚀 Getting Started

### Prerequisites

- Modern web browser with ES6 support
- Local web server (for asset loading)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd slot-machine-game
```

2. Set up a local web server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

3. Open your browser and navigate to `http://localhost:8000`

### Project Structure

```
slot-machine-game/
├── index.html          # Main HTML file
├── assets/             # Game assets (images)
│   ├── symbols/        # Symbol images
│   └── ui/            # UI elements (buttons, etc.)
├── src/               # Source code
│   ├── main.js        # Main game logic
│   ├── preloader.js   # Asset loading system
│   ├── slotMachine.js # Slot machine logic
│   └── winCalculator.js # Win calculation logic
└── README.md          # This file
```

## 🎯 How to Play

1. **Loading**: Wait for the preloader to complete (100%)
2. **Initial State**: The game starts with all reels at position 0
3. **Spinning**: Click the spin button to randomly select new reel positions
4. **Winning**: Check the win display below the reels for any winning combinations
5. **Repeat**: Click spin again for new combinations

## 💻 Technical Details

### Technologies Used

- **PixiJS**: 2D WebGL renderer for graphics
- **ECMAScript 6**: Modern JavaScript features
- **HTML5**: Web standards
- **CSS3**: Styling and responsive design

### Key Features

- **Responsive Design**: Game scales with window resizing
- **Asset Management**: Efficient loading and caching of game assets
- **Win Calculation**: Real-time detection of winning combinations across all paylines
- **Performance Optimized**: Smooth rendering and efficient memory usage

### Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🧪 Testing

The game includes comprehensive testing for:
- Asset loading functionality
- Reel position calculations
- Win detection algorithms
- Payline pattern matching
- Responsive design behavior

## 📝 Development Notes

### Code Organization

The codebase follows modern JavaScript best practices:
- ES6 modules for code organization
- Clear separation of concerns
- Comprehensive error handling
- Well-documented functions and classes

### Performance Considerations

- Efficient sprite management
- Optimized win calculation algorithms
- Minimal DOM manipulation
- Hardware-accelerated rendering via WebGL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎮 Game Examples

### Example 1: No Wins
```
Positions: 18, 9, 2, 0, 12
Screen:
  lv3 hv4 lv3 hv2 lv2
  hv2 lv3 lv4 lv2 hv4
  hv2 hv2 hv3 hv3 hv1
Total wins: 0
```

### Example 2: Multiple Wins
```
Positions: 0, 11, 1, 10, 14
Screen:
  hv2 hv2 hv2 lv1 hv1
  lv3 lv1 lv3 hv1 lv2
  lv3 lv3 lv4 lv2 hv1
Total wins: 6
- payline 2, hv2 x3, 5
- payline 5, lv3 x3, 1
```

---

**Enjoy playing! 🎰**
