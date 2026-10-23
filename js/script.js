/**
 * Joy Water Purifier — Vanilla JavaScript
 * Targets the original Blocksy theme + Elementor HTML structure
 */

(function () {
  'use strict';

  /* ─── 1. MOBILE DRAWER (Blocksy .ct-panel / ct-drawer-canvas) ─── */
  const drawerCanvas = document.querySelector('.ct-drawer-canvas');
  const offcanvas    = document.getElementById('offcanvas');
  const triggerBtns  = document.querySelectorAll('[data-id="trigger"], .ct-header-trigger');
  const closeBtns    = document.querySelectorAll('.ct-toggle-close, [data-toggle-panel]');

  // Create backdrop overlay
  const backdrop = document.createElement('div');
  backdrop.id = 'joy-backdrop';
  backdrop.style.cssText = [
    'position:fixed', 'inset:0', 'background:rgba(0,0,0,.45)',
    'z-index:99997', 'opacity:0', 'pointer-events:none',
    'transition:opacity .3s ease'
  ].join(';');
  document.body.appendChild(backdrop);

  function openDrawer() {
    if (drawerCanvas) drawerCanvas.classList.add('ct-active');
    if (offcanvas)    offcanvas.setAttribute('aria-hidden', 'false');
    document.body.classList.add('ct-offcanvas-open');
    backdrop.style.opacity       = '1';
    backdrop.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (drawerCanvas) drawerCanvas.classList.remove('ct-active');
    if (offcanvas)    offcanvas.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('ct-offcanvas-open');
    backdrop.style.opacity       = '0';
    backdrop.style.pointerEvents = 'none';
    document.body.style.overflow = '';
  }

  triggerBtns.forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault();
    openDrawer();
  }));

  closeBtns.forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault();
    closeDrawer();
  }));

  backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Close when a mobile nav link is clicked
  document.querySelectorAll('#offcanvas .ct-menu-link, #offcanvas a').forEach(a => {
    a.addEventListener('click', closeDrawer);
  });

  /* ─── 2. FAQ ACCORDION ─── */
  document.querySelectorAll('.elementor-accordion').forEach(accordion => {
    const items = accordion.querySelectorAll('.elementor-accordion-item');

    items.forEach((item, idx) => {
      const title   = item.querySelector('.elementor-tab-title');
      const content = item.querySelector('.elementor-tab-content');
      if (!title || !content) return;

      // Collapse all by default, open first
      if (idx === 0) {
        title.classList.add('elementor-active');
        content.style.display = 'block';
      } else {
        content.style.display = 'none';
      }

      title.addEventListener('click', () => {
        const isOpen = title.classList.contains('elementor-active');

        // Close all in same accordion
        items.forEach(i => {
          const t = i.querySelector('.elementor-tab-title');
          const c = i.querySelector('.elementor-tab-content');
          if (t) t.classList.remove('elementor-active');
          if (c) c.style.display = 'none';
        });

        // Toggle clicked
        if (!isOpen) {
          title.classList.add('elementor-active');
          content.style.display = 'block';
        }
      });
    });
  });

  /* ─── 3. SCROLL ANIMATIONS (fadeIn / fadeInDown / fadeInLeft / fadeInUp) ─── */
  const animatables = document.querySelectorAll('.elementor-invisible');
  if (animatables.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // Read animation class from data-settings
          let anim = 'fadeIn';
          try {
            const settings = JSON.parse(el.dataset.settings || '{}');
            anim = settings._animation || 'fadeIn';
          } catch (_) {}
          el.classList.remove('elementor-invisible');
          el.classList.add('animated', anim);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    animatables.forEach(el => io.observe(el));
  }

  /* ─── 4. SMOOTH SCROLL for anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id && id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ─── 5. ACTIVE NAV LINK HIGHLIGHT ─── */
  const current = location.pathname.replace(/\/$/, '').split('/').pop() || 'index.html';
  document.querySelectorAll('.ct-menu-link').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href === current) {
      const li = link.closest('li');
      if (li) li.classList.add('current-menu-item');
    }
  });

  /* ─── 6. STICKY HEADER SHADOW ─── */
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 2px 16px rgba(0,0,0,.18)';
      } else {
        header.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  console.log('Joy Water Purifier JS initialised ✓');
})();
