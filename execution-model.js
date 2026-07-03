/**
 * Execution Model — one-time executive story (no loop).
 */

const FLOW = [1, 2, 3, 4, 5, 6];

const HEADER_STAGGER_MS = 120;
const CARD_FADE_MS = 500;
const READING_PAUSE_MS = 500;
const CONNECT_TRAVEL_MS = 700;
const CONNECT_PAUSE_MS = 250;

/** Services page fade easing (CSS `ease`). */
const easePresentation = (t) => (
  t < 0.5
    ? 4 * t * t * t
    : 1 - ((-2 * t + 2) ** 3) / 2
);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const prefersReducedMotion = () => (
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
);

function revealEl(el) {
  if (!el) return;
  el.classList.add('is-visible');
}

function markComplete(card) {
  if (!card) return;
  card.classList.add('is-visible', 'is-complete');
}

function getCard(cards, step) {
  return cards.find((c) => Number(c.dataset.step) === step);
}

function getEdgePoint(rect, edge, rootRect, offset = 2) {
  const left = rect.left - rootRect.left;
  const top = rect.top - rootRect.top;
  const w = rect.width;
  const h = rect.height;

  switch (edge) {
    case 'left':
      return { x: left - offset, y: top + h / 2 };
    case 'right':
      return { x: left + w + offset, y: top + h / 2 };
    case 'top':
      return { x: left + w / 2, y: top - offset };
    case 'bottom':
      return { x: left + w / 2, y: top + h + offset };
    default:
      return { x: left + w / 2, y: top + h / 2 };
  }
}

function getConnectionEdges(fromRect, toRect) {
  const fromCx = fromRect.left + fromRect.width / 2;
  const fromCy = fromRect.top + fromRect.height / 2;
  const toCx = toRect.left + toRect.width / 2;
  const toCy = toRect.top + toRect.height / 2;
  const dx = toCx - fromCx;
  const dy = toCy - fromCy;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx > 0
      ? { fromEdge: 'right', toEdge: 'left' }
      : { fromEdge: 'left', toEdge: 'right' };
  }

  return dy > 0
    ? { fromEdge: 'bottom', toEdge: 'top' }
    : { fromEdge: 'top', toEdge: 'bottom' };
}

function resetConnection(section, beam, nodeFrom, nodeTo) {
  if (beam) {
    beam.style.opacity = '0';
    beam.setAttribute('x1', '0');
    beam.setAttribute('y1', '0');
    beam.setAttribute('x2', '0');
    beam.setAttribute('y2', '0');
  }

  if (nodeFrom) nodeFrom.style.opacity = '0';
  if (nodeTo) nodeTo.style.opacity = '0';
  section.classList.remove('is-connecting');
}

function showNodes(nodeFrom, nodeTo, fromPt, toPt) {
  if (nodeFrom) {
    nodeFrom.setAttribute('cx', String(fromPt.x));
    nodeFrom.setAttribute('cy', String(fromPt.y));
    nodeFrom.style.opacity = '0.55';
  }
  if (nodeTo) {
    nodeTo.setAttribute('cx', String(toPt.x));
    nodeTo.setAttribute('cy', String(toPt.y));
    nodeTo.style.opacity = '0.35';
  }
}

function animateConnection(section, beam, svg, nodeFrom, nodeTo, fromPt, toPt) {
  return new Promise((resolve) => {
    if (!beam || !svg) {
      resolve();
      return;
    }

    section.classList.add('is-connecting');
    showNodes(nodeFrom, nodeTo, fromPt, toPt);

    const grad = svg.querySelector('#emBeamGrad');
    if (grad) {
      grad.setAttribute('x1', String(fromPt.x));
      grad.setAttribute('y1', String(fromPt.y));
      grad.setAttribute('x2', String(toPt.x));
      grad.setAttribute('y2', String(toPt.y));
    }

    beam.setAttribute('x1', String(fromPt.x));
    beam.setAttribute('y1', String(fromPt.y));
    beam.setAttribute('x2', String(fromPt.x));
    beam.setAttribute('y2', String(fromPt.y));

    const dx = toPt.x - fromPt.x;
    const dy = toPt.y - fromPt.y;
    const len = Math.hypot(dx, dy) || 1;

    beam.style.opacity = '0.52';
    beam.style.strokeDasharray = `${len}`;
    beam.style.strokeDashoffset = `${len}`;

    if (nodeTo) nodeTo.style.opacity = '0.35';

    const t0 = performance.now();

    const tick = (now) => {
      const t = Math.min((now - t0) / CONNECT_TRAVEL_MS, 1);
      const e = easePresentation(t);
      const x = fromPt.x + dx * e;
      const y = fromPt.y + dy * e;

      beam.setAttribute('x2', String(x));
      beam.setAttribute('y2', String(y));
      beam.style.strokeDashoffset = `${len * (1 - e)}`;

      if (nodeTo && t > 0.85) {
        nodeTo.style.opacity = String(0.35 + (t - 0.85) / 0.15 * 0.25);
      }

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        if (nodeTo) nodeTo.style.opacity = '0.55';
        resolve();
      }
    };

    requestAnimationFrame(tick);
  });
}

async function runHeaderIntro(section) {
  const headerReveals = section.querySelectorAll('.execution-model-header [data-em-reveal]');
  for (const el of headerReveals) {
    revealEl(el);
    await wait(HEADER_STAGGER_MS);
  }

  const hub = section.querySelector('.execution-model-hub[data-em-reveal]');
  revealEl(hub);
  await wait(CARD_FADE_MS);
}

async function runStory(section, cards, beam, svg, nodeFrom, nodeTo) {
  const dashboard = section.querySelector('[data-em-dashboard]');

  const first = getCard(cards, 1);
  revealEl(first);
  await wait(CARD_FADE_MS);
  markComplete(first);
  await wait(READING_PAUSE_MS);

  for (let i = 0; i < FLOW.length - 1; i += 1) {
    const fromStep = FLOW[i];
    const toStep = FLOW[i + 1];
    const fromCard = getCard(cards, fromStep);
    const toCard = getCard(cards, toStep);
    if (!fromCard || !toCard) continue;

    const boardRect = dashboard.getBoundingClientRect();
    const fromRect = fromCard.getBoundingClientRect();
    const toRect = toCard.getBoundingClientRect();
    const { fromEdge, toEdge } = getConnectionEdges(fromRect, toRect);
    const fromPt = getEdgePoint(fromRect, fromEdge, boardRect);
    const toPt = getEdgePoint(toRect, toEdge, boardRect);

    await animateConnection(section, beam, svg, nodeFrom, nodeTo, fromPt, toPt);
    await wait(CONNECT_PAUSE_MS);
    resetConnection(section, beam, nodeFrom, nodeTo);

    revealEl(toCard);
    await wait(CARD_FADE_MS);
    markComplete(toCard);
    await wait(READING_PAUSE_MS);
  }

  resetConnection(section, beam, nodeFrom, nodeTo);
  section.classList.add('is-story-complete');
  section.dataset.emStoryComplete = 'true';
}

function showCompletedState(section, cards) {
  section.classList.add('is-ready', 'is-story-complete', 'is-static');
  section.dataset.emStoryComplete = 'true';

  section.querySelectorAll('[data-em-reveal]').forEach((el) => revealEl(el));
  cards.forEach((card) => markComplete(card));
}

export function initExecutionModel(section) {
  if (!section || section.dataset.emInit === 'true') return;
  section.dataset.emInit = 'true';

  const cards = [...section.querySelectorAll('.execution-model-card')];
  const beam = section.querySelector('[data-em-beam]');
  const svg = section.querySelector('[data-em-beams]');
  const nodeFrom = section.querySelector('[data-em-node-from]');
  const nodeTo = section.querySelector('[data-em-node-to]');
  const reduced = prefersReducedMotion();

  if (section.dataset.emStoryComplete === 'true') {
    showCompletedState(section, cards);
    return;
  }

  if (reduced) {
    showCompletedState(section, cards);
    return;
  }

  const start = async () => {
    if (section.dataset.emStoryStarted === 'true') return;
    section.dataset.emStoryStarted = 'true';
    section.classList.add('is-ready');

    await runHeaderIntro(section);
    await runStory(section, cards, beam, svg, nodeFrom, nodeTo);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      if (section.dataset.emStoryComplete === 'true') {
        showCompletedState(section, cards);
        observer.unobserve(section);
        return;
      }

      start();
      observer.unobserve(section);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -48px 0px' });

  observer.observe(section);
}

export async function mountExecutionModel() {
  const mount = document.querySelector('[data-execution-model-mount]');
  if (!mount) return;

  try {
    const res = await fetch('/partials/execution-model.html');
    if (!res.ok) throw new Error(`Failed to load execution model (${res.status})`);
    mount.innerHTML = await res.text();
    mount.removeAttribute('aria-busy');
    const section = mount.closest('[data-execution-model]');
    if (section) initExecutionModel(section);
  } catch (err) {
    console.error('[Execution Model] Mount failed:', err);
    mount.removeAttribute('aria-busy');
  }
}
