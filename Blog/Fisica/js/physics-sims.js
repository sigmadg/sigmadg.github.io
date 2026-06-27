(function () {
  'use strict';

  const TAU = Math.PI * 2;

  function resizeCanvas(canvas) {
    const wrap = canvas.parentElement;
    const w = wrap.clientWidth || 800;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(420 * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = '420px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h: 420 };
  }

  function drawGrid(ctx, w, h, ox, oy, scale) {
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let x = ox % scale; x < w; x += scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = oy % scale; y < h; y += scale) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();
  }

  function drawSimOverlay(ctx, w, options) {
    if (!options?.topicTitle) return;
    const boxW = Math.min(w - 24, 420);
    ctx.fillStyle = 'rgba(5, 6, 8, 0.9)';
    ctx.fillRect(12, 12, boxW, 78);
    ctx.strokeStyle = 'rgba(35, 240, 236, 0.4)';
    ctx.strokeRect(12, 12, boxW, 78);
    ctx.fillStyle = '#23f0ec';
    ctx.font = 'bold 12px system-ui,sans-serif';
    const title = options.topicTitle.length > 55 ? options.topicTitle.slice(0, 53) + '…' : options.topicTitle;
    ctx.fillText(title, 20, 32);
    ctx.fillStyle = '#c8ced8';
    ctx.font = '11px system-ui,sans-serif';
    const guide = (options.simGuide || options.definition || '').slice(0, 140);
    const words = guide.split(' ');
    let line = '';
    let y = 50;
    words.forEach((word) => {
      const test = line + word + ' ';
      if (ctx.measureText(test).width > boxW - 20 && line) {
        ctx.fillText(line.trim(), 20, y);
        line = word + ' ';
        y += 14;
      } else line = test;
    });
    if (line && y < 82) ctx.fillText(line.trim(), 20, y);
  }

  function getMode(simType, variantId) {
    return window.SimVariantModes?.getVisualMode(simType, variantId) || variantId;
  }

  function bindVariant(sim, opts, onVariant) {
    const orig = sim.setVariant?.bind(sim);
    sim.setVariant = (v) => {
      if (opts) opts.variant = v;
      onVariant?.(v);
      if (orig) orig(v);
      else sim.draw?.();
    };
    return sim;
  }

  function drawArrow(ctx, x1, y1, x2, y2, color, label) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    const head = 10;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - ux * head - uy * 5, y2 - uy * head + ux * 5);
    ctx.lineTo(x2 - ux * head + uy * 5, y2 - uy * head - ux * 5);
    ctx.closePath();
    ctx.fill();
    if (label) {
      ctx.font = '12px system-ui,sans-serif';
      ctx.fillText(label, x2 + 6, y2 - 6);
    }
  }

  /* ─── Vectors ─── */
  function createVectors(canvas, color, options) {
    const opts = options || {};
    let { ctx, w, h } = resizeCanvas(canvas);
    let variant = opts.variant || 'suma';
    let ax = 120, ay = -80, bx = 60, by = 100;
    let playing = false;
    let t = 0;
    let metrics = {};

    function draw() {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, w, h);
      const ox = w / 2, oy = h / 2;
      drawGrid(ctx, w, h, ox, oy, 40);
      const mode = getMode('vectors', variant);
      const scale = 1.2;
      const vax = ax * scale, vay = ay * scale;
      const vbx = bx * scale, vby = by * scale;

      if (mode === 'dot') {
        drawArrow(ctx, ox, oy, ox + vax, oy + vay, '#f59e0b', 'a');
        drawArrow(ctx, ox, oy, ox + vbx, oy + vby, '#38bdf8', 'b');
        const dot = ax * bx + ay * by;
        const mag = Math.hypot(ax, ay) * Math.hypot(bx, by) || 1;
        const ang = Math.acos(Math.max(-1, Math.min(1, dot / mag)));
        ctx.strokeStyle = 'rgba(34,197,94,0.5)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.arc(ox, oy, 50, 0, ang, ang > 0); ctx.stroke();
        ctx.setLineDash([]);
        const projLen = dot / (Math.hypot(bx, by) || 1);
        drawArrow(ctx, ox, oy, ox + (bx / (Math.hypot(bx, by) || 1)) * projLen * scale, oy + (by / (Math.hypot(bx, by) || 1)) * projLen * scale, '#22c55e', 'proj');
        metrics = { Modo: 'producto escalar / covector', 'a·b': dot.toFixed(2), 'θ (°)': (ang * 180 / Math.PI).toFixed(1) };
      } else if (mode === 'cross') {
        drawArrow(ctx, ox, oy, ox + vax, oy + vay, '#f59e0b', 'a');
        drawArrow(ctx, ox, oy, ox + vbx, oy + vby, '#38bdf8', 'b');
        const cross = ax * by - ay * bx;
        drawArrow(ctx, ox, oy, ox, oy - cross * 0.15 * scale, '#22c55e', 'a×b');
        metrics = { Modo: 'producto cruz / εᵢⱼₖ', '(a×b)_z': cross.toFixed(2), Área: Math.abs(cross).toFixed(2) };
      } else if (mode === 'bases') {
        drawArrow(ctx, ox, oy, ox + 90, oy, '#f59e0b', 'e₁');
        drawArrow(ctx, ox, oy, ox, oy - 90, '#38bdf8', 'e₂');
        drawArrow(ctx, ox, oy, ox + vax, oy + vay, '#22c55e', 'v');
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(ox - 100, oy - 100, 200, 200);
        ctx.setLineDash([]);
        metrics = { Modo: 'bases / cambio de base', '|v|': Math.hypot(ax, ay).toFixed(2) };
      } else {
        drawArrow(ctx, ox, oy, ox + vax, oy + vay, '#f59e0b', 'a');
        drawArrow(ctx, ox, oy, ox + vbx, oy + vby, '#38bdf8', 'b');
        drawArrow(ctx, ox + vax, oy + vay, ox + vax + vbx, oy + vay + vby, 'rgba(255,255,255,0.25)', '');
        drawArrow(ctx, ox, oy, ox + vax + vbx, oy + vay + vby, '#22c55e', 'a+b');
        metrics = { Modo: 'suma vectorial', '|a|': Math.hypot(ax, ay).toFixed(2), '|b|': Math.hypot(bx, by).toFixed(2) };
      }
      drawSimOverlay(ctx, w, opts);
    }

    const sim = {
      draw,
      setVariant(v) { variant = v; playing = false; t = 0; draw(); },
      setParam(name, val) {
        if (name === 'ax') ax = val;
        if (name === 'ay') ay = val;
        if (name === 'bx') bx = val;
        if (name === 'by') by = val;
        draw();
      },
      getControls() {
        return [
          { name: 'ax', label: 'a_x', min: -150, max: 150, value: ax, step: 5 },
          { name: 'ay', label: 'a_y', min: -150, max: 150, value: ay, step: 5 },
          { name: 'bx', label: 'b_x', min: -150, max: 150, value: bx, step: 5 },
          { name: 'by', label: 'b_y', min: -150, max: 150, value: by, step: 5 },
        ];
      },
      play() { playing = true; },
      pause() { playing = false; },
      reset() { ax = 120; ay = -80; bx = 60; by = 100; t = 0; draw(); },
      getMetrics() { return metrics; },
      step() {
        if (playing) { t += 0.02; ax = 100 * Math.cos(t); ay = 80 * Math.sin(t * 1.3); draw(); }
      },
      resize() { ({ ctx, w, h } = resizeCanvas(canvas)); draw(); },
      destroy() {},
    };
    draw();
    return bindVariant(sim, opts);
  }

  /* ─── Kinematics 1D ─── */
  function createKinematics(canvas, color, options) {
    const opts = options || {};
    let { ctx, w, h } = resizeCanvas(canvas);
    let variant = opts.variant || 'mru';
    let v0 = 0, a = 2, x0 = 0, omega = 1.5, R = 80;
    let playing = false, time = 0;
    let metrics = {};

    function state(t) {
      const mode = getMode('kinematics', variant);
      if (mode === 'mru') return { x: x0 + 3 * t, v: 3, a: 0 };
      if (mode === 'rotacion') return { x: R * Math.cos(omega * t), v: omega * R, a: omega * omega * R };
      return { x: x0 + v0 * t + 0.5 * a * t * t, v: v0 + a * t, a };
    }

    function draw() {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, w, h);
      const mode = getMode('kinematics', variant);
      const s = state(time);
      const graphH = h * 0.45;
      const trackY = h * 0.72;

      drawGrid(ctx, w, graphH, 40, graphH - 30, 30);
      ctx.strokeStyle = color || '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 200; i++) {
        const tt = (i / 200) * 8;
        const st = state(tt);
        const px = 40 + (tt / 8) * (w - 60);
        const py = graphH - 20 - st.x * 0.8;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath(); ctx.moveTo(40, trackY); ctx.lineTo(w - 20, trackY); ctx.stroke();

      if (mode === 'rotacion') {
        const cx = w / 2, cy = trackY - 20;
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
        const px = cx + s.x, py = cy + R * Math.sin(omega * time);
        ctx.fillStyle = color || '#f59e0b';
        ctx.beginPath(); ctx.arc(px, py, 10, 0, TAU); ctx.fill();
      } else {
        const px = 40 + ((s.x + 5) / 15) * (w - 80);
        ctx.fillStyle = color || '#f59e0b';
        ctx.fillRect(px - 12, trackY - 24, 24, 24);
        if (mode === 'mrua' && playing) {
          drawArrow(ctx, px + 14, trackY - 12, px + 14 + s.a * 8, trackY - 12, '#22c55e', 'a');
        }
      }

      metrics = { Modo: mode, 't (s)': time.toFixed(2), 'x (m)': s.x.toFixed(2), 'v (m/s)': s.v.toFixed(2), 'a (m/s²)': s.a.toFixed(2) };
      drawSimOverlay(ctx, w, opts);
    }

    const sim = {
      draw,
      setVariant(v) { variant = v; time = 0; playing = false; draw(); },
      setParam(name, val) {
        if (name === 'v0') v0 = val;
        if (name === 'a') a = val;
        if (name === 'omega') omega = val;
        draw();
      },
      getControls() {
        const mode = getMode('kinematics', variant);
        if (mode === 'rotacion') return [{ name: 'omega', label: 'ω (rad/s)', min: 0.5, max: 4, value: omega, step: 0.1 }];
        if (mode === 'mru') return [{ name: 'v0', label: 'v (m/s)', min: 1, max: 8, value: 3, step: 0.5 }];
        return [
          { name: 'v0', label: 'v₀ (m/s)', min: -5, max: 10, value: v0, step: 0.5 },
          { name: 'a', label: 'a (m/s²)', min: -3, max: 5, value: a, step: 0.2 },
        ];
      },
      play() { playing = true; },
      pause() { playing = false; },
      reset() { time = 0; v0 = 0; a = 2; draw(); },
      getMetrics() { return metrics; },
      step() { if (playing) { time += 0.04; if (time > 8) time = 0; draw(); } },
      resize() { ({ ctx, w, h } = resizeCanvas(canvas)); draw(); },
      destroy() {},
    };
    draw();
    return bindVariant(sim, opts);
  }

  /* ─── Oscillator ─── */
  function createOscillator(canvas, color, options) {
    const opts = options || {};
    let { ctx, w, h } = resizeCanvas(canvas);
    let variant = opts.variant || 'simple';
    let beta = 0.3, omega0 = 2, F0 = 0.5, Omega = 1.8, k2 = 0.3;
    let playing = false, time = 0;
    let metrics = {};

    function x(t) {
      const mode = getMode('oscillator', variant);
      if (mode === 'simple') return Math.cos(omega0 * t);
      if (mode === 'damped') return Math.exp(-beta * t) * Math.cos(omega0 * t);
      if (mode === 'forced') {
        const den = Math.pow(omega0 * omega0 - Omega * Omega, 2) + 4 * beta * beta * Omega * Omega;
        const A = F0 / Math.sqrt(Math.max(den, 0.01));
        return A * Math.cos(Omega * t - 0.3) + 0.3 * Math.exp(-beta * t) * Math.cos(omega0 * t);
      }
      if (mode === 'coupled') return Math.cos(omega0 * t) + k2 * Math.cos(omega0 * 1.5 * t);
      return Math.cos(omega0 * t);
    }

    function draw() {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, w, h);
      const mid = h / 2;
      const mode = getMode('oscillator', variant);
      drawGrid(ctx, w, h, w / 2, mid, 40);

      ctx.strokeStyle = color || '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= w; i++) {
        const tt = (i / w) * TAU * 2;
        const yy = mid - x(tt + time) * 80;
        i === 0 ? ctx.moveTo(i, yy) : ctx.lineTo(i, yy);
      }
      ctx.stroke();

      if (mode === 'coupled') {
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath();
        for (let i = 0; i <= w; i++) {
          const tt = (i / w) * TAU * 2;
          const yy = mid - Math.cos(omega0 * tt + time) * 50;
          i === 0 ? ctx.moveTo(i, yy) : ctx.lineTo(i, yy);
        }
        ctx.stroke();
      }

      const dotX = (time % (TAU * 2)) / (TAU * 2) * w;
      const dotY = mid - x(time) * 80;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.arc(dotX, dotY, 8, 0, TAU); ctx.fill();

      metrics = { Modo: mode, 'x(t)': x(time).toFixed(3), 'ω₀': omega0.toFixed(2), 'β': beta.toFixed(2) };
      drawSimOverlay(ctx, w, opts);
    }

    const sim = {
      draw,
      setVariant(v) {
        variant = v;
        const mode = getMode('oscillator', v);
        if (mode === 'damped') beta = 0.3;
        if (v === 'critico') beta = omega0;
        if (mode === 'simple') beta = 0;
        playing = false;
        time = 0;
        draw();
      },
      setParam(name, val) {
        if (name === 'beta') beta = val;
        if (name === 'omega0') omega0 = val;
        if (name === 'F0') F0 = val;
        if (name === 'Omega') Omega = val;
        draw();
      },
      getControls() {
        const mode = getMode('oscillator', variant);
        const c = [{ name: 'omega0', label: 'ω₀', min: 0.5, max: 4, value: omega0, step: 0.1 }];
        if (mode !== 'simple') c.push({ name: 'beta', label: 'Amortiguamiento β', min: 0, max: 2, value: beta, step: 0.05 });
        if (mode === 'forced') {
          c.push({ name: 'F0', label: 'F₀', min: 0, max: 2, value: F0, step: 0.1 });
          c.push({ name: 'Omega', label: 'Ω fuerza', min: 0.5, max: 3.5, value: Omega, step: 0.1 });
        }
        return c;
      },
      play() { playing = true; },
      pause() { playing = false; },
      reset() { time = 0; draw(); },
      getMetrics() { return metrics; },
      step() { if (playing) { time += 0.05; draw(); } },
      resize() { ({ ctx, w, h } = resizeCanvas(canvas)); draw(); },
      destroy() {},
    };
    draw();
    return bindVariant(sim, opts);
  }

  /* ─── Orbit ─── */
  function createOrbit(canvas, color, options) {
    const opts = options || {};
    let { ctx, w, h } = resizeCanvas(canvas);
    let variant = opts.variant || 'kepler';
    let e = 0.4, playing = false, time = 0;
    let metrics = {};

    function draw() {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, w, h);
      const mode = getMode('orbit', variant);
      const cx = w / 2, cy = h / 2;

      if (mode === 'scatter') {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(cx, cy, 14, 0, TAU); ctx.fill();
        for (let i = 0; i < 8; i++) {
          const b = 40 + i * 25;
          const ang = 0.3 + i * 0.15 + time * 0.02;
          const len = 180;
          ctx.strokeStyle = `rgba(56,189,248,${0.3 + i * 0.08})`;
          ctx.beginPath();
          ctx.moveTo(cx - 200, cy - b);
          ctx.lineTo(cx - 200 + Math.cos(ang) * len, cy - b + Math.sin(ang) * len * 0.3);
          ctx.stroke();
        }
        metrics = { Modo: 'dispersión', 'θ dispersión': (20 + e * 40).toFixed(1) + '°', Variante: variant };
      } else if (mode === 'two_body' || mode === 'angular') {
        const r1 = 50, r2 = 80;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(cx - r1 * Math.cos(time), cy, 8, 0, TAU); ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(cx + r2 * Math.cos(time), cy, 12, 0, TAU); ctx.fill();
        ctx.fillStyle = '#22c55e';
        ctx.beginPath(); ctx.arc(cx, cy, 4, 0, TAU); ctx.fill();
        ctx.fillStyle = '#9aa3b2';
        ctx.font = '11px system-ui';
        ctx.fillText('CM', cx + 6, cy - 6);
        metrics = { Modo: mode, 'r₁': r1.toFixed(0), 'r₂': r2.toFixed(0) };
      } else {
        const a = 120, b = a * Math.sqrt(1 - e * e);
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(cx - a * e * 0.6, cy, 8, 0, TAU); ctx.fill();
        ctx.strokeStyle = 'rgba(56,189,248,0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(cx - a * e * 0.6, cy, a, b, 0, 0, TAU);
        ctx.stroke();
        const theta = time;
        const r = a * (1 - e * e) / (1 + e * Math.cos(theta));
        const px = cx - a * e * 0.6 + r * Math.cos(theta);
        const py = cy + r * Math.sin(theta) * (b / a);
        ctx.fillStyle = color || '#38bdf8';
        ctx.beginPath(); ctx.arc(px, py, 10, 0, TAU); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(cx - a * e * 0.6, cy); ctx.lineTo(px, py); ctx.stroke();
        ctx.setLineDash([]);
        metrics = { Modo: 'kepler', e: e.toFixed(2), r: r.toFixed(1), 'θ (rad)': theta.toFixed(2) };
      }
      drawSimOverlay(ctx, w, opts);
    }

    const sim = {
      setVariant(v) { variant = v; time = 0; playing = false; draw(); },
      setParam(name, val) { if (name === 'e') e = val; draw(); },
      getControls() {
        return [{ name: 'e', label: 'Excentricidad e', min: 0, max: 0.95, value: e, step: 0.05 }];
      },
      play() { playing = true; },
      pause() { playing = false; },
      reset() { time = 0; e = 0.4; draw(); },
      getMetrics() { return metrics; },
      step() { if (playing) { time += 0.03; draw(); } },
      resize() { ({ ctx, w, h } = resizeCanvas(canvas)); draw(); },
      destroy() {},
    };
    draw();
    return bindVariant(sim, opts);
  }

  /* ─── Collision ─── */
  function createCollision(canvas, color, options) {
    const opts = options || {};
    let { ctx, w, h } = resizeCanvas(canvas);
    let variant = opts.variant || 'elastico';
    let m1 = 2, m2 = 1, u1 = 3, u2 = 0, eRest = 1;
    let playing = false, time = 0, collided = false;
    let x1 = 80, x2 = 280, metrics = {};

    function afterCollision() {
      const mode = getMode('collision', variant);
      if (mode === 'inelastic') {
        const v = (m1 * u1 + m2 * u2) / (m1 + m2);
        return { v1: v, v2: v };
      }
      const v1 = ((m1 - eRest * m2) * u1 + (1 + eRest) * m2 * u2) / (m1 + m2);
      const v2 = ((m2 - eRest * m1) * u2 + (1 + eRest) * m1 * u1) / (m1 + m2);
      return { v1, v2 };
    }

    function draw() {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, w, h);
      const mode = getMode('collision', variant);
      const y = h / 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath(); ctx.moveTo(20, y + 40); ctx.lineTo(w - 20, y + 40); ctx.stroke();

      if (mode === 'scatter') {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(w / 2, y + 10, 16, 0, TAU); ctx.fill();
        for (let i = 0; i < 6; i++) {
          const ang = -0.5 + i * 0.25 + time * 0.1;
          ctx.strokeStyle = '#38bdf8';
          ctx.beginPath();
          ctx.moveTo(w / 2, y + 10);
          ctx.lineTo(w / 2 + Math.cos(ang) * 120, y + 10 + Math.sin(ang) * 80);
          ctx.stroke();
        }
        metrics = { Modo: 'dispersión / blanco fijo', Variante: variant };
        drawSimOverlay(ctx, w, opts);
        return;
      }

      let px1 = x1, px2 = x2;
      if (playing) {
        if (!collided) {
          px1 = x1 + u1 * time * 40;
          px2 = x2 + u2 * time * 40;
          if (px1 + 20 >= px2 - 20) collided = true;
        } else {
          const { v1, v2 } = afterCollision();
          const dt = time - 0.5;
          px1 = x1 + u1 * 0.5 * 40 + v1 * dt * 40;
          px2 = x2 + u2 * 0.5 * 40 + v2 * dt * 40;
        }
      }

      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(px1 - 20, y - 10, 40, 40);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(px2 - 15, y - 8, 30, 30);

      const { v1, v2 } = afterCollision();
      metrics = {
        Modo: mode,
        'm₁': m1, 'm₂': m2,
        'v₁′': v1.toFixed(2), 'v₂′': v2.toFixed(2),
        e: mode === 'inelastic' ? '0' : eRest.toFixed(2),
      };
      drawSimOverlay(ctx, w, opts);
    }

    const sim = {
      setVariant(v) {
        variant = v;
        const mode = getMode('collision', v);
        eRest = mode === 'inelastic' ? 0 : v === 'parcialmente_elastico' ? 0.5 : 1;
        playing = false;
        time = 0;
        collided = false;
        draw();
      },
      setParam(name, val) {
        if (name === 'm1') m1 = val;
        if (name === 'u1') u1 = val;
        draw();
      },
      getControls() {
        return [
          { name: 'm1', label: 'm₁ (kg)', min: 0.5, max: 5, value: m1, step: 0.5 },
          { name: 'u1', label: 'u₁ (m/s)', min: 0, max: 8, value: u1, step: 0.5 },
        ];
      },
      play() { playing = true; },
      pause() { playing = false; },
      reset() { playing = false; time = 0; collided = false; draw(); },
      getMetrics() { return metrics; },
      step() { if (playing) { time += 0.04; draw(); } },
      resize() { ({ ctx, w, h } = resizeCanvas(canvas)); draw(); },
      destroy() {},
    };
    draw();
    return bindVariant(sim, opts);
  }

  /* ─── Thermo ─── */
  function createThermo(canvas, color, options) {
    const opts = options || {};
    let { ctx, w, h } = resizeCanvas(canvas);
    let variant = opts.variant || 'gas_ideal';
    let n = 1, T = 300, V = 1, playing = false, phase = 0;
    let metrics = {};

    function draw() {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, w, h);
      const mode = getMode('thermo', variant);
      const pad = 50;
      const gw = w - pad * 2, gh = h - pad * 2;
      const R = 8.314;

      if (mode === 'entropy') {
        ctx.fillStyle = '#9aa3b2';
        ctx.font = '12px system-ui';
        ctx.fillText('S', pad - 20, pad + 10);
        ctx.fillText('T', pad + gw / 2, h - 15);
        ctx.strokeStyle = color || '#818cf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const tVal = 200 + (i / 100) * 400;
          const sVal = n * R * Math.log(tVal / 200);
          const px = pad + (i / 100) * gw;
          const py = pad + gh - (sVal / 80) * gh;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
        const dotX = pad + ((T - 200) / 400) * gw;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(dotX, pad + gh - (n * R * Math.log(T / 200) / 80) * gh, 8, 0, TAU); ctx.fill();
        metrics = { Modo: 'entropía S(T)', 'T (K)': T.toFixed(0), 'S (J/K)': (n * R * Math.log(T / 200)).toFixed(1) };
      } else if (mode === 'carnot') {
        ctx.fillStyle = '#9aa3b2';
        ctx.font = '12px system-ui';
        ctx.fillText('P', pad - 20, pad + 10);
        ctx.fillText('V', pad + gw / 2, h - 15);
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        const cx = pad + gw * 0.3, cy = pad + gh * 0.7;
        ctx.strokeRect(cx, cy - gh * 0.4, gw * 0.35, gh * 0.4);
        const dot = phase % 1;
        const path = [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]];
        const seg = Math.floor(dot * 4);
        const t = (dot * 4) % 1;
        const x0 = cx + path[seg][0] * gw * 0.35;
        const y0 = cy - path[seg][1] * gh * 0.4;
        const x1 = cx + path[seg + 1][0] * gw * 0.35;
        const y1 = cy - path[seg + 1][1] * gh * 0.4;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, 8, 0, TAU); ctx.fill();
        metrics = { Modo: 'ciclo Carnot', η: (1 - 300 / 600).toFixed(2), Fase: (dot * 100).toFixed(0) + '%' };
      } else if (mode === 'phase') {
        ctx.fillStyle = '#9aa3b2';
        ctx.font = '12px system-ui';
        ctx.fillText('P', pad - 20, pad + 10);
        ctx.fillText('T', pad + gw / 2, h - 15);
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(pad + gw * 0.2, pad + gh * 0.8);
        ctx.lineTo(pad + gw * 0.5, pad + gh * 0.5);
        ctx.lineTo(pad + gw * 0.8, pad + gh * 0.3);
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(pad + gw * (0.2 + phase * 0.01 % 0.6), pad + gh * 0.65, 8, 0, TAU); ctx.fill();
        metrics = { Modo: 'diagrama de fases', T: T.toFixed(0), Variante: variant };
      } else {
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.strokeRect(pad, pad, gw, gh);
        ctx.fillStyle = '#9aa3b2';
        ctx.font = '12px system-ui';
        ctx.fillText('P', pad - 20, pad + 10);
        ctx.fillText('V', pad + gw / 2, h - 15);
        ctx.strokeStyle = color || '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const vv = 0.3 + (i / 100) * 2.5;
          const pp = (n * R * T) / vv;
          const px = pad + (vv / 2.8) * gw;
          const py = pad + gh - (pp / 3500) * gh;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
        const vv = V;
        const pp = (n * R * T) / vv;
        const dotX = pad + (vv / 2.8) * gw;
        const dotY = pad + gh - (pp / 3500) * gh;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(dotX, dotY, 8, 0, TAU); ctx.fill();
        metrics = { Modo: 'PV (gas ideal)', 'T (K)': T.toFixed(0), 'V (m³)': V.toFixed(2), 'P (Pa)': pp.toFixed(0) };
      }
      drawSimOverlay(ctx, w, opts);
    }

    const sim = {
      setVariant(v) { variant = v; phase = 0; playing = false; draw(); },
      setParam(name, val) {
        if (name === 'T') T = val;
        if (name === 'V') V = val;
        if (name === 'n') n = val;
        draw();
      },
      getControls() {
        return [
          { name: 'T', label: 'T (K)', min: 200, max: 600, value: T, step: 10 },
          { name: 'V', label: 'V (m³)', min: 0.3, max: 2.5, value: V, step: 0.1 },
          { name: 'n', label: 'n (mol)', min: 0.5, max: 3, value: n, step: 0.1 },
        ];
      },
      play() { playing = true; },
      pause() { playing = false; },
      reset() { phase = 0; T = 300; V = 1; draw(); },
      getMetrics() { return metrics; },
      step() {
        if (!playing) return;
        phase += 0.012;
        const mode = getMode('thermo', variant);
        if (mode === 'pv') V = 0.5 + Math.abs(Math.sin(phase)) * 1.8;
        if (mode === 'entropy') T = 250 + Math.abs(Math.sin(phase)) * 300;
        if (mode === 'phase') phase += 0.02;
        draw();
      },
      resize() { ({ ctx, w, h } = resizeCanvas(canvas)); draw(); },
      destroy() {},
    };
    draw();
    return bindVariant(sim, opts);
  }

  /* ─── Electrostatic ─── */
  function createElectrostatic(canvas, color, options) {
    const opts = options || {};
    let { ctx, w, h } = resizeCanvas(canvas);
    let variant = opts.variant || 'coulomb';
    let q1 = 1, q2 = -1, playing = false, time = 0;
    let metrics = {};

    function fieldAt(x, y, charges) {
      let Ex = 0, Ey = 0;
      charges.forEach((c) => {
        const dx = x - c.x, dy = y - c.y;
        const r2 = dx * dx + dy * dy + 80;
        const f = (c.q * 500) / r2;
        Ex += f * dx / Math.sqrt(r2);
        Ey += f * dy / Math.sqrt(r2);
      });
      return { Ex, Ey, E: Math.hypot(Ex, Ey) };
    }

    function draw() {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, w, h);
      const mode = getMode('electrostatic', variant);
      const q1x = w * 0.35 + (playing ? Math.sin(time) * 20 : 0);
      const q2x = w * 0.65;
      const charges = [{ q: q1, x: q1x, y: h / 2 }, { q: q2, x: q2x, y: h / 2 }];

      if (mode === 'gauss') {
        ctx.strokeStyle = 'rgba(34,197,94,0.6)';
        ctx.lineWidth = 2;
        ctx.strokeRect(w * 0.25, h * 0.25, w * 0.5, h * 0.5);
        ctx.fillStyle = '#9aa3b2';
        ctx.font = '11px system-ui';
        ctx.fillText('Superficie gaussiana', w * 0.25, h * 0.22);
      }
      if (mode === 'potential') {
        for (let r = 40; r < 160; r += 35) {
          ctx.strokeStyle = `rgba(129,140,248,${0.15 + r / 300})`;
          ctx.beginPath();
          ctx.ellipse((q1x + q2x) / 2, h / 2, r * 1.2, r * 0.7, 0, 0, TAU);
          ctx.stroke();
        }
      }

      const step = 28;
      for (let x = step; x < w; x += step) {
        for (let y = step; y < h; y += step) {
          const { Ex, Ey, E } = fieldAt(x, y, charges);
          if (E < 0.01) continue;
          const len = Math.min(12, E * 0.8);
          drawArrow(ctx, x, y, x + (Ex / E) * len, y + (Ey / E) * len, `rgba(56,189,248,${Math.min(0.7, E * 0.05)})`, '');
        }
      }
      ctx.fillStyle = q1 > 0 ? '#ef4444' : '#38bdf8';
      ctx.beginPath(); ctx.arc(q1x, h / 2, 12, 0, TAU); ctx.fill();
      ctx.fillStyle = q2 > 0 ? '#ef4444' : '#38bdf8';
      ctx.beginPath(); ctx.arc(q2x, h / 2, 12, 0, TAU); ctx.fill();
      const mid = fieldAt(w / 2, h / 2, charges);
      metrics = { Modo: mode, 'q₁': q1.toFixed(1), 'q₂': q2.toFixed(1), '|E|': mid.E.toFixed(2) };
      drawSimOverlay(ctx, w, opts);
    }

    const sim = {
      setVariant(v) { variant = v; time = 0; playing = false; draw(); },
      setParam(name, val) {
        if (name === 'q1') q1 = val;
        if (name === 'q2') q2 = val;
        draw();
      },
      getControls() {
        return [
          { name: 'q1', label: 'q₁ (rel)', min: -2, max: 2, value: q1, step: 0.5 },
          { name: 'q2', label: 'q₂ (rel)', min: -2, max: 2, value: q2, step: 0.5 },
        ];
      },
      play() { playing = true; },
      pause() { playing = false; },
      reset() { q1 = 1; q2 = -1; draw(); },
      getMetrics() { return metrics; },
      step() { if (playing) { time += 0.02; draw(); } },
      resize() { ({ ctx, w, h } = resizeCanvas(canvas)); draw(); },
      destroy() {},
    };
    draw();
    return bindVariant(sim, opts);
  }

  /* ─── Complex plane ─── */
  function createComplex(canvas, color, options) {
    const opts = options || {};
    let { ctx, w, h } = resizeCanvas(canvas);
    let variant = opts.variant || 'plano';
    let a = 1, b = 1.5, playing = false, time = 0;
    let metrics = {};

    function draw() {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, w, h);
      const ox = w / 2, oy = h / 2;
      drawGrid(ctx, w, h, ox, oy, 40);
      const mode = getMode('complex', variant);

      if (mode === 'conformal') {
        ctx.strokeStyle = 'rgba(129,140,248,0.35)';
        for (let i = -5; i <= 5; i++) {
          ctx.beginPath();
          for (let t = -5; t <= 5; t += 0.2) {
            const wx = t * 30 + Math.sin(t + time) * 10;
            const wy = i * 30 + Math.cos(t * 0.5 + time) * 8;
            const px = ox + wx, py = oy + wy;
            t === -5 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      } else if (mode === 'residue') {
        ctx.strokeStyle = 'rgba(239,68,68,0.7)';
        ctx.beginPath(); ctx.arc(ox + 50, oy - 30, 18, 0, TAU); ctx.stroke();
        ctx.strokeStyle = 'rgba(34,197,94,0.5)';
        ctx.beginPath(); ctx.ellipse(ox, oy, 100, 70, 0, 0, TAU); ctx.stroke();
        ctx.fillStyle = '#9aa3b2';
        ctx.font = '11px system-ui';
        ctx.fillText('Contorno ∮ f(z)dz', ox - 50, oy + 100);
      } else if (mode === 'map') {
        ctx.strokeStyle = 'rgba(56,189,248,0.4)';
        for (let k = -2; k <= 2; k++) {
          ctx.beginPath();
          for (let t = -3; t <= 3; t += 0.1) {
            const wx = t * 25, wy = k * 25;
            const px = ox + wx * wx * 0.08 - wy * wy * 0.08;
            const py = oy + 2 * wx * wy * 0.08;
            t === -3 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      }

      const zx = a * 50, zy = -b * 50;
      drawArrow(ctx, ox, oy, ox + zx, oy + zy, color || '#818cf8', 'z');
      const r = Math.hypot(a, b);
      const theta = Math.atan2(b, a);
      ctx.strokeStyle = 'rgba(34,197,94,0.5)';
      ctx.beginPath(); ctx.arc(ox, oy, r * 50, 0, -theta, true); ctx.stroke();

      metrics = {
        Modo: mode,
        'Re(z)': a.toFixed(2),
        'Im(z)': b.toFixed(2),
        '|z|': r.toFixed(2),
        'arg(z) (°)': (theta * 180 / Math.PI).toFixed(1),
      };
      drawSimOverlay(ctx, w, opts);
    }

    const sim = {
      setVariant(v) { variant = v; time = 0; playing = false; draw(); },
      setParam(name, val) {
        if (name === 'a') a = val;
        if (name === 'b') b = val;
        draw();
      },
      getControls() {
        return [
          { name: 'a', label: 'Re(z)', min: -3, max: 3, value: a, step: 0.1 },
          { name: 'b', label: 'Im(z)', min: -3, max: 3, value: b, step: 0.1 },
        ];
      },
      play() { playing = true; },
      pause() { playing = false; },
      reset() { a = 1; b = 1.5; time = 0; draw(); },
      getMetrics() { return metrics; },
      step() { if (playing) { time += 0.04; draw(); } },
      resize() { ({ ctx, w, h } = resizeCanvas(canvas)); draw(); },
      destroy() {},
    };
    draw();
    return bindVariant(sim, opts);
  }

  /* ─── ODE plotter ─── */
  function createODE(canvas, color, options) {
    const opts = options || {};
    let { ctx, w, h } = resizeCanvas(canvas);
    let variant = opts.variant || 'segundo_orden';
    let omega = 2, beta = 0.2, n = 1, playing = false, time = 0;
    let metrics = {};

    function y(t) {
      const mode = getMode('ode', variant);
      const b = mode === 'damped' ? beta * 2.5 : beta;
      if (mode === 'sturm') return Math.sin(n * Math.PI * t / 4) * Math.exp(-0.1 * t);
      return Math.exp(-b * t) * Math.cos(omega * t);
    }

    function draw() {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, w, h);
      const mid = h / 2;
      const mode = getMode('ode', variant);
      drawGrid(ctx, w, h, 40, mid, 30);

      if (mode === 'fourier') {
        const barW = (w - 80) / 8;
        for (let k = 1; k <= 8; k++) {
          const amp = 60 / k * (playing ? 0.7 + 0.3 * Math.sin(time * 2 + k) : 1);
          ctx.fillStyle = color || '#818cf8';
          ctx.fillRect(40 + (k - 1) * barW, mid - amp, barW - 6, amp);
          ctx.fillStyle = '#9aa3b2';
          ctx.font = '10px system-ui';
          ctx.fillText('n=' + k, 40 + (k - 1) * barW, mid + 16);
        }
        metrics = { Modo: 'serie de Fourier', Armónicos: 8, t: time.toFixed(2) };
      } else {
        ctx.strokeStyle = color || '#818cf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const tOff = playing ? time : 0;
        for (let i = 0; i <= w - 40; i++) {
          const t = i / 60 + tOff;
          const yy = mid - y(t) * 100;
          i === 0 ? ctx.moveTo(40 + i, yy) : ctx.lineTo(40 + i, yy);
        }
        ctx.stroke();
        if (mode === 'sturm') {
          ctx.strokeStyle = 'rgba(34,197,94,0.4)';
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(40, mid - 100); ctx.lineTo(w - 20, mid - 100);
          ctx.moveTo(40, mid + 100); ctx.lineTo(w - 20, mid + 100);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        metrics = { Modo: mode, 'ω': omega.toFixed(2), 'β': beta.toFixed(2), 'n': n, 'y(t)': y(time).toFixed(3) };
      }
      drawSimOverlay(ctx, w, opts);
    }

    const sim = {
      setVariant(v) { variant = v; time = 0; playing = false; draw(); },
      setParam(name, val) {
        if (name === 'omega') omega = val;
        if (name === 'beta') beta = val;
        if (name === 'n') n = val;
        draw();
      },
      getControls() {
        const mode = getMode('ode', variant);
        const c = [
          { name: 'omega', label: 'ω', min: 0.5, max: 5, value: omega, step: 0.1 },
          { name: 'beta', label: 'Amortiguamiento', min: 0, max: 1.5, value: beta, step: 0.05 },
        ];
        if (mode === 'sturm') c.push({ name: 'n', label: 'Modo n', min: 1, max: 5, value: n, step: 1 });
        return c;
      },
      play() { playing = true; },
      pause() { playing = false; },
      reset() { omega = 2; beta = 0.2; n = 1; time = 0; draw(); },
      getMetrics() { return metrics; },
      step() { if (playing) { time += 0.04; draw(); } },
      resize() { ({ ctx, w, h } = resizeCanvas(canvas)); draw(); },
      destroy() {},
    };
    draw();
    return bindVariant(sim, opts);
  }

  /* ─── Special functions ─── */
  function createSpecialFn(canvas, color, options) {
    const opts = options || {};
    let { ctx, w, h } = resizeCanvas(canvas);
    let variant = opts.variant || 'bessel';
    let n = 0, playing = false, time = 0;
    let metrics = {};

    function besselJ0(x) {
      let sum = 0;
      for (let k = 0; k < 20; k++) {
        const num = Math.pow(-1, k) * Math.pow(x / 2, 2 * k);
        const den = factorial(k) * factorial(k);
        sum += num / den;
      }
      return sum;
    }
    function factorial(k) { return k <= 1 ? 1 : k * factorial(k - 1); }
    function gamma(z) {
      if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
      z -= 1;
      const g = 7;
      const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
      let x = c[0];
      for (let i = 1; i < g + 2; i++) x += c[i] / (z + i);
      const t = z + g + 0.5;
      return Math.sqrt(TAU) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
    }

    function fn(x) {
      const mode = getMode('specialfn', variant);
      if (mode === 'gamma') return gamma(x + 1) / 10;
      if (mode === 'bessel') return besselJ0(x + (playing ? time * 0.1 : 0)) * 80;
      if (mode === 'legendre') return ((2 * n + 1) * x * x - 1) / 2 * 40;
      return Math.exp(-x * x / 2) * Math.sin((n + 1) * x + time) * 60;
    }

    function draw() {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, w, h);
      const mid = h / 2;
      const mode = getMode('specialfn', variant);
      drawGrid(ctx, w, h, w / 2, mid, 40);
      ctx.strokeStyle = color || '#818cf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < w; i++) {
        const x = (i - w / 2) / 40;
        const yy = mid - fn(x);
        i === 0 ? ctx.moveTo(i, yy) : ctx.lineTo(i, yy);
      }
      ctx.stroke();
      if (mode === 'quantum') {
        ctx.strokeStyle = 'rgba(34,197,94,0.3)';
        for (let j = 0; j <= 5; j++) {
          const yy = mid - j * j * 8;
          ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(w, yy); ctx.stroke();
        }
      }
      metrics = { Modo: mode, 'n / orden': n, 'J(0)≈': besselJ0(0).toFixed(3) };
      drawSimOverlay(ctx, w, opts);
    }

    const sim = {
      setVariant(v) { variant = v; time = 0; playing = false; draw(); },
      setParam(name, val) { if (name === 'n') n = val; draw(); },
      getControls() {
        return [{ name: 'n', label: 'Orden n', min: 0, max: 5, value: n, step: 1 }];
      },
      play() { playing = true; },
      pause() { playing = false; },
      reset() { n = 0; time = 0; draw(); },
      getMetrics() { return metrics; },
      step() { if (playing) { time += 0.05; draw(); } },
      resize() { ({ ctx, w, h } = resizeCanvas(canvas)); draw(); },
      destroy() {},
    };
    draw();
    return bindVariant(sim, opts);
  }

  /* ─── Maxwell / waves ─── */
  function createMaxwell(canvas, color, options) {
    const opts = options || {};
    let { ctx, w, h } = resizeCanvas(canvas);
    let variant = opts.variant || 'onda';
    let k = 2, omega = 4, playing = false, time = 0;
    let metrics = {};

    function draw() {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, w, h);
      const mid = h / 2;
      const mode = getMode('maxwell', variant);

      if (mode === 'faraday') {
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.strokeRect(w * 0.2, mid - 60, w * 0.25, 120);
        ctx.strokeStyle = color || '#38bdf8';
        ctx.lineWidth = 3;
        const flux = Math.sin(time * 2) * 40;
        ctx.beginPath(); ctx.arc(w * 0.325, mid, 30 + flux * 0.3, 0, TAU); ctx.stroke();
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(w * 0.55, mid - 40, 20, 80);
        drawArrow(ctx, w * 0.58, mid, w * 0.75, mid, '#22c55e', 'ℰ');
        metrics = { Modo: 'inducción Faraday', 'dΦ/dt': (Math.cos(time * 2) * 2).toFixed(2) };
      } else if (mode === 'energy') {
        const e = 0.5 + 0.5 * Math.sin(time);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(w * 0.3, mid + 40 - e * 120, 50, e * 120);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(w * 0.5, mid + 40 - (1 - e) * 120, 50, (1 - e) * 120);
        ctx.fillStyle = '#fff';
        ctx.font = '11px system-ui';
        ctx.fillText('U_B', w * 0.32, mid + 58);
        ctx.fillText('U_E', w * 0.52, mid + 58);
        metrics = { Modo: 'energía EM', 'U_B': e.toFixed(2), 'U_E': (1 - e).toFixed(2) };
      } else if (mode === 'maxwell') {
        const eqs = ['∇·E = ρ/ε₀', '∇·B = 0', '∇×E = −∂B/∂t', '∇×B = μ₀J + μ₀ε₀∂E/∂t'];
        ctx.fillStyle = '#c8ced8';
        ctx.font = '12px monospace';
        eqs.forEach((eq, i) => ctx.fillText(eq, 24, 36 + i * 22));
        ctx.strokeStyle = color || '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
          const yy = mid + 40 - 50 * Math.sin(k * x * 0.02 - omega * time);
          x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
        }
        ctx.stroke();
        metrics = { Modo: 'ecuaciones Maxwell', k: k.toFixed(1), ω: omega.toFixed(1) };
      } else {
        ctx.strokeStyle = color || '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
          const yy = mid - 70 * Math.cos(k * x * 0.02 - omega * time);
          x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
        }
        ctx.stroke();
        ctx.strokeStyle = '#f59e0b';
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
          const yy = mid + 50 * Math.sin(k * x * 0.02 - omega * time);
          x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
        }
        ctx.stroke();
        metrics = { Modo: 'ondas EM', k: k.toFixed(1), 'ω': omega.toFixed(1), 'λ (px)': (TAU / (k * 0.02)).toFixed(0) };
      }
      drawSimOverlay(ctx, w, opts);
    }

    const sim = {
      setVariant(v) { variant = v; time = 0; playing = false; draw(); },
      setParam(name, val) {
        if (name === 'k') k = val;
        if (name === 'omega') omega = val;
        draw();
      },
      getControls() {
        return [
          { name: 'k', label: 'Número de onda k', min: 0.5, max: 5, value: k, step: 0.2 },
          { name: 'omega', label: 'ω', min: 1, max: 8, value: omega, step: 0.2 },
        ];
      },
      play() { playing = true; },
      pause() { playing = false; },
      reset() { time = 0; draw(); },
      getMetrics() { return metrics; },
      step() { if (playing) { time += 0.06; draw(); } },
      resize() { ({ ctx, w, h } = resizeCanvas(canvas)); draw(); },
      destroy() {},
    };
    draw();
    return bindVariant(sim, opts);
  }

  /* ─── Generic fallback ─── */
  function createGeneric(canvas, color, options) {
    return createKinematics(canvas, color, options);
  }

  /* ─── Matrix rotation ─── */
  function createMatrix(canvas, color, options) {
    const opts = options || {};
    const simType = opts.simType === 'rigid' ? 'rigid' : 'matrix';
    let { ctx, w, h } = resizeCanvas(canvas);
    let variant = opts.variant || 'rotacion';
    let theta = 0.785, tx = 0, playing = false, time = 0;
    let metrics = {};

    function transform(p, ang) {
      const mode = getMode(simType, variant);
      if (mode === 'translate') return [p[0] + tx, p[1]];
      if (mode === 'transform') return [p[0] + p[1] * 0.4, p[1]];
      if (mode === 'eigen') return [p[0] * 1.3, p[1] * 0.7];
      return [
        p[0] * Math.cos(ang) - p[1] * Math.sin(ang),
        p[0] * Math.sin(ang) + p[1] * Math.cos(ang),
      ];
    }

    function draw() {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, w, h);
      const ox = w / 2, oy = h / 2;
      const mode = getMode(simType, variant);
      drawGrid(ctx, w, h, ox, oy, 40);
      const ang = playing ? time : theta;
      if (playing && mode === 'translate') tx = Math.sin(time) * 80;
      const pts = [[60, 0], [60, 40], [0, 40]];

      if (mode === 'eigen') {
        drawArrow(ctx, ox, oy, ox + 90, oy, '#22c55e', 'v₁');
        drawArrow(ctx, ox, oy, ox, oy - 60, '#38bdf8', 'v₂');
      }

      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.beginPath();
      pts.forEach((p, i) => {
        const [rx, ry] = transform(p, ang);
        i === 0 ? ctx.moveTo(ox + rx, oy + ry) : ctx.lineTo(ox + rx, oy + ry);
      });
      ctx.closePath(); ctx.stroke();
      ctx.fillStyle = color || '#f59e0b';
      ctx.fill();
      metrics = { Modo: mode, 'θ (°)': (ang * 180 / Math.PI).toFixed(1), Tipo: simType };
      drawSimOverlay(ctx, w, opts);
    }

    const sim = {
      setVariant(v) { variant = v; time = 0; tx = 0; playing = false; draw(); },
      setParam(name, val) { if (name === 'theta') { theta = val * Math.PI / 180; draw(); } },
      getControls() {
        const mode = getMode(simType, variant);
        if (mode === 'translate') return [];
        return [{ name: 'theta', label: 'θ (°)', min: 0, max: 360, value: theta * 180 / Math.PI, step: 5 }];
      },
      play() { playing = true; },
      pause() { playing = false; },
      reset() { time = 0; tx = 0; theta = 0.785; draw(); },
      getMetrics() { return metrics; },
      step() { if (playing) { time += 0.02; draw(); } },
      resize() { ({ ctx, w, h } = resizeCanvas(canvas)); draw(); },
      destroy() {},
    };
    draw();
    return bindVariant(sim, opts);
  }

  /* ─── Vector calc (gradient field) ─── */
  function createVectorCalc(canvas, color, options) {
    const opts = options || {};
    let { ctx, w, h } = resizeCanvas(canvas);
    let variant = opts.variant || 'gradiente';
    let playing = false, time = 0;
    let metrics = {};

    function draw() {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, w, h);
      const mode = getMode('vectorcalc', variant);
      const step = 32;
      const phase = playing ? time : 0;
      for (let x = step; x < w; x += step) {
        for (let y = step; y < h; y += step) {
          const nx = (x - w / 2) / 80, ny = (y - h / 2) / 80;
          let vx, vy;
          if (mode === 'divergence') { vx = nx * 15; vy = ny * 15; }
          else if (mode === 'curl') { vx = -ny * 20 * Math.cos(phase) + nx * 5; vy = nx * 20 * Math.cos(phase) + ny * 5; }
          else if (mode === 'integral') { vx = Math.sin(nx * 3 + phase) * 12; vy = Math.cos(ny * 3 + phase) * 12; }
          else { vx = nx * 15; vy = ny * 15; }
          drawArrow(ctx, x, y, x + vx, y + vy, color || '#38bdf8', '');
        }
      }
      if (mode === 'integral') {
        ctx.strokeStyle = 'rgba(34,197,94,0.4)';
        ctx.beginPath(); ctx.rect(w * 0.25, h * 0.25, w * 0.5, h * 0.5); ctx.stroke();
      }
      metrics = { Modo: mode, '∇·F': mode === 'divergence' ? '≠ 0' : '0', '∇×F': mode === 'curl' ? '≠ 0' : '0' };
      drawSimOverlay(ctx, w, opts);
    }

    const sim = {
      setVariant(v) { variant = v; time = 0; playing = false; draw(); },
      setParam() {},
      getControls() { return []; },
      play() { playing = true; },
      pause() { playing = false; },
      reset() { time = 0; draw(); },
      getMetrics() { return metrics; },
      step() { if (playing) { time += 0.04; draw(); } },
      resize() { ({ ctx, w, h } = resizeCanvas(canvas)); draw(); },
      destroy() {},
    };
    draw();
    return bindVariant(sim, opts);
  }

  /* ─── Newton (F = ma) ─── */
  function createNewton(canvas, color, options) {
    const opts = options || {};
    let { ctx, w, h } = resizeCanvas(canvas);
    let variant = opts.variant || 'fuerza_masa';
    let F = 20, m = 5, playing = false, time = 0, x = 60;
    let metrics = {};

    function draw() {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, w, h);
      const mode = getMode('newton', variant);
      const y = h * 0.65;
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.beginPath(); ctx.moveTo(40, y + 30); ctx.lineTo(w - 40, y + 30); ctx.stroke();

      if (mode === 'inertial') {
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fillRect(40 + (playing ? time * 30 : 0), y - 50, w - 80, 80);
        ctx.fillStyle = '#9aa3b2';
        ctx.font = '11px system-ui';
        ctx.fillText('marco inercial', 50, y - 55);
      }

      const a = mode === 'equilibrium' ? 0 : F / m;
      const px = playing && mode !== 'equilibrium' ? 60 + 0.5 * a * time * time * 30 : x;
      ctx.fillStyle = color || '#f59e0b';
      ctx.fillRect(px - 25, y - 10, 50, 40);
      drawArrow(ctx, px + 30, y + 10, px + 30 + F * 3, y + 10, '#22c55e', 'F');
      if (mode === 'equilibrium') {
        drawArrow(ctx, px - 30, y + 10, px - 30 - F * 2, y + 10, '#ef4444', '−F');
        ctx.fillStyle = '#9aa3b2';
        ctx.font = '12px system-ui';
        ctx.fillText('ΣF = 0', w - 100, 100);
      } else {
        ctx.fillStyle = '#9aa3b2';
        ctx.font = '12px system-ui';
        ctx.fillText('ΣF = ma', w - 120, 100);
      }
      metrics = { Modo: mode, 'F (N)': F, 'm (kg)': m, 'a (m/s²)': a.toFixed(2) };
      drawSimOverlay(ctx, w, opts);
    }

    const sim = {
      setVariant(v) { variant = v; time = 0; playing = false; draw(); },
      setParam(name, val) {
        if (name === 'F') F = val;
        if (name === 'm') m = val;
        draw();
      },
      getControls() {
        return [
          { name: 'F', label: 'Fuerza F (N)', min: 0, max: 50, value: F, step: 1 },
          { name: 'm', label: 'Masa m (kg)', min: 1, max: 20, value: m, step: 1 },
        ];
      },
      play() { playing = true; time = 0; },
      pause() { playing = false; },
      reset() { playing = false; time = 0; F = 20; m = 5; draw(); },
      getMetrics() { return metrics; },
      step() { if (playing) { time += 0.05; draw(); } },
      resize() { ({ ctx, w, h } = resizeCanvas(canvas)); draw(); },
      destroy() {},
    };
    draw();
    return bindVariant(sim, opts);
  }

  /* ─── Conservation (energy / momentum) ─── */
  function createConservation(canvas, color, options) {
    const opts = options || {};
    let { ctx, w, h } = resizeCanvas(canvas);
    let variant = opts.variant || 'energia_mecanica';
    let h0 = 80, v = 0, playing = false, time = 0, g = 10, m = 1;
    let metrics = {};

    function draw() {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, w, h);
      const mode = getMode('conservation', variant);
      const ground = h - 60;

      if (mode === 'momentum') {
        const px1 = playing ? w * 0.25 + time * 40 : w * 0.25;
        const px2 = playing ? w * 0.65 - time * 20 : w * 0.65;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(px1, ground - 30, 16, 0, TAU); ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(px2, ground - 24, 12, 0, TAU); ctx.fill();
        if (playing && time > 1.5) {
          drawArrow(ctx, px1, ground - 30, px1 + 60, ground - 30, '#22c55e', 'p');
        }
        metrics = { Modo: 'momento lineal', 'p_total': 'conservado', t: time.toFixed(2) };
      } else if (mode === 'potential') {
        ctx.strokeStyle = 'rgba(34,197,94,0.4)';
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
          const yy = ground - 80 - 60 * Math.sin((x / w) * Math.PI);
          x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
        }
        ctx.stroke();
        const px = w / 2 + Math.sin(time) * 100;
        const py = ground - 80 - 60 * Math.sin(((px / w) * Math.PI));
        ctx.fillStyle = color || '#38bdf8';
        ctx.beginPath(); ctx.arc(px, py, 12, 0, TAU); ctx.fill();
        metrics = { Modo: 'energía potencial', U: 'mgh', t: time.toFixed(2) };
      } else {
        let y = ground - h0;
        let K = 0, U = m * g * h0;
        if (playing) {
          const t = time * 0.5;
          y = ground - Math.max(0, h0 - 0.5 * g * t * t);
          const vy = -g * t;
          K = 0.5 * m * vy * vy;
          U = m * g * Math.max(0, ground - y);
        }
        const E = K + U;
        ctx.fillStyle = color || '#38bdf8';
        ctx.beginPath(); ctx.arc(w / 2, y, 14, 0, TAU); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath(); ctx.moveTo(w / 2, ground); ctx.lineTo(w / 2, y); ctx.stroke();
        const barX = w - 100;
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(barX, ground - K * 2, 30, K * 2);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(barX + 40, ground - U * 0.5, 30, U * 0.5);
        ctx.fillStyle = '#fff';
        ctx.font = '11px system-ui';
        ctx.fillText('K', barX + 8, ground + 16);
        ctx.fillText('U', barX + 48, ground + 16);
        metrics = { Modo: 'energía mecánica', 'K (J)': K.toFixed(1), 'U (J)': U.toFixed(1), 'E (J)': E.toFixed(1) };
      }
      drawSimOverlay(ctx, w, opts);
    }

    const sim = {
      setVariant(v) { variant = v; time = 0; playing = false; draw(); },
      setParam(name, val) { if (name === 'h0') h0 = val; draw(); },
      getControls() {
        return [{ name: 'h0', label: 'Altura h₀ (m)', min: 20, max: 150, value: h0, step: 5 }];
      },
      play() { playing = true; time = 0; },
      pause() { playing = false; },
      reset() { playing = false; time = 0; h0 = 80; draw(); },
      getMetrics() { return metrics; },
      step() { if (playing) { time += 0.04; if (time > 4) time = 0; draw(); } },
      resize() { ({ ctx, w, h } = resizeCanvas(canvas)); draw(); },
      destroy() {},
    };
    draw();
    return bindVariant(sim, opts);
  }

  /* ─── Coordinates ─── */
  function createCoordinates(canvas, color, options) {
    const opts = options || {};
    let { ctx, w, h } = resizeCanvas(canvas);
    let variant = opts.variant || 'cartesianas';
    let r = 120, theta = 0.785, playing = false;
    let metrics = {};

    function draw() {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, w, h);
      const ox = w / 2, oy = h / 2;
      const mode = getMode('coordinates', variant);
      drawGrid(ctx, w, h, ox, oy, 40);
      if (mode === 'polar') {
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        for (let rr = 40; rr <= 180; rr += 40) {
          ctx.beginPath(); ctx.arc(ox, oy, rr, 0, TAU); ctx.stroke();
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        for (let a = 0; a < TAU; a += Math.PI / 6) {
          ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + 180 * Math.cos(a), oy - 180 * Math.sin(a)); ctx.stroke();
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + r * Math.cos(theta), oy - r * Math.sin(theta)); ctx.stroke();
      }
      const px = ox + r * Math.cos(theta);
      const py = oy - r * Math.sin(theta);
      ctx.fillStyle = color || '#f59e0b';
      ctx.beginPath(); ctx.arc(px, py, 10, 0, TAU); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '12px system-ui';
      ctx.fillText(`x=${(r * Math.cos(theta)).toFixed(0)}, y=${(r * Math.sin(theta)).toFixed(0)}`, 20, h - 40);
      ctx.fillText(`r=${r.toFixed(0)}, θ=${(theta * 180 / Math.PI).toFixed(0)}°`, 20, h - 22);
      metrics = { Modo: mode, r: r.toFixed(0), 'θ (°)': (theta * 180 / Math.PI).toFixed(1), Sistema: variant };
      drawSimOverlay(ctx, w, opts);
    }

    const sim = {
      setVariant(v) { variant = v; playing = false; draw(); },
      setParam(name, val) {
        if (name === 'r') r = val;
        if (name === 'theta') theta = val * Math.PI / 180;
        draw();
      },
      getControls() {
        return [
          { name: 'r', label: 'r', min: 40, max: 180, value: r, step: 5 },
          { name: 'theta', label: 'θ (°)', min: 0, max: 360, value: theta * 180 / Math.PI, step: 5 },
        ];
      },
      play() { playing = true; },
      pause() { playing = false; },
      reset() { r = 120; theta = 0.785; draw(); },
      getMetrics() { return metrics; },
      step() { if (playing) { theta += 0.02; draw(); } },
      resize() { ({ ctx, w, h } = resizeCanvas(canvas)); draw(); },
      destroy() {},
    };
    draw();
    return bindVariant(sim, opts);
  }

  /* ─── Curves (curvature) ─── */
  function createCurves(canvas, color, options) {
    const opts = options || {};
    let { ctx, w, h } = resizeCanvas(canvas);
    let variant = opts.variant || 'curvatura';
    let playing = false, time = 0;
    let metrics = {};

    function draw() {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const mode = getMode('curves', variant);
      ctx.strokeStyle = color || '#818cf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 200; i++) {
        const t = (i / 200) * TAU * (mode === 'torsion' ? 2 : 1);
        const R = 100;
        let x, y;
        if (mode === 'torsion') {
          x = cx + R * Math.cos(t) * 0.5;
          y = cy + R * Math.sin(t) * 0.5 + t * 8;
        } else {
          x = cx + R * Math.cos(t);
          y = cy + R * 0.6 * Math.sin(t);
        }
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      const t0 = playing ? time : 1.2;
      const R = 100;
      let px, py;
      if (mode === 'torsion') {
        px = cx + R * Math.cos(t0) * 0.5;
        py = cy + R * Math.sin(t0) * 0.5 + t0 * 8;
      } else {
        px = cx + R * Math.cos(t0);
        py = cy + R * 0.6 * Math.sin(t0);
      }
      ctx.strokeStyle = 'rgba(34,197,94,0.5)';
      ctx.beginPath(); ctx.arc(px, py, mode === 'torsion' ? 25 : 40, 0, TAU); ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.arc(px, py, 8, 0, TAU); ctx.fill();
      ctx.fillStyle = '#9aa3b2';
      ctx.font = '11px system-ui';
      ctx.fillText(mode === 'torsion' ? 'Hélice (torsión τ ≠ 0)' : 'Círculo osculador (κ = 1/R)', px + 15, py - 15);
      metrics = { Modo: mode, κ: mode === 'torsion' ? '—' : '≈1/R', t: t0.toFixed(2) };
      drawSimOverlay(ctx, w, opts);
    }

    const sim = {
      setVariant(v) { variant = v; time = 0; playing = false; draw(); },
      setParam() {},
      getControls() { return []; },
      play() { playing = true; },
      pause() { playing = false; },
      reset() { time = 0; draw(); },
      getMetrics() { return metrics; },
      step() { if (playing) { time += 0.03; draw(); } },
      resize() { ({ ctx, w, h } = resizeCanvas(canvas)); draw(); },
      destroy() {},
    };
    draw();
    return bindVariant(sim, opts);
  }

  /* ─── Rotating frame ─── */
  function createRotating(canvas, color, options) {
    const opts = options || {};
    let { ctx, w, h } = resizeCanvas(canvas);
    let variant = opts.variant || 'centrifuga';
    let omega = 1.5, r = 80, playing = false, time = 0;
    let metrics = {};

    function draw() {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const mode = getMode('rotating', variant);
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath(); ctx.arc(cx, cy, 120, 0, TAU); ctx.stroke();

      if (mode === 'equivalence') {
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.strokeRect(cx - 60, cy - 100, 120, 200);
        ctx.fillStyle = color || '#f59e0b';
        ctx.fillRect(cx - 20, cy - 30 + (playing ? Math.sin(time) * 40 : 0), 40, 40);
        ctx.fillStyle = '#9aa3b2';
        ctx.font = '11px system-ui';
        ctx.fillText('Elevador (equivalencia)', cx - 55, cy - 110);
        metrics = { Modo: 'equivalencia', g_eff: (10 + (playing ? Math.sin(time) * 5 : 0)).toFixed(1) };
        drawSimOverlay(ctx, w, opts);
        return;
      }

      const ang = playing ? time * omega : 0.5;
      const px = cx + r * Math.cos(ang);
      const py = cy + r * Math.sin(ang);
      ctx.fillStyle = color || '#f59e0b';
      ctx.beginPath(); ctx.arc(px, py, 12, 0, TAU); ctx.fill();
      if (mode === 'centrifugal' || mode === 'coriolis') {
        drawArrow(ctx, px, py, px + omega * omega * r * 0.8, py, '#ef4444', 'F_cf');
      }
      if (mode === 'coriolis') {
        drawArrow(ctx, px, py, px, py + 2 * omega * 20, '#38bdf8', 'F_Cor');
      }
      ctx.fillStyle = '#9aa3b2';
      ctx.font = '11px system-ui';
      ctx.fillText('Marco rotante ω', cx - 40, cy - 130);
      metrics = { Modo: mode, 'ω (rad/s)': omega.toFixed(2), 'r (m)': r, 'a_cf': (omega * omega * r).toFixed(2) };
      drawSimOverlay(ctx, w, opts);
    }

    const sim = {
      setVariant(v) { variant = v; time = 0; playing = false; draw(); },
      setParam(name, val) { if (name === 'omega') omega = val; draw(); },
      getControls() {
        return [{ name: 'omega', label: 'ω (rad/s)', min: 0.5, max: 3, value: omega, step: 0.1 }];
      },
      play() { playing = true; },
      pause() { playing = false; },
      reset() { time = 0; omega = 1.5; draw(); },
      getMetrics() { return metrics; },
      step() { if (playing) { time += 0.04; draw(); } },
      resize() { ({ ctx, w, h } = resizeCanvas(canvas)); draw(); },
      destroy() {},
    };
    draw();
    return bindVariant(sim, opts);
  }

  /* ─── Magnetostatic ─── */
  function createMagnetostatic(canvas, color, options) {
    const opts = options || {};
    let { ctx, w, h } = resizeCanvas(canvas);
    let variant = opts.variant || 'biot_savart';
    let I = 2, playing = false, time = 0;
    let metrics = {};

    function draw() {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const mode = getMode('magnetostatic', variant);

      if (mode === 'wire') {
        ctx.strokeStyle = color || '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cx, cy, 70, 0, TAU * 0.75); ctx.stroke();
        const step = 28;
        for (let a = 0; a < TAU; a += Math.PI / 4) {
          const x = cx + 100 * Math.cos(a + time);
          const y = cy + 100 * Math.sin(a + time);
          drawArrow(ctx, x, y, x - 15 * Math.sin(a + time), y + 15 * Math.cos(a + time), 'rgba(56,189,248,0.5)', '');
        }
        metrics = { Modo: 'campo B (alambre/espira)', I: I.toFixed(1) };
      } else if (mode === 'dipole') {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(cx - 60, cy - 15, 30, 30);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(cx + 30, cy - 15, 30, 30);
        const ang = playing ? time * 0.5 : 0.3;
        drawArrow(ctx, cx, cy - 50, cx + Math.sin(ang) * 60, cy - 50 - Math.cos(ang) * 40, '#22c55e', 'τ');
        metrics = { Modo: 'dipolo magnético', τ: (I * Math.sin(ang)).toFixed(2) };
      } else if (mode === 'material') {
        ctx.strokeStyle = color || '#818cf8';
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const H = -80 + (i / 100) * 160;
          const B = 80 * Math.tanh(H / 40 + (playing ? Math.sin(time) * 0.2 : 0));
          const px = cx - 80 + (i / 100) * 160;
          const py = cy + 60 - B;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
        metrics = { Modo: 'histeresis B-H', H_max: '160 A/m' };
      } else {
        const step = 32;
        for (let x = step; x < w; x += step) {
          for (let y = step; y < h; y += step) {
            const nx = (x - cx) / 80, ny = (y - cy) / 80;
            drawArrow(ctx, x, y, x - ny * 18, y + nx * 18, 'rgba(56,189,248,0.45)', '');
          }
        }
        metrics = { Modo: 'campo B / vector potencial', I: I.toFixed(1) };
      }
      drawSimOverlay(ctx, w, opts);
    }

    const sim = {
      setVariant(v) { variant = v; time = 0; playing = false; draw(); },
      setParam(name, val) { if (name === 'I') I = val; draw(); },
      getControls() {
        return [{ name: 'I', label: 'Corriente I (A)', min: 0.5, max: 5, value: I, step: 0.5 }];
      },
      play() { playing = true; },
      pause() { playing = false; },
      reset() { time = 0; I = 2; draw(); },
      getMetrics() { return metrics; },
      step() { if (playing) { time += 0.04; draw(); } },
      resize() { ({ ctx, w, h } = resizeCanvas(canvas)); draw(); },
      destroy() {},
    };
    draw();
    return bindVariant(sim, opts);
  }

  const FACTORIES = {
    vectors: createVectors,
    kinematics: createKinematics,
    oscillator: createOscillator,
    orbit: createOrbit,
    collision: createCollision,
    thermo: createThermo,
    electrostatic: createElectrostatic,
    complex: createComplex,
    ode: createODE,
    specialfn: createSpecialFn,
    maxwell: createMaxwell,
    matrix: createMatrix,
    vectorcalc: createVectorCalc,
    coordinates: createCoordinates,
    newton: createNewton,
    conservation: createConservation,
    rotating: createRotating,
    rigid: createMatrix,
    lagrange: createOscillator,
    curves: createCurves,
    magnetostatic: createMagnetostatic,
    generic: createGeneric,
  };

  window.PhysicsSims = {
    create(type, canvas, options) {
      const opts = { simType: type, ...(options || {}) };
      const fn = FACTORIES[type] || FACTORIES.generic;
      const sim = fn(canvas, opts.color, opts);
      return bindVariant(sim, opts);
    },
  };
})();
