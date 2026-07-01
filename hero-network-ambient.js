/**
 * Subtle ambient motion for the hero network SVG — orbit particles only.
 * CSS handles logo glow, ring shimmer, and node pulses (delayed via --hero-ambient-start).
 */
const AMBIENT_START_MS = 1000;
const PARTICLE_STAGGER_MS = 80;

export function initHeroNetworkAmbient(svg) {
  if (!svg || svg.dataset.ambientInit === 'true') return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const heroSection = svg.closest('.hero');
  const ambientStartMs = heroSection
    ? parseFloat(getComputedStyle(heroSection).getPropertyValue('--hero-ambient-start')) || AMBIENT_START_MS
    : AMBIENT_START_MS;
  const particleStaggerMs = heroSection
    ? parseFloat(getComputedStyle(heroSection).getPropertyValue('--hero-particle-stagger')) || PARTICLE_STAGGER_MS
    : PARTICLE_STAGGER_MS;

  const CX = 800;
  const CY = 800;
  const ORBIT_RADII = [188, 238, 279, 287, 337, 346];
  const PARTICLE_COUNT = 16;
  const NS = 'http://www.w3.org/2000/svg';

  let group = svg.querySelector('#orbit-particles');
  if (!group) {
    group = document.createElementNS(NS, 'g');
    group.setAttribute('id', 'orbit-particles');
    group.setAttribute('aria-hidden', 'true');
    const heroNetwork = svg.querySelector('#hero-network');
    const serviceCards = svg.querySelector('#service-cards');
    if (heroNetwork && serviceCards) {
      heroNetwork.insertBefore(group, serviceCards);
    } else {
      return;
    }
  }

  /** @type {{ el: SVGGElement, radius: number, angle: number, speed: number, releaseAt: number, live: boolean }[]} */
  const particles = [];
  const loadStart = performance.now();

  for (let i = 0; i < PARTICLE_COUNT; i += 1) {
    const wrap = document.createElementNS(NS, 'g');
    wrap.setAttribute('class', 'orbit-particle');

    const glow = document.createElementNS(NS, 'circle');
    glow.setAttribute('r', String(3.2 + Math.random() * 1.4));
    glow.setAttribute('fill', '#FF3049');
    glow.setAttribute('opacity', String(0.14 + Math.random() * 0.12));

    const core = document.createElementNS(NS, 'circle');
    core.setAttribute('r', String(1.1 + Math.random() * 0.7));
    core.setAttribute('fill', '#FF8A97');
    core.setAttribute('opacity', String(0.55 + Math.random() * 0.3));

    wrap.appendChild(glow);
    wrap.appendChild(core);
    group.appendChild(wrap);

    const angle = Math.random() * Math.PI * 2;
    const radius = ORBIT_RADII[i % ORBIT_RADII.length] + (Math.random() - 0.5) * 10;
    const x = CX + radius * Math.sin(angle);
    const y = CY - radius * Math.cos(angle);
    wrap.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);

    particles.push({
      el: wrap,
      radius,
      angle,
      speed: (0.09 + Math.random() * 0.09) * (Math.random() > 0.5 ? 1 : -1),
      releaseAt: ambientStartMs + i * particleStaggerMs,
      live: false,
    });
  }

  let rafId = 0;
  let inView = false;
  let lastTime = 0;

  function tick(now) {
    rafId = requestAnimationFrame(tick);
    if (!inView) return;

    const elapsed = now - loadStart;
    const dt = Math.min(48, now - lastTime) / 1000;
    lastTime = now;
    if (dt <= 0) return;

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];

      if (elapsed < p.releaseAt) {
        continue;
      }

      if (!p.live) {
        p.live = true;
        p.el.classList.add('is-live');
      }

      p.angle += p.speed * dt;
      const x = CX + p.radius * Math.sin(p.angle);
      const y = CY - p.radius * Math.cos(p.angle);
      p.el.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      inView = Boolean(entries[0]?.isIntersecting);
      if (inView) {
        lastTime = performance.now();
        if (!rafId) rafId = requestAnimationFrame(tick);
      }
    },
    { threshold: 0.08 },
  );

  observer.observe(svg);
  svg.dataset.ambientInit = 'true';

  inView = true;
  lastTime = performance.now();
  rafId = requestAnimationFrame(tick);

  return () => {
    observer.disconnect();
    if (rafId) cancelAnimationFrame(rafId);
  };
}
