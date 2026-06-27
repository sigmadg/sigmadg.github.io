(function () {
  'use strict';

  const catalog = window.ML_CATALOG;
  const colors = window.ML_CATEGORY_COLORS || {};
  if (!catalog) return;

  const canvas = document.getElementById('algoMapCanvas');
  const wrap = document.getElementById('algoMapWrap');
  const tooltip = document.getElementById('algoMapTooltip');
  const legendEl = document.getElementById('algoMapLegend');
  const mapSearch = document.getElementById('mapSearch');
  const mapCountEl = document.getElementById('mapNodeCount');
  if (!canvas || !wrap) return;

  const ctx = canvas.getContext('2d');
  let nodes = [];
  let edges = [];
  let view = { x: 0, y: 0, scale: 1 };
  let dragging = false;
  let dragStart = { x: 0, y: 0 };
  let viewStart = { x: 0, y: 0 };
  let hovered = null;
  let highlightedCat = null;
  let searchQuery = '';

  function normalizeAlgo(item) {
    if (typeof item === 'string') return { name: item, slug: null, available: false };
    return { name: item.name, slug: item.slug || null, available: Boolean(item.available) };
  }

  function shortLabel(title) {
    return title.replace(/^\d+\.\s*/, '').replace(/ \(.*\)/, '');
  }

  function buildGraph() {
    nodes = [];
    edges = [];

    const center = {
      id: 'ml-root',
      type: 'root',
      label: 'Machine Learning',
      x: 0,
      y: 0,
      r: 36,
      color: '#ffffff',
    };
    nodes.push(center);

    const catCount = catalog.length;
    const catRadius = 520;

    catalog.forEach((cat, ci) => {
      const angle = (Math.PI * 2 * ci) / catCount - Math.PI / 2;
      const cx = Math.cos(angle) * catRadius;
      const cy = Math.sin(angle) * catRadius;
      const color = colors[cat.id] || '#23f0ec';

      const catNode = {
        id: cat.id,
        type: 'category',
        label: shortLabel(cat.title),
        fullTitle: cat.title,
        x: cx,
        y: cy,
        r: 22,
        color,
        desc: cat.desc || '',
      };
      nodes.push(catNode);
      edges.push({ from: center.id, to: cat.id });

      const allAlgos = [];
      cat.subgroups.forEach((sg) => {
        sg.algorithms.forEach((a) => {
          const algo = normalizeAlgo(a);
          allAlgos.push({ ...algo, subgroup: sg.title });
        });
      });

      const algoRadius = 180 + Math.min(allAlgos.length * 2, 80);
      const sector = (Math.PI * 2) / catCount;
      const startAngle = angle - sector * 0.42;
      const endAngle = angle + sector * 0.42;

      allAlgos.forEach((algo, ai) => {
        const t = allAlgos.length === 1 ? 0.5 : ai / (allAlgos.length - 1);
        const a = startAngle + t * (endAngle - startAngle);
        const ring = algoRadius + (ai % 3) * 28;
        const id = `${cat.id}::${algo.name}`;

        nodes.push({
          id,
          type: 'algorithm',
          label: algo.name,
          x: cx + Math.cos(a) * ring,
          y: cy + Math.sin(a) * ring,
          r: algo.available ? 7 : 5,
          color,
          categoryId: cat.id,
          subgroup: algo.subgroup,
          slug: algo.slug,
          available: algo.available,
        });
        edges.push({ from: cat.id, to: id });
      });
    });

    if (mapCountEl) {
      const algos = nodes.filter((n) => n.type === 'algorithm').length;
      mapCountEl.textContent = `${algos} algoritmos · ${catCount} categorías`;
    }
  }

  function renderLegend() {
    if (!legendEl) return;
    legendEl.innerHTML = catalog
      .map(
        (c) =>
          `<button type="button" class="map-legend-item" data-cat="${c.id}" style="--cat-color:${colors[c.id] || '#23f0ec'}">${shortLabel(c.title)}</button>`
      )
      .join('');

    legendEl.querySelectorAll('.map-legend-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.cat;
        highlightedCat = highlightedCat === id ? null : id;
        legendEl.querySelectorAll('.map-legend-item').forEach((b) => {
          b.classList.toggle('active', b.dataset.cat === highlightedCat);
        });
        focusCategory(id);
        draw();
      });
    });
  }

  function focusCategory(catId) {
    const cat = nodes.find((n) => n.id === catId);
    if (!cat) return;
    view.x = wrap.clientWidth / 2 - cat.x * view.scale;
    view.y = wrap.clientHeight / 2 - cat.y * view.scale;
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (view.scale === 1 && view.x === 0 && view.y === 0) fitView();
    draw();
  }

  function fitView() {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach((n) => {
      minX = Math.min(minX, n.x - n.r);
      maxX = Math.max(maxX, n.x + n.r);
      minY = Math.min(minY, n.y - n.r);
      maxY = Math.max(maxY, n.y + n.r);
    });
    const pad = 60;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    const gw = maxX - minX + pad * 2;
    const gh = maxY - minY + pad * 2;
    view.scale = Math.min(w / gw, h / gh, 1.2);
    view.x = w / 2 - ((minX + maxX) / 2) * view.scale;
    view.y = h / 2 - ((minY + maxY) / 2) * view.scale;
  }

  function toScreen(n) {
    return { x: n.x * view.scale + view.x, y: n.y * view.scale + view.y, r: n.r * view.scale };
  }

  function toWorld(sx, sy) {
    return { x: (sx - view.x) / view.scale, y: (sy - view.y) / view.scale };
  }

  function nodeVisible(n, alpha) {
    if (highlightedCat && n.type === 'algorithm' && n.categoryId !== highlightedCat) return alpha * 0.15;
    if (highlightedCat && n.type === 'category' && n.id !== highlightedCat) return alpha * 0.25;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        n.label.toLowerCase().includes(q) ||
        (n.fullTitle && n.fullTitle.toLowerCase().includes(q));
      if (n.type === 'root') return alpha;
      if (n.type === 'category') return match ? alpha : alpha * 0.2;
      return match ? alpha : alpha * 0.12;
    }
    return alpha;
  }

  function draw() {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#050608';
    ctx.fillRect(0, 0, w, h);

    const grid = 40 * view.scale;
    if (grid > 12) {
      const offX = view.x % grid;
      const offY = view.y % grid;
      ctx.beginPath();
      for (let x = offX; x < w; x += grid) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = offY; y < h; y += grid) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.stroke();
    }

    edges.forEach((e) => {
      const a = nodes.find((n) => n.id === e.from);
      const b = nodes.find((n) => n.id === e.to);
      if (!a || !b) return;
      const sa = toScreen(a);
      const sb = toScreen(b);
      const alpha = Math.min(nodeVisible(a, 1), nodeVisible(b, 1));
      ctx.beginPath();
      ctx.moveTo(sa.x, sa.y);
      ctx.lineTo(sb.x, sb.y);
      ctx.strokeStyle = `rgba(255,255,255,${0.08 + alpha * 0.15})`;
      ctx.lineWidth = 1 + alpha;
      ctx.stroke();
    });

    nodes.forEach((n) => {
      const s = toScreen(n);
      if (s.x < -50 || s.y < -50 || s.x > w + 50 || s.y > h + 50) return;
      const alpha = nodeVisible(n, 1);
      const isHover = hovered && hovered.id === n.id;
      const glow = isHover || (highlightedCat && (n.id === highlightedCat || n.categoryId === highlightedCat));

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r + (glow ? 4 : 0), 0, Math.PI * 2);
      if (glow) {
        ctx.fillStyle = n.color + '33';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      if (n.type === 'root') {
        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
        grd.addColorStop(0, '#fff');
        grd.addColorStop(1, '#23f0ec');
        ctx.fillStyle = grd;
      } else if (n.available) {
        ctx.fillStyle = '#23f0ec';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.globalAlpha = Math.max(0.35, alpha);
        ctx.fillStyle = n.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      if (n.type === 'category' && view.scale > 0.35) {
        ctx.font = `600 ${Math.max(10, 11 * view.scale)}px system-ui,sans-serif`;
        ctx.fillStyle = `rgba(255,255,255,${0.5 + alpha * 0.5})`;
        ctx.textAlign = 'center';
        ctx.fillText(n.label, s.x, s.y - s.r - 8);
      }

      if (isHover || (searchQuery && n.type === 'algorithm' && nodeVisible(n, 1) > 0.5)) {
        ctx.font = `500 ${Math.max(9, 10 * view.scale)}px system-ui,sans-serif`;
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(n.label.length > 28 ? n.label.slice(0, 26) + '…' : n.label, s.x, s.y + s.r + 14);
      }
    });
  }

  function hitTest(sx, sy) {
    const world = toWorld(sx, sy);
    let best = null;
    let bestDist = Infinity;
    nodes.slice().reverse().forEach((n) => {
      const dx = world.x - n.x;
      const dy = world.y - n.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      const hitR = Math.max(n.r, 8);
      if (d < hitR && d < bestDist) {
        best = n;
        bestDist = d;
      }
    });
    return best;
  }

  function showTooltip(n, sx, sy) {
    if (!tooltip || !n) {
      if (tooltip) tooltip.hidden = true;
      return;
    }
    let html = `<strong>${n.label}</strong>`;
    if (n.type === 'category') html += `<span>${n.desc || ''}</span>`;
    if (n.type === 'algorithm') {
      html += `<span>${n.subgroup || ''}</span>`;
      if (n.available) html += `<span class="tip-live">Simulación disponible — clic para abrir</span>`;
    }
    if (n.type === 'root') html += `<span>${nodes.filter((x) => x.type === 'algorithm').length} algoritmos catalogados</span>`;
    tooltip.innerHTML = html;
    tooltip.hidden = false;
    const rect = wrap.getBoundingClientRect();
    tooltip.style.left = Math.min(sx, rect.width - 220) + 'px';
    tooltip.style.top = Math.max(sy - 10, 8) + 'px';
  }

  canvas.addEventListener('mousedown', (e) => {
    dragging = true;
    dragStart = { x: e.clientX, y: e.clientY };
    viewStart = { x: view.x, y: view.y };
  });

  window.addEventListener('mouseup', () => {
    dragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    if (dragging) {
      view.x = viewStart.x + (e.clientX - dragStart.x);
      view.y = viewStart.y + (e.clientY - dragStart.y);
      draw();
      return;
    }

    const hit = hitTest(sx, sy);
    if (hit !== hovered) {
      hovered = hit;
      canvas.style.cursor = hit ? 'pointer' : 'grab';
      draw();
    }
    showTooltip(hovered, sx, sy);
  });

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const hit = hitTest(e.clientX - rect.left, e.clientY - rect.top);
    if (!hit) return;
    if (hit.type === 'category') {
      highlightedCat = hit.id;
      legendEl?.querySelectorAll('.map-legend-item').forEach((b) => {
        b.classList.toggle('active', b.dataset.cat === highlightedCat);
      });
      focusCategory(hit.id);
      document.getElementById(hit.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      draw();
    }
    if (hit.type === 'algorithm' && hit.available && hit.slug) {
      window.location.href = `algoritmo.html?id=${hit.slug}`;
    }
    if (hit.type === 'algorithm') {
      const search = document.getElementById('catalogSearch');
      if (search) {
        search.value = hit.label;
        search.dispatchEvent(new Event('input'));
      }
      document.querySelector('.catalog-layout')?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  wrap.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const factor = e.deltaY > 0 ? 0.92 : 1.08;
    const newScale = Math.max(0.15, Math.min(3, view.scale * factor));
    view.x = sx - (sx - view.x) * (newScale / view.scale);
    view.y = sy - (sy - view.y) * (newScale / view.scale);
    view.scale = newScale;
    draw();
  }, { passive: false });

  document.getElementById('mapZoomIn')?.addEventListener('click', () => {
    view.scale = Math.min(3, view.scale * 1.2);
    draw();
  });
  document.getElementById('mapZoomOut')?.addEventListener('click', () => {
    view.scale = Math.max(0.15, view.scale / 1.2);
    draw();
  });
  document.getElementById('mapReset')?.addEventListener('click', () => {
    highlightedCat = null;
    searchQuery = '';
    if (mapSearch) mapSearch.value = '';
    legendEl?.querySelectorAll('.map-legend-item').forEach((b) => b.classList.remove('active'));
    fitView();
    draw();
  });

  if (mapSearch) {
    mapSearch.addEventListener('input', () => {
      searchQuery = mapSearch.value.trim();
      draw();
    });
  }

  window.highlightMapCategory = function (catId) {
    highlightedCat = catId;
    legendEl?.querySelectorAll('.map-legend-item').forEach((b) => {
      b.classList.toggle('active', b.dataset.cat === catId);
    });
    focusCategory(catId);
    draw();
  };

  buildGraph();
  renderLegend();
  window.addEventListener('resize', resize);
  resize();
})();
