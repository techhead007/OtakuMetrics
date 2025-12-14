/**
 * Filtering Property Tests
 * **Feature: anime-aws-dashboard, Property 6: Time Range Filtering**
 * **Validates: Requirements 4.1**
 */

const FilteringTests = (function () {
  "use strict";

  const fc = window.fc || fastcheck;

  // Generate dates within a reasonable range
  const recentDateArb = fc.integer({ min: 0, max: 400 }).map((daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split("T")[0];
  });

  // Arbitrary for data points with dates
  const dataPointArb = fc.record({
    date: recentDateArb,
    value: fc.float({ min: 0, max: 100, noNaN: true }),
  });

  // Valid time range keys
  const timeRangeArb = fc.constantFrom("1W", "1M", "3M", "1Y");

  const tests = [];

  /**
   * Property 6: Time Range Filtering
   * For any dataset and valid time range selection, the filter function SHALL return
   * only data points whose dates fall within the specified range (inclusive),
   * and the result SHALL be sorted chronologically.
   */
  tests.push({
    name: "Property 6: Time Range Filtering - All returned dates are within range",
    property: function () {
      return fc.assert(
        fc.property(
          fc.array(dataPointArb, { minLength: 1, maxLength: 100 }),
          timeRangeArb,
          (data, range) => {
            const filtered = Filtering.filterByTimeRange(data, range);
            const { startDate, endDate } = Filtering.getDateBoundaries(range);

            // All filtered dates must be within range
            return filtered.every((item) => {
              const itemDate = new Date(item.date);
              return itemDate >= startDate && itemDate <= endDate;
            });
          }
        ),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 6: Time Range Filtering - No valid dates are omitted",
    property: function () {
      return fc.assert(
        fc.property(
          fc.array(dataPointArb, { minLength: 1, maxLength: 100 }),
          timeRangeArb,
          (data, range) => {
            const filtered = Filtering.filterByTimeRange(data, range);
            const { startDate, endDate } = Filtering.getDateBoundaries(range);

            // Count dates in original data that should be included
            const expectedCount = data.filter((item) => {
              const itemDate = new Date(item.date);
              return itemDate >= startDate && itemDate <= endDate;
            }).length;

            return filtered.length === expectedCount;
          }
        ),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 6: Time Range Filtering - Result is sorted chronologically",
    property: function () {
      return fc.assert(
        fc.property(
          fc.array(dataPointArb, { minLength: 2, maxLength: 100 }),
          timeRangeArb,
          (data, range) => {
            const filtered = Filtering.filterByTimeRange(data, range);

            if (filtered.length < 2) return true;

            // Check chronological order
            for (let i = 1; i < filtered.length; i++) {
              if (new Date(filtered[i].date) < new Date(filtered[i - 1].date)) {
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
    name: "Property 6: Time Range Filtering - Empty input returns empty array",
    property: function () {
      return fc.assert(
        fc.property(timeRangeArb, (range) => {
          const filtered = Filtering.filterByTimeRange([], range);
          return Array.isArray(filtered) && filtered.length === 0;
        }),
        { numRuns: 10 }
      );
    },
  });

  tests.push({
    name: "Property 6: Time Range Filtering - Invalid range returns all data sorted",
    property: function () {
      return fc.assert(
        fc.property(
          fc.array(dataPointArb, { minLength: 1, maxLength: 50 }),
          (data) => {
            const filtered = Filtering.filterByTimeRange(data, "INVALID");

            // Should return all data
            if (filtered.length !== data.length) return false;

            // Should be sorted
            for (let i = 1; i < filtered.length; i++) {
              if (new Date(filtered[i].date) < new Date(filtered[i - 1].date)) {
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
    name: "Property 6: Time Range Filtering - Shorter ranges return subset of longer ranges",
    property: function () {
      return fc.assert(
        fc.property(
          fc.array(dataPointArb, { minLength: 10, maxLength: 100 }),
          (data) => {
            const filtered1W = Filtering.filterByTimeRange(data, "1W");
            const filtered1M = Filtering.filterByTimeRange(data, "1M");
            const filtered3M = Filtering.filterByTimeRange(data, "3M");
            const filtered1Y = Filtering.filterByTimeRange(data, "1Y");

            // Each shorter range should be a subset of longer ranges
            return (
              filtered1W.length <= filtered1M.length &&
              filtered1M.length <= filtered3M.length &&
              filtered3M.length <= filtered1Y.length
            );
          }
        ),
        { numRuns: 100 }
      );
    },
  });

  return {
    name: "Filtering Tests",
    tests: tests,
  };
})();
