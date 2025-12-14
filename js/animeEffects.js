/**
 * Anime Effects - Scroll animations, parallax, and special effects
 * Creates an immersive anime-themed experience
 */

const AnimeEffects = (function () {
  "use strict";

  // Configuration
  const config = {
    sakuraPetals: 15,
    matrixColumns: 20,
    cursorTrailEnabled: true,
    speedLinesOnScroll: true,
  };

  // State
  let lastScrollY = 0;
  let scrollDirection = "down";
  let isScrolling = false;
  let scrollTimeout = null;

  /**
   * Initialize all anime effects
   */
  function init() {
    createScrollProgress();
    createSakuraPetals();
    createMatrixRain();
    createParallaxLayers();
    initScrollReveal();
    initTiltCards();
    initRippleEffect();
    initCursorTrail();
    initScrollListeners();
    initIntersectionObserver();

    console.log("🌸 Anime effects initialized!");
  }

  /**
   * Create scroll progress indicator
   */
  function createScrollProgress() {
    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    progress.id = "scroll-progress";
    document.body.appendChild(progress);
  }

  /**
   * Update scroll progress
   */
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    const progressBar = document.getElementById("scroll-progress");
    if (progressBar) {
      progressBar.style.width = progress + "%";
    }
  }

  /**
   * Create floating sakura petals
   */
  function createSakuraPetals() {
    const container = document.createElement("div");
    container.className = "sakura-container";
    container.id = "sakura-container";
    document.body.appendChild(container);

    for (let i = 0; i < config.sakuraPetals; i++) {
      createPetal(container, i);
    }
  }

  /**
   * Create a single sakura petal
   */
  function createPetal(container, index) {
    const petal = document.createElement("div");
    petal.className = "sakura-petal";

    const startX = Math.random() * 100;
    const duration = 8 + Math.random() * 7;
    const delay = Math.random() * 10;
    const size = 10 + Math.random() * 10;

    petal.style.cssText = `
            left: ${startX}%;
            width: ${size}px;
            height: ${size}px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;

    container.appendChild(petal);
  }

  /**
   * Create matrix rain effect
   */
  function createMatrixRain() {
    const container = document.createElement("div");
    container.className = "matrix-rain";
    container.id = "matrix-rain";
    document.body.appendChild(container);

    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";

    for (let i = 0; i < config.matrixColumns; i++) {
      const column = document.createElement("div");
      column.className = "matrix-column";

      const x = (i / config.matrixColumns) * 100;
      const duration = 10 + Math.random() * 20;
      const delay = Math.random() * 10;

      // Generate random characters
      let text = "";
      for (let j = 0; j < 30; j++) {
        text += chars[Math.floor(Math.random() * chars.length)] + "\n";
      }

      column.textContent = text;
      column.style.cssText = `
                left: ${x}%;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
            `;

      container.appendChild(column);
    }
  }

  /**
   * Create parallax character layers
   */
  function createParallaxLayers() {
    const layer1 = document.createElement("div");
    layer1.className = "parallax-layer anime-character-1";
    layer1.id = "parallax-1";

    const layer2 = document.createElement("div");
    layer2.className = "parallax-layer anime-character-2";
    layer2.id = "parallax-2";

    document.body.appendChild(layer1);
    document.body.appendChild(layer2);
  }

  /**
   * Update parallax on scroll
   */
  function updateParallax() {
    const scrollY = window.scrollY;
    const layer1 = document.getElementById("parallax-1");
    const layer2 = document.getElementById("parallax-2");

    if (layer1) {
      layer1.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
    if (layer2) {
      layer2.style.transform = `translateY(${scrollY * 0.2}px)`;
    }
  }

  /**
   * Initialize scroll reveal animations
   */
  function initScrollReveal() {
    // Add scroll-reveal class to sections
    const sections = document.querySelectorAll(
      "section, .glass-card, .analytics-card, .insight-card, .stat-card"
    );
    sections.forEach((section, index) => {
      if (!section.classList.contains("scroll-reveal")) {
        section.classList.add("scroll-reveal");
        section.style.transitionDelay = `${index * 0.05}s`;
      }
    });
  }

  /**
   * Initialize tilt effect on cards
   */
  function initTiltCards() {
    const cards = document.querySelectorAll(
      ".glass-card, .kpi-card, .analytics-card"
    );

    cards.forEach((card) => {
      card.classList.add("tilt-card");

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const tiltX = (y - centerY) / 20;
        const tiltY = (centerX - x) / 20;

        card.style.setProperty("--tilt-x", `${tiltX}deg`);
        card.style.setProperty("--tilt-y", `${tiltY}deg`);
      });

      card.addEventListener("mouseleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  /**
   * Initialize ripple effect on buttons
   */
  function initRippleEffect() {
    const buttons = document.querySelectorAll(".btn, .filter-btn");

    buttons.forEach((btn) => {
      btn.classList.add("ripple-effect");

      btn.addEventListener("click", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.left = x + "px";
        ripple.style.top = y + "px";

        btn.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  /**
   * Initialize cursor trail effect
   */
  function initCursorTrail() {
    if (!config.cursorTrailEnabled) return;

    const trail = document.createElement("div");
    trail.className = "cursor-trail";
    trail.id = "cursor-trail";
    document.body.appendChild(trail);

    let mouseX = 0,
      mouseY = 0;
    let trailX = 0,
      trailY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    document.addEventListener("mousedown", () => {
      trail.classList.add("clicking");
      createEnergyBurst(mouseX, mouseY);
    });

    document.addEventListener("mouseup", () => {
      trail.classList.remove("clicking");
    });

    function animateTrail() {
      trailX += (mouseX - trailX) * 0.2;
      trailY += (mouseY - trailY) * 0.2;

      trail.style.left = trailX + "px";
      trail.style.top = trailY + "px";

      requestAnimationFrame(animateTrail);
    }

    animateTrail();
  }

  /**
   * Create energy burst effect at position
   */
  function createEnergyBurst(x, y) {
    const burst = document.createElement("div");
    burst.className = "energy-burst";
    burst.style.left = x - 100 + "px";
    burst.style.top = y - 100 + "px";
    document.body.appendChild(burst);

    requestAnimationFrame(() => {
      burst.classList.add("active");
    });

    setTimeout(() => burst.remove(), 800);
  }

  /**
   * Create speed lines effect
   */
  function createSpeedLines() {
    if (!config.speedLinesOnScroll) return;

    const container = document.createElement("div");
    container.className = "speed-lines active";

    for (let i = 0; i < 10; i++) {
      const line = document.createElement("div");
      line.className = "speed-line";
      line.style.top = Math.random() * 100 + "%";
      line.style.animationDelay = Math.random() * 0.2 + "s";
      container.appendChild(line);
    }

    document.body.appendChild(container);

    setTimeout(() => container.remove(), 500);
  }

  /**
   * Initialize scroll event listeners
   */
  function initScrollListeners() {
    let ticking = false;

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;
      scrollDirection = currentScrollY > lastScrollY ? "down" : "up";
      lastScrollY = currentScrollY;

      if (!isScrolling) {
        isScrolling = true;
        if (Math.abs(currentScrollY - lastScrollY) > 50) {
          createSpeedLines();
        }
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 150);

      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollProgress();
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /**
   * Initialize Intersection Observer for scroll reveal
   */
  function initIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          entry.target.classList.add("in-view");

          // Add glow effect
          if (entry.target.classList.contains("glass-card")) {
            entry.target.classList.add("glow-on-scroll");
          }

          // Add neon border effect
          if (entry.target.classList.contains("analytics-card")) {
            entry.target.classList.add("neon-border");
          }
        }
      });
    }, observerOptions);

    // Observe all scroll-reveal elements
    document
      .querySelectorAll(
        ".scroll-reveal, .glass-card, .analytics-card, .kpi-card, .stat-card, .insight-card"
      )
      .forEach((el) => {
        observer.observe(el);
      });
  }

  /**
   * Create spark effect at element
   */
  function createSparks(element) {
    const rect = element.getBoundingClientRect();
    const container = document.createElement("div");
    container.className = "spark-container";
    element.appendChild(container);

    for (let i = 0; i < 8; i++) {
      const spark = document.createElement("div");
      spark.className = "spark";
      spark.style.left = "50%";
      spark.style.top = "50%";
      spark.style.setProperty("--spark-x", (Math.random() - 0.5) * 100 + "px");
      spark.style.setProperty("--spark-y", (Math.random() - 0.5) * 100 + "px");
      container.appendChild(spark);
    }

    setTimeout(() => container.remove(), 1000);
  }

  /**
   * Add glitch effect to element
   */
  function addGlitchEffect(element) {
    element.classList.add("glitch-text");
    element.setAttribute("data-text", element.textContent);
  }

  /**
   * Toggle sakura petals
   */
  function toggleSakura(enabled) {
    const container = document.getElementById("sakura-container");
    if (container) {
      container.style.display = enabled ? "block" : "none";
    }
  }

  /**
   * Toggle matrix rain
   */
  function toggleMatrix(enabled) {
    const container = document.getElementById("matrix-rain");
    if (container) {
      container.style.display = enabled ? "block" : "none";
    }
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
    createEnergyBurst: createEnergyBurst,
    createSparks: createSparks,
    addGlitchEffect: addGlitchEffect,
    toggleSakura: toggleSakura,
    toggleMatrix: toggleMatrix,
  };
})();
