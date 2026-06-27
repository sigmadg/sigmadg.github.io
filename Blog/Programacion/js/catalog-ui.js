(function () {
  'use strict';

  const catalog = window.ML_CATALOG;
  if (!catalog) return;

  const navEl = document.getElementById('catalogNav');
  const sectionsEl = document.getElementById('catalogSections');
  const searchEl = document.getElementById('catalogSearch');
  const statsEl = document.getElementById('catalogStats');
  const featuredEl = document.getElementById('catalogFeatured');
  const emptyEl = document.getElementById('catalogEmpty');

  function normalizeAlgo(item) {
    if (typeof item === 'string') {
      return { name: item, slug: null, available: false };
    }
    return {
      name: item.name,
      slug: item.slug || null,
      available: Boolean(item.available),
    };
  }

  function countAll() {
    let total = 0;
    let available = 0;
    catalog.forEach((cat) => {
      cat.subgroups.forEach((sg) => {
        sg.algorithms.forEach((a) => {
          total += 1;
          if (normalizeAlgo(a).available) available += 1;
        });
      });
    });
    return { total, available };
  }

  function getFeatured() {
    const items = [];
    catalog.forEach((cat) => {
      cat.subgroups.forEach((sg) => {
        sg.algorithms.forEach((a) => {
          const algo = normalizeAlgo(a);
          if (algo.available) {
            items.push({ ...algo, category: cat.title, subgroup: sg.title });
          }
        });
      });
    });
    return items;
  }

  function matchesQuery(text, q) {
    if (!q) return true;
    return text.toLowerCase().includes(q.toLowerCase());
  }

  function renderFeatured() {
    const featured = window.getPopularAlgorithms ? window.getPopularAlgorithms() : getFeatured();
    if (!featuredEl || !featured.length) return;
    featuredEl.innerHTML = featured
      .map(
        (f) => `
      <a href="algoritmo.html?id=${f.slug}" class="algo-hub-card algo-hub-card--live">
        <span class="tag tag--live">Simulación disponible</span>
        <h3>${f.name}</h3>
        <p>${f.subgroupTitle || f.subgroup} · ${(f.categoryTitle || f.category || '').replace(/^\d+\.\s*/, '')}</p>
        <span class="algo-link-cta">Abrir simulación →</span>
      </a>`
      )
      .join('');
  }

  function renderNav(filteredIds) {
    if (!navEl) return;
    navEl.innerHTML = catalog
      .filter((c) => filteredIds.has(c.id))
      .map(
        (c) =>
          `<a href="#${c.id}" class="catalog-nav-link">${c.title.replace(/^\d+\.\s*/, '')}</a>`
      )
      .join('');
  }

  function renderSections(query) {
    if (!sectionsEl) return new Set();

    const visibleIds = new Set();
    let anyVisible = false;

    sectionsEl.innerHTML = catalog
      .map((cat) => {
        const subgroupsHtml = cat.subgroups
          .map((sg) => {
            const algos = sg.algorithms
              .map(normalizeAlgo)
              .filter(
                (a) =>
                  matchesQuery(a.name, query) ||
                  matchesQuery(sg.title, query) ||
                  matchesQuery(cat.title, query)
              );

            if (!algos.length) return '';

            const pills = algos
              .map((a) => {
                if (a.available && a.slug) {
                  return `<a href="algoritmo.html?id=${a.slug}" class="algo-pill algo-pill--live" title="Simulación interactiva">${a.name}</a>`;
                }
                return `<span class="algo-pill">${a.name}</span>`;
              })
              .join('');

            return `
            <div class="catalog-subgroup">
              <h4 class="catalog-subgroup-title">${sg.title}</h4>
              ${sg.desc ? `<p class="catalog-subgroup-desc">${sg.desc}</p>` : ''}
              <div class="algo-pill-grid">${pills}</div>
            </div>`;
          })
          .filter(Boolean)
          .join('');

        if (!subgroupsHtml) return '';

        visibleIds.add(cat.id);
        anyVisible = true;

        return `
        <section class="catalog-section" id="${cat.id}">
          <div class="catalog-section-head">
            <h2 class="catalog-section-title">${cat.title}</h2>
            ${cat.desc ? `<p class="catalog-section-desc">${cat.desc}</p>` : ''}
          </div>
          ${subgroupsHtml}
        </section>`;
      })
      .filter(Boolean)
      .join('');

    if (emptyEl) {
      emptyEl.hidden = anyVisible;
    }

    return visibleIds;
  }

  function updateStats(query) {
    if (!statsEl) return;
    const { total, available } = countAll();
    if (query) {
      const pills = sectionsEl.querySelectorAll('.algo-pill, .algo-pill--live');
      statsEl.textContent = `${pills.length} resultados · ${available} simulaciones activas · ${total} algoritmos en catálogo`;
    } else {
      statsEl.textContent = `${total} algoritmos · ${available} simulaciones activas · 18 categorías`;
    }
  }

  function refresh() {
    const q = searchEl ? searchEl.value.trim() : '';
    const ids = renderSections(q);
    renderNav(ids);
    updateStats(q);
  }

  renderFeatured();
  refresh();

  if (searchEl) {
    searchEl.addEventListener('input', refresh);
  }
})();
