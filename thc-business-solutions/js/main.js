// ============================================================
// THC Business Solutions — Main JavaScript
// Stripe-quality animations: scroll reveals, counters, parallax
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ---- Navbar scroll state ----
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.pageYOffset > 20);
    }, { passive: true });
  }

  // ---- Mobile menu toggle ----
  const toggle = document.querySelector('.nav-mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      const icon = toggle.querySelector('svg');
      if (icon) {
        icon.innerHTML = isOpen
          ? '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
          : '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>';
      }
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        var icon = toggle.querySelector('svg');
        if (icon) {
          icon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>';
        }
      });
    });
  }

  // ---- Active nav link ----
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  // ---- Intersection Observer: fade-in + stagger + counter ----
  var observerOptions = { threshold: 0.08, rootMargin: '0px 0px -30px 0px' };

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Individual fade elements
        if (entry.target.classList.contains('fade-in') ||
            entry.target.classList.contains('fade-scale') ||
            entry.target.classList.contains('fade-left') ||
            entry.target.classList.contains('fade-right')) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
        // Stagger groups
        if (entry.target.classList.contains('stagger-group')) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
        // Stat counters
        if (entry.target.classList.contains('stat-value') && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCounter(entry.target);
          revealObserver.unobserve(entry.target);
        }
      }
    });
  }, observerOptions);

  // Observe all animatable elements
  document.querySelectorAll('.fade-in, .fade-scale, .fade-left, .fade-right, .stagger-group').forEach(function (el) {
    revealObserver.observe(el);
  });

  // ---- Counter animation ----
  function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10) || 0;
    var suffix = el.dataset.suffix || '';
    var duration = Math.min(2000, Math.max(800, target * 3));
    var start = performance.now();

    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  // Observe stat counters
  document.querySelectorAll('.stat-value').forEach(function (el) {
    revealObserver.observe(el);
  });

  // ---- Gradient mesh parallax on scroll ----
  var meshBg = document.querySelector('.mesh-bg');
  if (meshBg) {
    window.addEventListener('scroll', function () {
      var scrollY = window.pageYOffset;
      var hero = meshBg.closest('.mesh-hero');
      if (hero) {
        var rect = hero.getBoundingClientRect();
        var heroTop = rect.top + window.pageYOffset;
        var relativeScroll = window.pageYOffset - heroTop;
        if (relativeScroll > -hero.offsetHeight && relativeScroll < hero.offsetHeight) {
          meshBg.style.transform = 'translateY(' + (relativeScroll * 0.15) + 'px)';
        }
      }
    }, { passive: true });
  }

  // ---- Button hover sound (visual ripple) ----
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      btn.style.setProperty('--x', x + 'px');
      btn.style.setProperty('--y', y + 'px');
    });
  });

  // ---- Lazy load images (native + fallback) ----
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
      img.src = img.dataset.src || img.src;
    });
  }
});
