(function () {
  'use strict';

  const history = window.ML_HISTORY;
  const colors = window.ML_CATEGORY_COLORS || {};
  if (!history) return;

  const track = document.getElementById('timelineTrack');
  const eventsEl = document.getElementById('timelineEvents');
  const detailEl = document.getElementById('timelineDetail');
  const rangeEl = document.getElementById('timelineRange');
  const filterEl = document.getElementById('timelineFilters');
  const scroller = document.getElementById('timelineScroller');
  if (!track || !eventsEl) return;

  const minYear = 1948;
  const maxYear = 2026;
  const pxPerYear = 28;
  const totalWidth = (maxYear - minYear) * pxPerYear + 200;
  let activeFilter = 'all';
  let selectedId = null;

  function catLabel(id) {
    const labels = {
      'supervised': 'Supervisado',
      'unsupervised': 'No supervisado',
      'deep-learning': 'Deep Learning',
      'reinforcement': 'RL',
      'ensemble': 'Ensemble',
      'nlp': 'NLP',
      'time-series': 'Series temporales',
      'self-supervised': 'Self-supervised',
      'hybrid-modern': 'Híbridos modernos',
    };
    return labels[id] || id;
  }

  function renderAxis() {
    track.style.width = totalWidth + 'px';
    let html = '';
    for (let y = 1950; y <= 2025; y += 5) {
      const x = (y - minYear) * pxPerYear;
      html += `<div class="tl-tick" style="left:${x}px"><span>${y}</span></div>`;
    }
    track.innerHTML = html;
  }

  function renderFilters() {
    if (!filterEl) return;
    const cats = [...new Set(history.map((e) => e.category))];
    filterEl.innerHTML =
      `<button type="button" class="tl-filter active" data-filter="all">Todos</button>` +
      cats
        .map(
          (c) =>
            `<button type="button" class="tl-filter" data-filter="${c}" style="--cat-color:${colors[c] || '#23f0ec'}">${catLabel(c)}</button>`
        )
        .join('');

    filterEl.querySelectorAll('.tl-filter').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter;
        filterEl.querySelectorAll('.tl-filter').forEach((b) => b.classList.toggle('active', b === btn));
        renderEvents();
      });
    });
  }

  function renderEvents() {
    const filtered = history.filter((e) => activeFilter === 'all' || e.category === activeFilter);
    eventsEl.style.width = totalWidth + 'px';
    eventsEl.innerHTML = filtered
      .map((ev, i) => {
        const x = (ev.year - minYear) * pxPerYear;
        const color = colors[ev.category] || '#23f0ec';
        const top = (i % 3) * 88 + 20;
        const id = `tl-ev-${i}`;
        return `
        <button type="button" class="tl-event" id="${id}" data-index="${i}"
          style="left:${x}px;top:${top}px;--ev-color:${color}"
          aria-label="${ev.year}: ${ev.title}">
          <span class="tl-event-year">${ev.year}</span>
          <span class="tl-event-dot"></span>
          <span class="tl-event-title">${ev.title}</span>
        </button>`;
      })
      .join('');

    eventsEl.querySelectorAll('.tl-event').forEach((btn) => {
      btn.addEventListener('click', () => selectEvent(parseInt(btn.dataset.index, 10)));
    });

    if (filtered.length) selectEvent(filtered.length - 1);
  }

  function getFiltered() {
    return history.filter((e) => activeFilter === 'all' || e.category === activeFilter);
  }

  function selectEvent(index) {
    const filtered = getFiltered();
    const ev2 = filtered[index];
    if (!ev2) return;
    selectedId = index;

    eventsEl.querySelectorAll('.tl-event').forEach((btn) => {
      const isActive = parseInt(btn.dataset.index, 10) === index;
      btn.classList.toggle('active', isActive);
      if (isActive && scroller) {
        const left = parseFloat(btn.style.left);
        scroller.scrollTo({ left: Math.max(0, left - scroller.clientWidth / 2), behavior: 'smooth' });
      }
    });

    if (detailEl) {
      const color = colors[ev2.category] || '#23f0ec';
      const tags = (ev2.tags || []).map((t) => `<span class="tl-tag">${t}</span>`).join('');
      const link = ev2.slug
        ? `<a href="algoritmo.html?id=${ev2.slug}" class="tl-detail-link">Abrir simulación →</a>`
        : '';
      detailEl.innerHTML = `
        <div class="tl-detail-card" style="--ev-color:${color}">
          <span class="tl-detail-year">${ev2.year}</span>
          <h3>${ev2.title}</h3>
          <p>${ev2.desc}</p>
          <div class="tl-detail-tags">${tags}</div>
          ${link}
          <button type="button" class="tl-detail-map" data-cat="${ev2.category}">Ver en mapa</button>
        </div>`;

      detailEl.querySelector('.tl-detail-map')?.addEventListener('click', () => {
        window.highlightMapCategory?.(ev2.category);
        document.getElementById('algoMapWrap')?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (rangeEl) {
      const pct = ((ev2.year - minYear) / (maxYear - minYear)) * 100;
      rangeEl.value = pct;
    }
  }

  if (rangeEl) {
    rangeEl.addEventListener('input', () => {
      const year = minYear + ((maxYear - minYear) * rangeEl.value) / 100;
      const filtered = getFiltered();
      let bestIdx = 0;
      let bestDiff = Infinity;
      filtered.forEach((e, i) => {
        const d = Math.abs(e.year - year);
        if (d < bestDiff) {
          bestDiff = d;
          bestIdx = i;
        }
      });
      selectEvent(bestIdx);
    });
  }

  renderAxis();
  renderFilters();
  renderEvents();

  if (scroller) {
    scroller.scrollLeft = totalWidth * 0.55;
  }
})();
