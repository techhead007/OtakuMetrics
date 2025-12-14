/**
 * Filtering - Time range filter functions
 * Handles filtering data by various time ranges
 */

const Filtering = (function () {
  "use strict";

  // Time range configurations in days
  const TIME_RANGES = {
    "1W": 7,
    "1M": 30,
    "3M": 90,
    "1Y": 365,
  };

  /**
   * Filter data by time range
   * Property 6: Time Range Filtering
   * For any dataset and valid time range selection, the filter function SHALL return
   * only data points whose dates fall within the specified range (inclusive),
   * and the result SHALL be sorted chronologically.
   *
   * @param {Array} data - Array of data points with 'date' property
   * @param {string} range - Time range key ('1W', '1M', '3M', '1Y')
   * @returns {Array} Filtered and sorted data points
   */
  function filterByTimeRange(data, range) {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    const days = TIME_RANGES[range];
    if (!days) {
      // Invalid range, return all data sorted
      return sortChronologically(data);
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0); // Start of the day

    // Filter data within range
    const filtered = data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= today;
    });

    // Sort chronologically
    return sortChronologically(filtered);
  }

  /**
   * Sort data chronologically by date
   * @param {Array} data - Array of data points with 'date' property
   * @returns {Array} Sorted data points
   */
  function sortChronologically(data) {
    return [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  /**
   * Get the date range boundaries for a given range key
   * @param {string} range - Time range key
   * @returns {Object} Object with startDate and endDate
   */
  function getDateBoundaries(range) {
    const days = TIME_RANGES[range] || 365;

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    return {
      startDate: startDate,
      endDate: endDate,
      days: days,
    };
  }

  /**
   * Check if a date falls within a time range
   * @param {string|Date} date - Date to check
   * @param {string} range - Time range key
   * @returns {boolean} True if date is within range
   */
  function isDateInRange(date, range) {
    const { startDate, endDate } = getDateBoundaries(range);
    const checkDate = new Date(date);
    return checkDate >= startDate && checkDate <= endDate;
  }

  /**
   * Get available time range options
   * @returns {Array} Array of range option objects
   */
  function getTimeRangeOptions() {
    return Object.entries(TIME_RANGES).map(([key, days]) => ({
      key: key,
      days: days,
      label: key,
    }));
  }

  /**
   * Filter aligned data (anime + stock pairs) by time range
   * @param {Array} alignedData - Array of aligned data pairs
   * @param {string} range - Time range key
   * @returns {Array} Filtered aligned data
   */
  function filterAlignedDataByRange(alignedData, range) {
    if (!Array.isArray(alignedData) || alignedData.length === 0) {
      return [];
    }

    const days = TIME_RANGES[range];
    if (!days) {
      return sortChronologically(alignedData);
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const filtered = alignedData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= today;
    });

    return sortChronologically(filtered);
  }

  // Public API
  return {
    filterByTimeRange: filterByTimeRange,
    sortChronologically: sortChronologically,
    getDateBoundaries: getDateBoundaries,
    isDateInRange: isDateInRange,
    getTimeRangeOptions: getTimeRangeOptions,
    filterAlignedDataByRange: filterAlignedDataByRange,
    TIME_RANGES: TIME_RANGES,
  };
})();

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = Filtering;
}
