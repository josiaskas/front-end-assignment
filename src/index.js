import { Application } from 'pixi.js';
import Preloader from './core/Preloader.js';
import Game from './core/Game.js';

function initGame(containerId) {
  const app = new Application();
  app
    .init({
      resizeTo: window,
      background: 0xe6f3ff,
      resolution: window.devicePixelRatio,
      autoDensity: true,
      clearBeforeRender: true,
    })
    .then(() => {
      window.__PIXI_APP__ = app;
      const pixiStage = document.querySelector(containerId);
      if (!pixiStage) {
        throw new Error(`Container with id ${containerId} not found`);
      }

      pixiStage.appendChild(app.canvas);

      const preloader = new Preloader(app);

      window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        if (window.game) window.game.onResize();
      });

      preloader.start(loadedAssets => {
        const game = new Game(app, loadedAssets);
        window.game = game;
        game.loadConfigs().then(() => {
          game.initialize();
          game.onResize();
        });
      });
    });
}

initGame('#pixi-container');
