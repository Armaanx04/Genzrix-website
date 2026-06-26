/* ============================================================
   GENZRIX V3 — SHARED SCRIPT
   ============================================================ */

import { createClient } from '@supabase/supabase-js';
import { initSiteBackground } from './site-background.js';
import { initHeroShapeGrid } from './hero-shapegrid.js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
  const pathSegment = window.location.pathname.split('/').pop() || '';
  const currentPath = pathSegment === '' || pathSegment === 'about'
    ? (pathSegment === 'about' ? 'about.html' : 'index.html')
    : pathSegment;
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

  /* ── HOW IT WORKS: premium pipeline sequence ── */
  const processSection = document.querySelector('.ds-section--process');
  if (processSection) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pipelinePath = processSection.querySelector('#howPipelinePath');
    const pipelineIndicator = processSection.querySelector('.how-process-pipeline__indicator');
    const pipelineLine = processSection.querySelector('.how-process-pipeline__line');
    const pipelineShine = processSection.querySelector('.how-process-pipeline__shine');
    const processSteps = [...processSection.querySelectorAll('.how-step[data-how-step]')];
    let sequenceStarted = false;

    const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - (2 ** (-10 * t)));
    const easeOutQuart = (t) => 1 - ((1 - t) ** 4);
    const linear = (t) => t;

    const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

    const drawLine = (duration) => new Promise((resolve) => {
      if (!pipelineLine) {
        resolve();
        return;
      }

      const startAt = performance.now();
      pipelineLine.style.strokeDasharray = '100';
      pipelineLine.style.strokeDashoffset = '100';
      if (pipelineShine) {
        pipelineShine.style.strokeDasharray = '2.5 97.5';
        pipelineShine.style.strokeDashoffset = '100';
        pipelineShine.style.opacity = '1';
      }

      const tick = (now) => {
        const progress = Math.min((now - startAt) / duration, 1);
        const eased = easeOutExpo(progress);
        const offset = 100 * (1 - eased);
        pipelineLine.style.strokeDashoffset = String(offset);
        if (pipelineShine) pipelineShine.style.strokeDashoffset = String(offset);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          processSection.classList.add('is-line-complete');
          pipelineLine.style.strokeDasharray = 'none';
          pipelineLine.style.strokeDashoffset = '0';
          if (pipelineShine) pipelineShine.style.opacity = '0';
          resolve();
        }
      };

      requestAnimationFrame(tick);
    });

    const showCircle = (index) => {
      if (processSteps[index]) processSteps[index].classList.add('is-circle-in');
    };

    const pulseCircle = (index) => new Promise((resolve) => {
      const step = processSteps[index];
      if (!step) {
        resolve();
        return;
      }
      step.classList.remove('is-circle-pulse');
      void step.offsetWidth;
      step.classList.add('is-circle-pulse');
      setTimeout(() => {
        step.classList.remove('is-circle-pulse');
        resolve();
      }, 300);
    });

    const revealTitle = async (index) => {
      if (processSteps[index]) processSteps[index].classList.add('is-title-in');
      await wait(460);
    };

    const revealDesc = async (index) => {
      if (processSteps[index]) processSteps[index].classList.add('is-desc-in');
      await wait(400);
    };

    const animateChevron = (fromRatio, toRatio, duration, easing = linear) => new Promise((resolve) => {
      if (!pipelinePath || !pipelineIndicator) {
        resolve();
        return;
      }

      const pathLength = pipelinePath.getTotalLength();
      const startAt = performance.now();
      const targetOpacity = 0.9;

      const tick = (now) => {
        const progress = Math.min((now - startAt) / duration, 1);
        const eased = easing(progress);
        const ratio = fromRatio + (toRatio - fromRatio) * eased;
        const point = pipelinePath.getPointAtLength(pathLength * ratio);
        pipelineIndicator.setAttribute('transform', `translate(${point.x}, ${point.y})`);

        if (progress < 0.08) {
          pipelineIndicator.setAttribute('opacity', String((progress / 0.08) * targetOpacity));
        } else if (progress > 0.92 && toRatio >= 0.98) {
          pipelineIndicator.setAttribute('opacity', String(((1 - progress) / 0.08) * targetOpacity));
        } else {
          pipelineIndicator.setAttribute('opacity', String(targetOpacity));
        }

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          if (toRatio < 0.98) pipelineIndicator.setAttribute('opacity', String(targetOpacity));
          resolve();
        }
      };

      requestAnimationFrame(tick);
    });

    const fadeChevronOut = (duration) => new Promise((resolve) => {
      if (!pipelineIndicator) {
        resolve();
        return;
      }

      const startOpacity = parseFloat(pipelineIndicator.getAttribute('opacity') || '0.9');
      const startAt = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startAt) / duration, 1);
        const eased = easeOutQuart(progress);
        pipelineIndicator.setAttribute('opacity', String(startOpacity * (1 - eased)));
        if (progress < 1) requestAnimationFrame(tick);
        else {
          pipelineIndicator.setAttribute('opacity', '0');
          resolve();
        }
      };

      requestAnimationFrame(tick);
    });

    const showAllSteps = () => {
      processSection.classList.add('is-line-complete');
      processSteps.forEach((step) => {
        step.classList.add('is-circle-in', 'is-title-in', 'is-desc-in');
      });
    };

    const runPipelineSequence = async () => {
      if (sequenceStarted) return;
      sequenceStarted = true;

      processSection.classList.add('is-revealed');

      if (reducedMotion) {
        showAllSteps();
        return;
      }

      await drawLine(900);

      showCircle(0);
      await pulseCircle(0);
      await revealTitle(0);
      await revealDesc(0);

      await animateChevron(0.02, 0.5, 540, linear);
      showCircle(1);
      await pulseCircle(1);
      await revealTitle(1);
      await revealDesc(1);

      await animateChevron(0.5, 0.98, 540, linear);
      showCircle(2);
      await pulseCircle(2);
      await revealTitle(2);
      await revealDesc(2);

      await fadeChevronOut(280);
    };

    if (reducedMotion) {
      runPipelineSequence();
    } else {
      const processObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runPipelineSequence();
            processObserver.unobserve(processSection);
          }
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
      processObserver.observe(processSection);
    }
  }

  /* ── SITE BACKGROUND ── */
  const siteBgEl = document.querySelector('[data-site-background]');
  if (siteBgEl) initSiteBackground(siteBgEl);

  /* ── HERO ── */
  const heroShapeGridEl = document.querySelector('[data-hero-shapegrid]');
  if (heroShapeGridEl) initHeroShapeGrid(heroShapeGridEl);

  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    document.querySelectorAll('.hero-word').forEach((word, i) => {
      word.style.animationDelay = `${0.12 + i * 0.08}s`;
    });

    const diagram = heroSection.querySelector('.hero-diagram');
    const nodes = heroSection.querySelectorAll('.hero-node');
    const lines = heroSection.querySelectorAll('.hero-line');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (diagram && nodes.length && !reducedMotion) {
      lines.forEach((line, index) => {
        const length = line.getTotalLength?.() ?? 140;
        line.style.strokeDasharray = `${length}`;
        line.style.strokeDashoffset = `${length}`;
        line.style.animation = `heroLineDraw 1s cubic-bezier(0.22, 1, 0.36, 1) ${0.35 + index * 0.08}s forwards`;
      });

      if (!document.getElementById('hero-line-draw-style')) {
        const style = document.createElement('style');
        style.id = 'hero-line-draw-style';
        style.textContent = '@keyframes heroLineDraw { to { stroke-dashoffset: 0; } }';
        document.head.appendChild(style);
      }
    }

    const setActiveNode = (nodeId) => {
      if (!diagram) return;
      diagram.classList.add('is-interactive');
      nodes.forEach(node => {
        node.classList.toggle('is-active', node.dataset.node === nodeId);
      });
      lines.forEach(line => {
        line.classList.toggle('is-active', line.dataset.node === nodeId);
      });
    };

    const clearActiveNode = () => {
      if (!diagram) return;
      diagram.classList.remove('is-interactive');
      nodes.forEach(node => node.classList.remove('is-active'));
      lines.forEach(line => line.classList.remove('is-active'));
    };

    nodes.forEach(node => {
      node.addEventListener('mouseenter', () => setActiveNode(node.dataset.node));
      node.addEventListener('focus', () => setActiveNode(node.dataset.node));
      node.addEventListener('mouseleave', clearActiveNode);
      node.addEventListener('blur', clearActiveNode);
      node.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setActiveNode(node.dataset.node);
        }
        if (event.key === 'Escape') clearActiveNode();
      });
    });

    if (diagram) {
      diagram.addEventListener('mouseleave', clearActiveNode);
    }
  }

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

    const restartPanelVisuals = () => {};

    const updateVisualParallax = (index) => {
      const panel = panels[index];
      if (!panel) return;
      const visual = panel.querySelector('.services-showcase-visual');
      if (!visual) return;
      visual.style.setProperty('--sv-parallax-y', '0px');
      visual.style.setProperty('--sv-parallax-x', '0px');
    };

    const switchService = (index) => {
      if (index < 0 || index >= panels.length || index === currentIndex) return;

      const prevPanel = panels[currentIndex];
      const nextPanel = panels[index];
      const accent = nextPanel.dataset.accent;

      activateTab(index);
      if (card && accent) card.dataset.accent = accent;
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

  /* ── WHY GENZRIX STACK (scroll-driven) ── */
  function initWhyGenzrixStack() {
    const scrollRoot = document.querySelector('[data-why-stack-scroll]');
    if (!scrollRoot) return;

    const pinEl = scrollRoot.querySelector('.why-genzrix-pin');
    const stackEl = scrollRoot.querySelector('[data-why-stack]');
    const cards = [...scrollRoot.querySelectorAll('[data-why-card]')];
    if (!pinEl || !stackEl || cards.length < 2) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const STEP_VH = reducedMotion ? 2.25 : 4.5;
    const HOLD_VH = reducedMotion ? 0.5 : 1;
    const SUMMARY_VH = reducedMotion ? 0.5 : 1;
    const ROW_HEIGHT = 122;
    const ROW_GAP = 18;
    const INACTIVE_SCALE_Y = 1 / 1.2;
    let scrollTicking = false;
    let stackBaseHeight = 0;

    const easeOutCubic = (t) => 1 - (1 - t) ** 3;
    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
    const lerp = (a, b, t) => a + (b - a) * t;

    const getStepHeight = () => window.innerHeight * STEP_VH;
    const getHoldHeight = () => window.innerHeight * HOLD_VH;
    const getSummaryHeight = () => window.innerHeight * SUMMARY_VH;
    const getRootTop = () => scrollRoot.getBoundingClientRect().top + window.scrollY;
    const getCardHeight = () => cards[0]?.offsetHeight || stackEl.offsetHeight;
    const getPeekPx = () => Math.max(48, getCardHeight() * 0.22);
    const getStackBaseHeight = () => {
      const parsed = parseFloat(getComputedStyle(stackEl).height);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : stackEl.offsetHeight;
    };
    const getSummaryListHeight = () => cards.length * ROW_HEIGHT + (cards.length - 1) * ROW_GAP;

    const getCardPhaseEnd = () => (cards.length - 1) * getStepHeight();
    const getHoldEnd = () => getCardPhaseEnd() + getHoldHeight();
    const getScrollDistance = () => getHoldEnd() + getSummaryHeight();

    const getFrontFromScroll = (scrolled) => {
      const stepHeight = getStepHeight();
      const maxFront = cards.length - 1;

      if (scrolled <= 0 || stepHeight <= 0) return 0;
      return Math.min(maxFront, scrolled / stepHeight);
    };

    const getStackState = (front, i) => {
      const cardHeight = getCardHeight();
      const peek = getPeekPx();
      const behindStep = cardHeight - peek;
      const rel = front - i;
      let translateY = 0;
      let scaleX = 1;
      let scaleY = 1;
      let opacity = 1;
      let zIndex = 10;
      const inactiveScaleX = 0.96;

      if (rel >= 0) {
        translateY = rel * behindStep * 0.12 + rel * peek;
        scaleX = Math.max(inactiveScaleX, 1 - rel * 0.022);
        scaleY = Math.max(INACTIVE_SCALE_Y, 1 - rel * 0.1);
        opacity = Math.max(0.42, 1 - rel * 0.2);
        zIndex = 100 - Math.round(rel * 14);
      } else if (rel > -1) {
        const rise = 1 + rel;
        translateY = (1 - rise) * behindStep;
        scaleX = lerp(inactiveScaleX, 1, rise);
        scaleY = lerp(INACTIVE_SCALE_Y, 1, rise);
        opacity = 0.28 + rise * 0.72;
        zIndex = 70 + Math.round(rise * 50);
      } else {
        const depth = -rel - 1;
        translateY = behindStep + depth * (peek * 0.35);
        scaleX = inactiveScaleX;
        scaleY = INACTIVE_SCALE_Y;
        opacity = Math.max(0, 0.28 - depth * 0.28);
        zIndex = Math.max(1, 18 - Math.round(depth * 4));
      }

      return {
        translateY,
        scaleX,
        scaleY,
        opacity,
        zIndex,
        isActive: rel >= -0.05 && rel < 0.35,
      };
    };

    const applyCardVisual = (card, state) => {
      const activeBoost = state.isActive ? 1.02 : 1;
      const scaleX = state.scaleX * activeBoost;
      const scaleY = state.scaleY * activeBoost;
      card.style.transform = `translate3d(0, ${state.translateY.toFixed(1)}px, 0) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
      card.style.opacity = state.opacity.toFixed(3);
      card.style.zIndex = String(state.zIndex);
      card.classList.toggle('is-active', state.isActive);
    };

    const applyStack = (front) => {
      stackEl.classList.remove('is-summary');
      stackEl.classList.add('is-stacking');
      stackEl.style.height = `${stackBaseHeight}px`;
      cards.forEach((card) => card.classList.remove('is-compact'));

      cards.forEach((card, i) => {
        const desc = card.querySelector('p');
        if (desc) desc.style.opacity = '';
        applyCardVisual(card, getStackState(front, i));
      });
    };

    const applySummary = (rawProgress) => {
      stackEl.classList.remove('is-stacking');
      const t = Math.max(0, Math.min(1, rawProgress));
      const descFade = easeOutCubic(Math.min(1, t / 0.4));
      const morph = easeInOutCubic(Math.max(0, (t - 0.18) / 0.82));
      const front = cards.length - 1;
      const listHeight = getSummaryListHeight();

      stackEl.classList.toggle('is-summary', morph > 0.97);
      stackEl.style.height = `${lerp(stackBaseHeight, listHeight, morph).toFixed(1)}px`;

      cards.forEach((card, i) => {
        const stagger = i * 0.045;
        const cardMorph = easeInOutCubic(Math.max(0, Math.min(1, (morph - stagger) / Math.max(0.001, 1 - stagger))));
        const from = getStackState(front, i);
        const targetY = i * (ROW_HEIGHT + ROW_GAP);
        const translateY = lerp(from.translateY, targetY, cardMorph);
        const scaleX = lerp(from.scaleX, 1, cardMorph);
        const scaleY = lerp(from.scaleY, 1, cardMorph);
        const opacity = lerp(from.opacity, 1, cardMorph);
        const zIndex = 10 + i;

        card.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.zIndex = String(zIndex);
        card.classList.toggle('is-active', false);
        card.classList.toggle('is-compact', cardMorph > 0.62);

        const desc = card.querySelector('p');
        if (desc) desc.style.opacity = (1 - descFade).toFixed(3);
      });
    };

    const updateScrollHeight = () => {
      stackBaseHeight = getStackBaseHeight();
      const pinHeight = pinEl.offsetHeight;
      scrollRoot.style.height = `${pinHeight + getScrollDistance()}px`;
    };

    const onScroll = () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        const scrolled = Math.max(0, window.scrollY - getRootTop());
        const cardPhaseEnd = getCardPhaseEnd();
        const holdEnd = getHoldEnd();

        if (scrolled <= cardPhaseEnd) {
          applyStack(getFrontFromScroll(scrolled));
        } else if (scrolled <= holdEnd) {
          applyStack(cards.length - 1);
        } else {
          const summaryProgress = (scrolled - holdEnd) / getSummaryHeight();
          applySummary(summaryProgress);
        }

        scrollTicking = false;
      });
    };

    updateScrollHeight();
    requestAnimationFrame(() => {
      updateScrollHeight();
      applyStack(0);
      onScroll();
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      updateScrollHeight();
      onScroll();
    }, { passive: true });
  }

  initWhyGenzrixStack();

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
