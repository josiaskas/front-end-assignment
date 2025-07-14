import { Container } from 'pixi.js';
import { SymbolFactory } from './Symbol.js';

export default class Reel {
  constructor(band, app, visibleCount = 3, symbolSpacing = 10) {
    this.band = band;
    this.app = app;
    this.symbolKeys = band;
    this.container = new Container();
    this.visibleCount = visibleCount;
    this.symbolSpacing = symbolSpacing;
    this.rng = Math.random;
    this._currentIndex = 0; // position initiale selon les instructions
    this._allSymbols = [];
    this._visibleSymbols = [];
    this._maxSymbolSize = 0;

    this._initializeSymbols();
    this._updateVisibleSymbols();
    this.container.position.set(0, 0);
  }

  _initializeSymbols() {
    this._allSymbols = [];

    for (let i = 0; i < this.band.length; i++) {
      const key = this.band[i];
      const sym = SymbolFactory.create(key, i);
      if (sym) {
        sym.setOrder(i);
        sym.setState('invisible');
        this._allSymbols.push(sym);

        const symbolSize = sym.getSprite().height;
        if (symbolSize > this._maxSymbolSize) {
          this._maxSymbolSize = symbolSize;
        }
      }
    }
  }

  _updateVisibleSymbols() {
    this._visibleSymbols.forEach(sym => {
      if (this.container.children.includes(sym.getSprite())) {
        this.container.removeChild(sym.getSprite());
      }
    });

    this._visibleSymbols = [];

    for (let i = 0; i < this.visibleCount; i++) {
      const symbolIndex = (this._currentIndex + i) % this.band.length;
      const symbol = this._allSymbols[symbolIndex];

      if (symbol) {
        symbol.setState('idle');
        symbol.setPosition(0, i * (this._maxSymbolSize + this.symbolSpacing));
        symbol.setOrder(i);
        this.container.addChild(symbol.getSprite());
        this._visibleSymbols.push(symbol);
      }
    }
  }

  _animateVisibleSymbols(duration = 1000) {
    const animationPromises = this._visibleSymbols.map(symbol =>
      symbol.animate(this.app, duration)
    );
    return Promise.all(animationPromises);
  }

  getContainer() {
    return this.container;
  }

  getVisibleSymbols() {
    return this._visibleSymbols.map(sym => sym.key);
  }

  getVisibleSymbolReferences() {
    return [...this._visibleSymbols];
  }

  getCurrentIndex() {
    return this._currentIndex;
  }

  spinToIndex(index) {
    this._allSymbols.forEach(sym => sym.setState('spinning'));
    this._currentIndex = index % this.band.length;
    this._updateVisibleSymbols();
  }

  spinToRandom() {
    const randomIndex = Math.floor(this.rng() * this.band.length);
    this.spinToIndex(randomIndex);
    return randomIndex;
  }

  spin(animate = true, duration = 1000) {
    const newIndex = this.spinToRandom();

    if (animate) {
      return this._animateVisibleSymbols(duration).then(() => newIndex);
    }

    return Promise.resolve(newIndex);
  }

  applyScale(scale) {
    this._allSymbols.forEach(sym => {
      //sym.getSprite().scale.set(scale);
    });
    // this.container.scale.set(scale);
  }
}
