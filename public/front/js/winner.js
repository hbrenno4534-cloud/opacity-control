(() => {
  const winsBody = document.getElementById('winsBody');
  if (!winsBody) return;

  // Ensure we animate an inner track so the header is never overlapped
  let track = winsBody.querySelector('.wins-track');
  if (!track) {
    track = document.createElement('div');
    track.className = 'wins-track';
    while (winsBody.firstChild) track.appendChild(winsBody.firstChild);
    winsBody.appendChild(track);
  }

  // Random generators
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randFloat = (min, max) => Math.random() * (max - min) + min;
  const formatBR = (n) => n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const randomAvatar = () => `https://i.pravatar.cc/48?img=${randInt(1, 70)}&u=${randInt(1, 1e9)}`;
  const randomUserId = () => `${randInt(100, 999)}**`;
  const games = ['Fire Portals', 'Bandito', 'The Qilin', 'Gods of War', 'Anubis'];
  const vipChance = 0.3;
  const generateRowData = () => {
    const game = games[randInt(0, games.length - 1)];
    const isVip = Math.random() < vipChance;
    const value = isVip ? randFloat(3000, 12000) : randFloat(50, 2999);
    return {
      avatar: randomAvatar(),
      user: randomUserId(),
      game,
      isVip,
      amount: formatBR(value)
    };
  };

  const rowHtml = (d) => {
    const gameLabel = d.game;
    const gameClass = 'game';
    const vipChip = d.isVip ? '' : '';
    return `
    <div class="wins-cell col-user" role="cell"><span class="avatar"><img src="${d.avatar}" alt="${d.user}" loading="lazy"></span><span class="user${d.isVip ? ' vip' : ''}">${d.user}</span>${vipChip}</div>
    <div class="wins-cell col-game" role="cell"><span class="${gameClass}">${gameLabel}</span></div>
    <div class="wins-cell col-amount" role="cell"><span class="amount">${d.amount}</span></div>`;
  };
  const makeRow = (d) => {
    const r = document.createElement('div');
    r.className = d.isVip ? 'wins-row vip' : 'wins-row';
    r.setAttribute('role', 'row');
    r.innerHTML = rowHtml(d);
    return r;
  };

  // initial render 5 rows
  for (let i = 0; i < 5; i++) track.appendChild(makeRow(generateRowData()));

  const advance = () => {
    const first = track.firstElementChild;
    if (!first) return;
    const h = first.offsetHeight;
    first.classList.add('fade-out');
    track.style.transition = 'transform 320ms ease';
    requestAnimationFrame(() => { track.style.transform = `translateY(-${h}px)`; });
    setTimeout(() => {
      const data = generateRowData();
      first.classList.remove('fade-out');
      first.className = data.isVip ? 'wins-row vip' : 'wins-row';
      first.innerHTML = rowHtml(data);
      track.appendChild(first);
      track.style.transition = 'none';
      track.style.transform = 'translateY(0)';
    }, 330);
  };

  const randDelay = () => 2000 + Math.random() * 6000; // 2–8s
  const schedule = () => setTimeout(() => { advance(); schedule(); }, randDelay());
  schedule();
})();

(() => {
  const rankAmounts = Array.from(document.querySelectorAll('.wins-rank .rank-amount'));
  const rankSection = document.querySelector('.wins-rank-wrap');
  if (!rankAmounts.length || !rankSection) return;

  const formatMoney = (value) => `R$ ${Math.round(value).toLocaleString('pt-BR')}`;
  const parseMoney = (text) => {
    const digitsOnly = text.replace(/[^\d]/g, '');
    return digitsOnly ? Number(digitsOnly) : 0;
  };

  const animateTo = (el, target, duration, delay) => {
    el.textContent = formatMoney(0);

    const startAt = performance.now() + delay;
    const step = (now) => {
      if (now < startAt) {
        requestAnimationFrame(step);
        return;
      }

      const elapsed = now - startAt;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out for a more natural finish.
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatMoney(target * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatMoney(target);
      }
    };

    requestAnimationFrame(step);
  };

  let hasAnimated = false;
  const startAnimation = () => {
    if (hasAnimated) return;
    hasAnimated = true;

    rankAmounts.forEach((el, index) => {
      const target = parseMoney(el.textContent || '');
      animateTo(el, target, 1800, index * 180);
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      });
    }, {
      root: null,
      threshold: 0.35
    });

    observer.observe(rankSection);
  } else {
    startAnimation();
  }
})();

/* ── SALA DE CONTROLE – animação de contagem ── */
(() => {
  const section = document.querySelector('.control-room');
  if (!section) return;

  const values = section.querySelectorAll('.control-value');
  if (!values.length) return;

  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const animateValue = (el, target, suffix, duration) => {
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = current.toLocaleString('pt-BR') + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  let fired = false;
  const launch = () => {
    if (fired) return;
    fired = true;
    values.forEach((el, i) => {
      const min = parseInt(el.dataset.targetMin, 10);
      const max = parseInt(el.dataset.targetMax, 10);
      const suffix = el.dataset.suffix || '';
      const target = randInt(min, max);
      setTimeout(() => animateValue(el, target, suffix, 1500), i * 200);
    });
  };

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { launch(); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(section);
  } else {
    launch();
  }
})();
