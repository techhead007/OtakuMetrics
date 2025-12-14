/**
 * UI Controller - DOM manipulation and animations
 * Handles all UI updates, rendering, and user interactions
 */

const UIController = (function () {
  "use strict";

  // DOM Element references
  const elements = {
    loadingOverlay: null,
    errorModal: null,
    errorMessage: null,
    retryBtn: null,
    lastUpdatedTime: null,
    statusIndicator: null,
    animeKPICards: null,
    stockKPICards: null,
    correlationValue: null,
    correlationSignificance: null,
    insightText: null,
    timeFilters: null,
  };

  // Error message templates (user-friendly, no technical details)
  const ERROR_MESSAGES = {
    network:
      "Unable to connect to the data source. Please check your internet connection.",
    timeout: "The request took too long. Please try again.",
    parsing:
      "There was an issue processing the data. Using cached data instead.",
    api: "The data service is temporarily unavailable. Showing sample data.",
    unknown: "Something unexpected happened. Please try again.",
  };

  /**
   * Initialize DOM element references
   */
  function init() {
    elements.loadingOverlay = document.getElementById("loading-overlay");
    elements.errorModal = document.getElementById("error-modal");
    elements.errorMessage = document.getElementById("error-message");
    elements.retryBtn = document.getElementById("retry-btn");
    elements.lastUpdatedTime = document.getElementById("last-updated-time");
    elements.statusIndicator = document.getElementById("status-indicator");
    elements.animeKPICards = document.getElementById("anime-kpi-cards");
    elements.stockKPICards = document.getElementById("stock-kpi-cards");
    elements.correlationValue = document.getElementById("correlation-value");
    elements.correlationSignificance = document.getElementById(
      "correlation-significance"
    );
    elements.insightText = document.getElementById("insight-text");
    elements.timeFilters = document.getElementById("time-filters");
  }

  /**
   * Show loading overlay with anime-themed animation
   */
  function showLoading() {
    if (elements.loadingOverlay) {
      elements.loadingOverlay.classList.remove("hidden");
    }
  }

  /**
   * Hide loading overlay
   */
  function hideLoading() {
    if (elements.loadingOverlay) {
      elements.loadingOverlay.classList.add("hidden");
    }
  }

  /**
   * Get user-friendly error message
   * Property 10: Error Message Generation
   * @param {string} errorType - Type of error
   * @returns {string} User-friendly error message
   */
  function getErrorMessage(errorType) {
    if (typeof errorType !== "string" || !errorType) {
      return ERROR_MESSAGES.unknown;
    }

    const type = errorType.toLowerCase();

    if (
      type.includes("network") ||
      type.includes("fetch") ||
      type.includes("connection")
    ) {
      return ERROR_MESSAGES.network;
    }
    if (type.includes("timeout") || type.includes("abort")) {
      return ERROR_MESSAGES.timeout;
    }
    if (
      type.includes("parse") ||
      type.includes("json") ||
      type.includes("syntax")
    ) {
      return ERROR_MESSAGES.parsing;
    }
    if (
      type.includes("api") ||
      type.includes("rate") ||
      type.includes("limit")
    ) {
      return ERROR_MESSAGES.api;
    }

    return ERROR_MESSAGES.unknown;
  }

  /**
   * Show error modal with message and retry option
   * @param {string} message - Error message to display
   * @param {Function} onRetry - Callback for retry button
   */
  function showError(message, onRetry) {
    if (elements.errorModal && elements.errorMessage) {
      elements.errorMessage.textContent = message;
      elements.errorModal.classList.remove("hidden");

      if (elements.retryBtn && onRetry) {
        elements.retryBtn.onclick = () => {
          hideError();
          onRetry();
        };
      }
    }
  }

  /**
   * Hide error modal
   */
  function hideError() {
    if (elements.errorModal) {
      elements.errorModal.classList.add("hidden");
    }
  }

  /**
   * Format timestamp for display
   * Property 9: Timestamp Formatting
   * @param {Date} date - Date object to format
   * @returns {string} Formatted timestamp string
   */
  function formatTimestamp(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "--";
    }

    const options = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return date.toLocaleString("en-US", options);
  }

  /**
   * Update last updated timestamp
   * @param {Date} date - Date to display
   */
  function updateLastUpdated(date) {
    if (elements.lastUpdatedTime) {
      elements.lastUpdatedTime.textContent = formatTimestamp(date);
    }
  }

  /**
   * Create anime KPI card HTML
   * @param {Object} anime - Anime data object
   * @param {number} rank - Rank position
   * @returns {string} HTML string
   */
  function createAnimeKPICard(anime, rank) {
    const trendIcon =
      anime.trend === "up" ? "↑" : anime.trend === "down" ? "↓" : "→";
    const trendClass =
      anime.trend === "up"
        ? "positive"
        : anime.trend === "down"
        ? "negative"
        : "neutral";

    return `
            <div class="kpi-card anime-card glass-card" data-rank="${rank}">
                <div class="kpi-rank">#${rank}</div>
                <h3 class="kpi-title">${escapeHtml(anime.title)}</h3>
                <div class="kpi-value">
                    <span class="popularity-score">${anime.popularity.toFixed(
                      1
                    )}</span>
                    <span class="trend-indicator ${trendClass}">${trendIcon}</span>
                </div>
                <div class="kpi-meta">
                    <span class="members">${KPI.formatNumber(
                      anime.members
                    )} members</span>
                    <span class="score">★ ${anime.score.toFixed(1)}</span>
                </div>
            </div>
        `;
  }

  /**
   * Create stock KPI card HTML
   * @param {string} label - Card label
   * @param {string} value - Display value
   * @param {string} subValue - Secondary value
   * @param {string} colorClass - Color class for styling
   * @returns {string} HTML string
   */
  function createStockKPICard(label, value, subValue = "", colorClass = "") {
    return `
            <div class="kpi-card stock-card glass-card">
                <div class="kpi-label">${escapeHtml(label)}</div>
                <div class="kpi-value ${colorClass}">${escapeHtml(value)}</div>
                ${
                  subValue
                    ? `<div class="kpi-sub">${escapeHtml(subValue)}</div>`
                    : ""
                }
            </div>
        `;
  }

  /**
   * Render anime KPI cards
   * @param {Array} topAnime - Array of top anime data
   */
  function renderAnimeKPIs(topAnime) {
    if (!elements.animeKPICards) return;

    const html = topAnime
      .map((anime, index) => createAnimeKPICard(anime, index + 1))
      .join("");

    elements.animeKPICards.innerHTML = html;

    // Trigger entrance animation
    setTimeout(() => {
      const cards = elements.animeKPICards.querySelectorAll(".kpi-card");
      cards.forEach((card, i) => {
        setTimeout(() => card.classList.add("animate-in"), i * 100);
      });
    }, 50);
  }

  /**
   * Render stock KPI cards
   * @param {Object} stockKPIs - Stock KPI data
   */
  function renderStockKPIs(stockKPIs) {
    if (!elements.stockKPICards) return;

    const changeColor = KPI.getChangeColor(stockKPIs.changePercent);
    const changeColorClass = `text-${changeColor}`;

    const html = `
            ${createStockKPICard(
              "Current Price",
              KPI.formatPrice(stockKPIs.currentPrice),
              "AMZN"
            )}
            ${createStockKPICard(
              "Daily Change",
              KPI.formatPercent(stockKPIs.changePercent),
              KPI.formatPrice(stockKPIs.changeAmount),
              changeColorClass
            )}
            ${createStockKPICard(
              "52W Range",
              `${KPI.formatPrice(stockKPIs.low52Week)} - ${KPI.formatPrice(
                stockKPIs.high52Week
              )}`,
              KPI.formatNumber(stockKPIs.volume) + " vol"
            )}
        `;

    elements.stockKPICards.innerHTML = html;

    // Trigger entrance animation
    setTimeout(() => {
      const cards = elements.stockKPICards.querySelectorAll(".kpi-card");
      cards.forEach((card, i) => {
        setTimeout(() => card.classList.add("animate-in"), i * 100);
      });
    }, 50);
  }

  /**
   * Render correlation statistics
   * @param {Object} correlation - Correlation analysis result
   */
  function renderCorrelation(correlation) {
    if (elements.correlationValue) {
      elements.correlationValue.textContent =
        correlation.coefficient.toFixed(3);
    }
    if (elements.correlationSignificance) {
      elements.correlationSignificance.textContent =
        correlation.classification.toUpperCase();
      elements.correlationSignificance.className = `stat-value correlation-${correlation.classification}`;
    }
    if (elements.insightText) {
      elements.insightText.textContent = correlation.insight;
    }
  }

  /**
   * Set active time filter button
   * @param {string} range - Active range key
   */
  function setActiveFilter(range) {
    if (!elements.timeFilters) return;

    const buttons = elements.timeFilters.querySelectorAll(".filter-btn");
    buttons.forEach((btn) => {
      if (btn.dataset.range === range) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Trigger entrance animations for all dashboard components
   */
  function triggerEntranceAnimations() {
    document.querySelectorAll(".glass-card").forEach((card, i) => {
      setTimeout(() => card.classList.add("animate-in"), i * 50);
    });
  }

  /**
   * Update status indicator
   * @param {string} status - Status type ('live', 'sample', 'error')
   */
  function updateStatus(status) {
    if (!elements.statusIndicator) return;

    const dot = elements.statusIndicator.querySelector(".status-dot");
    const text = elements.statusIndicator.querySelector(".status-text");

    const statusConfig = {
      live: { color: "var(--positive)", text: "Live" },
      sample: { color: "var(--aws-orange)", text: "Sample" },
      error: { color: "var(--negative)", text: "Error" },
    };

    const config = statusConfig[status] || statusConfig.sample;

    if (dot) dot.style.background = config.color;
    if (text) {
      text.textContent = config.text;
      text.style.color = config.color;
    }
  }

  // Public API
  return {
    init: init,
    showLoading: showLoading,
    hideLoading: hideLoading,
    showError: showError,
    hideError: hideError,
    getErrorMessage: getErrorMessage,
    formatTimestamp: formatTimestamp,
    updateLastUpdated: updateLastUpdated,
    renderAnimeKPIs: renderAnimeKPIs,
    renderStockKPIs: renderStockKPIs,
    renderCorrelation: renderCorrelation,
    setActiveFilter: setActiveFilter,
    triggerEntranceAnimations: triggerEntranceAnimations,
    updateStatus: updateStatus,
  };
})();

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = UIController;
}
