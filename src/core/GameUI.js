import {
  RenderGroup,
  RenderLayer,
  Text,
  Sprite,
  Texture,
  ColorMatrixFilter,
} from 'pixi.js';

export default class GameUI {
  constructor(app, config, textContainer, buttonContainer) {
    this.app = app;
    this.renderGroup = new RenderGroup();
    this.uiLayer = new RenderLayer({ renderGroup: this.renderGroup });
    this.config = config;
    this.textContainer = textContainer;
    this.buttonContainer = buttonContainer;
    this.elements = {};
    this.spinCallback = null;
  }

  initializeUI() {
    const winText = new Text({
      text: 'Total wins: 0',
      style: {
        fontFamily: 'Arial',
        fontSize: 40,
        fill: '#0066FF',
        stroke: { color: '#000000', width: 2 },
        wordWrap: true,
        wordWrapWidth: this.config.baseWidth - 60,
        align: 'center',
      },
    });
    winText.anchor.set(0.5, 0);
    winText.position.set(0, 0);
    this.textContainer.addChild(winText);
    this.elements.winText = winText;

    const spinButton = new Sprite(Texture.from('spin-button'));
    spinButton.anchor.set(0.5);
    spinButton.position.set(0, 0);
    spinButton.interactive = true;
    spinButton.buttonMode = true;

    // effets de survol et de clic
    spinButton.on('pointerover', () => this.onButtonHover(spinButton, true));
    spinButton.on('pointerout', () => this.onButtonHover(spinButton, false));
    spinButton.on('pointerdown', () => this.onButtonClick(spinButton, true));
    spinButton.on('pointerup', () => this.onButtonClick(spinButton, false));
    spinButton.on('pointerupoutside', () =>
      this.onButtonClick(spinButton, false)
    );

    this.buttonContainer.addChild(spinButton);
    this.elements.spinButton = spinButton;
  }

  onButtonHover(button, isHovering) {
    if (!this.elements.spinButton.interactive) return;

    if (isHovering) {
      button.scale.set(1.1, 1.1);
      button.filters = [new ColorMatrixFilter()];
      button.filters[0].brightness(1.2, true);
    } else {
      button.scale.set(1, 1);
      button.filters = null;
    }
  }

  onButtonClick(button, isClicking) {
    if (!this.elements.spinButton.interactive) return;

    if (isClicking) {
      button.scale.set(0.95, 0.95);
      button.filters = [new ColorMatrixFilter()];
      button.filters[0].brightness(0.8, true);
    } else {
      button.scale.set(1, 1);
      button.filters = null;

      if (this.spinCallback) {
        this.spinCallback();
      }
    }
  }

  setSpinButtonCallback(callback) {
    this.spinCallback = callback;
  }

  getScoreText() {
    return this.elements.winText;
  }

  getSpinButton() {
    return this.elements.spinButton;
  }

  updateWinText(total, details) {
    const winText =
      total > 0
        ? `🎰 Total wins: ${total}\n${details.join('\n')}`
        : '🎰 Total wins: 0';

    console.log(`🎰 Spin result: ${total > 0 ? `${total} wins` : 'No wins'}`);
    if (details && details.length > 0) {
      details.forEach(detail => console.log(`  ${detail}`));
    }

    this.elements.winText.text = winText;
    this.updateScale();
  }

  setSpinButtonInteractive(interactive) {
    this.elements.spinButton.interactive = interactive;

    // état visuel selon l'interactivité
    if (!interactive) {
      // état de rotation - bouton désactivé
      this.elements.spinButton.scale.set(0.9, 0.9);
      this.elements.spinButton.filters = [new ColorMatrixFilter()];
      this.elements.spinButton.filters[0].brightness(0.6, true);
      this.elements.spinButton.filters[0].saturate(0.5, true);
    } else {
      // état normal - réinitialisation
      this.elements.spinButton.scale.set(1, 1);
      this.elements.spinButton.filters = null;
    }
  }

  updateScale(scale = 1) {
    if (this.elements.winText) {
      const baseFontSize = 40;
      const scaledFontSize = Math.max(40, baseFontSize * scale);
      this.elements.winText.style.fontSize = scaledFontSize;
      this.elements.winText.style.wordWrapWidth =
        (this.config.baseWidth - 60) * scale;
    }
  }
}
