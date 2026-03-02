(() => {
  const qs = (s, r = document) => r.querySelector(s);
  const statusEl = qs('#opStatus');
  const panel = qs('#opPanel');
  const bar = qs('#opBar');
  const log = qs('#opLog');
  const stepsEl = qs('#opSteps');
  const outNorm = qs('#opNorm');
  const outTurbo = qs('#opTurbo');
  const outValid = qs('#opValid');
  const outConf = qs('#opConf');
  const outGauge = qs('#opGauge');
  const runBtn = qs('#opRun');
  const followBtn = qs('#opFollow');
  const isSignalButton = followBtn?.classList.contains('signal-link-btn');
  const signalPrimary = isSignalButton ? followBtn.querySelector('.one') : null;
  const signalFinalLabel = isSignalButton ? followBtn.querySelector('.two') : null;
  const signalUrl =
    (isSignalButton ? followBtn.dataset.targetUrl : null) ||
    followBtn?.dataset.targetUrl ||
    followBtn?.getAttribute('href');
  const autoRun = panel?.dataset.autoRun === 'true';

  let cooldownInt = 0, validInt = 0;
  if (autoRun) {
    panel?.classList.add('results-hidden', 'radar-hidden');
  } else {
    panel?.classList.add('only-button', 'results-hidden');
  }
  if (followBtn) followBtn.style.display = 'none';

  // Code preview helpers
  function codeClear(){ log.textContent=''; }
  function codeAppend(line){ log.textContent += (log.textContent ? '\n' : '') + line; log.scrollTop = log.scrollHeight; }

  // Initialize placeholders as loading until first run
  [outNorm,outTurbo,outValid,outConf].forEach(el => {
    if (el) {
      el.textContent = '...';
      el.classList.add('loading');
      el.classList.remove('muted');
    }
  });

  function setStatus(txt, cls='') {
    if (!statusEl) return;
    const hideText = panel?.dataset.hideStatusText === 'true';
    statusEl.textContent = hideText ? '' : txt;
    statusEl.className = `op-status ${cls}`.trim();
  }

  function renderSteps(items){
    stepsEl.innerHTML = '';
    items.forEach((t) => {
      const li = document.createElement('li');
      li.className = 'op-step pending';
      li.innerHTML = `<span class="dot"></span><span class="txt">${t}</span>`;
      stepsEl.appendChild(li);
    });
  }

  function setStepState(idx, state){
    const li = stepsEl?.children?.[idx];
    if (!li) return;
    li.className = `op-step ${state}`;
  }

  let signalAnimationFrame = null;
  let signalRunning = false;

  const cancelSignalAnimation = () => {
    if (signalAnimationFrame) {
      cancelAnimationFrame(signalAnimationFrame);
      signalAnimationFrame = null;
    }
    signalRunning = false;
  };

  const setSignalProgress = (value = 0) => {
    if (!isSignalButton) return;
    const pct = Math.min(100, Math.max(0, Math.round(value)));
    followBtn.style.setProperty('--signal-progress', `${pct}%`);
    if (signalPrimary) signalPrimary.textContent = `GERANDO... ${pct}%`;
  };

  const resetSignalButtonState = () => {
    if (!isSignalButton) return;
    cancelSignalAnimation();
    followBtn.classList.remove('is-ready', 'is-generating', 'is-blinking');
    followBtn.disabled = true;
    setSignalProgress(0);
    if (signalFinalLabel) signalFinalLabel.textContent = 'ENTRAR NO LINK HACKEADO';
  };

  const finalizeSignalButton = () => {
    if (!isSignalButton) return;
    cancelSignalAnimation();
    followBtn.classList.remove('is-generating');
    followBtn.classList.add('is-ready', 'is-blinking');
    followBtn.disabled = false;
    setSignalProgress(100);
    if (signalFinalLabel) signalFinalLabel.textContent = 'ENTRAR NO LINK HACKEADO';
  };

  const startSignalProgressSequence = () => {
    if (!isSignalButton || signalRunning) return;
    cancelSignalAnimation();
    signalRunning = true;
    followBtn.disabled = true;
    followBtn.classList.remove('is-ready', 'is-blinking');
    followBtn.classList.add('is-generating');
    setSignalProgress(0);
    const duration = 3000;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = Math.min(duration, now - startTime);
      const pct = (elapsed / duration) * 100;
      setSignalProgress(pct);
      if (elapsed >= duration) {
        signalRunning = false;
        finalizeSignalButton();
      } else {
        signalAnimationFrame = requestAnimationFrame(animate);
      }
    };
    signalAnimationFrame = requestAnimationFrame(animate);
  };

  if (isSignalButton) {
    resetSignalButtonState();
    followBtn.addEventListener('click', (event) => {
      if (!followBtn.classList.contains('is-ready')) {
        event.preventDefault();
        return;
      }
      if (signalUrl) {
        window.open(signalUrl, '_blank');
      }
    });
  }

  function progressTo(pct, ms, cb){
    const start = parseFloat(bar.style.width) || 0;
    const end = pct;
    const t0 = performance.now();
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / ms);
      const v = start + (end - start) * k;
      bar.style.width = v + '%';
      if (k < 1) requestAnimationFrame(tick);
      else cb?.();
    };
    requestAnimationFrame(tick);
  }

  function resolveGameName(rawName) {
    const key = String(rawName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const map = {
      fireportals: 'Fire Portals',
      anubiswrath: 'Anubis Wrath',
      wildbandito: 'Wild Bandito',
      waysoftheqilin: 'Ways of the Qilin',
      godsofwar: 'Gods of War'
    };
    if (map[key]) return map[key];
    return rawName || 'Jogo';
  }

  function run(){
    if (runBtn && runBtn.disabled && !autoRun) return;
    setStatus('invadindo');
    panel?.classList.remove('only-button');
    panel?.classList.add('results-hidden');
    panel?.classList.add('radar-hidden');
    if (followBtn) followBtn.style.display = 'none';

    if (runBtn) {
      runBtn.disabled = true;
      const label = runBtn.querySelector('.label');
      if (label) label.textContent = 'GERANDO SINAL...';
    }
    if (validInt) { clearInterval(validInt); validInt = 0; }
    bar.style.width = '0%';

    // show panels with animation
    panel?.classList.add('running');
    stepsEl?.classList.add('open');
    log?.classList.add('open');

    // set placeholders loading
    [outNorm,outTurbo,outValid,outConf].forEach(el => {
      el.classList.remove('muted');
      el.classList.add('loading');
      el.textContent = '...';
    });

    const gameName = resolveGameName(panel?.dataset.game);
    const steps = [
      'Conectando à rede do cofre...',
      'Desativando alarmes...',
      'Invadindo sistema de segurança...',
      'Quebrando criptografia do cofre...',
      'Acessando protocolo secreto...',
      'Extraindo vulnerabilidade...',
      'ASSALTO EM ANDAMENTO...'
    ];
    renderSteps(steps);

    // start code preview - heist terminal style
    codeClear();
    codeAppend('> INICIANDO OPERAÇÃO: LA CASA DE LUCRO');
    codeAppend(`> ALVO: ${gameName}`);
    codeAppend('> STATUS: INFILTRANDO...');
    codeAppend('> ssh -p 443 cofre@plataforma.secure');
    codeAppend('> Conexão estabelecida...');
    codeAppend('> bypass --firewall --level=max');
    codeAppend('> Firewall desativado ✓');

    // tempo total 8 a 18s
    const total = 8000 + Math.random() * 10000;
    const per = total / steps.length;
    let i = 0;
    setStepState(0, 'active');
    const advance = () => {
      setStepState(i, 'ok');
      i++;
      if (i >= steps.length) { progressTo(100, 300, finish); return; }
      setStepState(i, 'active');
      const progress = (i / steps.length) * 100;
      progressTo(progress, 200, () => {});
      switch (i) {
        case 1: codeAppend('> Alarmes neutralizados ✓'); break;
        case 2: codeAppend('> decrypt --vault --brute-force'); break;
        case 3: codeAppend('> Criptografia AES-256 quebrada ✓'); break;
        case 4: codeAppend('> inject --payload=MÉTODO_SECRETO'); break;
        case 5: codeAppend('> Vulnerabilidade encontrada!'); break;
        case 6: codeAppend('> EXECUTANDO ASSALTO FINAL...'); codeAppend('> ██████████████████████ 100%'); break;
      }
      setTimeout(advance, per * (0.75 + Math.random() * 0.5));
    };
    setTimeout(advance, per * 0.6);
  }

  function finish(){
    // an�lise finalizada
    panel?.classList.remove('results-hidden');
    if (followBtn) {
      followBtn.style.display = '';
      startSignalProgressSequence();
    }
    stepsEl?.classList.remove('open');
    log?.classList.remove('open');
    codeClear();

    // Outputs: normal/turbo (rodadas), validade 2:00, acerto 90-95%
    const norm = Math.floor(10 + Math.random() * 16); // 10-25
    const turbo = Math.floor(5 + Math.random() * 6); // 5-10
    const conf = 90 + Math.random() * 5; // 90-95

    outNorm.textContent = `${norm}x`;
    outTurbo.textContent = `${turbo}x`;

    let left = 180;
    const renderValid = () => {
      const mm = String(Math.floor(left / 60)).padStart(2, '0');
      const ss = String(left % 60).padStart(2, '0');
      outValid.textContent = `${mm}:${ss}`;
    };
    renderValid();
    validInt = setInterval(() => {
      left--;
      if (left <= 0) {
        clearInterval(validInt);
        validInt = 0;
        outValid.textContent = 'EXPIRADO';
        resetToRadar();
      } else {
        renderValid();
      }
    }, 1000);

    outConf.textContent = `${conf.toFixed(2)}%`;
    if (outGauge) {
      outGauge.style.setProperty('--fill', conf.toFixed(2) + '%');
    }

    // finalize code preview with plan
    codeAppend('  const plan = {');
    codeAppend(`    normal: '${norm}x',`);
    codeAppend(`    turbo: '${turbo}x',`);
    codeAppend('    valid: "180s",');
    codeAppend(`    accuracy: "${conf.toFixed(2)}%"`);
    codeAppend('  };');
    codeAppend('  return plan;');
    codeAppend('}');

    [outNorm,outTurbo,outValid,outConf].forEach(el => { el.classList.remove('loading'); });
    panel?.classList.remove('running');
  }

  function resetToRadar(){
    if (autoRun) {
      run();
      return;
    }
    panel?.classList.add('only-button', 'results-hidden');
    panel?.classList.remove('running', 'radar-hidden');
    stepsEl?.classList.remove('open');
    log?.classList.remove('open');
    codeClear();
    if (followBtn) followBtn.style.display = 'none';
    if (isSignalButton) {
      resetSignalButtonState();
    }
    if (runBtn) {
      runBtn.disabled = false;
      const label = runBtn.querySelector('.label');
      if (label) label.textContent = 'COLETAR FALHAS';
    }
    setStatus('pronto');
    [outNorm,outTurbo,outValid,outConf].forEach(el => {
      el.textContent = '...';
      el.classList.add('loading');
      el.classList.remove('muted');
    });
}
  runBtn?.addEventListener('click', run);
  if (autoRun) {
    requestAnimationFrame(run);
  }
})();
