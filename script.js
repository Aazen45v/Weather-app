(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile navigation toggle
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('hidden') === false;
      navToggle.setAttribute('aria-expanded', String(isOpen));

      const openIcon = navToggle.querySelector('[data-icon="menu"]');
      const closeIcon = navToggle.querySelector('[data-icon="close"]');
      if (openIcon && closeIcon) {
        openIcon.classList.toggle('hidden', isOpen);
        closeIcon.classList.toggle('hidden', !isOpen);
      }
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        navToggle.setAttribute('aria-expanded', 'false');
        const openIcon = navToggle.querySelector('[data-icon="menu"]');
        const closeIcon = navToggle.querySelector('[data-icon="close"]');
        if (openIcon && closeIcon) {
          openIcon.classList.remove('hidden');
          closeIcon.classList.add('hidden');
        }
      });
    });
  }

  // Scroll reveal animations
  const revealEls = document.querySelectorAll('.fade-in-up');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  // Animated stat counters
  const statEls = document.querySelectorAll('[data-counter-target]');

  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-counter-target'));
    const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
    const suffix = el.getAttribute('data-counter-suffix') || '';
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    statEls.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-counter-target'));
      const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
      const suffix = el.getAttribute('data-counter-suffix') || '';
      el.textContent = target.toFixed(decimals) + suffix;
    });
  } else {
    const statObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    statEls.forEach((el) => statObserver.observe(el));
  }

  // Contact form (front-end demo only)
  const contactForm = document.getElementById('contact-form');
  const contactSuccess = document.getElementById('contact-success');

  if (contactForm && contactSuccess) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      contactForm.classList.add('hidden');
      contactSuccess.classList.remove('hidden');
      contactSuccess.focus();
    });
  }
})();
