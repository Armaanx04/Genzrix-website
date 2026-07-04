import {
  MULTI_PACKAGE_OVERVIEWS,
  MULTI_PACKAGE_MATRIX,
  MULTI_PACKAGE_FOOTNOTE,
} from './services-multi-packages-data.js';

const TRANSITION_MS = 450;

function formatCellValue(value) {
  if (value === '✓') {
    return '<span class="multi-packages-compare__mark multi-packages-compare__mark--yes" aria-label="Included">✓</span>';
  }
  if (value === '—') {
    return '<span class="multi-packages-compare__mark multi-packages-compare__mark--no" aria-label="Not included">—</span>';
  }
  return value;
}

function buildOverviewCard(pkg) {
  const featured = pkg.featured ? ' package-card--featured' : '';
  const badge = pkg.featured
    ? '<span class="services-packages__badge">Most Popular</span>'
    : '';
  const items = pkg.highlights.map((item) => `<li>${item}</li>`).join('');

  return `
    <article class="package-card services-packages__card${featured}" data-package-tier="${pkg.id}">
      ${badge}
      <span class="services-packages__tier section-label">${pkg.tier}</span>
      <h3>${pkg.title}</h3>
      <p class="package-tagline">${pkg.tagline}</p>
      <hr class="services-packages__divider" />
      <ul class="services-packages__list">${items}</ul>
      <button
        type="button"
        class="btn-primary services-packages__cta multi-packages__compare-trigger"
        data-compare-tier="${pkg.id}"
        aria-expanded="false"
        aria-controls="multi-packages-compare"
      >View Full Comparison →</button>
    </article>
  `;
}

function buildMatrixRows() {
  return MULTI_PACKAGE_MATRIX.map(
    (section) => `
    <div class="multi-packages-compare__group" role="rowgroup">
      <div class="multi-packages-compare__group-label" role="row">
        <span class="multi-packages-compare__group-name" role="rowheader">${section.group}</span>
      </div>
      ${section.rows
        .map(
          (row) => `
      <div class="multi-packages-compare__row" role="row">
        <span class="multi-packages-compare__feature" role="rowheader">${row.feature}</span>
        <span class="multi-packages-compare__val" data-tier-col="lite" role="cell">${formatCellValue(row.lite)}</span>
        <span class="multi-packages-compare__val" data-tier-col="pro" role="cell">${formatCellValue(row.pro)}</span>
        <span class="multi-packages-compare__val" data-tier-col="max" role="cell">${formatCellValue(row.max)}</span>
      </div>`,
        )
        .join('')}
    </div>`,
  ).join('');
}

function buildComparePanel() {
  return `
    <div
      class="multi-packages-compare"
      id="multi-packages-compare"
      data-multi-packages-compare
      hidden
      aria-hidden="true"
    >
      <div class="multi-packages-compare__inner">
        <header class="multi-packages-compare__header">
          <div class="multi-packages-compare__heading">
            <h3 class="multi-packages-compare__title">Compare every capability</h3>
            <p class="multi-packages-compare__subtitle">See what's included in each package.</p>
          </div>
          <button type="button" class="multi-packages-compare__collapse" data-compare-collapse>
            Hide Comparison <span aria-hidden="true">↑</span>
          </button>
        </header>
        <div class="multi-packages-compare__shell-wrap">
          <div class="multi-packages-compare__shell" role="table" aria-label="Lite, Pro, and Max package comparison">
            <div class="multi-packages-compare__head">
              <div class="multi-packages-compare__row multi-packages-compare__row--head" role="row">
                <span class="multi-packages-compare__feature" role="columnheader">Capability</span>
                <span class="multi-packages-compare__tier" data-tier-col="lite" role="columnheader">Lite</span>
                <span class="multi-packages-compare__tier" data-tier-col="pro" role="columnheader">Pro</span>
                <span class="multi-packages-compare__tier" data-tier-col="max" role="columnheader">Max</span>
              </div>
            </div>
            <div class="multi-packages-compare__body">
              ${buildMatrixRows()}
            </div>
          </div>
        </div>
        <p class="multi-packages-compare__footnote">${MULTI_PACKAGE_FOOTNOTE}</p>
      </div>
    </div>
  `;
}

function setColumnEmphasis(panel, tier) {
  panel.querySelectorAll('[data-tier-col]').forEach((el) => {
    el.classList.toggle('is-active-col', el.dataset.tierCol === tier);
  });
}

function setTriggerStates(triggers, isOpen, activeTier) {
  triggers.forEach((btn) => {
    const tier = btn.dataset.compareTier;
    btn.setAttribute('aria-expanded', isOpen && tier === activeTier ? 'true' : 'false');
  });
}

export function initMultiServicePackages() {
  const cardsMount = document.querySelector('[data-multi-packages-cards]');
  const compareMount = document.querySelector('[data-multi-packages-compare-mount]');
  if (!cardsMount || !compareMount) return;

  cardsMount.innerHTML = MULTI_PACKAGE_OVERVIEWS.map(buildOverviewCard).join('');
  cardsMount.removeAttribute('aria-busy');
  compareMount.innerHTML = buildComparePanel();

  const panel = compareMount.querySelector('[data-multi-packages-compare]');
  const collapseBtn = panel.querySelector('[data-compare-collapse]');
  const triggers = cardsMount.querySelectorAll('[data-compare-tier]');

  let activeTier = null;
  let isOpen = false;
  let isTransitioning = false;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const openCompare = (tier) => {
    if (isTransitioning) return;

    activeTier = tier;
    const wasOpen = isOpen;
    isOpen = true;

    panel.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
    setColumnEmphasis(panel, tier);
    setTriggerStates(triggers, true, tier);

    if (!wasOpen) {
      isTransitioning = true;
      requestAnimationFrame(() => {
        panel.classList.add('is-open');
        window.setTimeout(() => {
          isTransitioning = false;
        }, reducedMotion ? 0 : TRANSITION_MS);
      });
    }
  };

  const closeCompare = () => {
    if (isTransitioning || !isOpen) return;

    isTransitioning = true;
    panel.classList.remove('is-open');
    setTriggerStates(triggers, false, activeTier);

    const finish = () => {
      isOpen = false;
      isTransitioning = false;
      panel.hidden = true;
      panel.setAttribute('aria-hidden', 'true');
    };

    if (reducedMotion) {
      finish();
      return;
    }

    window.setTimeout(finish, TRANSITION_MS);
  };

  triggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      openCompare(btn.dataset.compareTier);
    });
  });

  collapseBtn.addEventListener('click', closeCompare);

  panel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      closeCompare();
      const activeTrigger = cardsMount.querySelector(`[data-compare-tier="${activeTier}"]`);
      activeTrigger?.focus({ preventScroll: true });
    }
  });
}
