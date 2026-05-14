/* ===========================
   SCRIPT.JS
   Studio — Freelancer Website
   =========================== */

'use strict';

// ============================
// NAV SCROLL BEHAVIOR
// ============================
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
// CONTACT FORM
// ============================
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Wird gesendet…';
    btn.disabled = true;

    const data = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.reset();
        btn.style.display = 'none';
        successMsg.classList.add('visible');
        setTimeout(() => {
          successMsg.classList.remove('visible');
          btn.style.display = '';
          btn.textContent = 'Nachricht senden';
          btn.disabled = false;
        }, 6000);
      } else {
        const json = await res.json();
        btn.textContent = json?.errors?.map(e => e.message).join(', ') || 'Fehler beim Senden.';
        btn.disabled = false;
        setTimeout(() => { btn.textContent = 'Nachricht senden'; }, 4000);
      }
    } catch (err) {
      btn.textContent = 'Verbindungsfehler. Bitte erneut versuchen.';
      btn.disabled = false;
      setTimeout(() => { btn.textContent = 'Nachricht senden'; }, 4000);
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
