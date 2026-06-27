(function () {
  'use strict';

  const STEPS = [
    {
      title: '1. Idea central',
      desc: 'Isolation Forest detecta anomalías porque los puntos raros se aíslan con menos cortes aleatorios. Cuanto más corto el camino hasta quedar solos, más anómalos son.',
      maxSplit: 0,
    },
    {
      title: '2. Un árbol = particiones',
      desc: 'Cada árbol divide el espacio con cortes aleatorios en X o Y. Observa cómo el punto A1 queda aislado en una celda con muy pocos cortes.',
      maxSplit: 1,
    },
    {
      title: '3. Path length',
      desc: 'Path length = número de particiones hasta aislar el punto. A1 necesita 1 corte; N5 (normal) necesita más porque está en el grueso del cluster.',
      maxSplit: 2,
    },
    {
      title: '4. Bosque completo',
      desc: 'Promediamos el path length de muchos árboles. Path corto → score alto de anomalía. Así el bosque distingue outliers sin etiquetas.',
      maxSplit: 4,
    },
  ];

  const POINTS = {
    A1: { id: 'A1', x: 0.12, y: 0.88, type: 'anomaly', pathLength: 1, score: 0.92 },
    N5: { id: 'N5', x: 0.52, y: 0.48, type: 'normal', pathLength: 4, score: 0.18 },
  };

  const NORMAL_CLUSTER = generateCluster(48, 0.55, 0.52, 0.12);
  const EXTRA_ANOMALIES = [
    { x: 0.88, y: 0.15, id: 'A2' },
    { x: 0.08, y: 0.25, id: 'A3' },
  ];

  const SPLITS = [
    { axis: 'x', value: 0.35, step: 1 },
    { axis: 'y', value: 0.72, step: 1 },
    { axis: 'x', value: 0.45, step: 2 },
    { axis: 'y', value: 0.55, step: 2 },
    { axis: 'x', value: 0.62, step: 3 },
    { axis: 'y', value: 0.42, step: 3 },
    { axis: 'x', value: 0.58, step: 4 },
  ];

  let currentStep = 0;
  let focusedPoint = 'A1';
  let animSplit = 0;
  let playTimer = null;

  const canvas = document.getElementById('algoCanvas');
  const ctx = canvas.getContext('2d');
  const stepButtons = document.querySelectorAll('.algo-step-btn');
  const stepDesc = document.getElementById('stepDesc');
  const pointButtons = document.querySelectorAll('.algo-point-toggle button');
  const btnPlay = document.getElementById('btnPlay');
  const btnNext = document.getElementById('btnNext');
  const btnReset = document.getElementById('btnReset');
  const metricPoint = document.getElementById('metricPoint');
  const metricPath = document.getElementById('metricPath');
  const metricType = document.getElementById('metricType');
  const scoreFill = document.getElementById('scoreFill');
  const scoreValue = document.getElementById('scoreValue');
  const caption = document.getElementById('algoCaption');

  function generateCluster(n, cx, cy, spread) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * spread;
      pts.push({
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
      });
    }
    return pts;
  }

  function resizeCanvas() {
    const wrap = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const w = wrap.clientWidth;
    const h = Math.min(420, Math.max(280, w * 0.65));
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function toCanvas(x, y, w, h) {
    const pad = 36;
    return {
      cx: pad + x * (w - pad * 2),
      cy: h - pad - y * (h - pad * 2),
    };
  }

  function visibleSplits() {
    const max = currentStep === 0 ? animSplit : STEPS[currentStep].maxSplit;
    if (currentStep === 3) return SPLITS.slice(0, 4);
    return SPLITS.filter((s) => s.step <= max);
  }

  function draw() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.fillRect(0, 0, w, h);

    drawGrid(w, h);
    drawSplits(w, h);
    drawCluster(w, h);
    drawAnomalies(w, h);
    drawFocus(w, h);
    drawAxes(w, h);
  }

  function drawGrid(w, h) {
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const x = (w / 4) * i;
      const y = (h / 4) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }

  function drawAxes(w, h) {
    ctx.fillStyle = '#9aa3b2';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText('Característica x', w / 2 - 40, h - 8);
    ctx.save();
    ctx.translate(12, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Característica y', -40, 0);
    ctx.restore();
  }

  function drawSplits(w, h) {
    const pad = 36;
    const splits = visibleSplits();
    splits.forEach((split, i) => {
      const alpha = 0.35 + (i / splits.length) * 0.35;
      ctx.strokeStyle = `rgba(35, 240, 236, ${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      if (split.axis === 'x') {
        const x = pad + split.value * (w - pad * 2);
        ctx.moveTo(x, pad);
        ctx.lineTo(x, h - pad);
      } else {
        const y = h - pad - split.value * (h - pad * 2);
        ctx.moveTo(pad, y);
        ctx.lineTo(w - pad, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    });
  }

  function drawCluster(w, h) {
    NORMAL_CLUSTER.forEach((p) => {
      const { cx, cy } = toCanvas(p.x, p.y, w, h);
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.85)';
      ctx.fill();
    });
  }

  function drawAnomalies(w, h) {
    EXTRA_ANOMALIES.forEach((p) => {
      const { cx, cy } = toCanvas(p.x, p.y, w, h);
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(249, 115, 22, 0.9)';
      ctx.fill();
    });
    Object.values(POINTS).forEach((p) => {
      const { cx, cy } = toCanvas(p.x, p.y, w, h);
      const isFocus = p.id === focusedPoint;
      if (isFocus) {
        ctx.strokeStyle = p.type === 'anomaly' ? '#f97316' : '#3b82f6';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - 14, cy - 14, 28, 28);
      }
      ctx.beginPath();
      ctx.arc(cx, cy, isFocus ? 7 : 5, 0, Math.PI * 2);
      ctx.fillStyle = p.type === 'anomaly' ? '#f97316' : '#3b82f6';
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px system-ui';
      ctx.fillText(p.id, cx + 10, cy - 8);
    });
  }

  function drawFocus(w, h) {
    if (currentStep < 1) return;
    const p = POINTS[focusedPoint];
    const { cx, cy } = toCanvas(p.x, p.y, w, h);
    if (focusedPoint === 'A1' && currentStep >= 1) {
      ctx.fillStyle = 'rgba(249, 115, 22, 0.08)';
      ctx.fillRect(36, 36, cx - 36, h - cy - 36);
    }
  }

  function updateUI() {
    stepButtons.forEach((btn, i) => {
      btn.classList.toggle('active', i === currentStep);
      btn.classList.toggle('done', i < currentStep);
    });
    stepDesc.textContent = STEPS[currentStep].desc;

    const p = POINTS[focusedPoint];
    metricPoint.textContent = p.id;
    metricPath.textContent = String(p.pathLength);
    metricType.textContent = p.type === 'anomaly' ? 'Anomalía' : 'Normal';
    scoreFill.style.width = Math.round(p.score * 100) + '%';
    scoreValue.textContent = Math.round(p.score * 100) + '%';

    btnNext.disabled = currentStep >= STEPS.length - 1;

    const captions = [
      'Puntos azules = comportamiento normal. Naranjas = posibles anomalías.',
      'El punto A1 quedó solo en una celda tras 1 corte. Path length = 1.',
      'Compara: A1 se aísla rápido; N5 necesita más particiones por estar en el cluster.',
      'El bosque promedia paths de cientos de árboles → score de anomalía estable.',
    ];
    caption.textContent = captions[currentStep];
    draw();
  }

  function goToStep(n) {
    currentStep = Math.max(0, Math.min(STEPS.length - 1, n));
    animSplit = STEPS[currentStep].maxSplit;
    updateUI();
  }

  function animateSplits() {
    const target = STEPS[currentStep].maxSplit;
    if (animSplit >= target) return;
    animSplit += 1;
    draw();
  }

  function play() {
    stopPlay();
    playTimer = setInterval(() => {
      animateSplits();
      if (animSplit >= STEPS[currentStep].maxSplit && currentStep < STEPS.length - 1) {
        goToStep(currentStep + 1);
      } else if (animSplit >= STEPS[currentStep].maxSplit) {
        stopPlay();
      }
    }, 900);
  }

  function stopPlay() {
    if (playTimer) {
      clearInterval(playTimer);
      playTimer = null;
    }
  }

  stepButtons.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      stopPlay();
      goToStep(i);
    });
  });

  pointButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      focusedPoint = btn.dataset.point;
      pointButtons.forEach((b) => b.classList.toggle('active', b === btn));
      updateUI();
    });
  });

  btnPlay.addEventListener('click', play);
  btnNext.addEventListener('click', () => {
    stopPlay();
    goToStep(currentStep + 1);
  });
  btnReset.addEventListener('click', () => {
    stopPlay();
    focusedPoint = 'A1';
    pointButtons.forEach((b) => b.classList.toggle('active', b.dataset.point === 'A1'));
    goToStep(0);
    animSplit = 0;
    updateUI();
  });

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  goToStep(0);
})();
