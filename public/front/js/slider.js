(() => {
  const track = document.getElementById('gamesTrack');
  if (!track) return;

  const prev = document.querySelector('.slider-btn.prev');
  const next = document.querySelector('.slider-btn.next');

  const cards = () => Array.from(track.querySelectorAll('.game-card'));
  const wrap = (i, n) => (n ? ((i % n) + n) % n : 0);

  let current = 0;
  let isAnimating = false;
  let animTO = 0;
  const ANIM_MS = 420; // duracao aproximada do scroll suave
  const EPS = 2; // tolerancia para bordas do scroll
  const atStart = () => track.scrollLeft <= EPS;
  const atEnd = () => Math.ceil(track.scrollLeft + EPS) >= (track.scrollWidth - track.clientWidth);

  // Support both the old CTA classes and the new `.game-cta` class.
  const actionSelector = '.game-cta, .btn.pill.small';

  function nearestIndex() {
    const cs = cards();
    if (!cs.length) return 0;
    let idx = 0, min = Infinity;
    const sl = track.scrollLeft;
    cs.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - sl);
      if (d < min) { min = d; idx = i; }
    });
    return idx;
  }

  function scrollToIndex(i) {
    const cs = cards();
    const n = cs.length;
    if (!n) return;
    current = wrap(i, n);
    const left = cs[current].offsetLeft;
    isAnimating = true;
    if (animTO) clearTimeout(animTO);
    track.scrollTo({ left, behavior: 'smooth' });
    animTO = window.setTimeout(() => { isAnimating = false; }, ANIM_MS);
  }

  // Navegacao apenas por setas, com loop 1 a 1
  prev?.addEventListener('click', () => {
    const n = cards().length; if (!n) return;
    if (atStart()) scrollToIndex(n - 1); else scrollToIndex(current - 1);
  });

  next?.addEventListener('click', () => {
    const n = cards().length; if (!n) return;
    if (atEnd()) scrollToIndex(0); else scrollToIndex(current + 1);
  });

  // Atualiza o indice quando o usuario rola manualmente
  track.addEventListener('scroll', () => {
    if (isAnimating) return;
    current = nearestIndex();
  }, { passive: true });

  const recalc = () => { current = nearestIndex(); };
  window.addEventListener('resize', recalc);
  window.addEventListener('load', recalc);
  recalc();

  function setCollected(card, count) {
    const title = card.querySelector('.game-title');
    if (title) title.textContent = `FALHAS COLETADAS: ${count}`;

    // Featured/unlocked card: show a "found" scan title.
    const scanLabel = card.querySelector('.scan-label');
    if (scanLabel) scanLabel.textContent = 'FALHAS ENCONTRADAS!';
    const scanProgress = card.querySelector('.scan-progress');
    if (scanProgress) scanProgress.setAttribute('aria-label', 'Falhas encontradas');
  }

  function setVerificando(card) {
    const title = card.querySelector('.game-title');
    if (title) title.textContent = 'VERIFICANDO...';

    // Non-featured cards keep the "searching" scan title.
    const scanLabel = card.querySelector('.scan-label');
    if (scanLabel) scanLabel.textContent = 'PROCURANDO FALHAS';
    const scanProgress = card.querySelector('.scan-progress');
    if (scanProgress) scanProgress.setAttribute('aria-label', 'Procurando falhas');

    let validity = card.querySelector('.scan-validity');
    if (!validity) {
      validity = document.createElement('div');
      validity.className = 'scan-validity';
      const action = card.querySelector(actionSelector);
      if (action) action.insertAdjacentElement('afterend', validity);
    }
    if (validity) validity.textContent = 'Disponivel assim que encontrarmos as falhas';
  }

  function animateProgress(card, target, durationMs) {
    const fill = card.querySelector('.scan-fill');
    const percentEl = card.querySelector('.scan-percent');
    const start = 0;
    const total = Math.max(1, target - start);
    const stepMin = Math.max(1, Math.round(total / 20));
    const stepMax = Math.max(stepMin + 1, Math.round(total / 8));
    const tickMin = Math.max(180, Math.round(durationMs / 12));
    const tickMax = Math.max(tickMin + 80, Math.round(durationMs / 6));
    let value = start;
    let count = Number(card.dataset.collectedCount || 0);
    const maxCollect = 20;
    if (fill) fill.style.width = '0%';
    const tick = () => {
      const step = Math.min(total, stepMin + Math.floor(Math.random() * (stepMax - stepMin + 1)));
      value = Math.min(target, value + step);
      if (count < maxCollect) count += 1;
      if (percentEl) percentEl.textContent = `${value}%`;
      if (card.classList.contains('is-featured')) setCollected(card, count);
      else setVerificando(card);
      if (fill) fill.style.width = `${value}%`;
      card.dataset.scanProgress = String(value);
      card.dataset.collectedCount = String(count);
      if (value < target) {
        const delay = tickMin + Math.floor(Math.random() * (tickMax - tickMin + 1));
        window.setTimeout(tick, delay);
      }
    };
    window.setTimeout(tick, tickMin);
  }

  function setupScan() {
    const cs = cards();
    if (!cs.length) return;

    const lockIconHTML = '<i class="bi bi-lock-fill" aria-hidden="true"></i>';

    function blockClick(e) {
      if (e.currentTarget.classList.contains('is-locked')) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    const playable = cs.filter((card) => card.querySelector(actionSelector));
    const chosen = playable.length ? playable[Math.floor(Math.random() * playable.length)] : cs[0];
    const chosenIndex = cs.indexOf(chosen);
    const endAt = Date.now() + 15 * 60 * 1000;

    cs.forEach((card) => {
      const action = card.querySelector(actionSelector);
      if (!action) return;
      const label = action.querySelector('.label');

      if (card === chosen) {
        if (label) label.textContent = 'ACESSAR';
        else action.textContent = 'ACESSAR';
        action.removeAttribute('aria-label');

        card.classList.remove('is-locked', 'is-scanning');
        card.classList.add('is-unlocked', 'is-featured');
        action.classList.remove('is-locked');
        action.setAttribute('aria-disabled', 'false');
        action.removeAttribute('tabindex');

        // Mantém o destino correspondente do próprio card (sem forçar Anubis)
        const targetHref =
          action.getAttribute('href') ||
          card.querySelector('.thumb a')?.getAttribute('href') ||
          '#';
        action.setAttribute('href', targetHref);
        action.classList.remove('is-locked');
        action.onclick = null;

        const percentEl = card.querySelector('.scan-percent');
        const fill = card.querySelector('.scan-fill');
        if (percentEl) percentEl.textContent = '100%';
        if (fill) fill.style.width = '100%';
        card.dataset.scanProgress = '100';
        card.dataset.collectedCount = '20';
        setCollected(card, 20);

        let validity = card.querySelector('.scan-validity');
        if (!validity) {
          validity = document.createElement('div');
          validity.className = 'scan-validity';
          action.insertAdjacentElement('afterend', validity);
        }
        let timer;
        const tick = () => {
          const remaining = Math.max(0, endAt - Date.now());
          const totalSeconds = Math.floor(remaining / 1000);
          const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
          const secs = String(totalSeconds % 60).padStart(2, '0');
          validity.textContent = `Disponivel por ${mins}:${secs}`;
          if (remaining <= 0 && timer) clearInterval(timer);
        };
        tick();
        timer = window.setInterval(tick, 1000);
        return;
      }

      if (label) label.innerHTML = lockIconHTML;
      else action.innerHTML = lockIconHTML;
      action.setAttribute('aria-label', 'Bloqueado');
      setVerificando(card);
      const target = 55 + Math.floor(Math.random() * 35);
      card.dataset.scanProgress = '0';
      card.dataset.collectedCount = '0';
      animateProgress(card, target, 900);
      card.classList.add('is-locked', 'is-scanning');
      action.classList.add('is-locked');
      action.setAttribute('aria-disabled', 'true');
      action.setAttribute('tabindex', '-1');
      action.addEventListener('click', blockClick);
    });

    if (chosen) {
      cs.forEach((card) => {
        if (card !== chosen) card.classList.add('is-dim');
      });
      if (chosenIndex >= 0) window.requestAnimationFrame(() => scrollToIndex(chosenIndex));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupScan, { once: true });
  } else {
    setupScan();
  }
})();

(() => {
  const section = document.getElementById('forbiddenGames');
  if (!section) return;

  const track = section.querySelector('.forbidden-track');
  const prev = section.querySelector('.forbidden-prev');
  const next = section.querySelector('.forbidden-next');
  if (!track || !prev || !next) return;

  const cards = () => Array.from(track.querySelectorAll('.game-card'));
  const wrap = (i, n) => (n ? ((i % n) + n) % n : 0);

  let current = 0;
  let isAnimating = false;
  let animTO = 0;
  const ANIM_MS = 420;
  const EPS = 2;
  const atStart = () => track.scrollLeft <= EPS;
  const atEnd = () => Math.ceil(track.scrollLeft + EPS) >= (track.scrollWidth - track.clientWidth);

  function nearestIndex() {
    const cs = cards();
    if (!cs.length) return 0;
    let idx = 0;
    let min = Infinity;
    const sl = track.scrollLeft;
    cs.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - sl);
      if (d < min) {
        min = d;
        idx = i;
      }
    });
    return idx;
  }

  function scrollToIndex(i) {
    const cs = cards();
    const n = cs.length;
    if (!n) return;
    current = wrap(i, n);
    const left = cs[current].offsetLeft;
    isAnimating = true;
    if (animTO) clearTimeout(animTO);
    track.scrollTo({ left, behavior: 'smooth' });
    animTO = window.setTimeout(() => {
      isAnimating = false;
    }, ANIM_MS);
  }

  prev.addEventListener('click', () => {
    const n = cards().length;
    if (!n) return;
    if (atStart()) scrollToIndex(n - 1);
    else scrollToIndex(current - 1);
  });

  next.addEventListener('click', () => {
    const n = cards().length;
    if (!n) return;
    if (atEnd()) scrollToIndex(0);
    else scrollToIndex(current + 1);
  });

  track.addEventListener('scroll', () => {
    if (isAnimating) return;
    current = nearestIndex();
  }, { passive: true });

  const recalc = () => {
    current = nearestIndex();
  };
  window.addEventListener('resize', recalc);
  window.addEventListener('load', recalc);
  recalc();
})();
