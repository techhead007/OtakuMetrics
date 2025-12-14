/**
 * Correlation - Statistical correlation calculations
 * Calculates Pearson correlation and generates insights
 */

const Correlation = (function () {
  "use strict";

  /**
   * Calculate Pearson correlation coefficient
   * Property 7: Correlation Coefficient Calculation
   * For any two numeric arrays of equal length (n ≥ 2), the correlation function
   * SHALL compute the Pearson correlation coefficient within the range [-1, 1]
   *
   * @param {Array<number>} array1 - First array of numbers
   * @param {Array<number>} array2 - Second array of numbers
   * @returns {number} Pearson correlation coefficient (-1 to 1)
   */
  function calculatePearsonCorrelation(array1, array2) {
    if (!Array.isArray(array1) || !Array.isArray(array2)) {
      return 0;
    }

    const n = Math.min(array1.length, array2.length);

    if (n < 2) {
      return 0;
    }

    // Use only the overlapping portion
    const x = array1.slice(0, n);
    const y = array2.slice(0, n);

    // Calculate means
    const meanX = x.reduce((sum, val) => sum + val, 0) / n;
    const meanY = y.reduce((sum, val) => sum + val, 0) / n;

    // Calculate covariance and standard deviations
    let covariance = 0;
    let varX = 0;
    let varY = 0;

    for (let i = 0; i < n; i++) {
      const diffX = x[i] - meanX;
      const diffY = y[i] - meanY;
      covariance += diffX * diffY;
      varX += diffX * diffX;
      varY += diffY * diffY;
    }

    // Handle edge case where variance is zero
    if (varX === 0 || varY === 0) {
      return 0;
    }

    const stdX = Math.sqrt(varX);
    const stdY = Math.sqrt(varY);

    const correlation = covariance / (stdX * stdY);

    // Clamp to [-1, 1] to handle floating point errors
    return Math.max(-1, Math.min(1, correlation));
  }

  /**
   * Classify correlation strength
   * Property 8: Correlation Significance Classification
   * For any correlation coefficient value, the classification function SHALL return
   * "strong" for |r| ≥ 0.7, "moderate" for 0.4 ≤ |r| < 0.7,
   * "weak" for 0.2 ≤ |r| < 0.4, and "none" for |r| < 0.2
   *
   * @param {number} coefficient - Correlation coefficient
   * @returns {string} Classification ('strong', 'moderate', 'weak', 'none')
   */
  function classifyCorrelation(coefficient) {
    const absCoeff = Math.abs(coefficient);

    if (absCoeff >= 0.7) {
      return "strong";
    } else if (absCoeff >= 0.4) {
      return "moderate";
    } else if (absCoeff >= 0.2) {
      return "weak";
    } else {
      return "none";
    }
  }

  /**
   * Generate human-readable insight text
   * @param {number} correlation - Correlation coefficient
   * @param {string} animeTitle - Name of the top anime (optional)
   * @returns {string} Insight text
   */
  function generateInsight(correlation, animeTitle = "anime trends") {
    const classification = classifyCorrelation(correlation);
    const direction =
      correlation > 0 ? "positive" : correlation < 0 ? "negative" : "no";
    const absCorr = Math.abs(correlation);

    const insights = {
      strong: {
        positive: `There's a strong positive correlation (${absCorr.toFixed(
          2
        )}) between ${animeTitle} popularity and AWS stock performance. When anime trends surge, AWS stock tends to follow suit - perhaps reflecting broader tech and entertainment market dynamics.`,
        negative: `Interestingly, there's a strong negative correlation (${absCorr.toFixed(
          2
        )}) between ${animeTitle} popularity and AWS stock. When anime popularity peaks, AWS stock tends to dip - an intriguing inverse relationship worth exploring.`,
        no: `The data shows a strong but neutral correlation pattern.`,
      },
      moderate: {
        positive: `A moderate positive correlation (${absCorr.toFixed(
          2
        )}) exists between ${animeTitle} trends and AWS stock. There's a noticeable tendency for both to move in the same direction, though other factors clearly play a role.`,
        negative: `A moderate negative correlation (${absCorr.toFixed(
          2
        )}) suggests that ${animeTitle} popularity and AWS stock often move in opposite directions. This could reflect shifting consumer attention between entertainment and tech investments.`,
        no: `The correlation is moderate but shows no clear directional pattern.`,
      },
      weak: {
        positive: `A weak positive correlation (${absCorr.toFixed(
          2
        )}) hints at a subtle connection between ${animeTitle} trends and AWS stock, though the relationship is not strong enough to draw firm conclusions.`,
        negative: `A weak negative correlation (${absCorr.toFixed(
          2
        )}) suggests a slight inverse relationship between ${animeTitle} popularity and AWS stock performance.`,
        no: `The correlation is weak with no clear pattern.`,
      },
      none: {
        positive: `With a correlation of ${absCorr.toFixed(
          2
        )}, there's essentially no meaningful relationship between ${animeTitle} trends and AWS stock performance. These two metrics appear to move independently of each other.`,
        negative: `With a correlation of ${absCorr.toFixed(
          2
        )}, there's essentially no meaningful relationship between ${animeTitle} trends and AWS stock performance. These two metrics appear to move independently of each other.`,
        no: `No significant correlation detected (${absCorr.toFixed(
          2
        )}). ${animeTitle} trends and AWS stock appear to be completely independent metrics.`,
      },
    };

    return insights[classification][direction];
  }

  /**
   * Calculate correlation from aligned data
   * @param {Array} alignedData - Array of aligned anime/stock data pairs
   * @returns {Object} Correlation result with coefficient, classification, and insight
   */
  function analyzeCorrelation(alignedData) {
    if (!Array.isArray(alignedData) || alignedData.length < 2) {
      return {
        coefficient: 0,
        classification: "none",
        insight: "Insufficient data to calculate correlation.",
        dataPoints: 0,
      };
    }

    // Extract popularity and stock close values
    const animePopularity = alignedData.map((d) => d.anime.popularity);
    const stockClose = alignedData.map((d) => d.stock.close);

    const coefficient = calculatePearsonCorrelation(
      animePopularity,
      stockClose
    );
    const classification = classifyCorrelation(coefficient);

    // Get top anime title for insight
    const topAnime = alignedData.reduce(
      (top, curr) =>
        curr.anime.popularity > (top?.anime?.popularity || 0) ? curr : top,
      null
    );
    const animeTitle =
      topAnime?.anime?.title || topAnime?.anime?.topAnime || "anime trends";

    return {
      coefficient: Math.round(coefficient * 1000) / 1000,
      classification: classification,
      insight: generateInsight(coefficient, animeTitle),
      dataPoints: alignedData.length,
    };
  }

  /**
   * Prepare scatter plot data from aligned data
   * @param {Array} alignedData - Array of aligned anime/stock data pairs
   * @returns {Array} Array of {x, y} points for scatter plot
   */
  function getScatterPlotData(alignedData) {
    if (!Array.isArray(alignedData)) {
      return [];
    }

    return alignedData.map((d) => ({
      x: d.anime.popularity,
      y: d.stock.close,
      date: d.date,
      animeTitle: d.anime.title || d.anime.topAnime,
    }));
  }

  // Public API
  return {
    calculatePearsonCorrelation: calculatePearsonCorrelation,
    classifyCorrelation: classifyCorrelation,
    generateInsight: generateInsight,
    analyzeCorrelation: analyzeCorrelation,
    getScatterPlotData: getScatterPlotData,
  };
})();

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = Correlation;
}
