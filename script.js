/* ============================================================
   GENZRIX V3 — SHARED SCRIPT
   ============================================================ */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}


/* ── Category SVG icons for portfolio cards ── */
const categoryIcons = {
  design: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#4F7BFF" stroke-width="1.5"><rect x="6" y="8" width="36" height="28" rx="2"/><circle cx="16" cy="20" r="5"/><path d="M6 28 l10-8 8 7 6-5 12 10"/></svg>`,
  development: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#0EA5E9" stroke-width="1.5"><polyline points="18,36 6,24 18,12"/><polyline points="30,12 42,24 30,36"/><line x1="22" y1="36" x2="26" y2="12"/></svg>`,
  marketing: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#F97316" stroke-width="1.5"><path d="M6 36 L14 20 L22 28 L32 12 L42 18"/><circle cx="42" cy="18" r="3" fill="#F97316" stroke="none"/></svg>`,
  events: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#F59E0B" stroke-width="1.5"><rect x="6" y="10" width="36" height="28" rx="2"/><path d="M6 18 h36"/><circle cx="14" cy="14" r="2" fill="#F59E0B" stroke="none"/><circle cx="20" cy="14" r="2" fill="#F59E0B" stroke="none"/></svg>`,
};

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAV SCROLL EFFECT ── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── HAMBURGER MENU ── */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── ACTIVE NAV LINK ── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── SCROLL ANIMATIONS ── */
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  const observeFadeUps = (root = document) => {
    root.querySelectorAll('.fade-up:not(.visible)').forEach(el => fadeObserver.observe(el));
  };

  observeFadeUps();

  /* ── HERO WORD STAGGER ── */
  document.querySelectorAll('.hero-word').forEach((word, i) => {
    word.style.animationDelay = `${0.25 + i * 0.1}s`;
  });

  /* ── ANIMATED COUNTERS ── */
  const statEls = document.querySelectorAll('.stat-count');
  if (statEls.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = target >= 1000
            ? Math.floor(current).toLocaleString()
            : Math.floor(current);
          if (current >= target) clearInterval(timer);
        }, 16);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => counterObserver.observe(el));
  }

  /* ── FAQ ACCORDION ── */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(open => open.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── SKELETON LOADERS for portfolio ── */
  function showSkeletons(container, count = 3) {
    container.innerHTML = Array(count).fill('').map(() => `
      <div class="skeleton-card">
        <div class="skeleton skeleton-rect" style="margin-bottom:16px;"></div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text" style="width:70%;"></div>
      </div>
    `).join('');
  }

  /* ── CONTACT FORM → Supabase ── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const statusEl = document.getElementById('contact-status');
      const btn = contactForm.querySelector('[type="submit"]');
      const btnText = btn.querySelector('.btn-text');
      const btnLoading = btn.querySelector('.btn-loading');

      const name    = contactForm.querySelector('#contact-name').value.trim();
      const email   = contactForm.querySelector('#contact-email').value.trim();
      const phone   = contactForm.querySelector('#contact-phone')?.value.trim() || '';
      const company = contactForm.querySelector('#contact-company').value.trim();
      const message = contactForm.querySelector('#contact-message').value.trim();
      const checkedServices = [...contactForm.querySelectorAll('input[name="services"]:checked')].map(cb => cb.value);

      statusEl.className = 'form-status';

      if (!name || !email || !message) {
        statusEl.textContent = 'Please fill in your name, email, and message.';
        statusEl.className = 'form-status error';
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        statusEl.textContent = 'Please enter a valid email address.';
        statusEl.className = 'form-status error';
        return;
      }

      if (checkedServices.length === 0) {
        statusEl.textContent = 'Please select at least one service.';
        statusEl.className = 'form-status error';
        return;
      }

      btn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnLoading) btnLoading.style.display = 'inline-flex';

      const { error } = await supabase.from('contacts').insert([{
        name,
        email,
        phone,
        company,
        services: checkedServices,
        message,
      }]);

      btn.disabled = false;
      if (btnText) btnText.style.display = '';
      if (btnLoading) btnLoading.style.display = 'none';

      if (error) {
        statusEl.textContent = 'Something went wrong. Please try again or email us directly.';
        statusEl.className = 'form-status error';
      } else {
        statusEl.textContent = 'Thank you. Our team will contact you shortly.';
        statusEl.className = 'form-status success';
        contactForm.reset();
        setTimeout(() => { statusEl.className = 'form-status'; }, 8000);
      }
    });
  }

  /* ── APPLICATION FORM → Supabase ── */
  const appForm = document.getElementById('application-form');
  if (appForm) {
    appForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const statusEl = document.getElementById('application-status');
      const btn = appForm.querySelector('[type="submit"]');
      const originalText = btn.textContent;

      const name          = appForm.querySelector('#app-name').value.trim();
      const email         = appForm.querySelector('#app-email').value.trim();
      const portfolio_url = appForm.querySelector('#app-portfolio').value.trim();
      const why_genzrix   = appForm.querySelector('#app-why').value.trim();
      const checkedDomains = [...appForm.querySelectorAll('input[name="domains"]:checked')].map(cb => cb.value);

      statusEl.className = 'form-status';

      if (!name || !email || !why_genzrix) {
        statusEl.textContent = 'Please fill in your name, email, and why GenZrix.';
        statusEl.className = 'form-status error';
        return;
      }

      if (checkedDomains.length === 0) {
        statusEl.textContent = 'Please select at least one domain.';
        statusEl.className = 'form-status error';
        return;
      }

      btn.textContent = 'Submitting...';
      btn.disabled = true;

      const { error } = await supabase.from('applications').insert([{
        name,
        email,
        domains: checkedDomains,
        portfolio_url,
        why_genzrix,
      }]);

      btn.disabled = false;
      btn.textContent = originalText;

      if (error) {
        statusEl.textContent = 'Something went wrong. Please try again.';
        statusEl.className = 'form-status error';
      } else {
        statusEl.textContent = 'Application submitted. We\'ll review it and get back to you soon.';
        statusEl.className = 'form-status success';
        appForm.reset();
        setTimeout(() => { statusEl.className = 'form-status'; }, 8000);
      }
    });
  }

  /* ── LOAD PORTFOLIO FROM SUPABASE ── */
  const portfolioGrid = document.getElementById('portfolio-grid');
  if (portfolioGrid) {
    showSkeletons(portfolioGrid, 6);
    loadProjects();
  }

  async function loadProjects() {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error || !projects || projects.length === 0) {
      portfolioGrid.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:80px 0;">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="rgba(11,31,75,0.2)" stroke-width="1.5" style="margin:0 auto 16px;">
            <rect x="6" y="8" width="36" height="28" rx="2"/>
            <circle cx="16" cy="20" r="5"/>
            <path d="M6 28 l10-8 8 7 6-5 12 10"/>
          </svg>
          <p style="color:var(--muted); font-size:15px;">Projects will be showcased here as we complete them. Check back soon.</p>
        </div>`;
      return;
    }

    portfolioGrid.innerHTML = '';
    projects.forEach((project, i) => {
      const card = document.createElement('article');
      card.className = 'portfolio-card fade-up';
      card.dataset.category = project.category;
      card.style.transitionDelay = `${(i % 3) * 0.1}s`;

      const iconSvg = categoryIcons[project.category] || categoryIcons.design;
      const imageContent = project.image_url
        ? `<img src="${project.image_url}" alt="${project.title}" loading="lazy" />`
        : `<div class="portfolio-img-placeholder">${iconSvg}</div>`;

      const categoryLabel = project.category.charAt(0).toUpperCase() + project.category.slice(1);

      card.innerHTML = `
        <div class="portfolio-img">${imageContent}</div>
        <div class="portfolio-info">
          <span class="portfolio-tag">${categoryLabel}</span>
          <h4>${project.title}</h4>
          <p>${project.description}</p>
        </div>
      `;
      portfolioGrid.appendChild(card);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    portfolioGrid.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  }

  /* ── SERVICES SHOWCASE (scroll-driven) ── */
  function initServicesShowcase(scrollRoot) {
    const serviceShowcase = scrollRoot.querySelector('[data-service-showcase]');
    if (!serviceShowcase) return;

    const pinEl = scrollRoot.querySelector('.services-showcase-pin');
    const tabs = [...serviceShowcase.querySelectorAll('[role="tab"]')];
    const panels = [...serviceShowcase.querySelectorAll('[role="tabpanel"]')];
    const card = serviceShowcase.querySelector('.services-showcase-card');
    const counterEl = serviceShowcase.querySelector('[data-service-counter]');
    const indexEl = serviceShowcase.querySelector('[data-service-index]');
    const panelsWrap = serviceShowcase.querySelector('.services-showcase-panels');
    let currentIndex = 0;
    let scrollTicking = false;
    const DURATION = 550;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const STEP_VH = reducedMotion ? 0.5 : 1;

    const getStepHeight = () => window.innerHeight * STEP_VH;

    const syncPanelHeight = () => {
      const maxHeight = panels.reduce((max, panel) => Math.max(max, panel.offsetHeight), 380);
      panelsWrap.style.minHeight = `${maxHeight + 72}px`;
    };

    const getRootTop = () => scrollRoot.getBoundingClientRect().top + window.scrollY;

    const updateScrollHeight = () => {
      syncPanelHeight();
      const pinHeight = pinEl.offsetHeight;
      const stepHeight = getStepHeight();
      const scrollDistance = Math.max(0, (panels.length - 1) * stepHeight);
      scrollRoot.style.height = `${pinHeight + scrollDistance}px`;
    };

    const getIndexFromScroll = () => {
      const rootTop = getRootTop();
      const scrolled = window.scrollY - rootTop;
      const stepHeight = getStepHeight();
      const maxIndex = panels.length - 1;

      if (scrolled <= 0) return 0;
      if (scrolled >= maxIndex * stepHeight) return maxIndex;

      return Math.min(maxIndex, Math.floor(scrolled / stepHeight));
    };

    const activateTab = (index) => {
      tabs.forEach((tab, i) => {
        const isActive = i === index;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.tabIndex = isActive ? 0 : -1;
      });

      const activeTab = tabs[index];
      if (activeTab) {
        const tabsWrap = activeTab.closest('.services-showcase-tabs');
        if (tabsWrap) {
          const tabRect = activeTab.getBoundingClientRect();
          const wrapRect = tabsWrap.getBoundingClientRect();
          if (tabRect.left < wrapRect.left || tabRect.right > wrapRect.right) {
            activeTab.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
          }
        }
      }
    };

    const restartPanelVisuals = (panel) => {
      if (reducedMotion || !panel) return;
      const animated = panel.querySelectorAll(
        '.sv-chart-line, .sv-glow-path, .sv-roadmap-fill, .sv-timeline-progress'
      );
      animated.forEach((el) => {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
      });
    };

    const updateVisualParallax = (index) => {
      if (reducedMotion) return;
      const panel = panels[index];
      if (!panel) return;
      const visual = panel.querySelector('.services-showcase-visual');
      if (!visual) return;

      const rootTop = getRootTop();
      const stepHeight = getStepHeight();
      const scrolled = Math.max(0, window.scrollY - rootTop);
      const stepProgress = stepHeight > 0 ? (scrolled - index * stepHeight) / stepHeight : 0;
      const eased = Math.max(-1, Math.min(1, (stepProgress - 0.5) * 2));
      const offsetY = eased * 10;
      const offsetX = eased * 4;

      visual.style.setProperty('--sv-parallax-y', `${offsetY.toFixed(2)}px`);
      visual.style.setProperty('--sv-parallax-x', `${offsetX.toFixed(2)}px`);
    };

    const switchService = (index) => {
      if (index < 0 || index >= panels.length || index === currentIndex) return;

      const prevPanel = panels[currentIndex];
      const nextPanel = panels[index];
      const accent = nextPanel.dataset.accent;

      activateTab(index);
      if (card && accent) card.dataset.accent = accent;
      if (counterEl) counterEl.textContent = `${index + 1} / ${panels.length}`;
      if (indexEl) indexEl.textContent = String(index + 1);

      panels.forEach((panel, i) => {
        if (i !== currentIndex && i !== index) {
          panel.classList.remove('is-active', 'is-exiting');
        }
      });

      prevPanel.classList.remove('is-active');
      if (!reducedMotion) prevPanel.classList.add('is-exiting');

      nextPanel.classList.remove('is-active', 'is-exiting');
      void nextPanel.offsetWidth;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          nextPanel.classList.add('is-active');
          restartPanelVisuals(nextPanel);
        });
      });

      window.setTimeout(() => {
        prevPanel.classList.remove('is-exiting');
      }, reducedMotion ? 150 : DURATION);

      currentIndex = index;
      updateVisualParallax(index);
    };

    const scrollToIndex = (index) => {
      const rootTop = getRootTop();
      const stepHeight = getStepHeight();
      const targetY = rootTop + index * stepHeight + stepHeight * 0.15;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    };

    const onScroll = () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        switchService(getIndexFromScroll());
        updateVisualParallax(currentIndex);
        scrollTicking = false;
      });
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => scrollToIndex(index));
      tab.addEventListener('keydown', (e) => {
        let nextIndex = null;
        if (e.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
        if (e.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') nextIndex = 0;
        if (e.key === 'End') nextIndex = tabs.length - 1;
        if (nextIndex !== null) {
          e.preventDefault();
          tabs[nextIndex].focus();
          scrollToIndex(nextIndex);
        }
      });
    });

    observeFadeUps(scrollRoot);
    updateScrollHeight();
    onScroll();
    window.requestAnimationFrame(updateScrollHeight);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      updateScrollHeight();
      onScroll();
    }, { passive: true });
  }

  async function mountServicesShowcase() {
    const mount = document.querySelector('[data-services-showcase-mount]');
    if (!mount) return;

    try {
      const response = await fetch('/partials/services-showcase.html');
      if (!response.ok) throw new Error('Failed to load services showcase');
      mount.innerHTML = await response.text();
      mount.removeAttribute('aria-busy');
      const scrollRoot = mount.querySelector('[data-service-scroll]');
      if (scrollRoot) initServicesShowcase(scrollRoot);
    } catch (error) {
      console.error(error);
      mount.removeAttribute('aria-busy');
    }
  }

  mountServicesShowcase();

  /* ── CUBE GRID INTERACTION ── */

const root = document.getElementById('cubesRoot');
const grid = document.getElementById('cubesGrid');
const dot  = document.getElementById('cursorDot');
 
const COLS = 10;
const ROWS = 7;
const GAP  = 8;
const PAD  = 30;
 
const cubes = [];
 

/* ════════════════════════════════════════════════════════
   GENZRIX — Dust Text + Cube Grid Animation
   cubes.js — single file, no dependencies
════════════════════════════════════════════════════════ */

/* ────────────────────────────────────────
   1.  DUST TEXT
──────────────────────────────────────── */
(function () {
  const wrap   = document.getElementById('dustWrap');
  const canvas = document.getElementById('dustCanvas');
  const hint   = wrap.querySelector('.dust-hint');
  const ctx    = canvas.getContext('2d');

  let W, H;
  let particles  = [];
  let mouse      = { x: -9999, y: -9999 };
  let hovering   = false;
  let dustRaf    = null;

  /* --- resize & rebuild ---------------------------------------- */
  function resize() {
    W = canvas.width  = wrap.offsetWidth;
    H = canvas.height = wrap.offsetHeight;
    buildParticles();
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    W = wrap.offsetWidth;
    H = wrap.offsetHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
    buildParticles();
}

  /* --- sample pixel positions from text ------------------------- */
  function sampleText() {
    const off = document.createElement('canvas');
    off.width  = W;
    off.height = H;
    const ox = off.getContext('2d');

    const fontSize = Math.min(W / 3.8, H * 0.72);
    ox.fillStyle     = '#fff';
    ox.font          = `900 ${fontSize}px "Arial Black", Arial, sans-serif`;
    ox.textAlign     = 'center';
    ox.textBaseline  = 'middle';
    ox.fillText('GENZRIX', W / 2, H / 2);

    const data = ox.getImageData(0, 0, W, H).data;
    const pts  = [];
    const step = 2;

    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        const i = (y * W + x) * 4;
        if (data[i + 3] > 128) pts.push({ x, y });
      }
    }
    return pts;
  }

  /* --- create particle objects ---------------------------------- */
  function buildParticles() {
    const pts   = sampleText();
    const count = Math.min(pts.length, 6000);
    const step  = pts.length / count;

    particles = [];
    for (let i = 0; i < count; i++) {
      const p = pts[Math.floor(i * step)];
      particles.push({
        tx:      p.x,
        ty:      p.y,
        x:       Math.random() * W,
        y:       Math.random() * H,
        vx:      0,
        vy:      0,
        size: Math.random() * 1.2 + 1,
        opacity: Math.random() * 0.45 + 0.55,
        hue: 5 + Math.random() * 35,
      });
    }
  }

  /* --- animation loop ------------------------------------------ */
  function dustTick() {
    ctx.clearRect(0, 0, W, H);

    const mx = mouse.x;
    const my = mouse.y;
    const REPULSE_R   = 95;
    const REPULSE_STR = 5.8;
    const SPRING      = 0.08;
    const DAMP        = 0.78;

    for (let i = 0; i < particles.length; i++) {
      const p  = particles[i];
      const dx = mx - p.x;
      const dy = my - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (hovering && dist < REPULSE_R) {
        const force = (1 - dist / REPULSE_R) * REPULSE_STR;
        const angle = Math.atan2(dy, dx);
        p.vx -= Math.cos(angle) * force;
        p.vy -= Math.sin(angle) * force;
        p.vx += (Math.random() - 0.5) * 0.9;
        p.vy += (Math.random() - 0.5) * 0.9;
      } else {
        p.vx += (p.tx - p.x) * SPRING;
        p.vy += (p.ty - p.y) * SPRING;
        p.vx *= DAMP;
        p.vy *= DAMP;
      }

      p.x += p.vx;
      p.y += p.vy;

      const scattered = hovering && dist < REPULSE_R * 1.6;
      const sat   = scattered ? '100%' : '85%';
      const light = scattered ? '65%'  : '55%';

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, ${sat}, ${light}, ${p.opacity})`;
      ctx.fill();
    }

    dustRaf = requestAnimationFrame(dustTick);
  }

  /* --- events --------------------------------------------------- */
  wrap.addEventListener('mouseenter', () => {
    hovering = true;
    hint.style.opacity = '0';
  });

  wrap.addEventListener('mouseleave', () => {
    hovering = false;
    mouse    = { x: -9999, y: -9999 };
    hint.style.opacity = '1';
  });

  wrap.addEventListener('mousemove', e => {
    const r  = wrap.getBoundingClientRect();
    mouse.x  = e.clientX - r.left;
    mouse.y  = e.clientY - r.top;
  });

  wrap.addEventListener('touchmove', e => {
    e.preventDefault();
    hovering = true;
    const r  = wrap.getBoundingClientRect();
    mouse.x  = e.touches[0].clientX - r.left;
    mouse.y  = e.touches[0].clientY - r.top;
  }, { passive: false });

  wrap.addEventListener('touchend', () => {
    hovering = false;
    mouse    = { x: -9999, y: -9999 };
  });

  /* --- init ----------------------------------------------------- */
  resize();
  window.addEventListener('resize', () => {
    cancelAnimationFrame(dustRaf);
    resize();
    dustTick();
  });
  dustTick();
})();


/* ────────────────────────────────────────
   2.  CUBE GRID
──────────────────────────────────────── */
(function () {
  const root = document.getElementById('cubesRoot');
  const grid = document.getElementById('cubesGrid');
  const dot  = document.getElementById('cursorDot');

  const COLS = 10;
  const ROWS = 7;
  const GAP  = 8;
  const PAD  = 30;

  let cubes     = [];
  let mouse     = { x: -9999, y: -9999 };
  let raf       = null;
  let resizeTmr = null;

  /* --- build / rebuild grid ------------------------------------ */
  function buildCubes() {
    grid.innerHTML = '';
    cubes = [];

    const totalW = root.offsetWidth  - PAD * 2 - GAP * (COLS - 1);
    const totalH = root.offsetHeight - PAD * 2 - GAP * (ROWS - 1);
    const cellW  = totalW / COLS;
    const cellH  = totalH / ROWS;
    const depth  = Math.min(cellW, cellH) * 0.5;
    const halfD  = depth / 2;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {

        const wrap = document.createElement('div');
        wrap.className = 'cube-wrap';

        const cube = document.createElement('div');
        cube.className = 'cube';

        /* Front */
        const front = document.createElement('div');
        front.className = 'face face-front';
        front.style.transform = `translateZ(${halfD}px)`;
        cube.appendChild(front);

        /* Back */
        const back = document.createElement('div');
        back.className = 'face face-back';
        back.style.transform = `rotateY(180deg) translateZ(${halfD}px)`;
        cube.appendChild(back);

        /* Top */
        const top = document.createElement('div');
        top.className = 'face face-top';
        top.style.height          = `${depth}px`;
        top.style.top             = '0';
        top.style.transformOrigin = 'top center';
        top.style.transform       = `rotateX(90deg) translateZ(${halfD}px)`;
        cube.appendChild(top);

        /* Bottom */
        const bottom = document.createElement('div');
        bottom.className = 'face face-bottom';
        bottom.style.height          = `${depth}px`;
        bottom.style.bottom          = '0';
        bottom.style.transformOrigin = 'bottom center';
        bottom.style.transform       = `rotateX(-90deg) translateZ(${halfD}px)`;
        cube.appendChild(bottom);

        /* Left */
        const left = document.createElement('div');
        left.className = 'face face-left';
        left.style.width           = `${depth}px`;
        left.style.left            = '0';
        left.style.transformOrigin = 'left center';
        left.style.transform       = `rotateY(-90deg) translateZ(${halfD}px)`;
        cube.appendChild(left);

        /* Right */
        const right = document.createElement('div');
        right.className = 'face face-right';
        right.style.width           = `${depth}px`;
        right.style.right           = '0';
        right.style.transformOrigin = 'right center';
        right.style.transform       = `rotateY(90deg) translateZ(${halfD}px)`;
        cube.appendChild(right);

        wrap.appendChild(cube);
        grid.appendChild(wrap);
        cubes.push({ el: cube, r, c });
      }
    }
  }

  buildCubes();

  window.addEventListener('resize', () => {
    clearTimeout(resizeTmr);
    resizeTmr = setTimeout(buildCubes, 150);
  });

  /* --- mouse events -------------------------------------------- */
  root.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
  });

  root.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    mouse = { x: -9999, y: -9999 };
    cubes.forEach(({ el }) => {
      el.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  });

  root.addEventListener('mousemove', e => {
    const rect = root.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    dot.style.left = mouse.x + 'px';
    dot.style.top  = mouse.y + 'px';
    if (!raf) raf = requestAnimationFrame(animate);
  });

  /* --- animation loop ------------------------------------------ */
  function animate() {
    raf = null;

    const rw = root.offsetWidth  / COLS;
    const rh = root.offsetHeight / ROWS;

    cubes.forEach(({ el, r, c }) => {
      const cx   = (c + 0.5) * rw;
      const cy   = (r + 0.5) * rh;
      const dx   = mouse.x - cx;
      const dy   = mouse.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = rw * 3.5;

      if (dist < radius) {
        const strength = Math.pow(Math.max(0, 1 - dist / radius), 1.1);
        const rotY     =  (dx / rw) * 38 * strength;
        const rotX     = -(dy / rh) * 38 * strength;
        el.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      } else {
        el.style.transform = 'rotateX(0deg) rotateY(0deg)';
      }
    });
  }
})();

  /* ── PORTFOLIO FILTER ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length && portfolioGrid) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        portfolioGrid.querySelectorAll('.portfolio-card').forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          if (match) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(14px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

});

