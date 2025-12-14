/**
 * KPI Property Tests
 * **Feature: anime-aws-dashboard, Property 3: Top Anime KPI Extraction**
 * **Feature: anime-aws-dashboard, Property 4: Stock KPI Calculation**
 * **Feature: anime-aws-dashboard, Property 5: Percentage Color Coding**
 * **Validates: Requirements 3.1, 3.2, 3.4**
 */

const KPITests = (function () {
  "use strict";

  const fc = window.fc || fastcheck;

  // Arbitrary for generating anime data points
  const animeDataArb = fc.record({
    date: fc
      .date({ min: new Date("2023-01-01"), max: new Date("2024-12-31") })
      .map((d) => d.toISOString().split("T")[0]),
    title: fc.constantFrom(
      "Solo Leveling",
      "Frieren",
      "Jujutsu Kaisen",
      "Demon Slayer",
      "One Piece"
    ),
    popularity: fc.float({ min: 0, max: 100, noNaN: true }),
    members: fc.integer({ min: 100000, max: 5000000 }),
    score: fc.float({ min: 0, max: 10, noNaN: true }),
    rank: fc.integer({ min: 1, max: 100 }),
  });

  // Arbitrary for generating stock data points with sequential dates
  const stockDataArb = fc.record({
    date: fc
      .date({ min: new Date("2023-01-01"), max: new Date("2024-12-31") })
      .map((d) => d.toISOString().split("T")[0]),
    open: fc.float({ min: 100, max: 300, noNaN: true }),
    high: fc.float({ min: 100, max: 300, noNaN: true }),
    low: fc.float({ min: 100, max: 300, noNaN: true }),
    close: fc.float({ min: 100, max: 300, noNaN: true }),
    volume: fc.integer({ min: 1000000, max: 100000000 }),
    change: fc.float({ min: -10, max: 10, noNaN: true }),
  });

  const tests = [];

  /**
   * Property 3: Top Anime KPI Extraction
   * For any non-empty anime dataset, the KPI extraction function SHALL return
   * the top N anime sorted in descending order by popularity score, where each
   * returned item has a popularity score greater than or equal to all items not returned.
   */
  tests.push({
    name: "Property 3: Top Anime KPI Extraction - Returns correct number of items",
    property: function () {
      return fc.assert(
        fc.property(
          fc.array(animeDataArb, { minLength: 1, maxLength: 50 }),
          fc.integer({ min: 1, max: 10 }),
          (animeData, n) => {
            const topAnime = KPI.getTopAnime(animeData, n);

            // Get unique titles count
            const uniqueTitles = new Set(animeData.map((a) => a.title)).size;
            const expectedCount = Math.min(n, uniqueTitles);

            return topAnime.length === expectedCount;
          }
        ),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 3: Top Anime KPI Extraction - Results are sorted by popularity descending",
    property: function () {
      return fc.assert(
        fc.property(
          fc.array(animeDataArb, { minLength: 2, maxLength: 50 }),
          fc.integer({ min: 2, max: 10 }),
          (animeData, n) => {
            const topAnime = KPI.getTopAnime(animeData, n);

            if (topAnime.length < 2) return true;

            // Check descending order
            for (let i = 1; i < topAnime.length; i++) {
              if (topAnime[i].popularity > topAnime[i - 1].popularity) {
                return false;
              }
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 3: Top Anime KPI Extraction - All returned items have higher popularity than non-returned",
    property: function () {
      return fc.assert(
        fc.property(
          fc.array(animeDataArb, { minLength: 5, maxLength: 50 }),
          fc.integer({ min: 1, max: 3 }),
          (animeData, n) => {
            const topAnime = KPI.getTopAnime(animeData, n);

            if (topAnime.length === 0) return true;

            const minTopPopularity = Math.min(
              ...topAnime.map((a) => a.popularity)
            );
            const topTitles = new Set(topAnime.map((a) => a.title));

            // Get max popularity of non-returned unique anime
            const animeMap = new Map();
            animeData.forEach((item) => {
              if (!topTitles.has(item.title)) {
                const existing = animeMap.get(item.title);
                if (!existing || item.popularity > existing.popularity) {
                  animeMap.set(item.title, item);
                }
              }
            });

            const nonTopAnime = Array.from(animeMap.values());
            if (nonTopAnime.length === 0) return true;

            const maxNonTopPopularity = Math.max(
              ...nonTopAnime.map((a) => a.popularity)
            );

            return minTopPopularity >= maxNonTopPopularity;
          }
        ),
        { numRuns: 100 }
      );
    },
  });

  /**
   * Property 4: Stock KPI Calculation
   * For any stock dataset with at least two data points, the KPI calculation function
   * SHALL correctly compute the daily change percentage as
   * ((current_close - previous_close) / previous_close) * 100
   * and determine trend direction as positive when change > 0, negative when change < 0,
   * and neutral when change = 0.
   */
  tests.push({
    name: "Property 4: Stock KPI Calculation - Change percentage is correctly calculated",
    property: function () {
      return fc.assert(
        fc.property(
          fc.array(stockDataArb, { minLength: 2, maxLength: 50 }),
          (stockData) => {
            const kpis = KPI.getStockKPIs(stockData);

            // Sort to get current and previous
            const sorted = [...stockData].sort(
              (a, b) => new Date(a.date) - new Date(b.date)
            );
            const current = sorted[sorted.length - 1];
            const previous = sorted[sorted.length - 2];

            const expectedChange =
              ((current.close - previous.close) / previous.close) * 100;
            const expectedChangeRounded =
              Math.round(expectedChange * 100) / 100;

            return Math.abs(kpis.changePercent - expectedChangeRounded) < 0.01;
          }
        ),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 4: Stock KPI Calculation - Trend direction matches change sign",
    property: function () {
      return fc.assert(
        fc.property(
          fc.array(stockDataArb, { minLength: 2, maxLength: 50 }),
          (stockData) => {
            const kpis = KPI.getStockKPIs(stockData);

            if (kpis.changePercent > 0 && kpis.trend !== "positive")
              return false;
            if (kpis.changePercent < 0 && kpis.trend !== "negative")
              return false;
            if (kpis.changePercent === 0 && kpis.trend !== "neutral")
              return false;

            return true;
          }
        ),
        { numRuns: 100 }
      );
    },
  });

  /**
   * Property 5: Percentage Color Coding
   * For any numeric percentage value, the color determination function SHALL return
   * green for values > 0, red for values < 0, and neutral/gray for values equal to 0.
   */
  tests.push({
    name: "Property 5: Percentage Color Coding - Positive values return positive color",
    property: function () {
      return fc.assert(
        fc.property(
          fc.float({ min: 0.001, max: 1000, noNaN: true }),
          (percentage) => {
            return KPI.getChangeColor(percentage) === "positive";
          }
        ),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 5: Percentage Color Coding - Negative values return negative color",
    property: function () {
      return fc.assert(
        fc.property(
          fc.float({ min: -1000, max: -0.001, noNaN: true }),
          (percentage) => {
            return KPI.getChangeColor(percentage) === "negative";
          }
        ),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 5: Percentage Color Coding - Zero returns neutral color",
    property: function () {
      return KPI.getChangeColor(0) === "neutral";
    },
  });

  tests.push({
    name: "Property 5: Percentage Color Coding - NaN returns neutral color",
    property: function () {
      return KPI.getChangeColor(NaN) === "neutral";
    },
  });

  return {
    name: "KPI Tests",
    tests: tests,
  };
})();
