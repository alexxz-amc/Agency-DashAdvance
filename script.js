/**
 * DashAdvance — main.js
 * Comportamientos interactivos de la web.
 *
 * 1. Header sticky con efecto blur al hacer scroll
 * 2. Botón flotante de WhatsApp que aparece tras 600px
 * 3. Acordeón de FAQ
 * 4. Reveal animations al hacer scroll (IntersectionObserver)
 * 5. Smooth scroll para anchor links
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------
  // 1. Header scroll effect + WhatsApp float visibility
  // --------------------------------------------------------------------
  const header = document.getElementById('header');
  const waFloat = document.getElementById('waFloat');

  function handleScroll() {
    const scrolled = window.scrollY > 60;
    if (header) header.classList.toggle('scrolled', scrolled);
    if (waFloat) waFloat.classList.toggle('visible', window.scrollY > 600);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // estado inicial

  // --------------------------------------------------------------------
  // 2. FAQ toggles
  // --------------------------------------------------------------------
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.parentElement.classList.toggle('open');
    });
  });

  // --------------------------------------------------------------------
  // 3. Reveal on scroll
  // --------------------------------------------------------------------
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback para navegadores antiguos: revelar todo de inmediato
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --------------------------------------------------------------------
  // 4. Smooth scroll para anchor links
  // --------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
