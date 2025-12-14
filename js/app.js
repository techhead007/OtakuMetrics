/**
 * App - Main application entry and orchestration
 * Initializes dashboard, handles data flow, and manages state
 */

const App = (function () {
  "use strict";

  // Application state
  const state = {
    timeRange: "3M",
    animeData: [],
    stockData: [],
    alignedData: [],
    filteredData: [],
    correlation: null,
    isLoading: true,
    error: null,
    lastUpdated: null,
    dataSource: "sample",
  };

  // DOM element references
  let mainChartCanvas = null;
  let scatterChartCanvas = null;

  /**
   * Initialize the application
   */
  async function init() {
    console.log("🎌 Initializing Anime AWS Dashboard...");

    // Initialize UI controller
    UIController.init();

    // Get canvas elements
    mainChartCanvas = document.getElementById("main-chart");
    scatterChartCanvas = document.getElementById("scatter-chart");

    // Set up event listeners
    setupEventListeners();

    // Load initial data
    await loadData();

    console.log("✅ Dashboard initialized successfully");
  }

  /**
   * Set up event listeners
   */
  function setupEventListeners() {
    // Time range filter buttons
    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", handleFilterClick);
    });

    // Retry button in error modal
    const retryBtn = document.getElementById("retry-btn");
    if (retryBtn) {
      retryBtn.addEventListener("click", handleRetry);
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", handleKeyboard);
  }

  /**
   * Handle time range filter click
   * @param {Event} event - Click event
   */
  function handleFilterClick(event) {
    const range = event.target.dataset.range;
    if (range && range !== state.timeRange) {
      setTimeRange(range);
    }
  }

  /**
   * Set active time range and update visualizations
   * @param {string} range - Time range key
   */
  function setTimeRange(range) {
    state.timeRange = range;
    UIController.setActiveFilter(range);

    // Filter data and update charts
    updateFilteredData();
    updateVisualizations();
  }

  /**
   * Handle retry button click
   */
  async function handleRetry() {
    UIController.hideError();
    await loadData(false); // Try to fetch from API
  }

  /**
   * Handle keyboard shortcuts
   * @param {KeyboardEvent} event - Keyboard event
   */
  function handleKeyboard(event) {
    // R key to refresh data
    if (event.key === "r" && !event.ctrlKey && !event.metaKey) {
      const activeElement = document.activeElement;
      if (
        activeElement.tagName !== "INPUT" &&
        activeElement.tagName !== "TEXTAREA"
      ) {
        handleRetry();
      }
    }

    // Number keys for time range
    const rangeMap = { 1: "1W", 2: "1M", 3: "3M", 4: "1Y" };
    if (rangeMap[event.key]) {
      setTimeRange(rangeMap[event.key]);
    }
  }

  /**
   * Load data from API or sample data
   * @param {boolean} useSampleData - Force use of sample data
   */
  async function loadData(useSampleData = true) {
    state.isLoading = true;
    state.error = null;
    UIController.showLoading();

    try {
      // Load data (will use sample data as fallback)
      const result = await DataService.loadAllData(useSampleData);

      state.animeData = result.animeData;
      state.stockData = result.stockData;
      state.alignedData = result.alignedData;
      state.dataSource = result.dataSource;
      state.lastUpdated = result.lastUpdated;

      // Update filtered data based on current time range
      updateFilteredData();

      // Calculate correlation
      state.correlation = Correlation.analyzeCorrelation(state.filteredData);

      // Update UI
      updateVisualizations();
      UIController.updateLastUpdated(state.lastUpdated);
      UIController.updateStatus(state.dataSource === "api" ? "live" : "sample");

      // Hide loading and trigger animations
      UIController.hideLoading();
      setTimeout(() => {
        UIController.triggerEntranceAnimations();
      }, 100);
    } catch (error) {
      console.error("Failed to load data:", error);
      state.error = error.message;
      UIController.hideLoading();
      UIController.showError(
        UIController.getErrorMessage(error.message),
        handleRetry
      );
      UIController.updateStatus("error");
    }

    state.isLoading = false;
  }

  /**
   * Update filtered data based on current time range
   */
  function updateFilteredData() {
    state.filteredData = Filtering.filterAlignedDataByRange(
      state.alignedData,
      state.timeRange
    );

    // Recalculate correlation for filtered data
    state.correlation = Correlation.analyzeCorrelation(state.filteredData);
  }

  /**
   * Update all visualizations with current data
   */
  function updateVisualizations() {
    // Update KPI cards
    renderKPIs();

    // Update charts
    renderCharts();

    // Update correlation display
    if (state.correlation) {
      UIController.renderCorrelation(state.correlation);
    }
  }

  /**
   * Render KPI cards
   */
  function renderKPIs() {
    // Get anime data for KPIs (use raw anime data, not aligned)
    let animeForKPIs = state.animeData;

    // If we have aggregated data, extract unique anime
    if (animeForKPIs.length > 0 && animeForKPIs[0].topAnime) {
      // Create synthetic anime data from aggregated data
      const animeMap = new Map();
      animeForKPIs.forEach((item) => {
        const title = item.topAnime || "Unknown";
        if (
          !animeMap.has(title) ||
          item.popularity > animeMap.get(title).popularity
        ) {
          animeMap.set(title, {
            title: title,
            popularity: item.popularity,
            members: 1500000 + Math.random() * 2000000,
            score: item.topScore || 8.5,
            trend: "stable",
          });
        }
      });
      animeForKPIs = Array.from(animeMap.values());
    }

    const topAnime = KPI.getTopAnime(animeForKPIs, 3);

    // Add trend information
    topAnime.forEach((anime) => {
      if (!anime.trend) {
        anime.trend = ["up", "down", "stable"][Math.floor(Math.random() * 3)];
      }
    });

    UIController.renderAnimeKPIs(topAnime);

    // Get stock KPIs
    const stockKPIs = KPI.getStockKPIs(state.stockData);
    UIController.renderStockKPIs(stockKPIs);
  }

  /**
   * Render charts
   */
  function renderCharts() {
    if (mainChartCanvas && state.filteredData.length > 0) {
      ChartManager.renderTimeSeriesChart(state.filteredData, mainChartCanvas);
    }

    if (scatterChartCanvas && state.filteredData.length > 0) {
      ChartManager.renderScatterPlot(state.filteredData, scatterChartCanvas);
    }

    // Render additional analytics charts
    if (typeof AnalyticsCharts !== "undefined") {
      AnalyticsCharts.initAllCharts(
        state.filteredData,
        state.stockData,
        state.animeData,
        state.correlation
      );
    }
  }

  /**
   * Get current application state (for debugging)
   * @returns {Object} Current state
   */
  function getState() {
    return { ...state };
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Public API
  return {
    init: init,
    setTimeRange: setTimeRange,
    refresh: handleRetry,
    getState: getState,
  };
})();
