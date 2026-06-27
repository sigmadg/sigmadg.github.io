(function () {
  'use strict';

  function resizeCanvas(canvas) {
    const wrap = canvas.parentElement;
    const w = wrap?.clientWidth || 800;
    const dpr = window.devicePixelRatio || 1;
    const h = 420;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h };
  }

  function randCluster(n, cx, cy, spread, seed) {
    const pts = [];
    let s = seed || 42;
    const rnd = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
    for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2;
      const r = rnd() * spread;
      pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
    }
    return pts;
  }

  function drawGrid(ctx, w, h) {
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    for (let i = 1; i < 8; i++) {
      const x = (w / 8) * i;
      const y = (h / 8) * i;
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

  function baseSim(canvas, color, opts) {
    let { ctx, w, h } = resizeCanvas(canvas);
    let step = 0;
    let playing = false;
    let t = 0;
    let params = { ...opts.initialParams };
    let metrics = {};
    const steps = opts.steps;
    const drawFn = opts.draw;

    function draw() {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, w, h);
      drawGrid(ctx, w, h);
      const result = drawFn(ctx, w, h, { step, t, params, color, ...opts });
      metrics = result?.metrics || metrics;
    }

    return {
      getSteps: () => steps,
      goToStep(n) {
        step = Math.max(0, Math.min(steps.length - 1, n));
        draw();
      },
      getStep() {
        return step;
      },
      setParam(name, val) {
        params[name] = val;
        draw();
      },
      getControls() {
        return (opts.controls || []).map((c) => ({ ...c, value: params[c.name] ?? c.value }));
      },
      getMetrics() {
        return metrics;
      },
      play() {
        playing = true;
      },
      pause() {
        playing = false;
      },
      reset() {
        playing = false;
        t = 0;
        step = 0;
        params = { ...opts.initialParams };
        draw();
      },
      stepFrame() {
        if (playing) {
          t += 0.025;
          draw();
        }
      },
      resize() {
        ({ ctx, w, h } = resizeCanvas(canvas));
        draw();
      },
      destroy() {
        playing = false;
      },
      draw,
    };
  }

  const STEP_TEMPLATES = {
    regression: [
      { title: '1. Datos', desc: 'Observa la nube de puntos. El modelo busca una función que minimice el error entre predicción y valor real.' },
      { title: '2. Ajuste', desc: 'La recta (o curva) se ajusta a los datos. Cambia pendiente e intercepto y observa cómo cambia el MSE.' },
      { title: '3. Residuos', desc: 'Los residuos son diferencias vertical y revelan sesgo o varianza. Residuos aleatorios → buen ajuste.' },
      { title: '4. Predicción', desc: 'Con el modelo entrenado, predices valores nuevos. Regularización (Ridge/Lasso) reduce sobreajuste.' },
    ],
    classification: [
      { title: '1. Clases', desc: 'Dos (o más) clases en el plano de características. El clasificador aprende una frontera de decisión.' },
      { title: '2. Frontera', desc: 'La línea/curva separa regiones. SVM maximiza margen; árboles particionan el espacio en rectángulos.' },
      { title: '3. Errores', desc: 'Puntos mal clasificados (falsos positivos/negativos) guían el reentrenamiento.' },
      { title: '4. Generalización', desc: 'Un buen modelo separa bien sin memorizar ruido. Prueba con datos fuera del cluster central.' },
    ],
    clustering: [
      { title: '1. Sin etiquetas', desc: 'Solo puntos en el espacio. El clustering agrupa por similitud (distancia, densidad o jerarquía).' },
      { title: '2. Centroides', desc: 'K-Means alterna: asignar puntos al centroide más cercano y recalcular centroides.' },
      { title: '3. Convergencia', desc: 'El algoritmo converge cuando las asignaciones dejan de cambiar o el cambio es mínimo.' },
      { title: '4. Evaluación', desc: 'Silhouette, inercia o estabilidad indican si K es adecuado. DBSCAN usa densidad, no K fijo.' },
    ],
    dimensionality: [
      { title: '1. Alta dimensión', desc: 'Datos en muchas dimensiones son difíciles de visualizar. Buscamos proyección que conserve estructura.' },
      { title: '2. Componentes', desc: 'PCA encuentra direcciones de máxima varianza. t-SNE/UMAP preservan vecindades locales.' },
      { title: '3. Proyección 2D', desc: 'Observa cómo clusters separados en alta dimensión se mantienen (o no) en 2D.' },
      { title: '4. Interpretación', desc: 'Cada componente es combinación lineal de features originales. Útil para compresión y visualización.' },
    ],
    anomaly: [
      { title: '1. Idea central', desc: 'Anomalías son puntos raros: se aíslan con pocos cortes o tienen baja densidad local.' },
      { title: '2. Particiones', desc: 'Isolation Forest divide el espacio con cortes aleatorios. Outliers quedan solos en pocas particiones.' },
      { title: '3. Path length', desc: 'Path length corto → alta probabilidad de anomalía. LOF compara densidad local vs vecinos.' },
      { title: '4. Score', desc: 'El score final combina muchos árboles o comparaciones. Umbral define alertas en producción.' },
    ],
    neural: [
      { title: '1. Neurona', desc: 'Entradas ponderadas + sesgo pasan por activación (ReLU, sigmoid). El perceptron es la unidad básica.' },
      { title: '2. Capas', desc: 'MLP apila capas ocultas. Cada capa transforma representaciones para tareas más abstractas.' },
      { title: '3. Forward pass', desc: 'Señal fluye de entrada a salida. Observa activaciones intermedias iluminarse.' },
      { title: '4. Backprop', desc: 'Gradiente retropropaga error para ajustar pesos. SGD y variantes optimizan la pérdida.' },
    ],
    cnn: [
      { title: '1. Imagen', desc: 'Entrada en grid de píxeles. Convolución aplica filtros locales (bordes, texturas).' },
      { title: '2. Filtros', desc: 'Cada filtro detecta un patrón. Capas profundas combinan patrones simples en complejos.' },
      { title: '3. Pooling', desc: 'Reduce resolución espacial manteniendo información saliente. Aumenta invarianza a traslación.' },
      { title: '4. Clasificación', desc: 'Capas fully-connected al final mapean features a clases. ResNet añade skip connections.' },
    ],
    rnn: [
      { title: '1. Secuencia', desc: 'Datos ordenados en el tiempo o tokens. RNN mantiene estado oculto h_t entre pasos.' },
      { title: '2. Memoria', desc: 'LSTM/GRU controlan qué olvidar y qué recordar con compuertas. Evitan gradiente que desaparece.' },
      { title: '3. Unrolling', desc: 'Desplegamos la red en el tiempo. Mismo peso W se reutiliza en cada paso (weight sharing).' },
      { title: '4. Seq2Seq', desc: 'Encoder resume secuencia; decoder genera salida. Atención mejora alineación entre ambos.' },
    ],
    transformer: [
      { title: '1. Tokens', desc: 'Texto → embeddings posicionales. Sin recurrencia: paralelismo total en entrenamiento.' },
      { title: '2. Self-attention', desc: 'Cada token consulta a todos los demás. Pesos de atención = relevancia contextual.' },
      { title: '3. Multi-head', desc: 'Varias cabezas capturan relaciones distintas (sintáctica, semántica, posicional).' },
      { title: '4. Escala', desc: 'BERT (encoder), GPT (decoder), T5 (encoder-decoder). Escala + datos = capacidades emergentes.' },
    ],
    generative: [
      { title: '1. Latente', desc: 'Espacio latente z comprime la distribución de datos. VAE modela μ, σ; GAN usa ruido aleatorio.' },
      { title: '2. Generador', desc: 'Red G(z) produce muestras sintéticas. Calidad medida por FID, IS o evaluación humana.' },
      { title: '3. Discriminador', desc: 'En GAN, D distingue real vs fake. Juego minimax entrena ambos en competencia.' },
      { title: '4. Difusión', desc: 'Añade ruido gradualmente y aprende a revertirlo. Stable Diffusion condiciona con texto.' },
    ],
    rl_classic: [
      { title: '1. Agente-entorno', desc: 'El agente observa estado s, elige acción a, recibe recompensa r y transita a s′.' },
      { title: '2. Q-values', desc: 'Q(s,a) estima retorno futuro. Política greedy: argmax_a Q(s,a).' },
      { title: '3. Actualización', desc: 'Q-Learning: Q ← Q + α[r + γ max Q(s′,a′) − Q]. SARSA usa acción real del agente.' },
      { title: '4. Exploración', desc: 'ε-greedy balancea explorar vs explotar. Sin exploración, nunca descubre recompensas altas.' },
    ],
    rl_deep: [
      { title: '1. Función Q profunda', desc: 'Red neuronal aproxima Q(s,a) para espacios grandes/continuos. Experience replay estabiliza.' },
      { title: '2. Target network', desc: 'DQN usa red objetivo con pesos congelados periódicamente. Reduce oscilaciones.' },
      { title: '3. Policy gradient', desc: 'PPO/TRPO optimizan directamente la política π(a|s) con restricciones de confianza.' },
      { title: '4. Actor-Critic', desc: 'A3C/A2C combinan valor (crítico) y política (actor). SAC añade entropía para exploración.' },
    ],
    probabilistic: [
      { title: '1. Incertidumbre', desc: 'Modelos bayesianos cuantifican incertidumbre con distribuciones, no solo puntos.' },
      { title: '2. Grafos', desc: 'Nodos = variables; aristas = dependencias. HMM añade cadena temporal oculta.' },
      { title: '3. Inferencia', desc: 'Bayes: P(θ|D) ∝ P(D|θ)P(θ). GP define prior sobre funciones.' },
      { title: '4. Predicción', desc: 'Intervalos de credibilidad y predicción guerían decisiones bajo riesgo.' },
    ],
    timeseries: [
      { title: '1. Serie', desc: 'Observaciones ordenadas en el tiempo. Tendencia, estacionalidad y ruido.' },
      { title: '2. Modelo', desc: 'ARIMA combina AR, I, MA. Kalman filtra estado oculto con ruido gaussiano.' },
      { title: '3. Forecast', desc: 'Predicción h pasos adelante con intervalos de confianza.' },
      { title: '4. Validación', desc: 'Walk-forward validation evita leakage temporal. Prophet maneja feriados y changepoints.' },
    ],
    recommendation: [
      { title: '1. Matriz', desc: 'Usuarios × ítems con ratings dispersos. Objetivo: predecir ratings faltantes.' },
      { title: '2. Factorización', desc: 'R ≈ U·Vᵀ. Cada usuario e ítem tiene vector latente de preferencias.' },
      { title: '3. Colaborativo', desc: 'Usuarios similares → recomendaciones similares. Content-based usa features de ítems.' },
      { title: '4. Híbrido', desc: 'Combina señales colaborativas, contenido y contexto. Neural recommenders aprenden embeddings.' },
    ],
    nlp: [
      { title: '1. Texto → números', desc: 'Tokenización y embeddings (Word2Vec, GloVe, FastText) mapean palabras a vectores.' },
      { title: '2. Contexto', desc: 'BERT usa bidireccional; GPT autoregresivo. Contexto enriquece el significado.' },
      { title: '3. Atención', desc: 'Attention Models alinean palabras relacionadas entre idiomas o en QA.' },
      { title: '4. RAG', desc: 'Recupera documentos externos y los inyecta al LLM para respuestas fundamentadas.' },
    ],
    automl: [
      { title: '1. Búsqueda', desc: 'NAS explora arquitecturas; Hyperband poda trials débiles temprano.' },
      { title: '2. HPO', desc: 'Bayesian Optimization modela superficie de pérdida para elegir próximos hiperparámetros.' },
      { title: '3. Pipeline', desc: 'AutoSklearn/AutoGluon ensamblan preprocessing + modelos automáticamente.' },
      { title: '4. Meta-learning', desc: 'MAML aprende inicialización que se adapta rápido a tareas nuevas con pocos ejemplos.' },
    ],
    ensemble: [
      { title: '1. Modelos base', desc: 'Varios modelos débiles o diversos. La diversidad reduce correlación de errores.' },
      { title: '2. Bagging', desc: 'Bootstrap + promedio (Random Forest). Reduce varianza.' },
      { title: '3. Boosting', desc: 'Modelos secuenciales corrigen residuos del anterior (AdaBoost, XGBoost).' },
      { title: '4. Stacking', desc: 'Meta-modelo aprende a combinar predicciones de modelos base. Voting es caso simple.' },
    ],
    evolutionary: [
      { title: '1. Población', desc: 'Conjunto de candidatos (genes/cromosomas). Fitness mide calidad de cada individuo.' },
      { title: '2. Selección', desc: 'Los mejores sobreviven y se reproducen. Mutación introduce diversidad genética.' },
      { title: '3. Crossover', desc: 'Combina genes de dos padres. PSO mueve partículas hacia el mejor global conocido.' },
      { title: '4. Convergencia', desc: 'Tras generaciones, la población converge a solución óptima o near-optimal.' },
    ],
    graph: [
      { title: '1. Grafo', desc: 'Nodos = entidades; aristas = relaciones. Social, molecular, de conocimiento.' },
      { title: '2. Embeddings', desc: 'Node2Vec/DeepWalk generan vectores por random walks. GCN agrega vecinos.' },
      { title: '3. Message passing', desc: 'GNN propaga información entre capas. GAT pondera vecinos con atención.' },
      { title: '4. Downstream', desc: 'Clasificación de nodos, link prediction o propiedades del grafo completo.' },
    ],
    semisupervised: [
      { title: '1. Pocos labels', desc: 'Muchos datos sin etiqueta, pocos con etiqueta. Aprovecha estructura no supervisada.' },
      { title: '2. Pseudo-labels', desc: 'Modelo confiado etiqueta datos no marcados para reentrenar (Self-Training).' },
      { title: '3. Co-Training', desc: 'Dos vistas independientes se enseñan mutuamente con predicciones de alta confianza.' },
      { title: '4. Propagación', desc: 'Label Propagation difunde etiquetas por similitud en el grafo de datos.' },
    ],
    selfsupervised: [
      { title: '1. Pretext task', desc: 'Genera supervisión artificial: rotación, masking, contraste entre vistas.' },
      { title: '2. Contrastive', desc: 'SimCLR/MoCo acercan embeddings de augmentations de la misma imagen.' },
      { title: '3. BYOL/DINO', desc: 'Evitan colapso sin pares negativos explícitos. MAE reconstruye parches enmascarados.' },
      { title: '4. Transfer', desc: 'Representaciones aprendidas se fine-tunean con pocos labels en downstream.' },
    ],
    federated: [
      { title: '1. Clientes', desc: 'Datos permanecen locales (hospitales, móviles). Solo se comparten actualizaciones de modelo.' },
      { title: '2. FedAvg', desc: 'Servidor promedia pesos de clientes tras rondas locales de entrenamiento.' },
      { title: '3. Heterogeneidad', desc: 'FedProx penaliza desviación de pesos globales. Datos non-IID complican convergencia.' },
      { title: '4. Privacidad', desc: 'Differential privacy y secure aggregation protegen contra filtraciones.' },
    ],
    online: [
      { title: '1. Stream', desc: 'Datos llegan secuencialmente. No caben todos en memoria; modelo se actualiza en vivo.' },
      { title: '2. Update', desc: 'Online SGD: un gradiente por ejemplo. Passive Aggressive para margen grande.' },
      { title: '3. Drift', desc: 'Distribución cambia con el tiempo. Modelo debe adaptarse o detectar concept drift.' },
      { title: '4. Árboles online', desc: 'Hoeffding Trees crecen con streaming usando tests estadísticos de split.' },
    ],
    causal: [
      { title: '1. Correlación ≠ causalidad', desc: 'Confounders Z pueden explicar X e Y. Observacional ≠ experimental.' },
      { title: '2. DAG', desc: 'Grafo causal: flechas indican efecto directo. do(X) interviene cortando entradas a X.' },
      { title: '3. Identificación', desc: 'Propensity scores, instrumental variables o Double ML estiman efecto causal.' },
      { title: '4. Política', desc: 'Causal Forests estiman efecto heterogéneo para personalizar tratamientos.' },
    ],
    hybrid: [
      { title: '1. Componentes', desc: 'Sistemas modernos combinan retrieval, razonamiento simbólico y LLMs.' },
      { title: '2. RAG', desc: 'Consulta base vectorial → contexto relevante → LLM genera respuesta fundamentada.' },
      { title: '3. Agentes', desc: 'Agentic AI planifica, usa herramientas (APIs, código) en bucle observe-act.' },
      { title: '4. MoE', desc: 'Mixture of Experts activa sub-redes especializadas por token. Escala eficientemente.' },
    ],
    generic: [
      { title: '1. Datos', desc: 'Entrada X y salida Y (si hay supervisión). Exploración y preprocesamiento.' },
      { title: '2. Modelo', desc: 'Familia de funciones parametrizadas. Entrenamiento minimiza función de pérdida.' },
      { title: '3. Validación', desc: 'Train/val/test o cross-validation. Métricas acordes a la tarea.' },
      { title: '4. Despliegue', desc: 'Monitoreo de drift, latencia y fairness en producción.' },
    ],
  };

  function makeScatterDraw(classA, classB, showBoundary, showResidual) {
    return (ctx, w, h, { step, t, params, color }) => {
      const pad = 40;
      const ptsA = randCluster(35, 0.35, 0.55, 0.12, 1);
      const ptsB = randCluster(30, 0.65, 0.45, 0.11, 2);
      const slope = params.slope ?? 0.8;
      const intercept = params.intercept ?? 0.2;
      const k = params.k ?? 3;

      ptsA.forEach((p) => {
        const x = pad + p.x * (w - pad * 2);
        const y = h - pad - p.y * (h - pad * 2);
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59,130,246,0.85)';
        ctx.fill();
      });
      ptsB.forEach((p) => {
        const x = pad + p.x * (w - pad * 2);
        const y = h - pad - p.y * (h - pad * 2);
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(249,115,22,0.85)';
        ctx.fill();
      });

      if (step >= 1 || showBoundary) {
        ctx.strokeStyle = color || '#23f0ec';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        const x1 = pad;
        const x2 = w - pad;
        const y1 = h - pad - (slope * 0.15 + intercept) * (h - pad * 2);
        const y2 = h - pad - (slope * 0.85 + intercept) * (h - pad * 2);
        if (showBoundary) {
          ctx.moveTo(pad, h - pad - (Math.sin(t) * 0.15 + 0.5) * (h - pad * 2));
          ctx.lineTo(w - pad, h - pad - (Math.cos(t) * 0.15 + 0.35) * (h - pad * 2));
        } else {
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
        ctx.stroke();
      }

      if (step >= 2 && showResidual) {
        ptsA.slice(0, 8).forEach((p) => {
          const x = pad + p.x * (w - pad * 2);
          const predY = h - pad - (slope * p.x + intercept) * (h - pad * 2);
          const y = h - pad - p.y * (h - pad * 2);
          ctx.strokeStyle = 'rgba(239,68,68,0.5)';
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, predY);
          ctx.stroke();
          ctx.setLineDash([]);
        });
      }

      if (step >= 1 && !showBoundary) {
        const centroids = [];
        for (let i = 0; i < k; i++) {
          const angle = (i / k) * Math.PI * 2 + t * 0.5;
          centroids.push({
            x: 0.5 + Math.cos(angle) * 0.25,
            y: 0.5 + Math.sin(angle) * 0.25,
          });
        }
        centroids.forEach((c, i) => {
          const x = pad + c.x * (w - pad * 2);
          const y = h - pad - c.y * (h - pad * 2);
          ctx.strokeStyle = ['#f59e0b', '#22c55e', '#a855f7', '#ef4444'][i % 4];
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, 12, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = ctx.strokeStyle;
          ctx.font = 'bold 11px system-ui';
          ctx.fillText('C' + (i + 1), x - 8, y + 4);
        });
      }

      return {
        metrics: {
          Paso: step + 1 + '/4',
          Parámetro: showBoundary ? 'margen' : `k=${k}`,
          Loss: (0.5 - step * 0.08 + Math.sin(t) * 0.02).toFixed(3),
        },
      };
    };
  }

  function drawAnomaly(ctx, w, h, { step, t, params }) {
    const pad = 36;
    const cluster = randCluster(40, 0.55, 0.5, 0.12, 7);
    const anomalies = [
      { x: 0.12, y: 0.88 },
      { x: 0.88, y: 0.15 },
    ];
    cluster.forEach((p) => {
      const x = pad + p.x * (w - pad * 2);
      const y = h - pad - p.y * (h - pad * 2);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59,130,246,0.8)';
      ctx.fill();
    });
    anomalies.forEach((p) => {
      const x = pad + p.x * (w - pad * 2);
      const y = h - pad - p.y * (h - pad * 2);
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#f97316';
      ctx.fill();
    });
    const splits = Math.min(step + 1, 4);
    for (let i = 0; i < splits; i++) {
      ctx.strokeStyle = `rgba(35,240,236,${0.3 + i * 0.15})`;
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (i % 2 === 0) {
        const x = pad + (0.25 + i * 0.15) * (w - pad * 2);
        ctx.moveTo(x, pad);
        ctx.lineTo(x, h - pad);
      } else {
        const y = h - pad - (0.3 + i * 0.12) * (h - pad * 2);
        ctx.moveTo(pad, y);
        ctx.lineTo(w - pad, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
    const threshold = params.threshold ?? 0.6;
    return {
      metrics: {
        'Path length A1': String(Math.max(1, 4 - step)),
        'Score anomalía': Math.round(threshold * 100) + '%',
        Cortes: String(splits),
      },
    };
  }

  function drawNeural(ctx, w, h, { step, t, color }) {
    const layers = [3, 4, 4, 2];
    const nodes = [];
    layers.forEach((count, li) => {
      const x = 80 + li * ((w - 160) / (layers.length - 1));
      for (let ni = 0; ni < count; ni++) {
        const y = h / 2 + (ni - (count - 1) / 2) * 55;
        nodes.push({ x, y, li, ni, active: step >= 1 && (li <= step || Math.sin(t + ni) > 0) });
      }
    });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[j].li === nodes[i].li + 1) {
          ctx.strokeStyle = nodes[i].active && nodes[j].active ? 'rgba(35,240,236,0.35)' : 'rgba(255,255,255,0.06)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.active ? 14 : 10, 0, Math.PI * 2);
      ctx.fillStyle = n.active ? color || '#23f0ec' : 'rgba(255,255,255,0.15)';
      ctx.fill();
    });
    return { metrics: { Capas: layers.length, Activas: step + 1, Neuronas: nodes.length } };
  }

  function drawGridWorld(ctx, w, h, { step, t, params, color }) {
    const cols = 8;
    const rows = 5;
    const cell = Math.min((w - 80) / cols, (h - 80) / rows);
    const ox = (w - cell * cols) / 2;
    const oy = (h - cell * rows) / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = ox + c * cell;
        const y = oy + r * cell;
        const q = Math.sin(c * 0.7 + r * 0.5 + t) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(35,240,236,${0.05 + q * (step >= 1 ? 0.35 : 0.1)})`;
        ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
        if (step >= 2) {
          ctx.fillStyle = '#fff';
          ctx.font = '10px system-ui';
          ctx.fillText(q.toFixed(1), x + cell / 2 - 10, y + cell / 2 + 4);
        }
      }
    }
    const ax = ox + (3 + Math.floor(t * 2) % 3) * cell + cell / 2;
    const ay = oy + 2 * cell + cell / 2;
    ctx.fillStyle = color || '#ff014f';
    ctx.beginPath();
    ctx.arc(ax, ay, cell * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(ox + 6 * cell + 4, oy + 1 * cell + 4, cell - 8, cell - 8);
    return { metrics: { ε: (params.epsilon ?? 0.2).toFixed(2), γ: (params.gamma ?? 0.9).toFixed(2), Q_max: '1.00' } };
  }

  function drawTimeSeries(ctx, w, h, { step, t, params }) {
    const pad = 40;
    const n = 60;
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const x = pad + (i / (n - 1)) * (w - pad * 2);
      const y =
        h -
        pad -
        (0.35 +
          0.15 * Math.sin(i * 0.25) +
          0.08 * Math.sin(i * 0.08 + t) +
          (step >= 2 ? 0.05 * Math.sin(i * 0.4 + t * 2) : 0)) *
          (h - pad * 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    if (step >= 2) {
      ctx.strokeStyle = '#22c55e';
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      for (let i = n - 15; i < n + 10; i++) {
        const x = pad + (i / (n - 1)) * (w - pad * 2);
        const y = h - pad - (0.38 + 0.12 * Math.sin(i * 0.25 + 2)) * (h - pad * 2);
        if (i === n - 15) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
    return { metrics: { Ventana: params.window ?? 12, RMSE: (0.12 - step * 0.02).toFixed(3), h: '+5' } };
  }

  function drawMatrix(ctx, w, h, { step, t, color }) {
    const pad = 50;
    const rows = 5;
    const cols = 7;
    const cw = (w - pad * 2) / cols;
    const ch = (h - pad * 2) / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const val = Math.sin(r * 0.9 + c * 0.7 + t) * 0.5 + 0.5;
        const filled = c < 3 + step;
        ctx.fillStyle = filled ? `rgba(35,240,236,${0.15 + val * 0.5})` : 'rgba(255,255,255,0.04)';
        ctx.fillRect(pad + c * cw + 2, pad + r * ch + 2, cw - 4, ch - 4);
        if (filled && step >= 2) {
          ctx.fillStyle = '#fff';
          ctx.font = '9px system-ui';
          ctx.fillText(val.toFixed(1), pad + c * cw + cw / 2 - 8, pad + r * ch + ch / 2 + 3);
        }
      }
    }
    ctx.fillStyle = color || '#23f0ec';
    ctx.font = '12px system-ui';
    ctx.fillText('Usuarios × Ítems', pad, pad - 12);
    return { metrics: { Rank: 2 + step, RMSE: (0.9 - step * 0.15).toFixed(2), Época: Math.floor(t * 10) } };
  }

  function drawGraph(ctx, w, h, { step, t, color }) {
    const nodes = [
      { x: 0.5, y: 0.2 },
      { x: 0.2, y: 0.5 },
      { x: 0.8, y: 0.5 },
      { x: 0.35, y: 0.82 },
      { x: 0.65, y: 0.82 },
    ];
    const edges = [[0, 1], [0, 2], [1, 3], [2, 4], [3, 4], [1, 2]];
    const pad = 50;
    edges.forEach(([a, b]) => {
      const ax = pad + nodes[a].x * (w - pad * 2);
      const ay = pad + nodes[a].y * (h - pad * 2);
      const bx = pad + nodes[b].x * (w - pad * 2);
      const by = pad + nodes[b].y * (h - pad * 2);
      ctx.strokeStyle = step >= 1 ? 'rgba(35,240,236,0.4)' : 'rgba(255,255,255,0.12)';
      ctx.lineWidth = step >= 2 ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
    });
    nodes.forEach((n, i) => {
      const x = pad + n.x * (w - pad * 2);
      const y = pad + n.y * (h - pad * 2);
      const pulse = step >= 1 ? 0.5 + 0.5 * Math.sin(t * 3 + i) : 0.3;
      ctx.beginPath();
      ctx.arc(x, y, 14 + pulse * 4, 0, Math.PI * 2);
      ctx.fillStyle = color || '#0ea5e9';
      ctx.globalAlpha = 0.6 + pulse * 0.4;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px system-ui';
      ctx.fillText('v' + i, x - 8, y + 4);
    });
    return { metrics: { Nodos: nodes.length, 'Capas GNN': step + 1, Emb_dim: 16 + step * 8 } };
  }

  function drawAttention(ctx, w, h, { step, t, color }) {
    const n = 6;
    const pad = 60;
    const cell = (w - pad * 2) / n;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const att = Math.exp(-Math.abs(i - j) * (1.2 - step * 0.15)) * (0.4 + 0.6 * Math.abs(Math.sin(t + i - j)));
        ctx.fillStyle = `rgba(35,240,236,${att * (step >= 1 ? 0.85 : 0.25)})`;
        ctx.fillRect(pad + j * cell + 2, pad + i * cell + 2, cell - 4, cell - 4);
      }
    }
    ctx.fillStyle = '#fff';
    ctx.font = '11px system-ui';
    ctx.fillText('Self-attention', pad, pad - 10);
    return { metrics: { Heads: 1 + step, Seq_len: n, 'Att max': (0.95 - step * 0.05).toFixed(2) } };
  }

  function drawPopulation(ctx, w, h, { step, t, params, color }) {
    const n = 20;
    const pad = 40;
    for (let i = 0; i < n; i++) {
      const gen = (i / n + t * 0.1 + step * 0.05) % 1;
      const x = pad + gen * (w - pad * 2);
      const fitness = Math.exp(-Math.pow(gen - (0.3 + step * 0.15), 2) * 8);
      const y = h - pad - fitness * (h - pad * 2) * 0.85;
      ctx.beginPath();
      ctx.arc(x, y, 5 + fitness * 4, 0, Math.PI * 2);
      ctx.fillStyle = color || '#a855f7';
      ctx.globalAlpha = 0.4 + fitness * 0.6;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pad, h - pad - 0.85 * (h - pad * 2) * Math.exp(-Math.pow(0.3 + step * 0.15 - (0.3 + step * 0.15), 2) * 8));
    ctx.lineTo(w - pad, h - pad - 0.85 * (h - pad * 2) * 0.95);
    ctx.stroke();
    return { metrics: { Generación: step + 1 + Math.floor(t * 5), Fitness: (0.6 + step * 0.1).toFixed(2), Población: n } };
  }

  function drawFederated(ctx, w, h, { step, t, color }) {
    const clients = [
      { x: 0.2, y: 0.3 },
      { x: 0.8, y: 0.3 },
      { x: 0.2, y: 0.75 },
      { x: 0.8, y: 0.75 },
    ];
    const pad = 50;
    const cx = w / 2;
    const cy = h / 2;
    clients.forEach((c, i) => {
      const x = pad + c.x * (w - pad * 2);
      const y = pad + c.y * (h - pad * 2);
      ctx.strokeStyle = step >= 1 ? color || '#22c55e' : 'rgba(255,255,255,0.15)';
      ctx.lineWidth = step >= 2 ? 2 : 1;
      ctx.setLineDash(step >= 1 ? [] : [4, 4]);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(cx, cy);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(59,130,246,0.8)';
      ctx.fillRect(x - 20, y - 14, 40, 28);
      ctx.fillStyle = '#fff';
      ctx.font = '10px system-ui';
      ctx.fillText('C' + (i + 1), x - 8, y + 4);
    });
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fillStyle = color || '#23f0ec';
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 11px system-ui';
    ctx.fillText('Srv', cx - 12, cy + 4);
    return { metrics: { Ronda: step + 1, Clientes: clients.length, Δpesos: (0.05 + step * 0.02).toFixed(3) } };
  }

  function drawCausal(ctx, w, h, { step, color }) {
    const pad = 60;
    const nodes = [
      { id: 'Z', x: 0.5, y: 0.15 },
      { id: 'X', x: 0.25, y: 0.55 },
      { id: 'Y', x: 0.75, y: 0.55 },
    ];
    const drawNode = (n) => {
      const x = pad + n.x * (w - pad * 2);
      const y = pad + n.y * (h - pad * 2);
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fillStyle = color || '#ef4444';
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px system-ui';
      ctx.fillText(n.id, x - 6, y + 5);
      return { x, y };
    };
    const pos = nodes.map(drawNode);
    const arrow = (a, b, label) => {
      ctx.strokeStyle = step >= 1 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y + 18);
      ctx.lineTo(b.x, b.y - 18);
      ctx.stroke();
      if (label && step >= 2) {
        ctx.fillStyle = '#9aa3b2';
        ctx.font = '10px system-ui';
        ctx.fillText(label, (a.x + b.x) / 2, (a.y + b.y) / 2);
      }
    };
    arrow(pos[0], pos[1], 'confound');
    arrow(pos[0], pos[2], 'confound');
    arrow(pos[1], pos[2], step >= 3 ? 'ATE' : '→');
    return { metrics: { Variables: 3, 'do(X)': step >= 2 ? 'activo' : '—', ATE: step >= 3 ? '0.42' : '—' } };
  }

  function drawPipeline(ctx, w, h, { step, t, color }) {
    const boxes = ['Datos', 'Modelo', 'Métrica', 'Deploy'];
    const bw = (w - 100) / boxes.length;
    boxes.forEach((label, i) => {
      const x = 50 + i * bw;
      const y = h / 2 - 30;
      const active = i <= step;
      ctx.fillStyle = active ? (color || '#23f0ec') + '33' : 'rgba(255,255,255,0.05)';
      ctx.strokeStyle = active ? color || '#23f0ec' : 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      ctx.fillRect(x + 8, y, bw - 16, 60);
      ctx.strokeRect(x + 8, y, bw - 16, 60);
      ctx.fillStyle = active ? '#fff' : '#9aa3b2';
      ctx.font = '12px system-ui';
      ctx.fillText(label, x + bw / 2 - 22, y + 35);
      if (i < boxes.length - 1) {
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.moveTo(x + bw - 4, y + 30);
        ctx.lineTo(x + bw + 12, y + 30);
        ctx.stroke();
      }
    });
    return { metrics: { Etapa: boxes[step] || boxes[0], Progreso: ((step + 1) / 4 * 100).toFixed(0) + '%' } };
  }

  const FACTORIES = {
    regression: (canvas, color, opts) =>
      baseSim(canvas, color, {
        steps: STEP_TEMPLATES.regression,
        initialParams: { slope: 0.8, intercept: 0.2, k: 3 },
        controls: [
          { name: 'slope', label: 'Pendiente', min: -1, max: 1, value: 0.8, step: 0.05 },
          { name: 'intercept', label: 'Intercepto', min: -0.5, max: 0.5, value: 0.2, step: 0.05 },
        ],
        draw: makeScatterDraw(false, false, false, true),
        ...opts,
      }),
    classification: (canvas, color, opts) =>
      baseSim(canvas, color, {
        steps: STEP_TEMPLATES.classification,
        initialParams: { slope: 0.5, k: 3 },
        controls: [{ name: 'slope', label: 'Margen', min: -1, max: 1, value: 0.5, step: 0.05 }],
        draw: makeScatterDraw(true, true, true, false),
        ...opts,
      }),
    clustering: (canvas, color, opts) =>
      baseSim(canvas, color, {
        steps: STEP_TEMPLATES.clustering,
        initialParams: { k: 3, slope: 0, intercept: 0 },
        controls: [{ name: 'k', label: 'Clusters k', min: 2, max: 5, value: 3, step: 1 }],
        draw: makeScatterDraw(false, false, false, false),
        ...opts,
      }),
    dimensionality: (canvas, color, opts) =>
      baseSim(canvas, color, {
        steps: STEP_TEMPLATES.dimensionality,
        initialParams: { k: 2 },
        controls: [{ name: 'k', label: 'Componentes', min: 1, max: 4, value: 2, step: 1 }],
        draw: (ctx, w, h, state) => {
          const r = makeScatterDraw(false, false, false, false)(ctx, w, h, state);
          if (state.step >= 2) {
            ctx.strokeStyle = color || '#8b5cf6';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(w * 0.2, h * 0.8);
            ctx.lineTo(w * 0.85, h * 0.2);
            ctx.stroke();
          }
          return r;
        },
        ...opts,
      }),
    anomaly: (canvas, color, opts) =>
      baseSim(canvas, color, {
        steps: STEP_TEMPLATES.anomaly,
        initialParams: { threshold: 0.6 },
        controls: [{ name: 'threshold', label: 'Umbral', min: 0.3, max: 0.95, value: 0.6, step: 0.05 }],
        draw: drawAnomaly,
        ...opts,
      }),
    neural: (canvas, color, opts) =>
      baseSim(canvas, color, { steps: STEP_TEMPLATES.neural, initialParams: {}, controls: [], draw: drawNeural, ...opts }),
    cnn: (canvas, color, opts) =>
      baseSim(canvas, color, {
        steps: STEP_TEMPLATES.cnn,
        initialParams: { k: 3 },
        controls: [{ name: 'k', label: 'Filtros', min: 1, max: 8, value: 3, step: 1 }],
        draw: (ctx, w, h, state) => {
          const pad = 40;
          const grid = 8;
          const cell = Math.min((w - pad * 2) / grid, 28);
          for (let i = 0; i < grid * grid; i++) {
            const gx = i % grid;
            const gy = Math.floor(i / grid);
            const v = Math.sin(gx * 0.8 + gy * 0.6 + state.t) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(59,130,246,${0.2 + v * 0.6})`;
            ctx.fillRect(pad + gx * cell, pad + gy * cell, cell - 1, cell - 1);
          }
          if (state.step >= 1) {
            ctx.strokeStyle = color || '#ec4899';
            ctx.lineWidth = 2;
            ctx.strokeRect(pad + cell, pad + cell, cell * 3, cell * 3);
          }
          return { metrics: { Filtros: state.params.k, Capa: state.step + 1, ReLU: 'on' } };
        },
        ...opts,
      }),
    rnn: (canvas, color, opts) =>
      baseSim(canvas, color, {
        steps: STEP_TEMPLATES.rnn,
        initialParams: {},
        controls: [],
        draw: (ctx, w, h, { step, t, color: c }) => {
          const tokens = ['El', 'gato', 'duerme', '…'];
          tokens.forEach((tok, i) => {
            const x = 80 + i * ((w - 160) / (tokens.length - 1));
            const y = h / 2;
            const active = i <= step + Math.floor(t * 2) % tokens.length;
            ctx.fillStyle = active ? c || '#ec4899' : 'rgba(255,255,255,0.15)';
            ctx.fillRect(x - 30, y - 20, 60, 40);
            ctx.fillStyle = active ? '#fff' : '#9aa3b2';
            ctx.font = '13px system-ui';
            ctx.fillText(tok, x - 14, y + 5);
            if (i < tokens.length - 1) {
              ctx.strokeStyle = 'rgba(255,255,255,0.2)';
              ctx.beginPath();
              ctx.moveTo(x + 32, y);
              ctx.lineTo(x + 48, y);
              ctx.stroke();
            }
          });
          return { metrics: { h_t: '[' + (step + 1) + ']', Pasos: tokens.length, GRU: step >= 2 ? 'on' : 'off' } };
        },
        ...opts,
      }),
    transformer: (canvas, color, opts) =>
      baseSim(canvas, color, { steps: STEP_TEMPLATES.transformer, initialParams: {}, controls: [], draw: drawAttention, ...opts }),
    generative: (canvas, color, opts) =>
      baseSim(canvas, color, {
        steps: STEP_TEMPLATES.generative,
        initialParams: { k: 2 },
        controls: [{ name: 'k', label: 'z dim', min: 1, max: 8, value: 2, step: 1 }],
        draw: (ctx, w, h, { step, t, color: c }) => {
          for (let i = 0; i < 12; i++) {
            const x = w / 2 + Math.cos(t + i) * (60 + step * 20 + i * 8);
            const y = h / 2 + Math.sin(t * 1.3 + i) * (40 + step * 15);
            ctx.beginPath();
            ctx.arc(x, y, 6 + step * 2, 0, Math.PI * 2);
            ctx.fillStyle = c || '#ec4899';
            ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t + i);
            ctx.fill();
            ctx.globalAlpha = 1;
          }
          return { metrics: { z_dim: 2 + step, D_loss: (0.8 - step * 0.1).toFixed(2), G_loss: (1.2 - step * 0.15).toFixed(2) } };
        },
        ...opts,
      }),
    rl_classic: (canvas, color, opts) =>
      baseSim(canvas, color, {
        steps: STEP_TEMPLATES.rl_classic,
        initialParams: { epsilon: 0.2, gamma: 0.9 },
        controls: [
          { name: 'epsilon', label: 'ε exploración', min: 0.05, max: 0.5, value: 0.2, step: 0.05 },
          { name: 'gamma', label: 'γ descuento', min: 0.5, max: 0.99, value: 0.9, step: 0.01 },
        ],
        draw: drawGridWorld,
        ...opts,
      }),
    rl_deep: (canvas, color, opts) =>
      baseSim(canvas, color, {
        steps: STEP_TEMPLATES.rl_deep,
        initialParams: { epsilon: 0.1, gamma: 0.99 },
        controls: [{ name: 'epsilon', label: 'ε', min: 0.01, max: 0.3, value: 0.1, step: 0.01 }],
        draw: (ctx, w, h, state) => {
          const r = drawGridWorld(ctx, w, h, state);
          if (state.step >= 1) drawNeural(ctx, w, h, { ...state, color: state.color });
          return r;
        },
        ...opts,
      }),
    probabilistic: (canvas, color, opts) =>
      baseSim(canvas, color, {
        steps: STEP_TEMPLATES.probabilistic,
        initialParams: {},
        controls: [],
        draw: drawCausal,
        ...opts,
      }),
    timeseries: (canvas, color, opts) =>
      baseSim(canvas, color, {
        steps: STEP_TEMPLATES.timeseries,
        initialParams: { window: 12 },
        controls: [{ name: 'window', label: 'Ventana', min: 4, max: 24, value: 12, step: 2 }],
        draw: drawTimeSeries,
        ...opts,
      }),
    recommendation: (canvas, color, opts) =>
      baseSim(canvas, color, { steps: STEP_TEMPLATES.recommendation, initialParams: {}, controls: [], draw: drawMatrix, ...opts }),
    nlp: (canvas, color, opts) =>
      baseSim(canvas, color, {
        steps: STEP_TEMPLATES.nlp,
        initialParams: {},
        controls: [],
        draw: (ctx, w, h, state) => {
          const words = ['machine', 'learning', 'es', 'genial'];
          words.forEach((wrd, i) => {
            const x = 60 + i * 90;
            const y = h / 2 + Math.sin(i + state.t) * 30;
            ctx.beginPath();
            ctx.arc(x, y, 18, 0, Math.PI * 2);
            ctx.fillStyle = state.color || '#6366f1';
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = '10px system-ui';
            ctx.fillText(wrd.slice(0, 4), x - 12, y + 4);
          });
          if (state.step >= 2) drawAttention(ctx, w, h, state);
          return { metrics: { dim: 128 + state.step * 64, vocab: 30000, ctx: state.step + 1 } };
        },
        ...opts,
      }),
    automl: (canvas, color, opts) =>
      baseSim(canvas, color, {
        steps: STEP_TEMPLATES.automl,
        initialParams: { k: 3 },
        controls: [{ name: 'k', label: 'Trials', min: 1, max: 10, value: 3, step: 1 }],
        draw: drawPopulation,
        ...opts,
      }),
    ensemble: (canvas, color, opts) =>
      baseSim(canvas, color, {
        steps: STEP_TEMPLATES.ensemble,
        initialParams: {},
        controls: [],
        draw: (ctx, w, h, { step, t, color: c }) => {
          for (let m = 0; m < 3 + step; m++) {
            const y = 80 + m * 70;
            ctx.strokeStyle = c || '#84cc16';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let x = 60; x < w - 60; x += 8) {
              const yy = y + Math.sin(x * 0.02 + t + m) * 20;
              if (x === 60) ctx.moveTo(x, yy);
              else ctx.lineTo(x, yy);
            }
            ctx.stroke();
          }
          if (step >= 3) {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let x = 60; x < w - 60; x += 8) {
              const yy = h - 80 + Math.sin(x * 0.02 + t) * 10;
              if (x === 60) ctx.moveTo(x, yy);
              else ctx.lineTo(x, yy);
            }
            ctx.stroke();
          }
          return { metrics: { Modelos: 3 + step, Vote: step >= 3 ? 'soft' : '—', Acc: (0.82 + step * 0.03).toFixed(2) } };
        },
        ...opts,
      }),
    evolutionary: (canvas, color, opts) =>
      baseSim(canvas, color, { steps: STEP_TEMPLATES.evolutionary, initialParams: {}, controls: [], draw: drawPopulation, ...opts }),
    graph: (canvas, color, opts) =>
      baseSim(canvas, color, { steps: STEP_TEMPLATES.graph, initialParams: {}, controls: [], draw: drawGraph, ...opts }),
    semisupervised: (canvas, color, opts) =>
      baseSim(canvas, color, {
        steps: STEP_TEMPLATES.semisupervised,
        initialParams: { k: 3 },
        controls: [],
        draw: (ctx, w, h, state) => {
          const r = makeScatterDraw(false, false, false, false)(ctx, w, h, state);
          const pad = 40;
          [0.3, 0.7].forEach((x, i) => {
            ctx.strokeStyle = i === 0 ? '#22c55e' : '#f97316';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(pad + x * (w - pad * 2), h / 2, 16, 0, Math.PI * 2);
            ctx.stroke();
          });
          return { metrics: { Labels: 2 + state.step, 'Sin label': 48 - state.step * 5, Conf: (0.7 + state.step * 0.05).toFixed(2) } };
        },
        ...opts,
      }),
    selfsupervised: (canvas, color, opts) =>
      baseSim(canvas, color, {
        steps: STEP_TEMPLATES.selfsupervised,
        initialParams: {},
        controls: [],
        draw: (ctx, w, h, { step, t, color: c }) => {
          [[0.35, 0.4], [0.65, 0.55]].forEach(([px, py], i) => {
            const x = px * w;
            const y = py * h;
            ctx.fillStyle = c || '#e879f9';
            ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t + i);
            ctx.fillRect(x - 40, y - 40, 80, 80);
            ctx.globalAlpha = 1;
          });
          if (step >= 2) {
            ctx.strokeStyle = '#22c55e';
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(w * 0.35, h * 0.4);
            ctx.lineTo(w * 0.65, h * 0.55);
            ctx.stroke();
            ctx.setLineDash([]);
          }
          return { metrics: { Aug: step + 1, Loss: (1.2 - step * 0.2).toFixed(2), Temp: '0.07' } };
        },
        ...opts,
      }),
    federated: (canvas, color, opts) =>
      baseSim(canvas, color, { steps: STEP_TEMPLATES.federated, initialParams: {}, controls: [], draw: drawFederated, ...opts }),
    online: (canvas, color, opts) =>
      baseSim(canvas, color, {
        steps: STEP_TEMPLATES.online,
        initialParams: { k: 1 },
        controls: [],
        draw: (ctx, w, h, state) => {
          const r = drawTimeSeries(ctx, w, h, state);
          const x = 60 + ((state.t * 50) % (w - 120));
          ctx.fillStyle = '#ff014f';
          ctx.beginPath();
          ctx.arc(x, h / 2, 8, 0, Math.PI * 2);
          ctx.fill();
          return { metrics: { Batch: 1, Update: '#' + Math.floor(state.t * 20), Drift: state.step >= 2 ? 'detectado' : 'no' } };
        },
        ...opts,
      }),
    causal: (canvas, color, opts) =>
      baseSim(canvas, color, { steps: STEP_TEMPLATES.causal, initialParams: {}, controls: [], draw: drawCausal, ...opts }),
    hybrid: (canvas, color, opts) =>
      baseSim(canvas, color, { steps: STEP_TEMPLATES.hybrid, initialParams: {}, controls: [], draw: drawPipeline, ...opts }),
    generic: (canvas, color, opts) =>
      baseSim(canvas, color, { steps: STEP_TEMPLATES.generic, initialParams: {}, controls: [], draw: drawPipeline, ...opts }),
  };

  window.AlgoSims = {
    create(simType, canvas, options) {
      const factory = FACTORIES[simType] || FACTORIES.generic;
      return factory(canvas, options?.color || '#23f0ec', {
        algorithmName: options?.algorithmName || 'Algoritmo',
        variant: options?.variant ?? 0,
      });
    },
    getStepTemplates(simType) {
      return STEP_TEMPLATES[simType] || STEP_TEMPLATES.generic;
    },
  };
})();
