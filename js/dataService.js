/**
 * Data Service - API fetching and data processing
 * Handles data retrieval from external APIs with fallback to sample data
 */

const DataService = (function () {
  "use strict";

  // API Configuration
  const JIKAN_API_BASE = "https://api.jikan.moe/v4";
  const ALPHA_VANTAGE_API_KEY = "demo"; // Use 'demo' for limited free access
  const ALPHA_VANTAGE_BASE = "https://www.alphavantage.co/query";
  const REQUEST_TIMEOUT = 10000; // 10 seconds

  // Cache for API responses
  let cache = {
    animeData: null,
    stockData: null,
    lastFetch: null,
  };

  /**
   * Fetch with timeout wrapper
   */
  async function fetchWithTimeout(url, timeout = REQUEST_TIMEOUT) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Fetch anime data from Jikan API (MyAnimeList)
   */
  async function fetchAnimeData() {
    try {
      // Fetch top anime
      const response = await fetchWithTimeout(
        `${JIKAN_API_BASE}/top/anime?filter=airing&limit=10`
      );

      if (!response.ok) {
        throw new Error(`Jikan API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error("Invalid response format from Jikan API");
      }

      // Transform API response to our data model
      const today = new Date().toISOString().split("T")[0];
      return data.data.map((anime, index) => ({
        date: today,
        title: anime.title || anime.title_english || "Unknown",
        popularity: normalizePopularity(anime.members, anime.score),
        members: anime.members || 0,
        score: anime.score || 0,
        rank: index + 1,
      }));
    } catch (error) {
      console.warn("Failed to fetch anime data from API:", error.message);
      return null;
    }
  }

  /**
   * Fetch stock data from Alpha Vantage API
   */
  async function fetchStockData() {
    try {
      const url = `${ALPHA_VANTAGE_BASE}?function=TIME_SERIES_DAILY&symbol=AMZN&apikey=${ALPHA_VANTAGE_API_KEY}&outputsize=full`;
      const response = await fetchWithTimeout(url);

      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }

      const data = await response.json();

      // Check for API limit message
      if (data["Note"] || data["Information"]) {
        throw new Error("API rate limit reached");
      }

      const timeSeries = data["Time Series (Daily)"];
      if (!timeSeries) {
        throw new Error("Invalid response format from Alpha Vantage");
      }

      // Transform API response to our data model
      const stockData = Object.entries(timeSeries).map(([date, values]) => {
        const open = parseFloat(values["1. open"]);
        const close = parseFloat(values["4. close"]);
        return {
          date: date,
          open: open,
          high: parseFloat(values["2. high"]),
          low: parseFloat(values["3. low"]),
          close: close,
          volume: parseInt(values["5. volume"]),
          change: 0, // Will be calculated
        };
      });

      // Sort by date and calculate daily changes
      stockData.sort((a, b) => new Date(a.date) - new Date(b.date));
      for (let i = 1; i < stockData.length; i++) {
        const prevClose = stockData[i - 1].close;
        stockData[i].change =
          Math.round(((stockData[i].close - prevClose) / prevClose) * 10000) /
          100;
      }

      return stockData;
    } catch (error) {
      console.warn("Failed to fetch stock data from API:", error.message);
      return null;
    }
  }

  /**
   * Normalize popularity score to 0-100 range
   */
  function normalizePopularity(members, score) {
    // Combine members count and score for popularity metric
    // Max members ~4M, max score 10
    const memberScore = Math.min(members / 4000000, 1) * 50;
    const ratingScore = (score / 10) * 50;
    return Math.round((memberScore + ratingScore) * 10) / 10;
  }

  /**
   * Align anime and stock data by date
   * Returns paired data points where both sources have data for the same date
   */
  function alignDataByDate(animeData, stockData) {
    const animeByDate = new Map();
    const stockByDate = new Map();

    // Index anime data by date (use aggregated/top anime for each date)
    animeData.forEach((item) => {
      if (!animeByDate.has(item.date)) {
        animeByDate.set(item.date, item);
      } else {
        // Keep the one with higher popularity
        if (item.popularity > animeByDate.get(item.date).popularity) {
          animeByDate.set(item.date, item);
        }
      }
    });

    // Index stock data by date
    stockData.forEach((item) => {
      stockByDate.set(item.date, item);
    });

    // Find overlapping dates
    const alignedData = [];
    const allDates = new Set([...animeByDate.keys(), ...stockByDate.keys()]);

    allDates.forEach((date) => {
      if (animeByDate.has(date) && stockByDate.has(date)) {
        alignedData.push({
          date: date,
          anime: animeByDate.get(date),
          stock: stockByDate.get(date),
        });
      }
    });

    // Sort by date
    alignedData.sort((a, b) => new Date(a.date) - new Date(b.date));

    return alignedData;
  }

  /**
   * Get tooltip data for a specific date
   */
  function getTooltipData(alignedData, date) {
    const dataPoint = alignedData.find((item) => item.date === date);
    if (!dataPoint) return null;

    return {
      date: dataPoint.date,
      animePopularity: dataPoint.anime.popularity,
      animeTitle: dataPoint.anime.title || dataPoint.anime.topAnime,
      stockClose: dataPoint.stock.close,
      stockChange: dataPoint.stock.change,
    };
  }

  /**
   * Main data loading function with fallback
   */
  async function loadAllData(useSampleData = false) {
    let animeData, stockData;
    let dataSource = "api";

    if (!useSampleData) {
      // Try to fetch from APIs
      const [apiAnimeData, apiStockData] = await Promise.all([
        fetchAnimeData(),
        fetchStockData(),
      ]);

      animeData = apiAnimeData;
      stockData = apiStockData;
    }

    // Fallback to sample data if API fails
    if (!animeData || animeData.length === 0) {
      console.log("Using sample anime data");
      animeData = SampleData.getAggregatedAnimeData();
      dataSource = "sample";
    }

    if (!stockData || stockData.length === 0) {
      console.log("Using sample stock data");
      stockData = SampleData.getStockData();
      dataSource = "sample";
    }

    // Cache the data
    cache.animeData = animeData;
    cache.stockData = stockData;
    cache.lastFetch = new Date();

    return {
      animeData: animeData,
      stockData: stockData,
      alignedData: alignDataByDate(animeData, stockData),
      dataSource: dataSource,
      lastUpdated: cache.lastFetch,
    };
  }

  /**
   * Get cached data if available
   */
  function getCachedData() {
    if (cache.animeData && cache.stockData) {
      return {
        animeData: cache.animeData,
        stockData: cache.stockData,
        alignedData: alignDataByDate(cache.animeData, cache.stockData),
        dataSource: "cache",
        lastUpdated: cache.lastFetch,
      };
    }
    return null;
  }

  // Public API
  return {
    loadAllData: loadAllData,
    getCachedData: getCachedData,
    alignDataByDate: alignDataByDate,
    getTooltipData: getTooltipData,
    fetchAnimeData: fetchAnimeData,
    fetchStockData: fetchStockData,
  };
})();

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = DataService;
}
