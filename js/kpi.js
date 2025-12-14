/**
 * KPI - Key Performance Indicator calculations
 * Extracts and calculates KPIs for anime trends and stock data
 */

const KPI = (function () {
  "use strict";

  /**
   * Get top N anime sorted by popularity score
   * Property 3: Top Anime KPI Extraction
   * @param {Array} data - Array of anime data points
   * @param {number} n - Number of top anime to return
   * @returns {Array} Top N anime sorted by popularity (descending)
   */
  function getTopAnime(data, n = 3) {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    // Get unique anime by title, keeping highest popularity for each
    const animeMap = new Map();
    data.forEach((item) => {
      const existing = animeMap.get(item.title);
      if (!existing || item.popularity > existing.popularity) {
        animeMap.set(item.title, item);
      }
    });

    // Convert to array and sort by popularity descending
    const uniqueAnime = Array.from(animeMap.values());
    uniqueAnime.sort((a, b) => b.popularity - a.popularity);

    // Return top N
    return uniqueAnime.slice(0, n);
  }

  /**
   * Calculate stock KPIs from stock data
   * Property 4: Stock KPI Calculation
   * @param {Array} data - Array of stock data points
   * @returns {Object} Stock KPIs including price, change, and trend
   */
  function getStockKPIs(data) {
    if (!Array.isArray(data) || data.length < 2) {
      return {
        currentPrice: 0,
        previousPrice: 0,
        changePercent: 0,
        changeAmount: 0,
        trend: "neutral",
        high52Week: 0,
        low52Week: 0,
        volume: 0,
      };
    }

    // Sort by date to ensure correct order
    const sortedData = [...data].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const current = sortedData[sortedData.length - 1];
    const previous = sortedData[sortedData.length - 2];

    const currentPrice = current.close;
    const previousPrice = previous.close;
    const changeAmount = currentPrice - previousPrice;
    const changePercent =
      ((currentPrice - previousPrice) / previousPrice) * 100;

    // Determine trend direction
    let trend;
    if (changePercent > 0) {
      trend = "positive";
    } else if (changePercent < 0) {
      trend = "negative";
    } else {
      trend = "neutral";
    }

    // Calculate 52-week high/low (or available data range)
    const highs = sortedData.map((d) => d.high);
    const lows = sortedData.map((d) => d.low);
    const high52Week = Math.max(...highs);
    const low52Week = Math.min(...lows);

    return {
      currentPrice: Math.round(currentPrice * 100) / 100,
      previousPrice: Math.round(previousPrice * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      changeAmount: Math.round(changeAmount * 100) / 100,
      trend: trend,
      high52Week: Math.round(high52Week * 100) / 100,
      low52Week: Math.round(low52Week * 100) / 100,
      volume: current.volume,
    };
  }

  /**
   * Get color class for percentage change
   * Property 5: Percentage Color Coding
   * @param {number} percentage - The percentage value
   * @returns {string} Color class name ('positive', 'negative', or 'neutral')
   */
  function getChangeColor(percentage) {
    if (typeof percentage !== "number" || isNaN(percentage)) {
      return "neutral";
    }

    if (percentage > 0) {
      return "positive";
    } else if (percentage < 0) {
      return "negative";
    } else {
      return "neutral";
    }
  }

  /**
   * Format number with appropriate suffix (K, M, B)
   * @param {number} num - Number to format
   * @returns {string} Formatted number string
   */
  function formatNumber(num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + "B";
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  }

  /**
   * Format price with currency symbol
   * @param {number} price - Price value
   * @returns {string} Formatted price string
   */
  function formatPrice(price) {
    return "$" + price.toFixed(2);
  }

  /**
   * Format percentage with sign
   * @param {number} percent - Percentage value
   * @returns {string} Formatted percentage string
   */
  function formatPercent(percent) {
    const sign = percent > 0 ? "+" : "";
    return sign + percent.toFixed(2) + "%";
  }

  /**
   * Get anime popularity trend (comparing recent vs older data)
   * @param {Array} data - Array of anime data points for a single title
   * @returns {string} Trend direction ('up', 'down', 'stable')
   */
  function getAnimeTrend(data) {
    if (!Array.isArray(data) || data.length < 2) {
      return "stable";
    }

    const sorted = [...data].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const recent = sorted.slice(-7); // Last 7 days
    const older = sorted.slice(-14, -7); // Previous 7 days

    if (recent.length === 0 || older.length === 0) {
      return "stable";
    }

    const recentAvg =
      recent.reduce((sum, d) => sum + d.popularity, 0) / recent.length;
    const olderAvg =
      older.reduce((sum, d) => sum + d.popularity, 0) / older.length;

    const change = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (change > 2) return "up";
    if (change < -2) return "down";
    return "stable";
  }

  // Public API
  return {
    getTopAnime: getTopAnime,
    getStockKPIs: getStockKPIs,
    getChangeColor: getChangeColor,
    formatNumber: formatNumber,
    formatPrice: formatPrice,
    formatPercent: formatPercent,
    getAnimeTrend: getAnimeTrend,
  };
})();

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = KPI;
}
