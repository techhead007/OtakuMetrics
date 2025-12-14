# Implementation Plan

- [x] 1. Set up project structure and base HTML

  - [x] 1.1 Create directory structure with index.html, css/, js/, and tests/ folders
    - Set up semantic HTML5 structure with header, main sections, and footer
    - Include Chart.js CDN and fast-check CDN for testing
    - _Requirements: 2.1, 2.4_
  - [x] 1.2 Create main.css with CSS variables and base dark theme styling
    - Define color palette variables (neon cyan, magenta, AWS orange, dark backgrounds)
    - Set up glassmorphism utility classes
    - Implement responsive grid layout
    - _Requirements: 2.1, 2.2, 2.4_

- [x] 2. Implement core data models and sample data

  - [x] 2.1 Create sampleData.js with curated anime and stock datasets
    - Generate 1 year of realistic anime popularity data for top titles
    - Generate 1 year of realistic AMZN stock price data
    - Ensure date alignment between datasets
    - _Requirements: 6.1, 6.2, 6.3_
  - [x] 2.2 Create dataService.js with data fetching and transformation functions
    - Implement fetchAnimeData() with Jikan API integration
    - Implement fetchStockData() with Alpha Vantage integration
    - Add fallback logic to sample data on API failure
    - _Requirements: 6.1, 6.2, 6.3_
  - [x] 2.3 Write property test for data alignment
    - **Property 1: Data Alignment by Date**
    - **Validates: Requirements 1.2, 5.3**

- [x] 3. Implement KPI calculation functions

  - [x] 3.1 Create kpi.js with anime and stock KPI extraction
    - Implement getTopAnime(data, n) to extract top trending anime
    - Implement getStockKPIs(data) to calculate price, change%, and trend
    - Implement getChangeColor(percentage) for color coding
    - _Requirements: 3.1, 3.2, 3.4_
  - [x] 3.2 Write property tests for KPI functions
    - **Property 3: Top Anime KPI Extraction**
    - **Property 4: Stock KPI Calculation**
    - **Property 5: Percentage Color Coding**
    - **Validates: Requirements 3.1, 3.2, 3.4**

- [x] 4. Implement time range filtering

  - [x] 4.1 Create filtering.js with date range filter function
    - Implement filterByTimeRange(data, range) supporting 1W, 1M, 3M, 1Y
    - Ensure chronological sorting of results
    - _Requirements: 4.1_
  - [x] 4.2 Write property test for time range filtering
    - **Property 6: Time Range Filtering**
    - **Validates: Requirements 4.1**

- [x] 5. Implement correlation analysis

  - [x] 5.1 Create correlation.js with statistical functions
    - Implement calculatePearsonCorrelation(array1, array2)
    - Implement classifyCorrelation(coefficient) for significance levels
    - Implement generateInsight(correlation, animeTitle) for human-readable text
    - _Requirements: 5.1, 5.2_
  - [x] 5.2 Write property tests for correlation functions
    - **Property 7: Correlation Coefficient Calculation**
    - **Property 8: Correlation Significance Classification**
    - **Validates: Requirements 5.1, 5.2**

- [x] 6. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement UI controller and formatting

  - [x] 7.1 Create uiController.js with DOM manipulation functions
    - Implement renderKPICards(animeKPIs, stockKPIs)
    - Implement showLoading() and hideLoading() with anime-themed spinner
    - Implement showError(message) with retry button
    - Implement formatTimestamp(date) for last updated display
    - _Requirements: 3.1, 3.2, 6.4, 7.1, 7.2_
  - [x] 7.2 Write property tests for formatting and error handling
    - **Property 9: Timestamp Formatting**
    - **Property 10: Error Message Generation**
    - **Validates: Requirements 6.4, 7.2**

- [x] 8. Implement chart rendering

  - [x] 8.1 Create chartManager.js with Chart.js configuration
    - Implement renderTimeSeriesChart(animeData, stockData) with dual Y-axes
    - Implement renderScatterPlot(correlationData) for correlation visualization
    - Configure anime-inspired chart styling (gradients, glow effects)
    - Implement tooltip customization showing both data sources
    - _Requirements: 1.1, 1.2, 1.3, 5.3_
  - [x] 8.2 Write property test for tooltip data retrieval
    - **Property 2: Tooltip Data Retrieval**
    - **Validates: Requirements 1.3**

- [x] 9. Build complete HTML structure and styling

  - [x] 9.1 Complete index.html with all dashboard sections
    - Add header with logo and title
    - Add KPI cards section (3 anime + 3 stock cards)
    - Add main chart container with time range filter buttons
    - Add correlation section with insights panel and scatter plot
    - Add loading overlay and error modal
    - _Requirements: 1.1, 3.1, 3.2, 5.1, 7.1, 7.2_
  - [x] 9.2 Create components.css with card and button styles
    - Style KPI cards with glassmorphism and anime accents
    - Style filter buttons with neon hover effects
    - Style correlation insights panel
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 9.3 Create animations.css with keyframe animations
    - Implement loading spinner animation (anime-themed)
    - Implement card entrance animations
    - Implement number counting animation for KPIs
    - Implement chart transition animations
    - _Requirements: 2.3, 3.3, 4.3, 7.1, 7.3_

- [x] 10. Wire up main application

  - [x] 10.1 Create app.js to orchestrate all modules
    - Initialize dashboard state
    - Wire up time range filter click handlers
    - Implement data refresh flow with loading states
    - Handle errors with fallback and retry logic
    - Trigger entrance animations on load complete
    - _Requirements: 1.4, 4.1, 4.2, 6.3, 7.2, 7.3_

- [x] 11. Add responsive design and polish

  - [x] 11.1 Create responsive.css with media queries
    - Implement mobile layout (stacked cards, full-width charts)
    - Implement tablet layout (2-column grid)
    - Implement desktop layout (3-column grid with side panels)
    - _Requirements: 2.4_
  - [x] 11.2 Add final visual polish and anime-style decorations
    - Add subtle particle/star background animation
    - Add anime character silhouette decorations
    - Fine-tune color gradients and glow effects
    - Ensure consistent spacing and typography
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 12. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
