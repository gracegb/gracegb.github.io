window.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabTrack = document.querySelector(".tab-track");
  const tabPanels = document.querySelector(".tab-panels");
  const projectsPanel = document.getElementById("projects-panel");
  const researchPanel = document.getElementById("research-panel");
  const waveCanvas = document.getElementById("wave-canvas");
  const headerEl = document.querySelector("header");

  if (tabButtons.length && tabTrack) {
    const updateTabHeight = () => {
      if (!tabPanels) return;
      const activePanel =
        document.querySelector('.tab-panel[aria-hidden="false"]') ||
        document.querySelector(".tab-panel");
      if (!activePanel) return;
      const targetHeight = activePanel.scrollHeight;
      tabPanels.style.height = `${targetHeight}px`;
    };

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (button.classList.contains("active")) return;

        tabButtons.forEach((btn) => {
          btn.classList.remove("active");
          btn.setAttribute("aria-selected", "false");
        });

        button.classList.add("active");
        button.setAttribute("aria-selected", "true");

        const showResearch = button.dataset.target === "research";
        tabTrack.classList.toggle("show-research", showResearch);
        tabTrack.setAttribute("data-active", showResearch ? "research" : "projects");

        projectsPanel?.setAttribute("aria-hidden", showResearch ? "true" : "false");
        researchPanel?.setAttribute("aria-hidden", showResearch ? "false" : "true");
        updateTabHeight();
        setTimeout(updateTabHeight, 450); // re-measure after slide transition
      });
    });

    updateTabHeight();
    window.addEventListener("resize", updateTabHeight);
    window.addEventListener("load", updateTabHeight);
  }

  // Animated wave background behind header
  if (waveCanvas && headerEl) {
    const ctx = waveCanvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    let grid = [];
    let cols = 18;
    let rows = 12;
    let loc = 90;

    function setupGrid() {
      const colSize = waveCanvas.width / cols;
      const rowSize = waveCanvas.height / rows;
      grid = Array.from({ length: cols }, (_, i) =>
        Array.from({ length: rows }, (_, j) => ({
          x: colSize / 2 + i * colSize,
          y: rowSize / 2 + j * rowSize,
          r: rowSize * 0.35,
          phase: i * loc + j * loc
        }))
      );
    }

    function resizeCanvas() {
      const { width, height } = headerEl.getBoundingClientRect();
      waveCanvas.width = Math.max(width * dpr, 1);
      waveCanvas.height = Math.max(height * dpr, 1);
      waveCanvas.style.width = `${width}px`;
      waveCanvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      setupGrid();
    }

    function draw(time = 0) {
      if (!grid.length) return;
      ctx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
      const freq = 0.0022;
      const amp = (waveCanvas.height / rows) * 0.18;

      for (let j = 0; j < rows; j++) {
        ctx.beginPath();
        for (let i = 0; i < cols; i++) {
          const cell = grid[i][j];
          const wobble = Math.sin((time + cell.phase) * freq) * amp;
          const sway = Math.cos(time * 0.001 + j * 0.3) * amp * 0.25;
          const y = cell.y + wobble + sway;
          i === 0 ? ctx.moveTo(cell.x, y) : ctx.lineTo(cell.x, y);
        }
        ctx.strokeStyle = "rgba(215, 231, 255, 0.8)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      requestAnimationFrame(draw);
    }

    resizeCanvas();
    requestAnimationFrame(draw);
    window.addEventListener("resize", resizeCanvas);
  }

  // Slideshow toggle
  window.nextSlide = function nextSlide(button) {
    const container = button.closest(".slideshow");
    if (!container) return;
    const imgs = container.querySelectorAll("img");
    const active = container.querySelector("img.active");
    if (!imgs.length || !active) return;

    active.classList.remove("active");
    const next = active.nextElementSibling && active.nextElementSibling.tagName === "IMG"
      ? active.nextElementSibling
      : imgs[0];
    next.classList.add("active");

    const link = container.querySelector(".figma-link");
    if (link) {
      if (next.dataset.link) {
        link.href = next.dataset.link;
        link.style.display = "inline";
      } else {
        link.style.display = "none";
      }
    }
  };
});
