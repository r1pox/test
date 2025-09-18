// script.js — меню, подсветка активной страницы, плавный скролл, лайтбокс
document.addEventListener('DOMContentLoaded', () => {
  // Set years in footers
  const year = new Date().getFullYear();
  document.querySelectorAll('#year, #year-info, #year-gallery, #year-contacts').forEach(el => {
    if (el) el.textContent = year;
  });

  // Mobile nav toggle (shared)
  const navToggleButtons = document.querySelectorAll('.nav-toggle');
  navToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const navList = document.getElementById('navList');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', (!expanded).toString());
      navList.classList.toggle('open');
      btn.classList.toggle('open');
    });
  });

  // Highlight active nav item based on body data-page
  const page = document.body.getAttribute('data-page');
  if (page) {
    document.querySelectorAll('.nav-list a').forEach(a => {
      // highlight by href containing page name
      if (a.getAttribute('href').includes(page)) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  // Smooth scroll for internal anchors (if used)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // Gallery lightbox
  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  let imgs = [];
  let currentIndex = 0;

  if (galleryGrid) {
    imgs = Array.from(galleryGrid.querySelectorAll('img'));
    imgs.forEach((img, i) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => openLightbox(i));
    });
  }

  function openLightbox(i) {
    currentIndex = i;
    const full = imgs[i].dataset.full || imgs[i].src;
    lightboxImg.src = full;
    lightboxImg.alt = imgs[i].alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    // lock scroll
    document.documentElement.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.documentElement.style.overflow = '';
  }

  function showNext(delta) {
    if (!imgs.length) return;
    currentIndex = (currentIndex + delta + imgs.length) % imgs.length;
    const full = imgs[currentIndex].dataset.full || imgs[currentIndex].src;
    lightboxImg.src = full;
    lightboxImg.alt = imgs[currentIndex].alt || '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', () => showNext(1));
  if (prevBtn) prevBtn.addEventListener('click', () => showNext(-1));

  // Close on backdrop click
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard nav for lightbox
  document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.classList.contains('open')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext(1);
      if (e.key === 'ArrowLeft') showNext(-1);
    }
  });

  // Lazy-load polyfill fallback (modern browsers have it)
  // Ensure images have loading="lazy" in HTML; nothing else required here.

  // Small UI reveal animation
  requestAnimationFrame(() => {
    document.querySelectorAll('.card, .gallery-item, .contact-card').forEach((el, idx) => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(10px)';
      setTimeout(() => {
        el.style.transition = 'opacity 520ms ease, transform 520ms cubic-bezier(.2,.9,.3,1)';
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
      }, 80 * idx);
    });
  });
});
