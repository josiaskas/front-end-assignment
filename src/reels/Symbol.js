import { Sprite, Texture, ColorMatrixFilter } from 'pixi.js'; 

// classe Symbol - encapsule un PIXI.Sprite avec identifiant et info de gain
export default class Symbol {
  constructor(key, textureKey, payout = {}, order) {
    this.key = key;
    this.payout = payout;
    this.order = order;
    this.state = 'invisible';
    this.sprite = new Sprite(Texture.from(textureKey));
    this.sprite.anchor.set(0, 0.5); // bord gauche, centré verticalement
    this.sprite.pivot.set(0, this.sprite.height * 0.5); // pivot correspond à l'ancre
    this.sprite.scale.set(1);
    this.symbolSize = this.sprite.height;
  }

  setPosition(x, y) {
    this.sprite.position.set(x, y);
  }
  setOrder(order) {
    this.order = order;
  }

  // définit l'état du symbole
  setState(state) {
    this.state = state;
    this._updateStyle();
  }

  getSprite() {
    return this.sprite;
  }

  // donne le gain pour ce symbole selon le nombre de symboles identiques
  getPayout(count) {
    return this.payout[count] || 0;
  }

  // met à jour le style visuel selon l'état
  _updateStyle() {
    switch (this.state) {
      case 'invisible':
        this.sprite.alpha = 0; // invisible
        this.sprite.filters = null;
        break;
      case 'idle':
        this.sprite.alpha = 1; // opacité complète
        this.sprite.filters = null;
        break;
      case 'winning':
        this.sprite.alpha = 1;
        this.sprite.filters = [new ColorMatrixFilter()];
        this.sprite.filters[0].brightness(1.4, true);
        this.sprite.filters[0].saturate(2.0, true);
        this.sprite.filters[0].contrast(1.3, true);
        break;
      case 'spinning':
        this.sprite.alpha = 0.7; // plus transparent pendant la rotation
        this.sprite.filters = [new ColorMatrixFilter()];
        this.sprite.filters[0].brightness(0.7, true);
        this.sprite.filters[0].saturate(0.2, true);
        this.sprite.filters[0].contrast(0.8, true);
        break;
    }
  }

  // anime le symbole (ex: rotation pour une victoire)
  animate(app, duration = 1000) {
    return new Promise(resolve => {
      this.setState('spinning');
      const startTime = performance.now();

      const animate = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        this.sprite.rotation = progress * 2 * Math.PI; // rotation complète
        if (progress < 1) {
          app.ticker.addOnce(() => animate(performance.now()));
        } else {
          this.setState('idle'); // revenir à l'état normal
          resolve();
        }
      };

      app.ticker.addOnce(() => animate(performance.now()));
    });
  }
}

export class SymbolFactory {
    static setSymbolConfig(symbolConfig) {
        this.symbolConfig = symbolConfig;
    }
    static create(symbolId, order) {
        const config = this.symbolConfig[symbolId];
        if (!config) {
            console.error(`Texture ${symbolId} not found`);
            return null;
        }
        return new Symbol(symbolId, config.textureKey, config.payout, order);
    }

    static getSymbolConfig() {
        return this.symbolConfig;
    }

    static getSymbolPayout(key) {
        return this.symbolConfig[key].payout;
    }
    static getSymbolPayoutNumber(key, count) {
        return this.symbolConfig[key].payout[count] || 0;
    }
}