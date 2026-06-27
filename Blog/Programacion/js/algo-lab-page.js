(function () {
  'use strict';

  const params = new URLSearchParams(location.search);
  const slug = params.get('id');
  const algo = slug ? window.getMlAlgorithm(slug) : null;

  if (!algo) {
    document.body.innerHTML =
      '<main style="padding:48px;text-align:center;color:#9aa3b2;font-family:system-ui"><h1 style="color:#fff">Algoritmo no encontrado</h1><p><a href="index.html" style="color:#23f0ec">Volver a Programación</a></p></main>';
    return;
  }

  document.title = `${algo.name} — Simulación | Programación · SigmaDG`;
  document.documentElement.style.setProperty('--algo-color', algo.color);

  let currentSim = null;
  let animId = null;
  let playing = false;

  const els = {
    breadcrumb: document.getElementById('algoBreadcrumb'),
    title: document.getElementById('algoTitle'),
    subtitle: document.getElementById('algoSubtitle'),
    meta: document.getElementById('algoMeta'),
    steps: document.getElementById('algoSteps'),
    stepDesc: document.getElementById('stepDesc'),
    caption: document.getElementById('algoCaption'),
    canvas: document.getElementById('algoCanvas'),
    controls: document.getElementById('algoControls'),
    metrics: document.getElementById('algoMetrics'),
    play: document.getElementById('btnPlay'),
    next: document.getElementById('btnNext'),
    reset: document.getElementById('btnReset'),
    nav: document.getElementById('algoNav'),
  };

  els.breadcrumb.innerHTML = `<a href="index.html">Programación</a> · ${algo.categoryTitle.replace(/^\d+\.\s*/, '')} · ${algo.subgroupTitle}`;
  els.title.textContent = algo.name;
  els.subtitle.textContent = `Simulación interactiva paso a paso de «${algo.name}». ${algo.subgroupDesc || 'Explora cómo funciona el algoritmo ajustando parámetros y avanzando por las etapas.'}`;
  els.meta.innerHTML = `
    <span class="algo-badge" style="background:${algo.color}22;color:${algo.color};border-color:${algo.color}55">${algo.subgroupTitle}</span>
    <span class="algo-badge algo-badge--live">Simulación activa</span>`;

  function renderSteps() {
    if (!currentSim) return;
    const steps = currentSim.getSteps();
    const cur = currentSim.getStep();
    els.steps.innerHTML = steps
      .map(
        (s, i) =>
          `<button type="button" class="algo-step-btn${i === cur ? ' active' : ''}${i < cur ? ' done' : ''}" data-step="${i}">${s.title}</button>`
      )
      .join('');
    els.stepDesc.textContent = steps[cur]?.desc || '';
    els.next.disabled = cur >= steps.length - 1;

    els.steps.querySelectorAll('.algo-step-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        stopPlay();
        goToStep(parseInt(btn.dataset.step, 10));
      });
    });
  }

  function renderControls() {
    if (!currentSim?.getControls) {
      els.controls.innerHTML = '';
      return;
    }
    const controls = currentSim.getControls();
    if (!controls.length) {
      els.controls.innerHTML = '<p class="algo-controls-empty">Este paso no tiene parámetros ajustables.</p>';
      return;
    }
    els.controls.innerHTML = controls
      .map(
        (c) => `
      <div class="algo-control">
        <label><span>${c.label}</span><span id="val-${c.name}">${c.value}</span></label>
        <input type="range" id="ctrl-${c.name}" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.value}" aria-label="${c.label}">
      </div>`
      )
      .join('');

    controls.forEach((c) => {
      const input = document.getElementById(`ctrl-${c.name}`);
      input?.addEventListener('input', () => {
        const val = parseFloat(input.value);
        document.getElementById(`val-${c.name}`).textContent = val;
        currentSim.setParam(c.name, val);
        updateMetrics();
      });
    });
  }

  function updateMetrics() {
    if (!currentSim?.getMetrics) return;
    const m = currentSim.getMetrics();
    els.metrics.innerHTML = Object.entries(m)
      .map(([k, v]) => `<div class="algo-metric-row"><span>${k}</span><span>${v}</span></div>`)
      .join('');
  }

  function goToStep(n) {
    currentSim?.goToStep(n);
    renderSteps();
    renderControls();
    updateMetrics();
    updateCaption();
  }

  function updateCaption() {
    const step = currentSim?.getStep() ?? 0;
    const templates = window.AlgoSims.getStepTemplates(algo.simType);
    els.caption.textContent = `${algo.name}: ${templates[step]?.title || 'Simulación'} — observa el canvas y ajusta los controles.`;
  }

  function initSim() {
    if (currentSim?.destroy) currentSim.destroy();
    currentSim = window.AlgoSims.create(algo.simType, els.canvas, {
      color: algo.color,
      algorithmName: algo.name,
      variant: algo.variant,
    });
    goToStep(0);
  }

  function loop() {
    if (playing) currentSim?.stepFrame?.();
    updateMetrics();
    animId = requestAnimationFrame(loop);
  }

  function stopPlay() {
    playing = false;
    currentSim?.pause?.();
    els.play.textContent = '▶ Reproducir';
  }

  els.play.addEventListener('click', () => {
    playing = !playing;
    els.play.textContent = playing ? '⏸ Pausar' : '▶ Reproducir';
    if (playing) currentSim?.play?.();
    else currentSim?.pause?.();
  });

  els.next.addEventListener('click', () => {
    stopPlay();
    goToStep((currentSim?.getStep() ?? 0) + 1);
  });

  els.reset.addEventListener('click', () => {
    stopPlay();
    currentSim?.reset?.();
    renderSteps();
    renderControls();
    updateMetrics();
    updateCaption();
  });

  window.addEventListener('resize', () => currentSim?.resize?.());

  const adj = window.getAdjacentAlgorithms(slug);
  els.nav.innerHTML = `
    ${adj.prev ? `<a href="algoritmo.html?id=${adj.prev.slug}">← ${adj.prev.name.slice(0, 36)}${adj.prev.name.length > 36 ? '…' : ''}</a>` : '<a class="disabled" href="#">← Anterior</a>'}
    ${adj.next ? `<a href="algoritmo.html?id=${adj.next.slug}">${adj.next.name.slice(0, 36)}${adj.next.name.length > 36 ? '…' : ''} →</a>` : '<a class="disabled" href="#">Siguiente →</a>'}`;

  initSim();
  loop();
  requestAnimationFrame(() => currentSim?.resize?.());
})();
