/**
 * Sample Data - Fallback datasets for Anime Trends vs AWS Stock Dashboard
 * Contains curated realistic data for demonstration when APIs are unavailable
 */

const SampleData = (function () {
  "use strict";

  // Generate dates for the past year
  function generateDateRange(days) {
    const dates = [];
    const today = new Date();
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  }

  // Top trending anime titles with base popularity
  const animeList = [
    {
      title: "Solo Leveling",
      basePopularity: 95,
      members: 2500000,
      score: 8.7,
    },
    {
      title: "Frieren: Beyond Journey's End",
      basePopularity: 92,
      members: 1800000,
      score: 9.1,
    },
    {
      title: "Jujutsu Kaisen",
      basePopularity: 90,
      members: 3200000,
      score: 8.6,
    },
    { title: "Demon Slayer", basePopularity: 88, members: 4100000, score: 8.5 },
    { title: "One Piece", basePopularity: 85, members: 2800000, score: 8.7 },
    {
      title: "Attack on Titan",
      basePopularity: 82,
      members: 3900000,
      score: 9.0,
    },
    {
      title: "My Hero Academia",
      basePopularity: 78,
      members: 3100000,
      score: 8.0,
    },
    { title: "Chainsaw Man", basePopularity: 75, members: 1600000, score: 8.4 },
    { title: "Spy x Family", basePopularity: 72, members: 1400000, score: 8.5 },
    { title: "Oshi no Ko", basePopularity: 70, members: 1200000, score: 8.8 },
  ];

  // Generate anime trend data with realistic fluctuations
  function generateAnimeData(days = 365) {
    const dates = generateDateRange(days);
    const data = [];

    dates.forEach((date, index) => {
      // Simulate seasonal trends and random fluctuations
      const seasonalFactor = Math.sin((index / 365) * Math.PI * 4) * 5;
      const weekendBoost = [0, 6].includes(new Date(date).getDay()) ? 3 : 0;

      animeList.forEach((anime) => {
        // Add some randomness and trends
        const randomFactor = (Math.random() - 0.5) * 10;
        const trendFactor = Math.sin((index / 30) * Math.PI) * 3;

        let popularity =
          anime.basePopularity +
          seasonalFactor +
          weekendBoost +
          randomFactor +
          trendFactor;
        popularity = Math.max(0, Math.min(100, popularity));

        data.push({
          date: date,
          title: anime.title,
          popularity: Math.round(popularity * 10) / 10,
          members: anime.members + Math.floor(Math.random() * 50000),
          score: anime.score,
          rank: 0, // Will be calculated
        });
      });
    });

    // Calculate daily ranks
    const groupedByDate = {};
    data.forEach((item) => {
      if (!groupedByDate[item.date]) groupedByDate[item.date] = [];
      groupedByDate[item.date].push(item);
    });

    Object.values(groupedByDate).forEach((dayData) => {
      dayData.sort((a, b) => b.popularity - a.popularity);
      dayData.forEach((item, idx) => (item.rank = idx + 1));
    });

    return data;
  }

  // Generate stock data with realistic price movements
  function generateStockData(days = 365) {
    const dates = generateDateRange(days);
    const data = [];

    // AMZN realistic price range (around $170-$230 in 2024)
    let basePrice = 175;
    let previousClose = basePrice;

    dates.forEach((date, index) => {
      // Skip weekends for stock data
      const dayOfWeek = new Date(date).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) return;

      // Simulate realistic stock movements
      const volatility = 0.02; // 2% daily volatility
      const drift = 0.0003; // Slight upward drift
      const randomReturn = (Math.random() - 0.5) * 2 * volatility + drift;

      // Add some trend correlation with anime (for interesting visualization)
      const animeTrendEffect = Math.sin((index / 60) * Math.PI) * 0.005;

      const dailyReturn = randomReturn + animeTrendEffect;
      const close = previousClose * (1 + dailyReturn);

      // Generate OHLC data
      const open = previousClose * (1 + (Math.random() - 0.5) * 0.005);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = Math.floor(30000000 + Math.random() * 20000000);
      const change = ((close - previousClose) / previousClose) * 100;

      data.push({
        date: date,
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(close * 100) / 100,
        volume: volume,
        change: Math.round(change * 100) / 100,
      });

      previousClose = close;
    });

    return data;
  }

  // Get aggregated anime popularity by date (average of top 3)
  function getAggregatedAnimeData(animeData) {
    const grouped = {};

    animeData.forEach((item) => {
      if (!grouped[item.date]) {
        grouped[item.date] = [];
      }
      grouped[item.date].push(item);
    });

    return Object.entries(grouped)
      .map(([date, items]) => {
        // Get top 3 by popularity
        const top3 = items
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 3);
        const avgPopularity =
          top3.reduce((sum, item) => sum + item.popularity, 0) / top3.length;

        return {
          date: date,
          popularity: Math.round(avgPopularity * 10) / 10,
          topAnime: top3[0].title,
          topScore: top3[0].score,
        };
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  // Pre-generated sample data
  const sampleAnimeData = generateAnimeData(365);
  const sampleStockData = generateStockData(365);
  const aggregatedAnimeData = getAggregatedAnimeData(sampleAnimeData);

  // Public API
  return {
    getAnimeData: function () {
      return JSON.parse(JSON.stringify(sampleAnimeData));
    },

    getStockData: function () {
      return JSON.parse(JSON.stringify(sampleStockData));
    },

    getAggregatedAnimeData: function () {
      return JSON.parse(JSON.stringify(aggregatedAnimeData));
    },

    getAnimeList: function () {
      return JSON.parse(JSON.stringify(animeList));
    },

    // Utility for generating fresh data
    generateAnimeData: generateAnimeData,
    generateStockData: generateStockData,
    getAggregatedAnimeDataFromRaw: getAggregatedAnimeData,
  };
})();

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = SampleData;
}
