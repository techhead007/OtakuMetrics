/**
 * Chart Manager - Chart.js configuration and rendering
 * Handles all chart creation, updates, and styling
 */

const ChartManager = (function () {
  "use strict";

  // Chart instances
  let mainChart = null;
  let scatterChart = null;

  // Anime-inspired color palette
  const colors = {
    animePrimary: "rgba(0, 245, 255, 1)", // Neon cyan
    animeSecondary: "rgba(0, 245, 255, 0.2)",
    stockPrimary: "rgba(255, 153, 0, 1)", // AWS orange
    stockSecondary: "rgba(255, 153, 0, 0.2)",
    gridColor: "rgba(255, 255, 255, 0.1)",
    textColor: "rgba(255, 255, 255, 0.7)",
    tooltipBg: "rgba(10, 10, 15, 0.95)",
  };

  // Gradient creation helper
  function createGradient(ctx, color1, color2, height = 400) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
  }

  /**
   * Get tooltip data for a specific index
   * Property 2: Tooltip Data Retrieval
   * @param {Array} alignedData - Aligned data array
   * @param {number} index - Data point index
   * @returns {Object|null} Tooltip data object
   */
  function getTooltipDataByIndex(alignedData, index) {
    if (
      !Array.isArray(alignedData) ||
      index < 0 ||
      index >= alignedData.length
    ) {
      return null;
    }

    const dataPoint = alignedData[index];
    return {
      date: dataPoint.date,
      animePopularity: dataPoint.anime.popularity,
      animeTitle: dataPoint.anime.title || dataPoint.anime.topAnime,
      stockClose: dataPoint.stock.close,
      stockChange: dataPoint.stock.change,
    };
  }

  /**
   * Render the main time series chart with dual Y-axes
   * @param {Array} alignedData - Aligned anime/stock data
   * @param {HTMLCanvasElement} canvas - Canvas element
   */
  function renderTimeSeriesChart(alignedData, canvas) {
    if (!canvas || !alignedData || alignedData.length === 0) return;

    const ctx = canvas.getContext("2d");

    // Destroy existing chart
    if (mainChart) {
      mainChart.destroy();
    }

    // Prepare data
    const labels = alignedData.map((d) => d.date);
    const animeData = alignedData.map((d) => d.anime.popularity);
    const stockData = alignedData.map((d) => d.stock.close);

    // Create gradients
    const animeGradient = createGradient(
      ctx,
      colors.animeSecondary,
      "rgba(0, 245, 255, 0)"
    );
    const stockGradient = createGradient(
      ctx,
      colors.stockSecondary,
      "rgba(255, 153, 0, 0)"
    );

    mainChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Anime Popularity",
            data: animeData,
            borderColor: colors.animePrimary,
            backgroundColor: animeGradient,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: colors.animePrimary,
            pointHoverBorderColor: "#fff",
            pointHoverBorderWidth: 2,
            yAxisID: "y",
          },
          {
            label: "AMZN Stock Price",
            data: stockData,
            borderColor: colors.stockPrimary,
            backgroundColor: stockGradient,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: colors.stockPrimary,
            pointHoverBorderColor: "#fff",
            pointHoverBorderWidth: 2,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: colors.textColor,
              font: {
                family: "'Rajdhani', sans-serif",
                size: 12,
              },
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
          tooltip: {
            enabled: true,
            backgroundColor: colors.tooltipBg,
            titleColor: "#fff",
            bodyColor: colors.textColor,
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              title: function (context) {
                const date = new Date(context[0].label);
                return date.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              },
              label: function (context) {
                const datasetLabel = context.dataset.label;
                const value = context.parsed.y;

                if (datasetLabel.includes("Anime")) {
                  return `Popularity: ${value.toFixed(1)}`;
                } else {
                  return `Price: $${value.toFixed(2)}`;
                }
              },
              afterBody: function (context) {
                const index = context[0].dataIndex;
                const dataPoint = alignedData[index];
                if (dataPoint && dataPoint.anime) {
                  const title =
                    dataPoint.anime.title || dataPoint.anime.topAnime;
                  return title ? [`\nTop Anime: ${title}`] : [];
                }
                return [];
              },
            },
          },
        },
        scales: {
          x: {
            type: "category",
            grid: {
              color: colors.gridColor,
              drawBorder: false,
            },
            ticks: {
              color: colors.textColor,
              maxTicksLimit: 10,
              font: {
                family: "'Rajdhani', sans-serif",
              },
            },
          },
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: {
              display: true,
              text: "Anime Popularity",
              color: colors.animePrimary,
              font: {
                family: "'Orbitron', sans-serif",
                size: 11,
              },
            },
            grid: {
              color: colors.gridColor,
              drawBorder: false,
            },
            ticks: {
              color: colors.animePrimary,
              font: {
                family: "'Rajdhani', sans-serif",
              },
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            title: {
              display: true,
              text: "Stock Price ($)",
              color: colors.stockPrimary,
              font: {
                family: "'Orbitron', sans-serif",
                size: 11,
              },
            },
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              color: colors.stockPrimary,
              font: {
                family: "'Rajdhani', sans-serif",
              },
              callback: function (value) {
                return "$" + value;
              },
            },
          },
        },
        animation: {
          duration: 1000,
          easing: "easeOutQuart",
        },
      },
    });

    return mainChart;
  }

  /**
   * Render scatter plot for correlation visualization
   * @param {Array} alignedData - Aligned anime/stock data
   * @param {HTMLCanvasElement} canvas - Canvas element
   */
  function renderScatterPlot(alignedData, canvas) {
    if (!canvas || !alignedData || alignedData.length === 0) return;

    const ctx = canvas.getContext("2d");

    // Destroy existing chart
    if (scatterChart) {
      scatterChart.destroy();
    }

    // Prepare scatter data
    const scatterData = Correlation.getScatterPlotData(alignedData);

    scatterChart = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Anime vs Stock",
            data: scatterData,
            backgroundColor: "rgba(168, 85, 247, 0.6)",
            borderColor: "rgba(168, 85, 247, 1)",
            borderWidth: 1,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: "rgba(255, 0, 255, 0.8)",
            pointHoverBorderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: colors.tooltipBg,
            titleColor: "#fff",
            bodyColor: colors.textColor,
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderWidth: 1,
            callbacks: {
              title: function (context) {
                const point = scatterData[context[0].dataIndex];
                return point.date;
              },
              label: function (context) {
                const point = scatterData[context.dataIndex];
                return [
                  `Popularity: ${point.x.toFixed(1)}`,
                  `Stock: $${point.y.toFixed(2)}`,
                  point.animeTitle ? `Anime: ${point.animeTitle}` : "",
                ].filter(Boolean);
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Anime Popularity",
              color: colors.animePrimary,
              font: {
                family: "'Orbitron', sans-serif",
                size: 11,
              },
            },
            grid: {
              color: colors.gridColor,
            },
            ticks: {
              color: colors.textColor,
              font: {
                family: "'Rajdhani', sans-serif",
              },
            },
          },
          y: {
            title: {
              display: true,
              text: "Stock Price ($)",
              color: colors.stockPrimary,
              font: {
                family: "'Orbitron', sans-serif",
                size: 11,
              },
            },
            grid: {
              color: colors.gridColor,
            },
            ticks: {
              color: colors.textColor,
              font: {
                family: "'Rajdhani', sans-serif",
              },
              callback: function (value) {
                return "$" + value;
              },
            },
          },
        },
        animation: {
          duration: 800,
          easing: "easeOutQuart",
        },
      },
    });

    return scatterChart;
  }

  /**
   * Update charts with new data (animated transition)
   * @param {Array} alignedData - New aligned data
   */
  function updateCharts(alignedData) {
    if (mainChart && alignedData) {
      const labels = alignedData.map((d) => d.date);
      const animeData = alignedData.map((d) => d.anime.popularity);
      const stockData = alignedData.map((d) => d.stock.close);

      mainChart.data.labels = labels;
      mainChart.data.datasets[0].data = animeData;
      mainChart.data.datasets[1].data = stockData;
      mainChart.update("active");
    }

    if (scatterChart && alignedData) {
      const scatterData = Correlation.getScatterPlotData(alignedData);
      scatterChart.data.datasets[0].data = scatterData;
      scatterChart.update("active");
    }
  }

  /**
   * Destroy all charts
   */
  function destroyCharts() {
    if (mainChart) {
      mainChart.destroy();
      mainChart = null;
    }
    if (scatterChart) {
      scatterChart.destroy();
      scatterChart = null;
    }
  }

  // Public API
  return {
    renderTimeSeriesChart: renderTimeSeriesChart,
    renderScatterPlot: renderScatterPlot,
    updateCharts: updateCharts,
    destroyCharts: destroyCharts,
    getTooltipDataByIndex: getTooltipDataByIndex,
  };
})();

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = ChartManager;
}
