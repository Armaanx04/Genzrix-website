/**
 * Global site background — fixed grid + eased cursor spotlight.
 */

export function initSiteBackground(wrapEl) {
  if (!wrapEl) return () => {};

  const canvas = document.createElement('canvas');
  canvas.className = 'site-grid-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  wrapEl.appendChild(canvas);

  const spotlight = document.createElement('div');
  spotlight.className = 'site-cursor-spotlight';
  spotlight.setAttribute('aria-hidden', 'true');
  wrapEl.appendChild(spotlight);

  const ctx = canvas.getContext('2d');
  const squareSize = 48;
  /* Grid line params — must match hero-shapegrid.js exactly */
  const gridLineAlpha = 0.054;
  const gridLineColor = '240, 242, 255';
  const hoverFillColor = 'rgba(109, 94, 248, 0.06)';
  const hoverLineBoost = 0.02;
  const hoverRadius = 80;
  const fadeSpeed = 0.1;
  const spotlightLerp = 0.042;
  const cellOpacities = new Map();
  const mouse = { x: -9999, y: -9999, inside: false };
  const spotlightPos = { x: 0, y: 0 };
  const spotlightTarget = { x: 0, y: 0 };

  let rafId = null;
  let cols = 0;
  let rows = 0;
  let spotlightReady = false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const resizeCanvas = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / squareSize) + 2;
    rows = Math.ceil(h / squareSize) + 2;
  };

  const visibilityAt = (px, py, width, height) => {
    const cx = width * 0.5;
    const cy = height * 0.46;
    const distCenter = Math.hypot(px - cx, py - cy);
    const maxDist = Math.hypot(cx, cy);
    return 0.05 + 0.95 * Math.pow(Math.min(distCenter / maxDist, 1), 1.22);
  };

  const updateCellOpacities = () => {
    const targets = new Map();

    if (!reducedMotion && mouse.inside) {
      const startCol = Math.floor((mouse.x - hoverRadius) / squareSize) - 1;
      const endCol = Math.ceil((mouse.x + hoverRadius) / squareSize) + 1;
      const startRow = Math.floor((mouse.y - hoverRadius) / squareSize) - 1;
      const endRow = Math.ceil((mouse.y + hoverRadius) / squareSize) + 1;

      for (let col = startCol; col <= endCol; col++) {
        for (let row = startRow; row <= endRow; row++) {
          const cellCx = col * squareSize + squareSize / 2;
          const cellCy = row * squareSize + squareSize / 2;
          const dist = Math.hypot(mouse.x - cellCx, mouse.y - cellCy);
          if (dist > hoverRadius) continue;

          const falloff = 1 - dist / hoverRadius;
          const eased = falloff * falloff * (3 - 2 * falloff);
          const target = eased * 0.68;
          if (target > 0.006) targets.set(`${col},${row}`, target);
        }
      }
    }

    for (const [key] of targets) {
      if (!cellOpacities.has(key)) cellOpacities.set(key, 0);
    }

    for (const [key, opacity] of cellOpacities) {
      const target = targets.get(key) || 0;
      const next = opacity + (target - opacity) * fadeSpeed;
      if (next < 0.002) cellOpacities.delete(key);
      else cellOpacities.set(key, next);
    }
  };

  const updateSpotlight = () => {
    if (reducedMotion) {
      spotlight.classList.remove('is-active');
      return;
    }

    spotlightPos.x += (spotlightTarget.x - spotlightPos.x) * spotlightLerp;
    spotlightPos.y += (spotlightTarget.y - spotlightPos.y) * spotlightLerp;
    spotlight.style.left = `${spotlightPos.x}px`;
    spotlight.style.top = `${spotlightPos.y}px`;

    if (mouse.inside) {
      spotlight.classList.add('is-active');
      spotlightReady = true;
    } else if (spotlightReady) {
      spotlight.classList.remove('is-active');
    }
  };

  const drawGrid = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const sx = col * squareSize;
        const sy = row * squareSize;
        const cellCx = sx + squareSize / 2;
        const cellCy = sy + squareSize / 2;
        const visibility = visibilityAt(cellCx, cellCy, width, height);
        const key = `${col},${row}`;
        const hoverAlpha = cellOpacities.get(key) || 0;

        if (hoverAlpha > 0) {
          ctx.globalAlpha = hoverAlpha * visibility;
          ctx.fillStyle = hoverFillColor;
          ctx.fillRect(sx + 0.5, sy + 0.5, squareSize - 1, squareSize - 1);
        }

        const lineAlpha = gridLineAlpha * visibility + hoverAlpha * hoverLineBoost;
        if (lineAlpha < 0.003) continue;

        ctx.globalAlpha = Math.min(lineAlpha, 0.086);
        ctx.strokeStyle = `rgba(${gridLineColor}, 1)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(sx + 0.5, sy + 0.5, squareSize - 1, squareSize - 1);
        ctx.globalAlpha = 1;
      }
    }
  };

  const tick = () => {
    updateCellOpacities();
    updateSpotlight();
    drawGrid();
    rafId = requestAnimationFrame(tick);
  };

  const onMouseMove = (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.inside = true;
    spotlightTarget.x = mouse.x;
    spotlightTarget.y = mouse.y;
  };

  const onMouseLeave = () => {
    mouse.inside = false;
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseleave', onMouseLeave);
  rafId = requestAnimationFrame(tick);

  return () => {
    window.removeEventListener('resize', resizeCanvas);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseleave', onMouseLeave);
    if (rafId) cancelAnimationFrame(rafId);
    wrapEl.replaceChildren();
  };
}
