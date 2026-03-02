(() => {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  document.body.appendChild(overlay);

  document.body.classList.add('page-loaded');

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href) return;
    if (link.target === '_blank' || href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript')) return;

    e.preventDefault();
    overlay.classList.add('active');
    setTimeout(() => {
      window.location.href = href;
    }, 300);
  });
})();
