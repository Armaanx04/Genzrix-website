import { SERVICES, SERVICE_PACKAGES } from './services-page-data.js';

const ART = {
  design: `
    <div class="svc-art svc-art--design">
      <div class="svc-art__glow"></div>
      <div class="svc-art__device svc-art__laptop">
        <div class="svc-art__laptop-lid">
          <span class="svc-art__ui-bar"></span>
          <span class="svc-art__ui-line svc-art__ui-line--lg"></span>
          <span class="svc-art__ui-line"></span>
          <span class="svc-art__ui-chip"></span>
          <span class="svc-art__ui-label">UI/UX</span>
        </div>
        <div class="svc-art__laptop-base"></div>
      </div>
      <div class="svc-art__pen"></div>
    </div>`,
  dev: `
    <div class="svc-art svc-art--dev">
      <div class="svc-art__glow"></div>
      <div class="svc-art__device svc-art__editor">
        <div class="svc-art__editor-tabs"><i></i><i></i><i></i></div>
        <div class="svc-art__code"><span></span><span></span><span class="short"></span></div>
        <div class="svc-art__bracket">{ /&gt;</div>
      </div>
      <div class="svc-art__terminal"><em>$</em> npm run build</div>
    </div>`,
  branding: `
    <div class="svc-art svc-art--branding">
      <div class="svc-art__glow"></div>
      <div class="svc-art__letter">A</div>
      <div class="svc-art__swatch svc-art__swatch--1"></div>
      <div class="svc-art__swatch svc-art__swatch--2"></div>
      <div class="svc-art__swatch svc-art__swatch--3"></div>
    </div>`,
  marketing: `
    <div class="svc-art svc-art--marketing">
      <div class="svc-art__glow"></div>
      <div class="svc-art__dash">
        <span class="svc-art__metric">+24%</span>
        <div class="svc-art__bars"><i></i><i></i><i></i><i></i></div>
        <svg class="svc-art__chart" viewBox="0 0 120 48" aria-hidden="true"><path d="M4 38 L28 28 L48 32 L72 16 L96 10 L116 6" fill="none" stroke="currentColor" stroke-width="2"/></svg>
      </div>
      <div class="svc-art__megaphone"></div>
    </div>`,
  ecommerce: `
    <div class="svc-art svc-art--ecommerce">
      <div class="svc-art__glow"></div>
      <div class="svc-art__cart"><span class="svc-art__cart-body"></span><span class="svc-art__cart-wheel"></span><span class="svc-art__cart-wheel"></span></div>
      <div class="svc-art__phone"><span class="svc-art__pay">PAY</span></div>
    </div>`,
  app: `
    <div class="svc-art svc-art--app">
      <div class="svc-art__glow"></div>
      <div class="svc-art__phone svc-art__phone--back"></div>
      <div class="svc-art__phone svc-art__phone--front"><span></span><span></span><span class="svc-art__app-dot"></span></div>
      <div class="svc-art__float-icon svc-art__float-icon--1"></div>
      <div class="svc-art__float-icon svc-art__float-icon--2"></div>
    </div>`,
  content: `
    <div class="svc-art svc-art--content">
      <div class="svc-art__glow"></div>
      <div class="svc-art__camera"><span class="svc-art__lens"></span></div>
      <div class="svc-art__player"><span class="svc-art__play"></span><span class="svc-art__wave"></span></div>
    </div>`,
  analytics: `
    <div class="svc-art svc-art--analytics">
      <div class="svc-art__glow"></div>
      <div class="svc-art__dash">
        <span class="svc-art__metric">+32%</span>
        <div class="svc-art__bars"><i></i><i></i><i></i><i></i></div>
        <svg class="svc-art__chart" viewBox="0 0 120 48" aria-hidden="true"><path d="M4 38 L28 28 L48 32 L72 16 L96 10 L116 6" fill="none" stroke="currentColor" stroke-width="2"/></svg>
      </div>
      <div class="svc-art__pie"></div>
    </div>`,
  events: `
    <div class="svc-art svc-art--events">
      <div class="svc-art__glow"></div>
      <div class="svc-art__calendar"><span class="svc-art__cal-head"></span><span class="svc-art__cal-grid"><i></i><i></i><i></i><i></i><i></i><i class="active"></i></span></div>
      <div class="svc-art__stage"><span class="svc-art__stage-light"></span><span class="svc-art__stage-light"></span></div>
    </div>`,
};

const PKG_TRANSITION_MS = 500;

function formatPackageValue(value) {
  if (value === '✓') {
    return '<span class="svc-pkg__mark svc-pkg__mark--yes" aria-label="Included">✓</span>';
  }
  if (value === '—') {
    return '<span class="svc-pkg__mark svc-pkg__mark--no" aria-label="Not included">—</span>';
  }
  return value;
}

function buildOverviewInner(service) {
  const includesItems = service.includes
    .map((item) => `<li>${item}</li>`)
    .join('');

  return `
    <div class="svc-card__num" aria-hidden="true">${service.num}</div>
    <div class="svc-card__main">
      <div class="svc-card__head">
        <div class="svc-card__icon">${service.icon}</div>
        <div class="svc-card__copy">
          <h3>${service.title}</h3>
          <p class="svc-card__desc">${service.description}</p>
        </div>
      </div>
    </div>
    <div class="svc-card__includes">
      <span class="svc-card__includes-label">What's Included</span>
      <ul class="svc-card__list">${includesItems}</ul>
    </div>
    <div class="svc-card__art" data-svc-art-parallax>${ART[service.art] || ''}</div>
  `;
}

function buildPackagePanelHTML(packages) {
  const tierHeaders = packages.tiers
    .map((tier) => `<span class="svc-pkg__tier" role="columnheader">${tier}</span>`)
    .join('');

  const rows = packages.rows
    .map(
      (row) => `
    <div class="svc-pkg__row" role="row">
      <span class="svc-pkg__feature" role="rowheader">${row.feature}</span>
      <span class="svc-pkg__val" role="cell">${formatPackageValue(row.core)}</span>
      <span class="svc-pkg__val" role="cell">${formatPackageValue(row.prime)}</span>
      <span class="svc-pkg__val" role="cell">${formatPackageValue(row.elite)}</span>
    </div>`,
    )
    .join('');

  const footnoteHtml = packages.footnote
    ? `<p class="svc-pkg__footnote">${packages.footnote}</p>`
    : '';

  return `
    <header class="svc-pkg__header">
      <button type="button" class="svc-pkg__back" data-svc-back>
        <span class="svc-pkg__back-arrow" aria-hidden="true">←</span> Back to Service
      </button>
      <div class="svc-pkg__title-block">
        <h3 class="svc-pkg__title">${packages.title}</h3>
        <p class="svc-pkg__subtitle">${packages.subtitle}</p>
      </div>
    </header>
    <div class="svc-pkg__compare-wrap">
      <div class="svc-pkg__compare-shell" role="table" aria-label="${packages.title} comparison">
        <div class="svc-pkg__compare-head">
          <div class="svc-pkg__row svc-pkg__row--head" role="row">
            <span class="svc-pkg__feature" role="columnheader">Service / Feature</span>
            ${tierHeaders}
          </div>
        </div>
        <div class="svc-pkg__compare-body" tabindex="0" aria-label="Package feature rows">
          ${rows}
        </div>
      </div>
    </div>
    <footer class="svc-pkg__footer">
      ${footnoteHtml}
      <a href="contact.html" class="svc-pkg__discuss">Discuss This Package →</a>
    </footer>
  `;
}

function buildCard(service, index) {
  const reverse = index % 2 === 1;
  const packages = SERVICE_PACKAGES[service.id];
  const card = document.createElement('article');
  card.className = `svc-card svc-reveal${reverse ? ' svc-card--reverse' : ''}${packages ? ' svc-card--has-packages' : ''}`;
  card.style.setProperty('--svc-accent', service.accent);
  card.style.setProperty('--svc-accent-rgb', service.accentRgb);
  card.style.transitionDelay = `${(index % 4) * 0.08}s`;
  card.dataset.service = service.id;

  if (packages) {
    card.innerHTML = `
      <div class="svc-card__state-viewport" data-svc-viewport>
        <div class="svc-card__state-track" data-svc-state-track data-state="overview">
          <div class="svc-card__panel svc-card__panel--overview${reverse ? ' svc-card__panel--reverse' : ''}" data-svc-panel="overview">
            ${buildOverviewInner(service)}
            <button type="button" class="svc-card__explore" data-svc-explore>
              Explore Packages <span class="svc-card__explore-arrow" aria-hidden="true">→</span>
            </button>
          </div>
          <div class="svc-card__panel svc-card__panel--packages" data-svc-panel="packages" aria-hidden="true" inert>
            ${buildPackagePanelHTML(packages)}
          </div>
        </div>
      </div>
    `;
    return card;
  }

  card.innerHTML = buildOverviewInner(service);
  return card;
}

function setPanelAccessibility(card, state) {
  const overview = card.querySelector('[data-svc-panel="overview"]');
  const packages = card.querySelector('[data-svc-panel="packages"]');
  const explore = card.querySelector('[data-svc-explore]');
  if (!overview || !packages) return;

  const isPackages = state === 'packages';

  overview.toggleAttribute('inert', isPackages);
  overview.setAttribute('aria-hidden', isPackages ? 'true' : 'false');

  packages.toggleAttribute('inert', !isPackages);
  packages.setAttribute('aria-hidden', isPackages ? 'false' : 'true');

  if (explore) {
    explore.tabIndex = isPackages ? -1 : 0;
  }
}

function initPackagePanel(card) {
  const track = card.querySelector('[data-svc-state-track]');
  const exploreBtn = card.querySelector('[data-svc-explore]');
  const backBtn = card.querySelector('[data-svc-back]');
  if (!track || !exploreBtn || !backBtn) return;

  let isTransitioning = false;
  let currentState = 'overview';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const applyState = (nextState, { focusTarget } = {}) => {
    if (isTransitioning || currentState === nextState) return;

    isTransitioning = true;
    track.dataset.state = nextState;
    card.classList.toggle('is-package-open', nextState === 'packages');
    setPanelAccessibility(card, nextState);

    const finish = () => {
      currentState = nextState;
      isTransitioning = false;
      if (focusTarget) focusTarget.focus({ preventScroll: true });
    };

    if (reducedMotion) {
      finish();
      return;
    }

    window.setTimeout(finish, PKG_TRANSITION_MS);
  };

  exploreBtn.addEventListener('click', () => {
    applyState('packages', { focusTarget: backBtn });
  });

  backBtn.addEventListener('click', () => {
    applyState('overview', { focusTarget: exploreBtn });
  });

  setPanelAccessibility(card, 'overview');
}

function initReveal(cards) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    cards.forEach((c) => c.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' },
  );

  cards.forEach((card) => observer.observe(card));
}

function initParallax(cards) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const arts = cards.map((c) => c.querySelector('[data-svc-art-parallax]')).filter(Boolean);
  if (!arts.length) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    arts.forEach((art) => {
      const card = art.closest('.svc-card');
      if (card?.classList.contains('is-package-open')) return;

      const rect = art.getBoundingClientRect();
      const center = rect.top + rect.height * 0.5;
      const dist = (center - vh * 0.5) / vh;
      const offset = Math.max(-12, Math.min(12, dist * -18));
      art.style.setProperty('--svc-parallax-y', `${offset}px`);
    });
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
}

export function initServicesPage() {
  const mount = document.querySelector('[data-svc-catalog]');
  if (!mount) return;

  const fragment = document.createDocumentFragment();
  const cards = SERVICES.map((service, index) => {
    const card = buildCard(service, index);
    fragment.appendChild(card);
    return card;
  });

  mount.appendChild(fragment);
  mount.removeAttribute('aria-busy');

  cards
    .filter((card) => card.classList.contains('svc-card--has-packages'))
    .forEach((card) => initPackagePanel(card));

  initReveal(cards);
  initParallax(cards);
}
