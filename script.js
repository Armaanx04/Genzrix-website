/* ============================================================
   GENZRIX V3 — SHARED SCRIPT
   ============================================================ */
import { createClient } from '@supabase/supabase-js';
import { initSiteBackground } from './site-background.js';
import { initHeroShapeGrid } from './hero-shapegrid.js';
import { initServicesPage } from './services-page.js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}


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

  /* ── IDEA CTA: minimal glass panel entrance ── */
  const ideaSection = document.querySelector('.idea-section');
  if (ideaSection) {
    const ideaReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (ideaReducedMotion) {
      ideaSection.classList.add('is-visible');
    } else {
      const ideaObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            ideaSection.classList.add('is-visible');
            ideaObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      ideaObserver.observe(ideaSection);
    }
  }

  /* ── CLIENTS: unified group settle ── */
  const clientsSection = document.querySelector('.ds-section--clients');
  if (clientsSection) {
    const clientsGrid = clientsSection.querySelector('.clients-grid--settle');
    const settleReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (clientsGrid) {
      if (settleReducedMotion) {
        clientsGrid.classList.add('is-settled');
      } else {
        clientsGrid.classList.add('is-prepared');

        const runClientsSettle = () => {
          if (clientsGrid.classList.contains('is-settled') || clientsGrid.classList.contains('is-settling')) {
            return;
          }

          clientsGrid.classList.add('is-settling');
          clientsGrid.addEventListener('animationend', (event) => {
            if (event.animationName !== 'clients-group-settle') return;
            clientsGrid.classList.remove('is-settling', 'is-prepared');
            clientsGrid.classList.add('is-settled');
          }, { once: true });
        };

        const clientsSettleObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runClientsSettle();
              clientsSettleObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        clientsSettleObserver.observe(clientsSection);
      }
    }
  }

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
    const diagram = heroSection.querySelector('.hero-diagram');
    const parallaxEl = heroSection.querySelector('.hero-diagram-parallax');
    const heroRight = heroSection.querySelector('.hero-right');
    const nodes = heroSection.querySelectorAll('.hero-node');
    const lines = heroSection.querySelectorAll('.hero-line');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lineDrawEasing = 'cubic-bezier(0.22, 1, 0.36, 1)';
    const lineDrawStart = 0.95;

    if (diagram && lines.length && !reducedMotion) {
      lines.forEach((line, index) => {
        const length = line.getTotalLength?.() ?? 140;
        line.style.strokeDasharray = `${length}`;
        line.style.strokeDashoffset = `${length}`;
        line.style.animation = `heroLineDraw 0.75s ${lineDrawEasing} ${lineDrawStart + index * 0.07}s forwards`;
      });
    }

    if (parallaxEl && heroRight && !reducedMotion) {
      const maxMove = 10;
      let rafId = 0;
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;

      const applyParallax = () => {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;
        parallaxEl.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`;
        if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
          rafId = requestAnimationFrame(applyParallax);
        }
      };

      heroRight.addEventListener('mousemove', (event) => {
        const rect = heroRight.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        targetX = x * maxMove * 2;
        targetY = y * maxMove * 2;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(applyParallax);
      });

      heroRight.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(applyParallax);
      });
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
  const FAQ_OPEN_MS = 480;
  const FAQ_ANSWER_DELAY_MS = 175;
  const FAQ_CLOSE_ANSWER_MS = 180;
  const FAQ_CLOSE_COLLAPSE_DELAY_MS = 165;

  const faqItems = [...document.querySelectorAll('.faq-item')];

  const isFaqAnimating = (item) => (
    item.classList.contains('is-opening')
    || item.classList.contains('is-closing')
  );

  const finishFaqOpen = (item) => {
    const answer = item.querySelector('.faq-answer');
    if (!answer || !item.classList.contains('open')) return;
    answer.style.height = 'auto';
    item.classList.remove('is-opening');
  };

  const openFaq = (item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const inner = item.querySelector('.faq-answer-inner');
    if (!answer || !inner) return;

    item.classList.remove('is-closing', 'is-answer-visible');
    item.classList.add('is-opening', 'open');
    question?.setAttribute('aria-expanded', 'true');
    answer.setAttribute('aria-hidden', 'false');

    if (answer.style.height === 'auto') {
      answer.style.height = `${answer.scrollHeight}px`;
    }

    requestAnimationFrame(() => {
      answer.style.height = `${inner.scrollHeight}px`;
    });

    window.setTimeout(() => {
      if (item.classList.contains('open') && !item.classList.contains('is-closing')) {
        item.classList.add('is-answer-visible');
        requestAnimationFrame(() => {
          if (answer.style.height !== 'auto') {
            answer.style.height = `${inner.scrollHeight}px`;
          }
        });
      }
    }, FAQ_ANSWER_DELAY_MS);

    window.setTimeout(() => {
      finishFaqOpen(item);
    }, FAQ_OPEN_MS + 40);
  };

  const closeFaq = (item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!answer || item.classList.contains('is-closing')) return;

    item.classList.remove('is-opening', 'is-answer-visible');
    item.classList.add('is-closing');

    answer.style.height = `${answer.scrollHeight}px`;

    window.setTimeout(() => {
      item.classList.remove('open');
      question?.setAttribute('aria-expanded', 'false');
      answer.setAttribute('aria-hidden', 'true');
      answer.style.height = '0px';
    }, FAQ_CLOSE_COLLAPSE_DELAY_MS);

    window.setTimeout(() => {
      if (item.classList.contains('is-closing')) {
        item.classList.remove('is-closing');
        answer.style.height = '0px';
      }
    }, FAQ_CLOSE_COLLAPSE_DELAY_MS + FAQ_OPEN_MS + 40);
  };

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    answer.style.height = '0px';

    answer.addEventListener('transitionend', (event) => {
      if (event.propertyName !== 'height') return;
      if (item.classList.contains('open') && !item.classList.contains('is-closing')) {
        finishFaqOpen(item);
      }
      if (item.classList.contains('is-closing') && !item.classList.contains('open')) {
        item.classList.remove('is-closing');
        answer.style.height = '0px';
      }
    });

    question.addEventListener('click', () => {
      if (isFaqAnimating(item)) return;

      const isOpen = item.classList.contains('open');

      faqItems.forEach((other) => {
        if (other !== item && other.classList.contains('open') && !isFaqAnimating(other)) {
          closeFaq(other);
        }
      });

      if (isOpen) {
        closeFaq(item);
      } else {
        openFaq(item);
      }
    });
  });

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

  /* ── CONTACT TIMELINE: What Happens Next ── */
  const contactTimeline = document.querySelector('[data-contact-timeline]');
  if (contactTimeline) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lineProgress = contactTimeline.querySelector('.contact-timeline__line-progress');
    const nodes = [...contactTimeline.querySelectorAll('[data-contact-node]')];
    const steps = [...contactTimeline.querySelectorAll('[data-contact-step]')];
    let sequenceStarted = false;

    const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - (2 ** (-10 * t)));
    const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });
    const isVertical = () => window.matchMedia('(max-width: 768px)').matches;
    const lineProp = () => (isVertical() ? 'height' : 'width');

    const getLineProgress = () => {
      if (!lineProgress) return 0;
      return parseFloat(lineProgress.style[lineProp()] || '0') || 0;
    };

    const animateLineTo = (targetPercent, duration) => new Promise((resolve) => {
      if (!lineProgress) {
        resolve();
        return;
      }

      const prop = lineProp();
      const startVal = getLineProgress();
      const startAt = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startAt) / duration, 1);
        const eased = easeOutExpo(progress);
        const current = startVal + (targetPercent - startVal) * eased;
        lineProgress.style[prop] = `${current}%`;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(tick);
    });

    const revealStep = async (index) => {
      const step = steps[index];
      if (!step) return;

      step.classList.add('is-icon-in');
      await wait(300);
      step.classList.add('is-number-in');
      await wait(240);
      step.classList.add('is-title-in');
      await wait(280);
      step.classList.add('is-desc-in');
      await wait(200);
    };

    const lightNode = (index) => {
      if (nodes[index]) nodes[index].classList.add('is-lit');
    };

    const showAll = () => {
      contactTimeline.classList.add('is-revealed', 'is-line-complete');
      if (lineProgress) {
        lineProgress.style[lineProp()] = '100%';
      }
      nodes.forEach((node) => node.classList.add('is-lit'));
      steps.forEach((step) => {
        step.classList.add('is-icon-in', 'is-number-in', 'is-title-in', 'is-desc-in');
      });
    };

    const runTimelineSequence = async () => {
      if (sequenceStarted) return;
      sequenceStarted = true;
      contactTimeline.classList.add('is-revealed');

      if (reducedMotion) {
        showAll();
        return;
      }

      const milestones = [
        { line: 14, node: null, step: 0 },
        { line: 33, node: 0, step: null },
        { line: 48, node: null, step: 1 },
        { line: 66, node: 1, step: null },
        { line: 81, node: null, step: 2 },
        { line: 100, node: 2, step: null },
        { line: 100, node: null, step: 3 },
      ];

      for (const milestone of milestones) {
        if (milestone.line > getLineProgress()) {
          await animateLineTo(milestone.line, milestone.line === 100 ? 520 : 460);
        }
        if (milestone.node !== null) lightNode(milestone.node);
        if (milestone.step !== null) await revealStep(milestone.step);
      }

      contactTimeline.classList.add('is-line-complete');
    };

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runTimelineSequence();
          timelineObserver.unobserve(contactTimeline);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });

    timelineObserver.observe(contactTimeline);
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

  initServicesPage();

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

  /* ── FOOTER: Dust Text + Cube Grid (Alina) ── */
  (function () {
    const wrap = document.getElementById('dustWrap');
    const canvas = document.getElementById('dustCanvas');
    if (!wrap || !canvas) return;

    const hint = wrap.querySelector('.dust-hint');
    const ctx = canvas.getContext('2d');

    let W;
    let H;
    let particles = [];
    let mouse = { x: -9999, y: -9999 };
    let hovering = false;
    let dustRaf = null;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      W = wrap.offsetWidth;
      H = wrap.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      buildParticles();
    }

    function sampleText() {
      const off = document.createElement('canvas');
      off.width = W;
      off.height = H;
      const ox = off.getContext('2d');
      const fontSize = Math.min(W / 3.8, H * 0.72);
      ox.fillStyle = '#fff';
      ox.font = `900 ${fontSize}px "Arial Black", Arial, sans-serif`;
      ox.textAlign = 'center';
      ox.textBaseline = 'middle';
      ox.fillText('GENZRIX', W / 2, H / 2);

      const data = ox.getImageData(0, 0, W, H).data;
      const pts = [];
      for (let y = 0; y < H; y += 2) {
        for (let x = 0; x < W; x += 2) {
          const i = (y * W + x) * 4;
          if (data[i + 3] > 128) pts.push({ x, y });
        }
      }
      return pts;
    }

    function pickDustColor() {
      const roll = Math.random();
      let base;

      // Metallic silver / graphite — ~95% silver impression
      if (roll < 0.68) {
        base = { r: 217, g: 217, b: 221 }; // Satin silver #D9D9DD
      } else if (roll < 0.90) {
        base = { r: 184, g: 186, b: 194 }; // Brushed mid-tone #B8BAC2
      } else {
        base = { r: 142, g: 145, b: 155 }; // Gunmetal shadow #8E919B
      }

      const micro = 0.96 + Math.random() * 0.08;
      const warmth = 0.98 + Math.random() * 0.04;

      return {
        r: Math.round(Math.min(255, base.r * micro * warmth)),
        g: Math.round(Math.min(255, base.g * micro * warmth)),
        b: Math.round(Math.min(255, base.b * micro)),
        // Tiny ambient violet bounce from footer environment — never dominant
        env: Math.random() * 0.035,
      };
    }

    function buildParticles() {
      const pts = sampleText();
      const count = Math.min(pts.length, 6000);
      const step = pts.length / count;
      particles = [];
      for (let i = 0; i < count; i += 1) {
        const p = pts[Math.floor(i * step)];
        particles.push({
          tx: p.x,
          ty: p.y,
          x: Math.random() * W,
          y: Math.random() * H,
          vx: 0,
          vy: 0,
          size: Math.random() * 1.25 + 0.85,
          opacity: Math.random() * 0.38 + 0.58,
          color: pickDustColor(),
          brightness: 0.86 + Math.random() * 0.18,
        });
      }
    }

    function dustTick() {
      ctx.clearRect(0, 0, W, H);
      const mx = mouse.x;
      const my = mouse.y;
      const REPULSE_R = 95;
      const REPULSE_STR = 5.8;
      const SPRING = 0.08;
      const DAMP = 0.78;

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
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
        const { r, g, b, env } = p.color;
        const lum = scattered ? p.brightness * 1.05 : p.brightness;
        const alpha = scattered ? Math.min(1, p.opacity * 1.03) : p.opacity;

        // Subtle environmental cool reflection from page violet lighting
        const envLift = env * (0.6 + (1 - p.y / H) * 0.4);
        let pr = Math.round(Math.min(255, r * lum));
        let pg = Math.round(Math.min(255, g * lum));
        let pb = Math.round(Math.min(255, (b * lum) + envLift * 5));

        ctx.shadowBlur = scattered ? 2.4 : 1.35;
        ctx.shadowColor = `rgba(255, 255, 255, ${alpha * (scattered ? 0.20 : 0.12)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pr}, ${pg}, ${pb}, ${alpha})`;
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';

      dustRaf = requestAnimationFrame(dustTick);
    }

    wrap.addEventListener('mouseenter', () => {
      hovering = true;
      if (hint) hint.style.opacity = '0';
    });
    wrap.addEventListener('mouseleave', () => {
      hovering = false;
      mouse = { x: -9999, y: -9999 };
      if (hint) hint.style.opacity = '1';
    });
    wrap.addEventListener('mousemove', (e) => {
      const r = wrap.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    wrap.addEventListener('touchmove', (e) => {
      e.preventDefault();
      hovering = true;
      const r = wrap.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - r.left;
      mouse.y = e.touches[0].clientY - r.top;
    }, { passive: false });
    wrap.addEventListener('touchend', () => {
      hovering = false;
      mouse = { x: -9999, y: -9999 };
    });

    resize();
    window.addEventListener('resize', () => {
      cancelAnimationFrame(dustRaf);
      resize();
      dustTick();
    });
    dustTick();
  })();

  (function () {
    const root = document.getElementById('cubesRoot');
    const grid = document.getElementById('cubesGrid');
    const dot = document.getElementById('cursorDot');
    if (!root || !grid) return;

    const COLS = 10;
    const ROWS = 7;
    const GAP = 8;
    const PAD = 30;
    let cubes = [];
    let mouse = { x: -9999, y: -9999 };
    let raf = null;
    let resizeTmr = null;

    function buildCubes() {
      grid.innerHTML = '';
      cubes = [];
      const totalW = root.offsetWidth - PAD * 2 - GAP * (COLS - 1);
      const totalH = root.offsetHeight - PAD * 2 - GAP * (ROWS - 1);
      const cellW = totalW / COLS;
      const cellH = totalH / ROWS;
      const depth = Math.min(cellW, cellH) * 0.5;
      const halfD = depth / 2;

      for (let r = 0; r < ROWS; r += 1) {
        for (let c = 0; c < COLS; c += 1) {
          const wrapEl = document.createElement('div');
          wrapEl.className = 'cube-wrap';
          const cube = document.createElement('div');
          cube.className = 'cube';

          const faces = [
            ['face-front', `translateZ(${halfD}px)`],
            ['face-back', `rotateY(180deg) translateZ(${halfD}px)`],
          ];
          faces.forEach(([cls, transform]) => {
            const face = document.createElement('div');
            face.className = `face ${cls}`;
            face.style.transform = transform;
            cube.appendChild(face);
          });

          const top = document.createElement('div');
          top.className = 'face face-top';
          top.style.height = `${depth}px`;
          top.style.top = '0';
          top.style.transformOrigin = 'top center';
          top.style.transform = `rotateX(90deg) translateZ(${halfD}px)`;
          cube.appendChild(top);

          const bottom = document.createElement('div');
          bottom.className = 'face face-bottom';
          bottom.style.height = `${depth}px`;
          bottom.style.bottom = '0';
          bottom.style.transformOrigin = 'bottom center';
          bottom.style.transform = `rotateX(-90deg) translateZ(${halfD}px)`;
          cube.appendChild(bottom);

          const left = document.createElement('div');
          left.className = 'face face-left';
          left.style.width = `${depth}px`;
          left.style.left = '0';
          left.style.transformOrigin = 'left center';
          left.style.transform = `rotateY(-90deg) translateZ(${halfD}px)`;
          cube.appendChild(left);

          const right = document.createElement('div');
          right.className = 'face face-right';
          right.style.width = `${depth}px`;
          right.style.right = '0';
          right.style.transformOrigin = 'right center';
          right.style.transform = `rotateY(90deg) translateZ(${halfD}px)`;
          cube.appendChild(right);

          wrapEl.appendChild(cube);
          grid.appendChild(wrapEl);
          cubes.push({ el: cube, r, c });
        }
      }
    }

    buildCubes();
    window.addEventListener('resize', () => {
      clearTimeout(resizeTmr);
      resizeTmr = setTimeout(buildCubes, 150);
    });

    root.addEventListener('mouseenter', () => {
      if (dot) dot.style.opacity = '1';
    });
    root.addEventListener('mouseleave', () => {
      if (dot) dot.style.opacity = '0';
      mouse = { x: -9999, y: -9999 };
      cubes.forEach(({ el }) => {
        el.style.transform = 'rotateX(0deg) rotateY(0deg)';
      });
    });
    root.addEventListener('mousemove', (e) => {
      const rect = root.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      if (dot) {
        dot.style.left = `${mouse.x}px`;
        dot.style.top = `${mouse.y}px`;
      }
      if (!raf) raf = requestAnimationFrame(animate);
    });

    function animate() {
      raf = null;
      const rw = root.offsetWidth / COLS;
      const rh = root.offsetHeight / ROWS;
      cubes.forEach(({ el, r, c }) => {
        const cx = (c + 0.5) * rw;
        const cy = (r + 0.5) * rh;
        const dx = mouse.x - cx;
        const dy = mouse.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = rw * 3.5;
        if (dist < radius) {
          const strength = (1 - dist / radius) ** 1.1;
          el.style.transform = `rotateX(${-(dy / rh) * 38 * strength}deg) rotateY(${(dx / rw) * 38 * strength}deg)`;
        } else {
          el.style.transform = 'rotateX(0deg) rotateY(0deg)';
        }
      });
    }
  })();

});
