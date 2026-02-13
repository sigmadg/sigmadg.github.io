(function () {
  const base = window.location.pathname.includes('/web') ? '../n8n-portfolio' : 'n8n-portfolio';
  const imagesBase = window.location.pathname.includes('/web') ? '../Imagenes' : 'Imagenes';

  // Imágenes de la carpeta Imagenes (capturas de cada flujo), en el mismo orden que projects
  const flowImages = [
    'Selección_565.png', 'Selección_566.png', 'Selección_567.png', 'Selección_568.png',
    'Selección_572.png', 'Selección_573.png', 'Selección_574.png', 'Selección_575.png',
    'Selección_576.png', 'Selección_577.png', 'Selección_578.png', 'Selección_579.png',
  ];

  // Lista única de proyectos (sin repetir): slug, sector, título, descripción
  const projects = [
    { slug: 'aeroespacial', sector: 'Aeroespacial', title: 'Telemetría y alertas de mantenimiento', description: 'Monitoreo de telemetría y alertas cuando se superan umbrales, con notificación a mantenimiento.' },
    { slug: 'fintech', sector: 'Fintech', title: 'Conciliación de pagos y anomalías', description: 'Conciliación de movimientos con proveedor de pagos e internos; reporte de discrepancias.' },
    { slug: 'salud', sector: 'Salud', title: 'Recordatorios de citas y consentimientos', description: 'Recordatorios de citas y envío de enlaces de consentimiento informado.' },
    { slug: 'retail', sector: 'Retail / E-commerce', title: 'Inventario y notificaciones de pedidos', description: 'Sincronización de stock y notificación al almacén ante nuevo pedido (webhook).' },
    { slug: 'logistica', sector: 'Logística', title: 'Tracking de envíos y estados', description: 'Consulta al transportista, actualización de estado en BD y notificación al cliente si entregado.' },
    { slug: 'educacion', sector: 'Educación (EdTech)', title: 'Inscripciones y envío de certificados', description: 'Al completar curso: generación de certificado y envío por email.' },
    { slug: 'energia', sector: 'Energía', title: 'Lecturas de medidores y alertas de consumo', description: 'Lecturas de smart meters, guardado en BD y alertas por consumo por encima del umbral.' },
    { slug: 'agricultura', sector: 'Agricultura (AgTech)', title: 'Sensores de suelo y riego', description: 'Sensores y pronóstico del tiempo para recomendar o activar riego.' },
    { slug: 'gobierno', sector: 'Gobierno (GovTech)', title: 'Trámites y notificaciones oficiales', description: 'Actualización de estado de trámites, auditoría y notificación al ciudadano.' },
    { slug: 'media', sector: 'Media / Entretenimiento', title: 'Publicación programada y métricas', description: 'Posts programados desde BD y publicación en LinkedIn (o otra red).' },
    { slug: 'inmobiliario', sector: 'Inmobiliario (Real Estate)', title: 'Lead scoring y seguimiento de visitas', description: 'Score según visitas y valoración; notificación al agente para leads calientes.' },
    { slug: 'automotriz', sector: 'Automotriz', title: 'Recordatorios de servicio y feedback', description: 'Recordatorios de revisión por km/fecha y registro de envío.' },
  ];

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function escapeAttr(s) {
    return String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function getFlowImageSrc(index) {
    var filename = flowImages[index];
    if (!filename) return null;
    return imagesBase + '/' + encodeURIComponent(filename);
  }

  function getPlaceholderImageUrl(sector) {
    return 'https://placehold.co/600x400/1a1a2e/22c55e?text=' + encodeURIComponent(sector);
  }

  // Mapeo slug -> nombre del archivo workflow (para descarga correcta)
  const workflowFileNames = {
    aeroespacial: 'workflow-telemetria-mantenimiento.json',
    fintech: 'workflow-conciliacion-pagos.json',
    salud: 'workflow-recordatorios-consentimientos.json',
    retail: 'workflow-inventario-pedidos.json',
    logistica: 'workflow-tracking-envios.json',
    educacion: 'workflow-inscripciones-certificados.json',
    energia: 'workflow-lecturas-alertas-consumo.json',
    agricultura: 'workflow-sensores-riego.json',
    gobierno: 'workflow-tramites-notificaciones.json',
    media: 'workflow-publicacion-metricas.json',
    inmobiliario: 'workflow-lead-scoring-visitas.json',
    automotriz: 'workflow-servicio-feedback.json',
  };

  function renderCardsFixed() {
    const grid = document.getElementById('project-grid');
    if (!grid) return;

    grid.innerHTML = projects
      .map(function (p, i) {
        var flowImgSrc = getFlowImageSrc(i);
        var placeholderUrl = getPlaceholderImageUrl(p.sector);
        var imgSrc = flowImgSrc || placeholderUrl;
        var fileName = workflowFileNames[p.slug] || 'workflow.json';
        var jsonPath = base + '/' + p.slug + '/' + fileName;
        return (
          '<article class="card">' +
          '  <div class="card-image-wrap">' +
          '    <img class="card-image" src="' + escapeAttr(imgSrc) + '" alt="' + escapeAttr(p.title) + '" loading="lazy" data-fallback="' + escapeAttr(placeholderUrl) + '" onerror="if(this.dataset.fallback){this.src=this.dataset.fallback;}">' +
          '  </div>' +
          '  <div class="card-body">' +
          '    <div class="card-sector">' + escapeHtml(p.sector) + '</div>' +
          '    <h3 class="card-title">' + escapeHtml(p.title) + '</h3>' +
          '    <p class="card-desc">' + escapeHtml(p.description) + '</p>' +
          '    <div class="card-actions">' +
          '      <a href="' + escapeAttr(jsonPath) + '" download="' + escapeAttr(fileName) + '" class="btn btn-primary">Descargar</a>' +
          '      <a href="' + escapeAttr(base + '/' + p.slug + '/README.md') + '" class="btn btn-secondary" target="_blank" rel="noopener">Documentación</a>' +
          '    </div>' +
          '  </div>' +
          '</article>'
        );
      })
      .join('');
  }

  renderCardsFixed();
})();
