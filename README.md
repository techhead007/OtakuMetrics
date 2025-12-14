# 🎌 OtakuMetrics — Anime × Stock Analytics Dashboard
![Gemini_Generated_Image_9lzpjr9lzpjr9lzp](https://github.com/user-attachments/assets/4120c22d-d014-407b-ab6c-38c3ee42c421)

<div align="center">

![OtakuMetrics Banner](https://img.shields.io/badge/OtakuMetrics-Anime%20×%20Finance-ff00ff?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyIDJMMiAyMmgyMEwxMiAyeiIvPjwvc3ZnPg==)

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20Site-00f5ff?style=for-the-badge)](https://techhead007.github.io/OtakuMetrics)
[![Built with Kiro](https://img.shields.io/badge/Built%20with-Kiro%20AI-ff9900?style=for-the-badge)](https://kiro.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

**Discover hidden correlations between anime popularity trends and Amazon stock performance**

[Features](#-features) • [Demo](#-live-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Deployment](#-deploy-to-github-pages)

</div>

---

## 🎯 What is OtakuMetrics?

OtakuMetrics is a professional-grade analytics dashboard that visualizes the surprising correlation between **anime popularity trends** and **AMZN stock performance**. Built with vanilla JavaScript and Chart.js, it features stunning anime-inspired aesthetics with neon colors, glassmorphism, and smooth animations.

> 💡 **Fun Fact:** We found a moderate positive correlation (r=0.64) between anime popularity spikes and stock momentum!

---

## ✨ Features

### 📊 9 Interactive Visualizations

- **Dual-Axis Time Series** — Compare anime popularity vs stock price
- **Genre Distribution** — Doughnut chart of trending anime genres
- **Trading Volume** — Color-coded bar chart (green/red days)
- **Anime Radar Chart** — Multi-dimensional comparison of top 3 anime
- **Market Sentiment Gauge** — Bullish/Bearish/Neutral indicator
- **Weekly Activity Heatmap** — 8×7 grid of trading patterns
- **Moving Averages** — MA7, MA20, and Bollinger Bands
- **Returns Distribution** — Histogram of daily returns
- **Correlation Scatter Plot** — Visual proof of the correlation

### 📈 Real-Time KPIs

- Total Data Points
- Average Correlation Coefficient
- Stock YTD Performance
- Anime Momentum (week-over-week)
- Volatility Index

### 🎨 Anime-Inspired Design

- Neon cyan & magenta color scheme
- Glassmorphism card effects
- Floating sakura particles
- Smooth scroll animations
- Responsive on all devices

### 🔧 Technical Features

- **Dual API Integration** — Jikan (MyAnimeList) + Alpha Vantage
- **Graceful Fallback** — Sample data when APIs fail
- **Property-Based Testing** — 10 correctness properties with fast-check
- **Zero Dependencies** — Pure vanilla JS (no React/Vue/Angular)

---

## 🚀 Live Demo

**[👉 View Live Dashboard](https://techhead007.github.io/OtakuMetrics)**

![Dashboard Screenshot](screenshots/dashboard-preview.png)

---

## 📦 Installation

### Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/techhead007/OtakuMetrics.git

# Navigate to project folder
cd OtakuMetrics

# Open in browser (no build step required!)
open index.html
# Or use a local server
npx serve .
```

### Using VS Code Live Server

1. Install the **Live Server** extension
2. Right-click `index.html`
3. Select "Open with Live Server"

---

## 🛠 Tech Stack

| Category        | Technology                          |
| --------------- | ----------------------------------- |
| **Frontend**    | HTML5, CSS3, Vanilla JavaScript     |
| **Charts**      | Chart.js 4.4.1                      |
| **Fonts**       | Google Fonts (Orbitron, Rajdhani)   |
| **APIs**        | Jikan API, Alpha Vantage            |
| **Testing**     | fast-check (Property-Based Testing) |
| **Development** | Kiro AI (Spec-Driven Development)   |

---

## 📁 Project Structure

```
OtakuMetrics/
├── 📄 index.html              # Main HTML file
├── 📁 css/
│   ├── main.css               # Variables & base styles
│   ├── components.css         # Cards, buttons, forms
│   ├── animations.css         # Keyframe animations
│   ├── responsive.css         # Media queries
│   ├── analytics.css          # Chart-specific styles
│   └── anime-effects.css      # Particles, glow effects
├── 📁 js/
│   ├── sampleData.js          # Fallback data generation
│   ├── dataService.js         # API integration
│   ├── kpi.js                 # KPI calculations
│   ├── filtering.js           # Time range filtering
│   ├── correlation.js         # Statistical analysis
│   ├── chartManager.js        # Main chart rendering
│   ├── analyticsCharts.js     # Additional visualizations
│   ├── uiController.js        # DOM manipulation
│   ├── animeEffects.js        # Visual effects
│   └── app.js                 # Main orchestration
├── 📁 tests/
│   ├── correlation.property.test.js
│   ├── dataAlignment.property.test.js
│   ├── filtering.property.test.js
│   ├── formatting.property.test.js
│   └── kpi.property.test.js
├── 📁 .kiro/specs/            # Kiro specification files
├── 📄 README.md
├── 📄 BLOG_POST.md            # Technical blog post
└── 📄 LICENSE
```

---

## 🌐 Deploy to GitHub Pages

### Step-by-Step Guide

#### Step 1: Create a GitHub Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: OtakuMetrics Dashboard"

# Create repo on GitHub, then add remote
git remote add origin https://github.com/techhead007/OtakuMetrics.git

# Push to main branch
git branch -M main
git push -u origin main
```

#### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (gear icon)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Click **Save**

#### Step 3: Access Your Live Site

After 1-2 minutes, your site will be live at:

```
https://techhead007.github.io/OtakuMetrics
```

### 🔄 Updating Your Site

Every time you push to `main`, GitHub Pages automatically rebuilds:

```bash
git add .
git commit -m "Update: Added new feature"
git push
```

---

## ⚙️ Configuration

### Using Real API Data

By default, the dashboard uses sample data. To enable live API calls:

#### Jikan API (Anime Data)

- **No API key required!**
- Rate limit: 3 requests/second
- Automatically falls back to sample data on failure

#### Alpha Vantage (Stock Data)

1. Get a free API key at [alphavantage.co](https://www.alphavantage.co/support/#api-key)
2. Update `js/dataService.js`:

```javascript
const ALPHA_VANTAGE_API_KEY = "YOUR_API_KEY_HERE";
```

3. Change `useSampleData` to `false` in `js/app.js`:

```javascript
await loadData(false); // false = try APIs first
```

---

## 🧪 Running Tests

```bash
# Install fast-check (if running tests locally)
npm install fast-check

# Run tests
node tests/runTests.js
```

Or open `tests/test-runner.html` in your browser.

---

## 📊 Data Sources

| Source                                        | Data                               | Update Frequency |
| --------------------------------------------- | ---------------------------------- | ---------------- |
| [Jikan API](https://jikan.moe/)               | Anime popularity, scores, rankings | Real-time        |
| [Alpha Vantage](https://www.alphavantage.co/) | AMZN stock prices, volume          | Daily            |
| Sample Data                                   | 365 days of curated data           | Static fallback  |

---

## 🎨 Customization

### Change Color Scheme

Edit CSS variables in `css/main.css`:

```css
:root {
  --neon-cyan: #00f5ff;
  --neon-magenta: #ff00ff;
  --neon-orange: #ff9900;
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
}
```

### Add New Charts

1. Add canvas element in `index.html`
2. Create render function in `js/analyticsCharts.js`
3. Call it from `initAllCharts()`

### Change Anime List

Edit `js/sampleData.js`:

```javascript
const animeList = [
  { title: "Your Anime", basePopularity: 90, members: 2000000, score: 8.5 },
  // Add more...
];
```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Kiro](https://kiro.dev)** — AI-powered spec-driven development
- **[Chart.js](https://www.chartjs.org/)** — Beautiful charts made simple
- **[Jikan API](https://jikan.moe/)** — Unofficial MyAnimeList API
- **[Alpha Vantage](https://www.alphavantage.co/)** — Free stock market data
- **[fast-check](https://github.com/dubzzz/fast-check)** — Property-based testing

---

---

<div align="center">

**Built with 💜 and lots of anime**

⭐ Star this repo if you found it interesting!

</div>
