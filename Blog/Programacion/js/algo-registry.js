(function () {
  'use strict';

  const SUBGROUP_SIM = {
    Regresión: 'regression',
    Clasificación: 'classification',
    Clustering: 'clustering',
    'Reducción de dimensionalidad': 'dimensionality',
    'Detección de anomalías': 'anomaly',
    'Redes neuronales clásicas': 'neural',
    'Redes para imágenes': 'cnn',
    'Redes secuenciales': 'rnn',
    Transformers: 'transformer',
    Generativos: 'generative',
    'Métodos clásicos': 'rl_classic',
    'Deep Reinforcement Learning': 'rl_deep',
    Modelos: 'probabilistic',
    Sistemas: 'hybrid',
    'Modelos y técnicas': 'nlp',
    AutoML: 'automl',
    Técnicas: 'ensemble',
    Algoritmos: 'evolutionary',
    Grafos: 'graph',
    Métodos: 'generic',
  };

  const CATEGORY_DEFAULT_SIM = {
    'time-series': 'timeseries',
    recommendation: 'recommendation',
    'semi-supervised': 'semisupervised',
    'self-supervised': 'selfsupervised',
    federated: 'federated',
    online: 'online',
    causal: 'causal',
    'hybrid-modern': 'hybrid',
  };

  const CATEGORY_COLORS = {
    supervised: '#3b82f6',
    unsupervised: '#8b5cf6',
    'deep-learning': '#ec4899',
    reinforcement: '#f59e0b',
    probabilistic: '#06b6d4',
    'time-series': '#10b981',
    recommendation: '#f97316',
    nlp: '#6366f1',
    automl: '#14b8a6',
    ensemble: '#84cc16',
    evolutionary: '#a855f7',
    'graph-ml': '#0ea5e9',
    'semi-supervised': '#64748b',
    'self-supervised': '#e879f9',
    federated: '#22c55e',
    online: '#eab308',
    causal: '#ef4444',
    'hybrid-modern': '#23f0ec',
  };

  window.ML_CATEGORY_COLORS = { ...window.ML_CATEGORY_COLORS, ...CATEGORY_COLORS };

  const POPULAR_SLUGS = [
    'unsupervised-isolation-forest',
    'unsupervised-k-means',
    'supervised-regresion-lineal',
    'supervised-random-forest',
    'deep-learning-transformer',
    'reinforcement-q-learning',
    'unsupervised-pca',
    'supervised-xgboost',
    'deep-learning-cnn',
    'nlp-bert',
    'reinforcement-deep-q-network-dqn',
    'ensemble-gradient-boosting',
  ];

  function slugify(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function resolveSimType(cat, sg) {
    if (cat.id === 'time-series') return 'timeseries';
    if (cat.id === 'recommendation') return 'recommendation';
    if (cat.id === 'semi-supervised') return 'semisupervised';
    if (cat.id === 'self-supervised') return 'selfsupervised';
    if (cat.id === 'federated') return 'federated';
    if (cat.id === 'online') return 'online';
    if (cat.id === 'causal') return 'causal';
    if (cat.id === 'hybrid-modern') return 'hybrid';
    if (cat.id === 'probabilistic') return 'probabilistic';
    if (cat.id === 'nlp') return 'nlp';
    if (cat.id === 'automl') return 'automl';
    if (cat.id === 'ensemble') return 'ensemble';
    if (cat.id === 'evolutionary') return 'evolutionary';
    if (cat.id === 'graph-ml') return 'graph';
    return SUBGROUP_SIM[sg.title] || CATEGORY_DEFAULT_SIM[cat.id] || 'generic';
  }

  function hashVariant(slug) {
    let h = 0;
    for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
    return Math.abs(h) % 4;
  }

  function enrichCatalog() {
    const catalog = window.ML_CATALOG;
    if (!catalog) return [];

    const index = [];

    catalog.forEach((cat) => {
      cat.subgroups.forEach((sg) => {
        const simType = resolveSimType(cat, sg);
        sg.algorithms = sg.algorithms.map((raw) => {
          const name = typeof raw === 'string' ? raw : raw.name;
          const slug = `${cat.id}-${slugify(name)}`;
          const entry = {
            name,
            slug,
            available: true,
            simType,
            categoryId: cat.id,
            categoryTitle: cat.title,
            subgroupTitle: sg.title,
            subgroupDesc: sg.desc || '',
            color: CATEGORY_COLORS[cat.id] || '#23f0ec',
            variant: hashVariant(slug),
          };
          index.push(entry);
          return entry;
        });
      });
    });

    return index;
  }

  window.ML_ALGO_INDEX = enrichCatalog();

  window.getMlAlgorithm = function (slug) {
    return window.ML_ALGO_INDEX.find((a) => a.slug === slug) || null;
  };

  window.getAdjacentAlgorithms = function (slug) {
    const idx = window.ML_ALGO_INDEX.findIndex((a) => a.slug === slug);
    if (idx < 0) return { prev: null, next: null };
    return {
      prev: idx > 0 ? window.ML_ALGO_INDEX[idx - 1] : null,
      next: idx < window.ML_ALGO_INDEX.length - 1 ? window.ML_ALGO_INDEX[idx + 1] : null,
    };
  };

  window.getPopularAlgorithms = function () {
    const bySlug = new Map(window.ML_ALGO_INDEX.map((a) => [a.slug, a]));
    const popular = POPULAR_SLUGS.map((s) => bySlug.get(s)).filter(Boolean);
    if (popular.length >= 8) return popular;
    return window.ML_ALGO_INDEX.slice(0, 12);
  };
})();
