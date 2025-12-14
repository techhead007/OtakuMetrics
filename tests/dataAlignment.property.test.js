/**
 * Data Alignment Property Tests
 * **Feature: anime-aws-dashboard, Property 1: Data Alignment by Date**
 * **Validates: Requirements 1.2, 5.3**
 */

const DataAlignmentTests = (function () {
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

  // Arbitrary for generating stock data points
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
   * Property 1: Data Alignment by Date
   * For any two datasets (anime trends and stock data) with overlapping date ranges,
   * the alignment function SHALL produce paired data points where each pair contains
   * data from the exact same date, and no dates present in both source datasets are
   * omitted from the result.
   */
  tests.push({
    name: "Property 1: Data Alignment by Date - All aligned pairs have matching dates",
    property: function () {
      return fc.assert(
        fc.property(
          fc.array(animeDataArb, { minLength: 1, maxLength: 50 }),
          fc.array(stockDataArb, { minLength: 1, maxLength: 50 }),
          (animeData, stockData) => {
            const aligned = DataService.alignDataByDate(animeData, stockData);

            // Every aligned pair must have matching dates
            return aligned.every((pair) => pair.anime.date === pair.stock.date);
          }
        ),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 1: Data Alignment by Date - No overlapping dates are omitted",
    property: function () {
      return fc.assert(
        fc.property(
          fc.array(animeDataArb, { minLength: 1, maxLength: 50 }),
          fc.array(stockDataArb, { minLength: 1, maxLength: 50 }),
          (animeData, stockData) => {
            const aligned = DataService.alignDataByDate(animeData, stockData);

            // Find all dates that exist in both datasets
            const animeDates = new Set(animeData.map((a) => a.date));
            const stockDates = new Set(stockData.map((s) => s.date));
            const overlappingDates = [...animeDates].filter((d) =>
              stockDates.has(d)
            );

            // All overlapping dates must be in the aligned result
            const alignedDates = new Set(aligned.map((a) => a.date));
            return overlappingDates.every((date) => alignedDates.has(date));
          }
        ),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 1: Data Alignment by Date - Result is sorted chronologically",
    property: function () {
      return fc.assert(
        fc.property(
          fc.array(animeDataArb, { minLength: 2, maxLength: 50 }),
          fc.array(stockDataArb, { minLength: 2, maxLength: 50 }),
          (animeData, stockData) => {
            const aligned = DataService.alignDataByDate(animeData, stockData);

            if (aligned.length < 2) return true;

            // Check chronological order
            for (let i = 1; i < aligned.length; i++) {
              if (new Date(aligned[i].date) < new Date(aligned[i - 1].date)) {
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

  /**
   * Property 2: Tooltip Data Retrieval
   * For any valid date that exists in both datasets, the tooltip data function
   * SHALL return an object containing the correct anime popularity value and
   * stock closing price for that specific date.
   */
  tests.push({
    name: "Property 2: Tooltip Data Retrieval - Returns correct values for valid dates",
    property: function () {
      return fc.assert(
        fc.property(
          fc.array(animeDataArb, { minLength: 1, maxLength: 30 }),
          fc.array(stockDataArb, { minLength: 1, maxLength: 30 }),
          (animeData, stockData) => {
            const aligned = DataService.alignDataByDate(animeData, stockData);

            if (aligned.length === 0) return true;

            // Test each aligned date
            return aligned.every((pair) => {
              const tooltip = DataService.getTooltipData(aligned, pair.date);

              if (!tooltip) return false;

              // Tooltip must contain correct anime popularity
              if (tooltip.animePopularity !== pair.anime.popularity)
                return false;

              // Tooltip must contain correct stock close price
              if (tooltip.stockClose !== pair.stock.close) return false;

              return true;
            });
          }
        ),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 2: Tooltip Data Retrieval - Returns null for non-existent dates",
    property: function () {
      return fc.assert(
        fc.property(
          fc.array(animeDataArb, { minLength: 1, maxLength: 20 }),
          fc.array(stockDataArb, { minLength: 1, maxLength: 20 }),
          (animeData, stockData) => {
            const aligned = DataService.alignDataByDate(animeData, stockData);

            // A date that definitely doesn't exist
            const nonExistentDate = "1900-01-01";
            const tooltip = DataService.getTooltipData(
              aligned,
              nonExistentDate
            );

            return tooltip === null;
          }
        ),
        { numRuns: 100 }
      );
    },
  });

  return {
    name: "Data Alignment Tests",
    tests: tests,
  };
})();
