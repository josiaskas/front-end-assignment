import { Assets, Text } from 'pixi.js';

export default class Preloader {
  constructor(app) {
    this.app = app;
    this.loaderText = null;
    this.assetList = [
      { alias: 'symbol-hv1', src: '/assets/hv1_symbol.png' },
      { alias: 'symbol-hv2', src: '/assets/hv2_symbol.png' },
      { alias: 'symbol-hv3', src: '/assets/hv3_symbol.png' },
      { alias: 'symbol-hv4', src: '/assets/hv4_symbol.png' },
      { alias: 'symbol-lv1', src: '/assets/lv1_symbol.png' },
      { alias: 'symbol-lv2', src: '/assets/lv2_symbol.png' },
      { alias: 'symbol-lv3', src: '/assets/lv3_symbol.png' },
      { alias: 'symbol-lv4', src: '/assets/lv4_symbol.png' },
      { alias: 'spin-button', src: '/assets/spin_button.png' },
    ];
  }

  start(onComplete) {
    this.loaderText = new Text({
      text: '0%',
      style: {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: '#ffffff',
        align: 'center',
      },
    });

    this.loaderText.anchor.set(0.5);
    this.loaderText.position.set(
      this.app.screen.width / 2,
      this.app.screen.height / 2
    );
    this.app.stage.addChild(this.loaderText);

    const bundle = {};
    this.assetList.forEach(asset => {
      bundle[asset.alias] = asset.src;
    });

    Assets.addBundle('game-assets', bundle);

    Assets.loadBundle('game-assets', progress => {
      const progressPercent = Math.round(progress * 100);
      this.loaderText.text = `${progressPercent}%`;
    })
      .then(loadedAssets => {
        this.app.stage.removeChild(this.loaderText);
        this.loaderText = null;
        onComplete(loadedAssets);
      })
      .catch(error => {
        console.error('Loading error:', error);
        if (this.loaderText) {
          this.loaderText.text = 'Loading Error';
          this.loaderText.style.fill = '#ff0000';
        }
      });
  }

  updatePosition() {
    if (this.loaderText) {
      this.loaderText.position.set(
        this.app.screen.width / 2,
        this.app.screen.height / 2
      );
    }
  }

  getAsset(alias) {
    return Assets.get(alias);
  }

  unloadAll() {
    Assets.unloadBundle('game-assets').catch(error => {
      console.error('Error unloading assets:', error);
    });
  }
}
