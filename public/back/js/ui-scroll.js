(() => {
  const bottomNav = document.querySelector('.mobile-bottom-nav');
  if (!bottomNav) return;

  const mq = window.matchMedia('(max-width: 1023px)');
  const showAfter = 70;
  const isGamePage = document.body.classList.contains('game-page');

  let ticking = false;
  let visible = false;

  const setVisible = (nextVisible) => {
    if (visible === nextVisible) return;
    visible = nextVisible;
    bottomNav.classList.toggle('is-visible', visible);
  };

  const update = () => {
    ticking = false;
    if (!mq.matches) {
      setVisible(false);
      return;
    }

    // In game pages (or pages with no vertical room to scroll), keep the bottom nav visible.
    const scrollRoom = document.documentElement.scrollHeight - window.innerHeight;
    if (isGamePage || scrollRoom <= 10) {
      setVisible(true);
      return;
    }

    setVisible(window.scrollY > showAfter);
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
