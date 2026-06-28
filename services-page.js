import { SERVICES } from './services-page-data.js';

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
  events: `
    <div class="svc-art svc-art--events">
      <div class="svc-art__glow"></div>
      <div class="svc-art__calendar"><span class="svc-art__cal-head"></span><span class="svc-art__cal-grid"><i></i><i></i><i></i><i></i><i></i><i class="active"></i></span></div>
      <div class="svc-art__stage"><span class="svc-art__stage-light"></span><span class="svc-art__stage-light"></span></div>
    </div>`,
};

function buildCard(service, index) {
  const reverse = index % 2 === 1;
  const card = document.createElement('article');
  card.className = `svc-card svc-reveal${reverse ? ' svc-card--reverse' : ''}`;
  card.style.setProperty('--svc-accent', service.accent);
  card.style.setProperty('--svc-accent-rgb', service.accentRgb);
  card.style.transitionDelay = `${(index % 4) * 0.08}s`;
  card.dataset.service = service.id;

  const includesItems = service.includes
    .map((item) => `<li>${item}</li>`)
    .join('');

  card.innerHTML = `
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

  return card;
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
  initReveal(cards);
  initParallax(cards);
}
