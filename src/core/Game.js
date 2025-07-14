import { Container } from 'pixi.js';
import ConfigLoader from './ConfigLoader.js';
import { SymbolFactory } from '../reels/Symbol.js';
import Reel from '../reels/Reel.js';
import GameUI from './GameUI.js';
import { Paylines } from '../paylines/index.js';

export default class Game {
  constructor(app, loadedAssets) {
    this.app = app;
    this.loadedAssets = loadedAssets;
    this.config = {
      initialX: 40,
      initialY: 0,
      symbolSpacing: 40,
      visibleCount: 3,
      symbolSize: 256,
      mainPadding: 0,
    };

    this.config.baseWidth =
      this.config.symbolSize * 5 +
      this.config.symbolSpacing * 4 +
      this.config.mainPadding * 2;
    this.config.baseHeight =
      this.config.symbolSize * 5 +
      this.config.symbolSpacing * 4 +
      this.config.mainPadding * 2;

    this.mainContainer = new Container();
    this.mainContainer.position.set(0, 0);
    this.mainContainer.label = 'GameContainer';

    this.textContainer = new Container();
    this.textContainer.label = 'TextContainer';
    this.textContainer.position.set(0, 0);

    this.slotContainer = new Container();
    this.slotContainer.label = 'SlotContainer';
    this.slotContainer.position.set(0, 0);

    this.buttonContainer = new Container();
    this.buttonContainer.label = 'ButtonContainer';
    this.buttonContainer.position.set(0, 0);

    this.ui = new GameUI(
      this.app,
      this.config,
      this.textContainer,
      this.buttonContainer
    );
    this.reels = [];
    this.paylines = null;
    this.scale = 1;
    this.isSpinning = false;
  }

  async loadConfigs() {
    const { reels, symbols, paylines } = await ConfigLoader.loadConfig();
    console.log(
      `🎮 Slot machine loaded: ${reels.length} reels, ${Object.keys(symbols).length} symbols, ${paylines.length} paylines`
    );

    SymbolFactory.setSymbolConfig(symbols);
    this.reels = reels.map(
      keys =>
        new Reel(
          keys,
          this.app,
          this.config.visibleCount,
          this.config.symbolSpacing
        )
    );
    this.paylines = new Paylines(paylines);
  }

  initialize() {
    this.app.stage.addChild(this.mainContainer);

    this.mainContainer.addChild(this.textContainer);
    this.mainContainer.addChild(this.slotContainer);
    this.mainContainer.addChild(this.buttonContainer);

    this.ui.initializeUI();
    this.ui.setSpinButtonCallback(() => this.spin());

    this._positionReels();
    this._positionContainers();
    this.onResize();
    console.log('🎮 Game ready! Click spin to play');
  }

  _positionReels() {
    const reelWidth = this.config.symbolSize + this.config.symbolSpacing;

    this.reels.forEach((reel, index) => {
      reel.getContainer().position.x = index * reelWidth;
      reel.getContainer().position.y = this.config.initialY;
      this.slotContainer.addChild(reel.getContainer());
    });
  }

  _positionContainers() {
    const slotContainerHeight =
      this.config.symbolSize * 3 + this.config.symbolSpacing * 2;
    const slotContainerWidth =
      5 * (this.config.symbolSize + this.config.symbolSpacing) -
      this.config.symbolSpacing;
    const pad = this.config.mainPadding;

    // positionnement du conteneur de slot au centre
    this.slotContainer.pivot.set(
      slotContainerWidth / 2,
      slotContainerHeight / 2
    );
    this.slotContainer.position.set(
      this.config.baseWidth / 2,
      this.config.baseHeight / 2
    );

    // positionnement du bouton spin sous les rouleaux
    const lastReelX =
      this.config.baseWidth / 2 +
      slotContainerWidth / 2 -
      (this.config.symbolSize + this.config.symbolSpacing);
    const buttonY =
      this.config.baseHeight / 2 +
      slotContainerHeight / 2 +
      this.config.symbolSpacing / 4;
    this.buttonContainer.position.set(lastReelX, buttonY);

    // positionnement du texte de gain sous le bouton spin
    const textY = buttonY;
    this.textContainer.position.set(this.config.baseWidth / 5, textY);
  }

  async spin() {
    if (this.isSpinning) return;

    console.log('🎰 Spinning...');
    this.isSpinning = true;
    this.ui.setSpinButtonInteractive(false);

    try {
      const spinPromises = this.reels.map((reel, index) => reel.spin(false));
      const results = await Promise.all(spinPromises);
      console.log(`🎯 Positions: ${results.join(', ')}`);

      this.calculateWinnings();
    } catch (error) {
      console.error('❌ Spin error:', error);
    } finally {
      this.isSpinning = false;
      this.ui.setSpinButtonInteractive(true);
    }
  }

  calculateWinnings() {
    const visibleSymbols = this.reels.map(reel => reel.getVisibleSymbols());
    const winResults = this.paylines.calculateAllWins(
      visibleSymbols,
      SymbolFactory.getSymbolConfig()
    );

    this.ui.updateWinText(winResults.totalWins, winResults.winDetails);
  }

  onResize() {
    const screenW = this.app.screen.width;
    const screenH = this.app.screen.height;
    const baseWidth = this.config.baseWidth;
    const baseHeight = this.config.baseHeight;

    this.scale = Math.min(screenW / baseWidth, screenH / baseHeight);

    this.mainContainer.scale.set(this.scale, this.scale);

    const scaledWidth = baseWidth * this.scale;
    const scaledHeight = baseHeight * this.scale;
    this.mainContainer.position.set(
      (screenW - scaledWidth) / 2,
      (screenH - scaledHeight) / 2
    );

    this.reels.forEach(reel => reel.applyScale(this.scale));
    this.ui.updateScale(this.scale);
  }
}
