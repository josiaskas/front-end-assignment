import reels from '../config/reels.json';
import symbols from '../config/symbols.json';
import paylines from '../config/paylines.json';
import { Paylines } from '../paylines/index.js';

export default class ConfigLoader {
  static validateReels(reels) {
    if (!Array.isArray(reels) || reels.length !== 5) {
      throw new Error(
        'Reels configuration must be an array with exactly 5 bands'
      );
    }

    reels.forEach((band, index) => {
      if (!Array.isArray(band) || band.length === 0) {
        throw new Error(`Reel band ${index + 1} must be a non-empty array`);
      }

      band.forEach((symbol, symbolIndex) => {
        if (typeof symbol !== 'string' || symbol.trim() === '') {
          throw new Error(
            `Invalid symbol at position ${symbolIndex} in reel band ${index + 1}: "${symbol}"`
          );
        }
      });
    });
  }

  static validateSymbols(symbols) {
    if (typeof symbols !== 'object' || symbols === null) {
      throw new Error('Symbols configuration must be an object');
    }

    const requiredFields = ['textureKey', 'payout'];
    const requiredPayouts = ['3', '4', '5'];

    Object.entries(symbols).forEach(([symbolId, symbolConfig]) => {
      if (typeof symbolConfig !== 'object' || symbolConfig === null) {
        throw new Error(`Symbol "${symbolId}" configuration must be an object`);
      }

      requiredFields.forEach(field => {
        if (!(field in symbolConfig)) {
          throw new Error(
            `Symbol "${symbolId}" is missing required field: "${field}"`
          );
        }
      });

      if (
        typeof symbolConfig.textureKey !== 'string' ||
        symbolConfig.textureKey.trim() === ''
      ) {
        throw new Error(
          `Symbol "${symbolId}" must have a valid textureKey string`
        );
      }

      if (
        typeof symbolConfig.payout !== 'object' ||
        symbolConfig.payout === null
      ) {
        throw new Error(`Symbol "${symbolId}" payout must be an object`);
      }

      requiredPayouts.forEach(payoutKey => {
        if (!(payoutKey in symbolConfig.payout)) {
          throw new Error(
            `Symbol "${symbolId}" is missing payout for ${payoutKey} of a kind`
          );
        }
        if (
          typeof symbolConfig.payout[payoutKey] !== 'number' ||
          symbolConfig.payout[payoutKey] < 0
        ) {
          throw new Error(
            `Symbol "${symbolId}" payout for ${payoutKey} of a kind must be a non-negative number`
          );
        }
      });
    });
  }

  static validatePaylines(paylines) {
    if (!Array.isArray(paylines) || paylines.length === 0) {
      throw new Error('Paylines configuration must be a non-empty array');
    }
  }

  static validateSymbolReferences(reels, symbols) {
    const validSymbols = Object.keys(symbols);
    const usedSymbols = new Set();

    reels.forEach((band, bandIndex) => {
      band.forEach((symbol, symbolIndex) => {
        if (!validSymbols.includes(symbol)) {
          throw new Error(
            `Reel band ${bandIndex + 1} position ${symbolIndex + 1} references undefined symbol: "${symbol}"`
          );
        }
        usedSymbols.add(symbol);
      });
    });

    // vérification des symboles non utilisés
    const unusedSymbols = validSymbols.filter(
      symbol => !usedSymbols.has(symbol)
    );
    if (unusedSymbols.length > 0) {
      console.warn(
        `Warning: The following symbols are defined but not used in reels: ${unusedSymbols.join(', ')}`
      );
    }
  }

  static async loadConfig() {
    try {
      console.log('Loading slot machine configuration...');

      // validation de chaque section de configuration
      this.validateReels(reels);
      this.validateSymbols(symbols);
      this.validatePaylines(paylines);

      // validation croisée des références de symboles
      this.validateSymbolReferences(reels, symbols);

      console.log('Configuration loaded and validated successfully');
      return { reels, symbols, paylines };
    } catch (error) {
      console.error('Configuration loading failed:', error.message);
      throw new Error(`Configuration error: ${error.message}`);
    }
  }
}
