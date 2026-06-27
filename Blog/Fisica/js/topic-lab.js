(function () {
  'use strict';

  const params = new URLSearchParams(location.search);
  const topicId = params.get('id');
  let currentSim = null;
  let animId = null;
  let playing = false;

  const topic = topicId ? window.getFisicaTopic(topicId) : null;

  if (!topic) {
    document.body.innerHTML = '<main style="padding:48px;text-align:center;color:#9aa3b2;font-family:system-ui"><h1 style="color:#fff">Tema no encontrado</h1><p><a href="index.html" style="color:#38bdf8">Volver a Física</a></p></main>';
    return;
  }

  document.title = `${topic.title} — Laboratorio | Física · SigmaDG`;
  document.documentElement.style.setProperty('--tema-color', topic.courseColor);

  const els = {
    breadcrumb: document.getElementById('temaBreadcrumb'),
    title: document.getElementById('temaTitle'),
    meta: document.getElementById('temaMeta'),
    theory: document.getElementById('temaTheory'),
    example: document.getElementById('temaExample'),
    exam: document.getElementById('temaExam'),
    variants: document.getElementById('simVariants'),
    controls: document.getElementById('simControls'),
    metrics: document.getElementById('simMetrics'),
    caption: document.getElementById('simCaption'),
    simIntro: document.getElementById('simIntro'),
    canvas: document.getElementById('simCanvas'),
    play: document.getElementById('simPlay'),
    reset: document.getElementById('simReset'),
    nav: document.getElementById('temaNavTopics'),
  };

  els.breadcrumb.innerHTML = `<a href="index.html">Física</a> · ${topic.courseTitle} · ${topic.unitTitle}`;
  els.title.textContent = topic.title;
  els.meta.innerHTML = `
    <span class="tema-badge" style="background:${topic.courseColor}22;color:${topic.courseColor};border-color:${topic.courseColor}55">${topic.courseIcon} ${topic.courseTitle}</span>
    ${topic.optional ? '<span class="tema-badge">Opcional</span>' : ''}
    <span class="tema-badge">${topic.variants.length} variantes</span>
    ${topic.exam ? '<span class="tema-badge tema-badge--exam">Examen</span>' : ''}`;
  els.theory.innerHTML = topic.theory;
  els.example.innerHTML = `
    <div class="tema-example-card problem"><h3>Enunciado</h3>${topic.example.problem}</div>
    <div class="tema-example-card solution"><h3>Solución</h3>${topic.example.solution}</div>`;
  if (topic.exam && els.exam) {
    els.exam.innerHTML = renderExam(topic.exam);
  }
  els.caption.textContent = topic.simCaption;
  if (els.simIntro) els.simIntro.textContent = topic.definition || '';

  function renderExam(ex) {
    return `
      <div class="tema-exam-card tema-exam-card--question">
        <h3>Pregunta integradora (tipo examen)</h3>
        ${ex.question}
      </div>
      <div class="tema-exam-card tema-exam-card--reasoning">
        <h3>Cadena de razonamiento</h3>
        ${ex.reasoning}
      </div>
      <div class="tema-exam-grid">
        <div class="tema-exam-card">
          <h3>Estrategia paso a paso</h3>
          <ol class="tema-exam-list">${ex.strategy.map((s) => `<li>${s}</li>`).join('')}</ol>
        </div>
        <div class="tema-exam-card tema-exam-card--warn">
          <h3>Errores frecuentes en examen</h3>
          <ul class="tema-exam-list">${ex.pitfalls.map((p) => `<li>${p}</li>`).join('')}</ul>
        </div>
        <div class="tema-exam-card">
          <h3>Autocomprobación</h3>
          <ul class="tema-exam-list tema-exam-list--check">${ex.selfCheck.map((c) => `<li>${c}</li>`).join('')}</ul>
        </div>
        <div class="tema-exam-card tema-exam-card--links">
          <h3>Conexiones conceptuales</h3>
          <div class="tema-exam-tags">${ex.connections.map((c) => `<span class="tema-exam-tag">${c}</span>`).join('')}</div>
        </div>
      </div>`;
  }

  let activeVariant = topic.primaryVariant || topic.variants[0]?.id;
  const vInit = topic.variants.find((v) => v.id === activeVariant);
  let simContext = {
    simType: topic.simType,
    color: topic.courseColor,
    topicTitle: topic.title,
    definition: topic.definition,
    simGuide: vInit?.simGuide || topic.simGuide,
    variant: activeVariant,
  };

  function renderVariants() {
    els.variants.innerHTML = topic.variants
      .map(
        (v) =>
          `<button type="button" class="tema-variant-btn${v.id === activeVariant ? ' active' : ''}${v.primary ? ' primary' : ''}" data-variant="${v.id}" title="${v.simGuide || ''}">${v.primary ? '★ ' : ''}${v.label}</button>`
      )
      .join('');

    els.variants.querySelectorAll('.tema-variant-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeVariant = btn.dataset.variant;
        const vObj = topic.variants.find((v) => v.id === activeVariant);
        simContext.variant = activeVariant;
        simContext.simGuide = vObj?.simGuide || topic.simGuide;
        els.caption.textContent = simContext.simGuide || topic.simCaption;
        els.variants.querySelectorAll('.tema-variant-btn').forEach((b) => b.classList.toggle('active', b === btn));
        currentSim?.setVariant(activeVariant);
        renderControls();
        updateMetrics();
      });
    });
  }

  function renderControls() {
    if (!currentSim?.getControls) {
      els.controls.innerHTML = '';
      return;
    }
    const labelMap = { ax: 'Componente a_x', ay: 'Componente a_y', bx: 'Componente b_x', by: 'Componente b_y' };
    const controls = currentSim.getControls();
    els.controls.innerHTML = controls
      .map(
        (c) => `
      <div class="tema-control">
        <label><span>${labelMap[c.name] || c.label}</span><span id="val-${c.name}">${c.value}</span></label>
        <input type="range" id="ctrl-${c.name}" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.value}" aria-label="${labelMap[c.name] || c.label}">
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
      .map(([k, v]) => `<div class="tema-metric"><span>${k}</span><span>${v}</span></div>`)
      .join('');
  }

  function initSim() {
    if (currentSim?.destroy) currentSim.destroy();
    simContext.variant = activeVariant;
    currentSim = window.PhysicsSims.create(topic.simType, els.canvas, simContext);
    currentSim.setVariant(activeVariant);
    renderControls();
    updateMetrics();
  }

  function loop() {
    if (playing && currentSim?.step) currentSim.step();
    updateMetrics();
    animId = requestAnimationFrame(loop);
  }

  els.play.addEventListener('click', () => {
    playing = !playing;
    els.play.textContent = playing ? '⏸ Pausar' : '▶ Reproducir';
    if (playing) currentSim?.play();
    else currentSim?.pause();
  });

  els.reset.addEventListener('click', () => {
    playing = false;
    els.play.textContent = '▶ Reproducir';
    currentSim?.pause();
    currentSim?.reset();
    updateMetrics();
  });

  document.querySelectorAll('.tema-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tema-tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.tema-panel').forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`panel-${tab.dataset.panel}`).classList.add('active');
      if (tab.dataset.panel === 'sim') {
        initSim();
        currentSim?.resize?.();
      }
    });
  });

  window.addEventListener('resize', () => currentSim?.resize?.());

  const adj = window.getAdjacentTopics(topic.id);
  els.nav.innerHTML = `
    ${adj.prev ? `<a href="tema.html?id=${adj.prev.id}">← ${adj.prev.title.slice(0, 40)}${adj.prev.title.length > 40 ? '…' : ''}</a>` : '<a class="disabled" href="#">← Anterior</a>'}
    ${adj.next ? `<a href="tema.html?id=${adj.next.id}">${adj.next.title.slice(0, 40)}${adj.next.title.length > 40 ? '…' : ''} →</a>` : '<a class="disabled" href="#">Siguiente →</a>'}`;

  renderVariants();
  initSim();
  updateMetrics();
  loop();

  // Asegurar que el canvas tenga tamaño correcto al cargar
  requestAnimationFrame(() => currentSim?.resize?.());
})();
