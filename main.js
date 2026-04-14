/* =============================================================
   GHOSTWRITING & BOOK EDITING SERVICE — MAIN JAVASCRIPT
   Features: Theme, RTL, Navbar, Scroll Animations, Toast,
             Counters, Accordion, Mobile Menu, Parallax
   ============================================================= */

'use strict';

/* ═══════════════════════════════════════════════════════════
   1. DARK / LIGHT MODE TOGGLE
   ═══════════════════════════════════════════════════════════ */
const ThemeManager = (() => {
  const html = document.documentElement;
  const STORAGE_KEY = 'gbs-theme';

  function getPreferred() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function apply(theme) {
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, theme);
    updateIcons(theme);
  }

  function updateIcons(theme) {
    document.querySelectorAll('[id="theme-icon"], .theme-icon').forEach(icon => {
      icon.className = theme === 'dark'
        ? (icon.className.replace('fa-moon', '').replace('fa-sun', '') + ' fas fa-sun').trim()
        : (icon.className.replace('fa-sun', '').replace('fa-moon', '') + ' fas fa-moon').trim();
    });
  }

  function toggle() {
    const current = html.classList.contains('dark') ? 'dark' : 'light';
    apply(current === 'dark' ? 'light' : 'dark');
  }

  function init() {
    apply(getPreferred());
    document.querySelectorAll('[id="theme-toggle"], .theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  }

  return { init, toggle, apply };
})();

/* ═══════════════════════════════════════════════════════════
   2. RTL / LTR TOGGLE
   ═══════════════════════════════════════════════════════════ */
const RTLManager = (() => {
  const STORAGE_KEY = 'gbs-dir';

  function apply(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(STORAGE_KEY, dir);
    updateIcons(dir);
  }

  function updateIcons(dir) {
    document.querySelectorAll('[id="rtl-icon"], .rtl-icon').forEach(icon => {
      icon.style.transform = dir === 'rtl' ? 'scaleX(-1)' : '';
    });
  }

  function toggle() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    apply(current === 'ltr' ? 'rtl' : 'ltr');
  }

  function init() {
    const stored = localStorage.getItem(STORAGE_KEY) || 'ltr';
    apply(stored);
    document.querySelectorAll('[id="rtl-toggle"], .rtl-toggle-btn').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  }

  return { init, toggle };
})();

/* ═══════════════════════════════════════════════════════════
   3. STICKY NAVBAR
   ═══════════════════════════════════════════════════════════ */
const NavbarManager = (() => {
  function init() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    function update() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════
   4. MOBILE NAVIGATION
   ═══════════════════════════════════════════════════════════ */
const MobileMenuManager = (() => {
  function init() {
    const menuBtn    = document.getElementById('mobile-menu-btn');
    const closeBtn   = document.getElementById('mobile-close-btn');
    const menu       = document.getElementById('mobile-menu');
    const overlay    = document.getElementById('mobile-overlay');

    if (!menuBtn || !menu) return;

    function open() {
      menu.classList.add('open');
      if (overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      menu.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    menuBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);

    // Mobile accordion sub-menus
    document.querySelectorAll('.mobile-accordion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const icon   = btn.querySelector('.accordion-arrow');
        if (!target) return;

        const isOpen = target.classList.contains('open');
        document.querySelectorAll('.mobile-sub-menu').forEach(s => s.classList.remove('open'));
        document.querySelectorAll('.accordion-arrow').forEach(i => {
          i.style.transform = '';
        });

        if (!isOpen) {
          target.classList.add('open');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    });
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════
   5. TOAST NOTIFICATION SYSTEM
   ═══════════════════════════════════════════════════════════ */
const ToastManager = (() => {
  let container;

  const ICONS = {
    success: 'fas fa-check',
    error:   'fas fa-times',
    info:    'fas fa-info',
    warning: 'fas fa-exclamation',
  };

  function getContainer() {
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  function show(type = 'info', title = '', message = '', duration = 4000) {
    const c    = getContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    toast.innerHTML = `
      <div class="toast-icon">
        <i class="${ICONS[type] || ICONS.info}"></i>
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close"><i class="fas fa-times fa-xs"></i></button>
      <div class="toast-progress"></div>
    `;

    c.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => dismiss(toast));

    setTimeout(() => dismiss(toast), duration);
    return toast;
  }

  function dismiss(toast) {
    toast.classList.add('hiding');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 400);
  }

  return { show };
})();

/* ═══════════════════════════════════════════════════════════
   6. SCROLL ANIMATIONS (IntersectionObserver)
   ═══════════════════════════════════════════════════════════ */
const ScrollAnimations = (() => {
  function init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right, .stagger-children')
      .forEach(el => observer.observe(el));
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════
   7. NUMBER COUNTER ANIMATION
   ═══════════════════════════════════════════════════════════ */
const CounterManager = (() => {
  function animateCounter(el) {
    const target    = parseFloat(el.dataset.target || '0');
    const duration  = parseInt(el.dataset.duration || '2000');
    const suffix    = el.dataset.suffix || '';
    const prefix    = el.dataset.prefix || '';
    const decimals  = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const start     = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(timestamp) {
      const elapsed  = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutCubic(progress);
      const value    = eased * target;

      el.textContent = prefix + value.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target.toFixed(decimals) + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  function init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = 'true';
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('[data-counter]').forEach(el => observer.observe(el));
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════
   8. ACCORDION / FAQ
   ═══════════════════════════════════════════════════════════ */
const AccordionManager = (() => {
  function init() {
    document.querySelectorAll('.accordion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.accordion-item');
        const body = item.querySelector('.accordion-body');
        const isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.accordion-item.open').forEach(openItem => {
          openItem.classList.remove('open');
          const ob = openItem.querySelector('.accordion-body');
          if (ob) ob.style.maxHeight = '0';
        });

        // Open clicked (if was closed)
        if (!isOpen) {
          item.classList.add('open');
          if (body) body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════
   9. TAB SYSTEM
   ═══════════════════════════════════════════════════════════ */
const TabManager = (() => {
  function init() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const group  = btn.dataset.group || 'default';
        const target = btn.dataset.tab;

        // Deactivate all in group
        document.querySelectorAll(`.tab-btn[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
        document.querySelectorAll(`.tab-panel[data-group="${group}"]`).forEach(p => p.classList.add('hidden'));

        // Activate target
        btn.classList.add('active');
        const panel = document.querySelector(`.tab-panel[data-tab="${target}"][data-group="${group}"]`);
        if (panel) panel.classList.remove('hidden');
      });
    });
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════
   10. FILTER CHIPS (Portfolio / Blog)
   ═══════════════════════════════════════════════════════════ */
const FilterManager = (() => {
  function init() {
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const group = chip.dataset.group || 'default';
        const filter = chip.dataset.filter;

        document.querySelectorAll(`.filter-chip[data-group="${group}"]`).forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const items = document.querySelectorAll(`[data-filter-item][data-group="${group}"]`);
        items.forEach(item => {
          const categories = (item.dataset.category || '').split(',').map(s => s.trim());
          if (filter === 'all' || categories.includes(filter)) {
            item.style.display = '';
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            setTimeout(() => { item.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════
   11. FORM SUBMISSION (Mock Toast)
   ═══════════════════════════════════════════════════════════ */
const FormManager = (() => {
  function init() {
    document.querySelectorAll('form[data-mock]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const type    = form.dataset.mockType || 'success';
        const title   = form.dataset.mockTitle || 'Success!';
        const message = form.dataset.mockMessage || 'Your request has been received.';

        const btn = form.querySelector('[type="submit"]');
        if (btn) {
          const originalText = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Sending...';
          btn.disabled = true;
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            ToastManager.show(type, title, message);
            if (type === 'success') form.reset();
          }, 1500);
        } else {
          ToastManager.show(type, title, message);
        }
      });
    });
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════
   12. PARALLAX SHAPES
   ═══════════════════════════════════════════════════════════ */
const ParallaxManager = (() => {
  function init() {
    const shapes = document.querySelectorAll('[data-parallax]');
    if (!shapes.length) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      shapes.forEach(shape => {
        const speed = parseFloat(shape.dataset.parallax || 0.1);
        shape.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════
   13. COUNTDOWN TIMER (for coming-soon.html)
   ═══════════════════════════════════════════════════════════ */
const CountdownManager = (() => {
  function init() {
    const container = document.getElementById('countdown');
    if (!container) return;

    const targetDate = new Date(container.dataset.date || '2026-12-31T00:00:00');

    function update() {
      const now  = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        container.innerHTML = '<p class="text-accent text-xl font-semibold">We\'re Live!</p>';
        return;
      }

      const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n) => String(n).padStart(2, '0');

      ['days', 'hours', 'minutes', 'seconds'].forEach(unit => {
        const el = document.getElementById(`cd-${unit}`);
        if (el) {
          const val = unit === 'days' ? days : unit === 'hours' ? hours : unit === 'minutes' ? minutes : seconds;
          el.textContent = pad(val);
        }
      });
    }

    update();
    setInterval(update, 1000);
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════
   14. DASHBOARD SIDEBAR TOGGLE
   ═══════════════════════════════════════════════════════════ */
const DashboardManager = (() => {
  function init() {
    const sidebar     = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const toggleBtn   = document.getElementById('sidebar-toggle');
    const overlay     = document.getElementById('sidebar-overlay');

    if (!sidebar) return;

    function toggle() {
      const isCollapsed = sidebar.classList.contains('collapsed');
      if (isCollapsed) {
        sidebar.classList.remove('collapsed');
        if (mainContent) mainContent.classList.remove('expanded');
      } else {
        sidebar.classList.add('collapsed');
        if (mainContent) mainContent.classList.add('expanded');
      }

      if (window.innerWidth <= 1024) {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('open');
      }
    }

    if (toggleBtn) toggleBtn.addEventListener('click', toggle);

    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
      });
    }

    // Handle sidebar responsiveness
    function handleResize() {
      if (window.innerWidth > 1024) {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    window.addEventListener('resize', handleResize, { passive: true });
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════
   15. PRICING TOGGLE (Monthly / Annual)
   ═══════════════════════════════════════════════════════════ */
const PricingManager = (() => {
  function init() {
    const toggle = document.getElementById('pricing-toggle');
    if (!toggle) return;

    toggle.addEventListener('change', () => {
      const isAnnual = toggle.checked;
      document.querySelectorAll('[data-monthly]').forEach(el => {
        el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
      });
      const label = document.getElementById('pricing-label');
      if (label) label.textContent = isAnnual ? 'Annual (Save 20%)' : 'Monthly';
    });
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════
   16. SMOOTH ANCHOR LINKS
   ═══════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   17. FLOATING CARDS RANDOM DELAY
   ═══════════════════════════════════════════════════════════ */
function initFloatingCards() {
  document.querySelectorAll('.floating-card').forEach((card, i) => {
    card.style.animationDelay = `${i * 0.8}s`;
    card.style.animationDuration = `${4.5 + i * 0.5}s`;
  });
}

/* ═══════════════════════════════════════════════════════════
   BOOTSTRAP ALL MODULES
   ═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  RTLManager.init();
  NavbarManager.init();
  MobileMenuManager.init();
  ScrollAnimations.init();
  CounterManager.init();
  AccordionManager.init();
  TabManager.init();
  FilterManager.init();
  FormManager.init();
  ParallaxManager.init();
  CountdownManager.init();
  DashboardManager.init();
  PricingManager.init();
  initSmoothScroll();
  initFloatingCards();
});

/* ─── Expose globally for inline handlers ─────────────────── */
window.GBS = {
  toast: ToastManager.show,
  toggleTheme: ThemeManager.toggle,
  toggleRTL: RTLManager.toggle,
};
