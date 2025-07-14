export default class Paylines {
  constructor(paylinesConfig) {
    this.paylines = paylinesConfig;
    this.validatePaylines();
  }

  // valide la configuration des lignes de paiement
  validatePaylines() {
    if (!Array.isArray(this.paylines) || this.paylines.length === 0) {
      throw new Error('Paylines configuration must be a non-empty array');
    }

    this.paylines.forEach((payline, paylineIndex) => {
      if (!Array.isArray(payline) || payline.length !== 5) {
        throw new Error(
          `Payline ${paylineIndex + 1} must be an array with exactly 5 positions`
        );
      }

      payline.forEach((symbolIndex, reelIndex) => {
        if (
          typeof symbolIndex !== 'number' ||
          symbolIndex < 0 ||
          symbolIndex > 2
        ) {
          throw new Error(
            `Payline ${paylineIndex + 1} reel ${reelIndex + 1} must be a number between 0 and 2`
          );
        }
      });
    });
  }

  // extrait les symboles pour une ligne de paiement spécifique
  getPaylineSymbols(visibleSymbols, paylineIndex) {
    const payline = this.paylines[paylineIndex];
    return payline.map(
      (symbolIndex, reelIndex) => visibleSymbols[reelIndex][symbolIndex]
    );
  }

  // calcule tous les gains sur toutes les lignes de paiement
  calculateAllWins(visibleSymbols, symbolConfig) {
    let totalWins = 0;
    const winDetails = [];

    for (let i = 0; i < this.paylines.length; i++) {
      const paylineSymbols = this.getPaylineSymbols(visibleSymbols, i);
      const firstSymbol = paylineSymbols[0];
      let consecutiveCount = 1;

      // compte les symboles consécutifs identiques de gauche à droite
      for (let j = 1; j < paylineSymbols.length; j++) {
        if (paylineSymbols[j] === firstSymbol) {
          consecutiveCount++;
        } else {
          break;
        }
      }

      // vérifie si on a une combinaison gagnante (3 ou plus identiques)
      if (consecutiveCount >= 3 && symbolConfig[firstSymbol]) {
        const payout =
          symbolConfig[firstSymbol].payout[consecutiveCount.toString()];
        if (payout && payout > 0) {
          totalWins += payout;
          winDetails.push(
            `- payline ${i + 1}, ${firstSymbol} x${consecutiveCount}, ${payout}`
          );
        }
      }
    }

    return {
      totalWins,
      winDetails,
    };
  }
}
