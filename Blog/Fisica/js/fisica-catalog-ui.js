(function () {
  'use strict';

  const courses = window.FISICA_PROPEDEUTICOS;
  if (!courses) return;

  const mapEl = document.getElementById('fisicaCoursesMap');
  const filtersEl = document.getElementById('fisicaCourseFilters');
  const catalogEl = document.getElementById('fisicaCatalog');
  const searchEl = document.getElementById('fisicaCatalogSearch');
  const statsEl = document.getElementById('fisicaCatalogStats');
  const emptyEl = document.getElementById('fisicaCatalogEmpty');

  let activeCourse = 'all';

  function topicText(topic) {
    return typeof topic === 'string' ? topic : topic.text;
  }

  function isOptional(topic) {
    return typeof topic === 'object' && topic.optional;
  }

  function countTopics(course) {
    return course.units.reduce((n, unit) => n + unit.topics.length, 0);
  }

  function countAllTopics() {
    return courses.reduce((n, c) => n + countTopics(c), 0);
  }

  function countAllUnits() {
    return courses.reduce((n, c) => n + c.units.length, 0);
  }

  function matchesQuery(text, q) {
    if (!q) return true;
    return text.toLowerCase().includes(q.toLowerCase());
  }

  function courseMatches(course, query) {
    if (activeCourse !== 'all' && course.id !== activeCourse) return false;
    if (!query) return true;
    if (matchesQuery(course.title, query) || matchesQuery(course.desc || '', query)) return true;
    return course.units.some(
      (unit) =>
        matchesQuery(unit.title, query) ||
        unit.topics.some((t) => matchesQuery(topicText(t), query))
    );
  }

  function renderFilters() {
    if (!filtersEl) return;
    filtersEl.innerHTML =
      '<button type="button" class="fisica-chip active" data-course="all">Todos</button>' +
      courses
        .map(
          (c) =>
            `<button type="button" class="fisica-chip" data-course="${c.id}" style="--chip-color:${c.color}">${c.icon} ${c.title.split(' ')[0]}</button>`
        )
        .join('');

    filtersEl.querySelectorAll('.fisica-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCourse = btn.dataset.course;
        filtersEl.querySelectorAll('.fisica-chip').forEach((b) => b.classList.toggle('active', b === btn));
        mapEl?.querySelectorAll('.fisica-course-card').forEach((card) => {
          card.classList.toggle('active', activeCourse === 'all' || card.dataset.course === activeCourse);
        });
        refresh();
      });
    });
  }

  function renderMap() {
    if (!mapEl) return;
    mapEl.innerHTML = courses
      .map((course) => {
        const units = course.units.length;
        const topics = countTopics(course);
        return `
        <button type="button" class="fisica-course-card" data-course="${course.id}" style="--course-color:${course.color}">
          <span class="fisica-course-card__icon" aria-hidden="true">${course.icon}</span>
          <span class="fisica-course-card__count">${units} unidades · ${topics} temas</span>
          <span class="fisica-course-card__title">${course.title}</span>
          <span class="fisica-course-card__desc">${course.desc}</span>
        </button>`;
      })
      .join('');

    mapEl.querySelectorAll('.fisica-course-card').forEach((card) => {
      card.addEventListener('click', () => {
        activeCourse = card.dataset.course;
        filtersEl?.querySelectorAll('.fisica-chip').forEach((b) => {
          b.classList.toggle('active', b.dataset.course === activeCourse);
        });
        mapEl.querySelectorAll('.fisica-course-card').forEach((c) => {
          c.classList.toggle('active', c.dataset.course === activeCourse);
        });
        refresh();
        document.getElementById('programaHeading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function findTopicId(courseId, unitIndex, topicIndex) {
    const t = (window.FISICA_TOPIC_INDEX || []).find(
      (x) => x.courseId === courseId && x.unitIndex === unitIndex && x.topicIndex === topicIndex
    );
    return t?.id;
  }

  function renderUnitTopics(topics, courseId, unitIndex) {
    return topics
      .map((topic, ti) => {
        const text = topicText(topic);
        const opt = isOptional(topic);
        const tid = findTopicId(courseId, unitIndex, ti);
        const link = tid ? `tema.html?id=${encodeURIComponent(tid)}` : '#';
        return `<li class="fisica-topic-item${opt ? ' optional' : ''}">
          <a href="${link}" class="fisica-topic-link">
            <span class="fisica-topic-link__text">${text}${opt ? ' <em>(opcional)</em>' : ''}</span>
            <span class="fisica-topic-link__lab">Teoría · Ejemplo · Razonamiento · Simulación →</span>
          </a>
        </li>`;
      })
      .join('');
  }

  function renderBibliography(course) {
    let html = '';
    if (course.bibliography?.length) {
      html += `<div class="fisica-biblio"><h4>Bibliografía</h4><ul>${course.bibliography.map((b) => `<li>${b}</li>`).join('')}</ul></div>`;
    }
    if (course.bibliographyExtra?.length) {
      html += `<div class="fisica-biblio"><h4>Bibliografía complementaria</h4><ul>${course.bibliographyExtra.map((b) => `<li>${b}</li>`).join('')}</ul></div>`;
    }
    return html;
  }

  function renderCatalog(query) {
    if (!catalogEl) return;
    const visible = courses.filter((c) => courseMatches(c, query));

    if (statsEl) {
      const shown = visible.reduce((n, c) => n + countTopics(c), 0);
      statsEl.textContent = query || activeCourse !== 'all'
        ? `${shown} temas en ${visible.length} curso(s)`
        : `${courses.length} cursos · ${countAllUnits()} unidades · ${countAllTopics()} temas`;
    }

    if (!visible.length) {
      catalogEl.innerHTML = '';
      if (emptyEl) emptyEl.hidden = false;
      return;
    }

    if (emptyEl) emptyEl.hidden = true;

    catalogEl.innerHTML = visible
      .map((course) => {
        const unitsHtml = course.units
          .map((unit, i) => {
            const unitOptional = unit.optionalUnit;
            return `
            <details class="fisica-unit" style="--course-color:${course.color}" open>
              <summary class="fisica-unit__summary">
                <span class="fisica-unit__num">${i + 1}.</span>
                <span>${unit.title}</span>
                ${unitOptional ? '<span class="fisica-unit__optional">Unidad opcional</span>' : ''}
              </summary>
              <ul class="fisica-unit__topics">${renderUnitTopics(unit.topics, course.id, i)}</ul>
            </details>`;
          })
          .join('');

        return `
        <article class="fisica-course-block" id="curso-${course.id}" style="--course-color:${course.color}">
          <div class="fisica-course-block__head">
            <span class="fisica-course-block__icon" aria-hidden="true">${course.icon}</span>
            <h3 class="fisica-course-block__title">${course.title}</h3>
            <span class="fisica-course-block__badge">${course.units.length} unidades</span>
          </div>
          ${course.note ? `<p class="fisica-course-note">${course.note}</p>` : ''}
          <div class="fisica-units">${unitsHtml}</div>
          ${renderBibliography(course)}
        </article>`;
      })
      .join('');
  }

  function refresh() {
    renderCatalog(searchEl?.value.trim() || '');
  }

  renderFilters();
  renderMap();
  refresh();

  searchEl?.addEventListener('input', refresh);

  const statsHero = document.getElementById('fisicaHeroStats');
  if (statsHero) {
    const total = countAllTopics();
    statsHero.innerHTML = `
      <div class="section-stat"><strong>${courses.length}</strong><span>Cursos</span></div>
      <div class="section-stat"><strong>${countAllUnits()}</strong><span>Unidades</span></div>
      <div class="section-stat"><strong>${total}</strong><span>Laboratorios</span></div>`;
  }
})();
