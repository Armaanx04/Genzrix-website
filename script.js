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

  
/* ── footer dots canvas ── */
 (function () {
  const canvas = document.getElementById('dotCanvas');
  const ctx    = canvas.getContext('2d');
 
  // Dot visual parameters — tuned to match the reference screenshot
  const SPACING   = 5;     // tight grid, ~14 px between centres
  const RADIUS    = 1.0;    // slightly larger, more visible dots
  const BASE_DARK = 0.04;   // minimum opacity everywhere
 
  let dots = [];
  let W, H;
 
  function buildDots() {
    W = canvas.width;
    H = canvas.height;
 
    const cols = Math.ceil(W / SPACING) + 1;
    const rows = Math.ceil(H / SPACING) + 1;
 
    dots = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * SPACING;
        const y = r * SPACING;
 
        // Gradient brightness: brighter toward the bottom (matching the reference)
        // Using a radial-ish falloff centred bottom-left
        const normY  = y / H;                     // 0 = top, 1 = bottom
        const normX  = x / W;                     // 0 = left, 1 = right
        // Bottom rows glow more; left side slightly brighter than right
        const zoneBrightness = Math.pow(normY, 1.2) * (1 - normX * 0.4);
 
        dots.push({
          x, y,
          period : 800 + Math.random() * 4000,
          phase  : Math.random() * Math.PI * 2,
          // Each dot oscillates between its own min/max shaped by zone
          minA   : BASE_DARK + zoneBrightness * 0.05,
          maxA   : 0 + zoneBrightness * 1.0
        });
      }
    }
  }
 
  function resize() {
    const rect   = canvas.parentElement.getBoundingClientRect();
    canvas.width  = rect.width;
    canvas.height = rect.height;
    buildDots();
  }
 
  function draw(ts) {
    ctx.clearRect(0, 0, W, H);
 
    for (const d of dots) {
      const t     = (ts % d.period) / d.period;
      const sine  = Math.sin(t * Math.PI * 2 + d.phase);
      const alpha = d.minA + (sine * 0.5 + 0.5) * (d.maxA - d.minA);
 
      ctx.beginPath();
      // Rounded-square dots: use fillRect with slight rounding via arc
      // The reference dots look like small rounded squares, not perfect circles
      const s = RADIUS * 1.6;  // half-size of square
      ctx.roundRect(d.x - s, d.y - s, s * 2, s * 2, 0.6);
      // Interpolate from dark red (139,0,0) to white (255,255,255) based on brightness
      const r = Math.round(139 + (255 - 139) * alpha);
      const g = Math.round(0   + (255 - 0)   * alpha);
      const b = Math.round(0   + (255 - 0)   * alpha);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
      ctx.fill();
    }
 
    requestAnimationFrame(draw);
  }
 
  resize();
  new ResizeObserver(resize).observe(canvas.parentElement);
  requestAnimationFrame(draw);
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
