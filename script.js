// script.js — меню, подсветка активной страницы, плавный скролл, лайтбокс, темы, новости
document.addEventListener('DOMContentLoaded', () => {
  // Set years in footers
  const year = new Date().getFullYear();
  document.querySelectorAll('#year, #year-info, #year-gallery, #year-contacts, #year-news').forEach(el => {
    if (el) el.textContent = year;
  });

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const isDark = localStorage.getItem('darkMode') === 'true';
  if (isDark) body.classList.add('dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark');
      const darkMode = body.classList.contains('dark');
      localStorage.setItem('darkMode', darkMode);
      themeToggle.setAttribute('aria-label', darkMode ? 'Переключить на светлую тему' : 'Переключить на тёмную тему');
    });
  }

  // Highlight active nav item based on body data-page
  const page = document.body.getAttribute('data-page');
  if (page) {
    document.querySelectorAll('.nav-list a').forEach(a => {
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

  // Gallery lightbox (unchanged)
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

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.classList.contains('open')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext(1);
      if (e.key === 'ArrowLeft') showNext(-1);
    }
  });

  // News functionality
  const newsForm = document.getElementById('newsForm');
  const newsGrid = document.getElementById('newsGrid');
  if (newsForm && newsGrid) {
    // Load saved news
    let news = JSON.parse(localStorage.getItem('pogrebiNews')) || [];
    renderNews(news);

    // Form submit
    newsForm.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('newsTitle').value;
      const content = document.getElementById('newsContent').value;
      const dateInput = document.getElementById('newsDate').value;
      const date = dateInput || new Date().toISOString().split('T')[0]; // Default today

      const newNews = { title, content, date };
      news.unshift(newNews); // Add to top
      localStorage.setItem('pogrebiNews', JSON.stringify(news));
      renderNews(news);
      e.target.reset();
      // Animate form hide/show
      newsForm.style.opacity = '0';
      setTimeout(() => { newsForm.style.opacity = '1'; }, 300);
    });
  }

  function renderNews(newsArray) {
    newsGrid.innerHTML = ''; // Clear
    newsArray.forEach((newsItem, idx) => {
      const article = document.createElement('article');
      article.className = 'news-card';
      article.innerHTML = `
        <header class="news-header">
          <time datetime="${newsItem.date}">${new Date(newsItem.date).toLocaleDateString('ru-RU')}</time>
          <h3>${newsItem.title}</h3>
        </header>
        <p>${newsItem.content}</p>
        <footer class="news-footer">
          <a href="#" class="link">Подробнее →</a>
        </footer>
      `;
      newsGrid.appendChild(article);
      // Stagger animation
      setTimeout(() => article.classList.add('animate-in'), 100 * idx);
    });
  }

  // Small UI reveal animation (enhanced for all cards)
  requestAnimationFrame(() => {
    document.querySelectorAll('.card, .gallery-item, .contact-card, .news-card').forEach((el, idx) => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(20px)';
      setTimeout(() => {
        el.style.transition = 'opacity 600ms ease, transform 600ms cubic-bezier(.2,.9,.3,1)';
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
      }, 120 * idx);
    });
  });

  // Form animation on news page
  if (newsForm) {
    newsForm.style.opacity = 0;
    newsForm.style.transform = 'translateY(10px)';
    setTimeout(() => {
      newsForm.style.transition = 'opacity 500ms ease, transform 500ms ease';
      newsForm.style.opacity = 1;
      newsForm.style.transform = 'translateY(0)';
    }, 500);
  }
});
