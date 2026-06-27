(function () {
  'use strict';

  const catalog = window.BIO_CATALOG;
  const colors = window.BIO_CATEGORY_COLORS || {};
  if (!catalog) return;

  const navEl = document.getElementById('bioCatalogNav');
  const sectionsEl = document.getElementById('bioCatalogSections');
  const searchEl = document.getElementById('bioCatalogSearch');
  const statsEl = document.getElementById('bioCatalogStats');
  const emptyEl = document.getElementById('bioCatalogEmpty');
  const areasMapEl = document.getElementById('bioAreasMap');
  const filtersEl = document.getElementById('bioAreaFilters');
  const drawer = document.getElementById('bioDrawer');
  const drawerContent = document.getElementById('bioDrawerContent');
  const drawerBackdrop = document.getElementById('bioDrawerBackdrop');
  const drawerClose = document.getElementById('bioDrawerClose');

  let activeArea = 'all';

  function slugify(name) {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function countAll() {
    return catalog.reduce(
      (n, cat) => n + cat.subgroups.reduce((s, sg) => s + sg.subjects.length, 0),
      0
    );
  }

  function matchesQuery(text, q) {
    if (!q) return true;
    return text.toLowerCase().includes(q.toLowerCase());
  }

  function catVisible(cat, query) {
    if (activeArea !== 'all' && cat.id !== activeArea) return false;
    if (!query) return true;
    if (matchesQuery(cat.title, query) || matchesQuery(cat.desc || '', query)) return true;
    return cat.subgroups.some((sg) =>
      sg.subjects.some((s) => matchesQuery(s, query))
    );
  }

  function renderFilters() {
    if (!filtersEl) return;
    filtersEl.innerHTML =
      `<button type="button" class="bio-chip active" data-area="all">Todas</button>` +
      catalog
        .map(
          (c) =>
            `<button type="button" class="bio-chip" data-area="${c.id}" style="--chip-color:${c.color}">${c.icon || ''} ${c.title.split(' ')[0]}</button>`
        )
        .join('');

    filtersEl.querySelectorAll('.bio-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeArea = btn.dataset.area;
        filtersEl.querySelectorAll('.bio-chip').forEach((b) => b.classList.toggle('active', b === btn));
        areasMapEl?.querySelectorAll('.bio-area-card').forEach((card) => {
          card.classList.toggle('active', activeArea === 'all' || card.dataset.area === activeArea);
        });
        refresh();
      });
    });
  }

  function renderAreasMap() {
    if (!areasMapEl) return;
    areasMapEl.innerHTML = catalog
      .map((cat) => {
        const count = cat.subgroups.reduce((n, sg) => n + sg.subjects.length, 0);
        const color = cat.color || colors[cat.id];
        return `
        <button type="button" class="bio-area-card" data-area="${cat.id}" style="--area-color:${color}">
          <span class="bio-area-card__icon" aria-hidden="true">${cat.icon || '•'}</span>
          <span class="bio-area-card__count">${count}</span>
          <span class="bio-area-card__title">${cat.title}</span>
          <span class="bio-area-card__desc">${cat.desc || ''}</span>
        </button>`;
      })
      .join('');

    areasMapEl.querySelectorAll('.bio-area-card').forEach((card) => {
      card.addEventListener('click', () => {
        activeArea = card.dataset.area;
        filtersEl?.querySelectorAll('.bio-chip').forEach((b) => {
          b.classList.toggle('active', b.dataset.area === activeArea);
        });
        areasMapEl.querySelectorAll('.bio-area-card').forEach((c) => {
          c.classList.toggle('active', c.dataset.area === activeArea);
        });
        refresh();
        document.getElementById(activeArea)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function renderNav(filteredIds) {
    if (!navEl) return;
    navEl.innerHTML = catalog
      .filter((c) => filteredIds.has(c.id))
      .map((c) => {
        const count = c.subgroups.reduce((n, sg) => n + sg.subjects.length, 0);
        return `<a href="#${c.id}" class="catalog-nav-link" style="--cat-color:${c.color || colors[c.id]}">
          <span>${c.icon || ''} ${c.title}</span>
          <small>${count}</small>
        </a>`;
      })
      .join('');
  }

  function renderSections(query) {
    if (!sectionsEl) return new Set();

    const visibleIds = new Set();
    let anyVisible = false;

    sectionsEl.innerHTML = catalog
      .filter((cat) => catVisible(cat, query))
      .map((cat) => {
        const color = cat.color || colors[cat.id] || '#22c55e';
        const cards = cat.subgroups
          .flatMap((sg) => sg.subjects)
          .filter(
            (s) =>
              matchesQuery(s, query) ||
              matchesQuery(cat.title, query) ||
              !query
          )
          .map((name) => {
            const slug = slugify(name);
            return `
            <button type="button" class="bio-subject-card" data-subject="${name}" data-slug="${slug}"
              data-area="${cat.id}" style="--card-color:${color}">
              <span class="bio-subject-card__icon">${cat.icon || '•'}</span>
              <span class="bio-subject-card__name">${name}</span>
              <span class="bio-subject-card__status">Próximamente</span>
            </button>`;
          })
          .join('');

        if (!cards) return '';

        visibleIds.add(cat.id);
        anyVisible = true;

        return `
        <section class="catalog-section bio-area-block" id="${cat.id}" style="--area-color:${color}">
          <div class="catalog-section-head">
            <span class="bio-area-block__icon">${cat.icon || ''}</span>
            <div>
              <h2 class="catalog-section-title">${cat.title}</h2>
              ${cat.desc ? `<p class="catalog-section-desc">${cat.desc}</p>` : ''}
            </div>
          </div>
          <div class="bio-subjects-grid">${cards}</div>
        </section>`;
      })
      .filter(Boolean)
      .join('');

    sectionsEl.querySelectorAll('.bio-subject-card').forEach((btn) => {
      btn.addEventListener('click', () => openDrawer(btn.dataset.subject, btn.dataset.slug, btn.dataset.area));
    });

    if (emptyEl) emptyEl.hidden = anyVisible;
    return visibleIds;
  }

  function openDrawer(name, slug, areaId) {
    const cat = catalog.find((c) => c.id === areaId);
    const color = cat?.color || '#22c55e';
    if (!drawer || !drawerContent) return;

    drawerContent.innerHTML = `
      <span class="bio-drawer__tag" style="--area-color:${color}">Próximamente · Interactivo</span>
      <h2 id="bioDrawerTitle">${name}</h2>
      <p class="bio-drawer__area">${cat?.icon || ''} ${cat?.title || ''}</p>
      <p>Laboratorio en desarrollo: simulaciones de procesos, visualizaciones 2D/3D, ejercicios guiados y apuntes integrados.</p>
      <ul class="bio-drawer__features">
        <li>Visualización interactiva</li>
        <li>Ejercicios paso a paso</li>
        <li>Referencias y fórmulas clave</li>
      </ul>
      <p class="bio-drawer__slug"><code>${slug}</code></p>`;

    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  drawerClose?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  function updateStats(query) {
    if (!statsEl) return;
    const total = countAll();
    const visible = sectionsEl.querySelectorAll('.bio-subject-card').length;
    const areaLabel = activeArea === 'all' ? 'todas las áreas' : catalog.find((c) => c.id === activeArea)?.title;
    if (query || activeArea !== 'all') {
      statsEl.textContent = `${visible} materias visibles · filtro: ${areaLabel}`;
    } else {
      statsEl.textContent = `${total} materias en ${catalog.length} áreas · laboratorios interactivos en desarrollo`;
    }
  }

  function refresh() {
    const q = searchEl ? searchEl.value.trim() : '';
    const ids = renderSections(q);
    renderNav(ids);
    updateStats(q);
  }

  renderFilters();
  renderAreasMap();
  refresh();
  if (searchEl) searchEl.addEventListener('input', refresh);
})();
