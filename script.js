/* ===========================
   SCRIPT.JS
   Studio — Freelancer Website
   =========================== */

'use strict';

// ============================
// HERO MOCKUP — ANIMIERTER CURSOR (Loop)
// ============================
(function initMockCursor() {
  const cursor = document.getElementById('mockCursor');
  const ripple = document.getElementById('mockRipple');
  if (!cursor || !ripple) return;

  // Klick-Sequenz: Element-ID + welche CSS-Klasse kurz dran kommt
  const sequence = [
    { id: 'mockNav2',  cls: 'mock-link--active'  },
    { id: 'mockNav3',  cls: 'mock-link--active'  },
    { id: 'mockBtn',   cls: 'mock-btn--clicked'  },
    { id: 'mockCard0', cls: 'mock-card--active'  },
    { id: 'mockCard2', cls: 'mock-card--active'  },
    { id: 'mockNav1',  cls: 'mock-link--active'  },
    { id: 'mockBtn',   cls: 'mock-btn--clicked'  },
    { id: 'mockCard1', cls: 'mock-card--active'  },
  ];

  let step = 0;

  function moveCursorTo(el) {
    const container = cursor.parentElement; // .browser-content
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();

    // Cursor-Spitze zeigt auf obere-linke Ecke des Elements + kleiner Offset
    const x = eRect.left - cRect.left + 6;
    const y = eRect.top  - cRect.top  + 4;

    cursor.style.transform = `translate(${x}px, ${y}px)`;
  }

  function fireRipple() {
    ripple.classList.remove('ripple-active');
    void ripple.offsetWidth;
    ripple.classList.add('ripple-active');
  }

  function runStep() {
    const { id, cls } = sequence[step];
    const el = document.getElementById(id);
    if (!el) { step = (step + 1) % sequence.length; return; }

    // 1. Cursor bewegen
    moveCursorTo(el);

    // 2. Nach Transition-Ende (700ms) klicken
    setTimeout(() => {
      fireRipple();
      el.classList.add(cls);
      setTimeout(() => el.classList.remove(cls), 400);
    }, 750);

    step = (step + 1) % sequence.length;
  }

  // Erst starten wenn Reveal-Animation durch ist
  setTimeout(() => {
    runStep();
    setInterval(runStep, 2000);
  }, 1800);
})();


const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// ============================
// MOBILE MENU
// ============================
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
const mobLinks = document.querySelectorAll('.mob-link');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobLinks.forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ============================
// SMOOTH SCROLL
// ============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ============================
// REVEAL ON SCROLL
// ============================
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings within same parent
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
      const sibIdx = siblings.indexOf(entry.target);
      const delay = Math.min(sibIdx * 80, 320);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

// ============================
// CONTACT FORM — Formspree: https://formspree.io/f/mpqbegll
// ============================
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mpqbegll';

const form       = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');
const errorMsg   = document.getElementById('formError');
const errorText  = document.getElementById('formErrorMsg');
const submitBtn  = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hide previous feedback
    successMsg.classList.remove('visible');
    errorMsg.classList.remove('visible');

    // Loading state
    submitBtn.textContent = 'Wird gesendet …';
    submitBtn.disabled = true;

    // Collect all form fields (name, email, service, message)
    const data = new FormData(form);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: {
          // Tell Formspree to return JSON instead of redirecting
          'Accept': 'application/json'
        }
      });

      if (res.ok) {
        // Success
        form.reset();
        submitBtn.style.display = 'none';
        successMsg.classList.add('visible');

        // Reset after 8 seconds
        setTimeout(() => {
          successMsg.classList.remove('visible');
          submitBtn.style.display = '';
          submitBtn.textContent = 'Nachricht senden';
          submitBtn.disabled = false;
        }, 8000);

      } else {
        // Formspree returned an error (e.g. form not active, validation)
        let msg = 'Fehler beim Senden. Bitte erneut versuchen.';
        try {
          const json = await res.json();
          if (json && json.errors && json.errors.length > 0) {
            msg = json.errors.map(err => err.message).join(' · ');
          }
        } catch (_) { /* keep default msg */ }

        if (errorText) errorText.textContent = msg;
        errorMsg.classList.add('visible');
        submitBtn.textContent = 'Nachricht senden';
        submitBtn.disabled = false;
      }

    } catch (err) {
      // Network error
      if (errorText) errorText.textContent = 'Netzwerkfehler, bitte Internetverbindung prüfen.';
      errorMsg.classList.add('visible');
      submitBtn.textContent = 'Nachricht senden';
      submitBtn.disabled = false;
    }
  });
}

// ============================
// MODALS (Impressum & Datenschutz)
// ============================
function setupModal(linkId, modalId, closeId, backdropId) {
  const link = document.getElementById(linkId);
  const modal = document.getElementById(modalId);
  const closeBtn = document.getElementById(closeId);
  const backdrop = document.getElementById(backdropId);

  if (!link || !modal) return;

  function openModal(e) {
    e.preventDefault();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  link.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

setupModal('imprintLink', 'imprintModal', 'imprintClose', 'imprintBackdrop');
setupModal('privacyLink', 'privacyModal', 'privacyClose', 'privacyBackdrop');

// ============================
// SUBTLE PARALLAX ON HERO
// ============================
const heroBrowser = document.querySelector('.hero-visual');
if (heroBrowser && window.innerWidth > 900) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 6;
    heroBrowser.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });
}

// ============================
// ACTIVE NAV LINK HIGHLIGHT
// ============================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => sectionObserver.observe(sec));

// Add active link styles dynamically
const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: var(--pure) !important; }`;
document.head.appendChild(style);
