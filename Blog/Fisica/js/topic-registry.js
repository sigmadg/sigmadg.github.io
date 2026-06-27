(function () {
  'use strict';

  /** Asignación simType + variantes por unidad (índice) del curso */
  const UNIT_SIM = {
    mecanica: [
      { type: 'vectors', variants: ['suma', 'producto_escalar', 'producto_cruz', 'bases', 'proyeccion'] },
      { type: 'vectors', variants: ['covector', 'dual', 'funcional_lineal', 'plano_dual'] },
      { type: 'vectors', variants: ['levi_civita', 'determinante', 'triple_producto', 'indices'] },
      { type: 'matrix', variants: ['tensor_lineal', 'transformacion', 'autovalores', 'deformacion'] },
      { type: 'matrix', variants: ['rotacion_2d', 'rotacion_3d', 'traslacion', 'composicion'] },
      { type: 'curves', variants: ['curvatura', 'torsión', 'frenet', 'helice'] },
      { type: 'kinematics', variants: ['mru', 'mrua', 'caida_libre', 'rotacion'] },
      { type: 'coordinates', variants: ['cartesianas', 'polares', 'cilindricas', 'esfericas'] },
      { type: 'newton', variants: ['inercial', 'galilei', 'transformacion', 'relatividad_restringida'] },
      { type: 'newton', variants: ['fuerza_masa', 'segunda_ley', 'diagrama_cuerpo', 'peso'] },
      { type: 'newton', variants: ['accion_reaccion', 'equilibrio', 'tension', 'normal'] },
      { type: 'conservation', variants: ['momento_lineal', 'impulso', 'momento_angular', 'torque'] },
      { type: 'conservation', variants: ['trabajo', 'energia_cinetica', 'teorema_trabajo', 'potencia'] },
      { type: 'conservation', variants: ['potencial', 'conservativa', 'campo_gradiente', 'equipotenciales'] },
      { type: 'conservation', variants: ['energia_mecanica', 'friccion', 'disipacion', 'rendimiento'] },
      { type: 'conservation', variants: ['centro_masa', 'sistema_particulas', 'coordenadas_cm', 'reducido'] },
      { type: 'lagrange', variants: ['coordenadas_generalizadas', 'lagrangiano', 'euler_lagrange', 'pendulo'] },
      { type: 'oscillator', variants: ['simple', 'amortiguado_sub', 'amortiguado_sobre', 'critico'] },
      { type: 'oscillator', variants: ['forzado', 'resonancia', 'green', 'impulso'] },
      { type: 'oscillator', variants: ['acoplados', 'modos_normales', 'simetrico', 'antisimetrico'] },
      { type: 'orbit', variants: ['dos_cuerpos', 'masa_reducida', 'baricentro', 'fuerza_central'] },
      { type: 'orbit', variants: ['kepler', 'eliptica', 'parabolica', 'hiperbolica'] },
      { type: 'orbit', variants: ['momento_angular', 'ley_areas', 'excentricidad', 'energia_orbital'] },
      { type: 'orbit', variants: ['dispersion', 'parametro_impacto', 'angulo_dispersion', 'seccion_eficaz'] },
      { type: 'orbit', variants: ['rutherford', 'coulomb', 'nucleo', 'particula_alpha'] },
      { type: 'collision', variants: ['choque_1d', 'centro_masa', 'lab_cm', 'lab_lab'] },
      { type: 'collision', variants: ['elastico', 'inelastico', 'parcialmente_elastico', 'coef_restitucion'] },
      { type: 'collision', variants: ['blanco_fijo', 'seccion_eficaz', 'hard_sphere', 'geometrica'] },
      { type: 'rotating', variants: ['base_rotante', 'omega', 'derivada_material', 'infinitesimal'] },
      { type: 'rotating', variants: ['centrifuga', 'coriolis', 'tren', 'presion_extra'] },
      { type: 'rotating', variants: ['equivalencia', 'elevador', 'campo_gravitacional', 'principio'] },
      { type: 'rigid', variants: ['punto_fijo', 'euler_angulos', 'rotacion_finita', 'so3'] },
      { type: 'rigid', variants: ['generales', 'traslacion_rotacion', 'chasde', 'rodadura'] },
      { type: 'rigid', variants: ['tensor_inercia', 'paralelos', 'perpendiculares', 'steiner'] },
      { type: 'rigid', variants: ['ejes_principales', 'diagonalizacion', 'simetria', 'elipsoide'] },
      { type: 'rigid', variants: ['euler_ecuaciones', 'poisson', 'top', 'precesion'] },
    ],
    metodos: [
      { type: 'complex', variants: ['plano', 'modulo_argumento', 'forma_polar', 'regiones'] },
      { type: 'complex', variants: ['funcion', 'dominio', 'imagen', 'mapeo'] },
      { type: 'complex', variants: ['analitica', 'derivada_compleja', 'holomorfa', 'condiciones'] },
      { type: 'complex', variants: ['cauchy_riemann', 'grid', 'rotacion', 'dilatacion'] },
      { type: 'complex', variants: ['singularidades', 'polo', 'esencial', 'removible'] },
      { type: 'complex', variants: ['integral_linea', 'contorno', 'parametrizacion', 'deformacion'] },
      { type: 'complex', variants: ['cauchy_goursat', 'simply_connected', 'contorno_cerrado', 'analitica'] },
      { type: 'complex', variants: ['cauchy_integral', 'valor_medio', 'derivadas', 'formula_integral'] },
      { type: 'complex', variants: ['taylor', 'laurent', 'radio_convergencia', 'serie'] },
      { type: 'complex', variants: ['residuo', 'polo_simple', 'polo_multiple', 'integral_real'] },
      { type: 'ode', variants: ['segundo_orden', 'homogenea', 'no_homogenea', 'coeficientes_const'] },
      { type: 'ode', variants: ['wronskiano', 'independencia', 'determinante', 'solucion_general'] },
      { type: 'ode', variants: ['frobenius', 'serie_potencias', 'indice', 'singularidad'] },
      { type: 'ode', variants: ['sturm_liouville', 'autovalores', 'ortogonalidad', 'autofunciones'] },
      { type: 'ode', variants: ['fourier', 'serie', 'coeficientes', 'parseval'] },
      { type: 'ode', variants: ['green', 'impulso', 'respuesta', 'convolucion'] },
      { type: 'specialfn', variants: ['gamma', 'factorial', 'integrales', 'propiedades'] },
      { type: 'specialfn', variants: ['bessel', 'jn', 'yn', 'nodos'] },
      { type: 'specialfn', variants: ['legendre', 'pl', 'asociados', 'ortogonalidad'] },
      { type: 'specialfn', variants: ['armonicos', 'esfericos', 'ylm', 'simetria'] },
      { type: 'specialfn', variants: ['hermite', 'cuantico', 'oscilador', 'polinomios'] },
      { type: 'specialfn', variants: ['laguerre', 'atomo', 'radial', 'asociados'] },
    ],
    termodinamica: [
      { type: 'thermo', variants: ['equilibrio', 'estado', 'proceso', 'quasi_estatico'] },
      { type: 'thermo', variants: ['extensivas', 'intensivas', 'densidad', 'molares'] },
      { type: 'thermo', variants: ['temperatura', 'reservorio', 'escalas', 'cero_absoluto'] },
      { type: 'thermo', variants: ['trabajo', 'calor', 'signos', 'ruta'] },
      { type: 'thermo', variants: ['reversible', 'irreversible', 'disipacion', 'friccion'] },
      { type: 'thermo', variants: ['ecuacion_estado', 'gas_ideal', 'van_der_waals', 'isotermas'] },
      { type: 'thermo', variants: ['energia_interna', 'primera_ley', 'delta_u', 'ciclo'] },
      { type: 'thermo', variants: ['entalpia', 'cp_cv', 'procesos', 'joule_thomson'] },
      { type: 'thermo', variants: ['calor_especifico', 'cv', 'cp', 'relacion'] },
      { type: 'thermo', variants: ['kelvin', 'clausius', 'enunciados', 'refrigerador'] },
      { type: 'thermo', variants: ['carnot', 'ciclo', 'eficiencia', 'maquina'] },
      { type: 'thermo', variants: ['clausius_ineq', 'integrales', 'ciclo', 'desigualdad'] },
      { type: 'thermo', variants: ['entropia', 's', 'cambio', 'universo'] },
      { type: 'thermo', variants: ['potencial_quimico', 'componentes', 'fases', 'equilibrio'] },
      { type: 'thermo', variants: ['reacciones', 'entalpia_reaccion', 'espontaneidad', 'equilibrio_q'] },
      { type: 'thermo', variants: ['helmholtz', 'f', 'canonico', 'particion'] },
      { type: 'thermo', variants: ['gibbs', 'g', 'isoterma_isobara', 'espontaneidad'] },
      { type: 'thermo', variants: ['landau', 'transicion', 'orden', 'parametro'] },
      { type: 'thermo', variants: ['maxwell', 'relaciones', 'derivadas', 'identidades'] },
      { type: 'thermo', variants: ['gibbs_duhem', 'componentes', 'potenciales', 'actividad'] },
      { type: 'thermo', variants: ['fluctuaciones', 'einstein', 'desviacion', 'probabilidad'] },
      { type: 'thermo', variants: ['le_chatelier', 'perturbacion', 'respuesta', 'equilibrio'] },
      { type: 'thermo', variants: ['fases', 'diagrama', 'coexistencia', 'regla_fases'] },
      { type: 'thermo', variants: ['calor_latente', 'fusion', 'vaporizacion', 'sublimacion'] },
      { type: 'thermo', variants: ['clapeyron', 'pendiente', 'presion', 'temperatura'] },
      { type: 'thermo', variants: ['produccion_entropia', 'irreversible', 'sigma', 'flujos'] },
      { type: 'thermo', variants: ['afinidades', 'flujos', 'reacciones', 'acoplamiento'] },
      { type: 'thermo', variants: ['onsager', 'simetria', 'coeficientes', 'reciprocidad'] },
    ],
    electromagnetismo: [
      { type: 'vectorcalc', variants: ['tensor', 'rank', 'contraccion', 'simetria'] },
      { type: 'vectorcalc', variants: ['gradiente', 'divergencia', 'rotacional', 'laplaciano'] },
      { type: 'vectorcalc', variants: ['integral_linea', 'superficie', 'volumen', 'elementos'] },
      { type: 'vectorcalc', variants: ['stokes', 'gauss', 'green', 'identidades'] },
      { type: 'coordinates', variants: ['cilindricas', 'esfericas', 'jacobiano', 'elementos'] },
      { type: 'ode', variants: ['fourier', 'serie', 'armonicos', 'espectro'] },
      { type: 'vectorcalc', variants: ['delta', 'dirac', 'distribuciones', 'convolucion'] },
      { type: 'electrostatic', variants: ['coulomb', 'dos_cargas', 'superposicion', 'fuerza'] },
      { type: 'electrostatic', variants: ['continua', 'linea', 'superficie', 'volumen'] },
      { type: 'electrostatic', variants: ['gauss', 'flujo', 'simetria', 'carga_encerrada'] },
      { type: 'electrostatic', variants: ['potencial', 'diferencia', 'equipotencial', 'trabajo'] },
      { type: 'electrostatic', variants: ['poisson', 'laplace', 'fronteras', 'solucion'] },
      { type: 'electrostatic', variants: ['multipolo', 'monopolo', 'dipolo', 'cuadripolo'] },
      { type: 'electrostatic', variants: ['conductores', 'capacitores', 'induccion', 'blindaje'] },
      { type: 'electrostatic', variants: ['dielectricos', 'polarizacion', 'd', 'susceptibilidad'] },
      { type: 'electrostatic', variants: ['energia_campo', 'densidad', 'capacitor', 'fuerzas'] },
      { type: 'magnetostatic', variants: ['biot_savart', 'alambre', 'espira', 'arco'] },
      { type: 'magnetostatic', variants: ['corriente', 'densidad', 'continuidad', 'hilo'] },
      { type: 'magnetostatic', variants: ['ampere', 'ley', 'simetria', 'solenoide'] },
      { type: 'magnetostatic', variants: ['vector_potencial', 'gauge', 'rotacional', 'campo_b'] },
      { type: 'magnetostatic', variants: ['dipolo', 'torque', 'energia', 'momento'] },
      { type: 'magnetostatic', variants: ['diamagnetismo', 'paramagnetismo', 'susceptibilidad', 'm'] },
      { type: 'magnetostatic', variants: ['ferromagnetismo', 'histeresis', 'dominios', 'curva_mh'] },
      { type: 'maxwell', variants: ['fem', 'induccion', 'faraday', 'lenz'] },
      { type: 'maxwell', variants: ['faraday', 'flujo', 'fem_movimiento', 'generador'] },
      { type: 'maxwell', variants: ['energia_b', 'densidad', 'inductancia', 'almacenamiento'] },
      { type: 'maxwell', variants: ['continuidad', 'corriente', 'carga', 'conservacion'] },
      { type: 'maxwell', variants: ['ecuaciones', 'vacuum', 'materia', 'simetria'] },
      { type: 'maxwell', variants: ['ondas', 'propagacion', 'polarizacion', 'espectro'] },
    ],
  };

  const VARIANT_LABELS = {
    suma: 'Suma vectorial', producto_escalar: 'Producto escalar', producto_cruz: 'Producto cruz',
    bases: 'Cambio de base', proyeccion: 'Proyección', covector: 'Covectores', dual: 'Espacio dual',
    funcional_lineal: 'Funcional lineal', plano_dual: 'Plano dual', levi_civita: 'Levi-Civita εᵢⱼₖ',
    determinante: 'Como determinante', triple_producto: 'Triple producto', indices: 'Notación índices',
    mru: 'MRU', mrua: 'MRUA', caida_libre: 'Caída libre', rotacion: 'Movimiento circular',
    simple: 'Sin amortiguamiento', amortiguado_sub: 'Subamortiguado', amortiguado_sobre: 'Sobreamortiguado',
    critico: 'Amortiguamiento crítico', forzado: 'Forzado sinusoidal', resonancia: 'Resonancia',
    elastico: 'Choque elástico', inelastico: 'Choque inelástico', carnot: 'Ciclo de Carnot',
    coulomb: 'Ley de Coulomb', gauss: 'Ley de Gauss', gradiente: 'Gradiente ∇f',
    divergencia: 'Divergencia ∇·F', rotacional: 'Rotacional ∇×F', ondas: 'Ondas EM',
    gas_ideal: 'Gas ideal', entropia: 'Entropía S', kepler: 'Órbitas de Kepler',
    cauchy_riemann: 'Ecuaciones C-R', residuo: 'Teorema del residuo', bessel: 'Jₙ(x)',
    gamma: 'Función Γ(z)', helmholtz: 'Energía libre F', gibbs: 'Energía libre G',
  };

  function slugify(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48);
  }

  function variantLabel(id) {
    return VARIANT_LABELS[id] || id.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function buildTheory(topic, course, unit, content) {
    const formulas = content.formulas || [];
    return `
      <div class="tema-definition">
        <h3>Definición</h3>
        <p>${content.definition}</p>
      </div>
      <p><strong>${topic.title}</strong> — ${course.title}, unidad «${unit.title}».</p>
      <ul>
        ${(content.keyPoints || []).map((p) => `<li>${p}</li>`).join('')}
      </ul>
      ${formulas.map((f) => `<span class="tema-formula">${f}</span>`).join('')}`;
  }

  function buildExample(topic, content) {
    const ex = content.example || {};
    return {
      problem: ex.problem || `<p>Problema sobre «${topic.title}».</p>`,
      solution: ex.solution || '<p>Consulta la definición y las fórmulas del tema.</p>',
    };
  }

  /** Contenido enriquecido por tipo de simulación */
  const SIM_CONTENT = {
    vectors: {
      theoryIntro: 'Los vectores modelan magnitudes con dirección: posición, velocidad, fuerza. En ℝ³ usamos bases {î, ĵ, k̂} y operaciones algebraicas.',
      keyPoints: ['Suma por componentes o regla del paralelogramo', 'Producto escalar mide proyección; producto cruz da vector perpendicular', 'Bases ortogonales simplifican cálculos'],
      formulas: ['|a + b|² = |a|² + |b|² + 2a·b', 'a·b = |a||b| cos θ', '|a×b| = |a||b| sin θ'],
      example: {
        problem: '<p>Dados <strong>a = (3, 0, 4)</strong> y <strong>b = (0, 5, 0)</strong>, calcula |a|, a·b y a×b.</p>',
        solution: '<p>|a| = √(9+16) = <strong>5</strong></p><p>a·b = 0</p><p>a×b = (0·0 − 4·5) <strong>x</strong> + (3·5 − 0·0) <strong>z</strong> = <strong>−20 x + 15 z</strong></p>',
      },
    },
    kinematics: {
      theoryIntro: 'La cinemática describe el movimiento sin atender las causas. Con x(t), v(t) y a(t) se clasifican MRU, MRUA y movimiento circular.',
      formulas: ['x(t) = x₀ + vt (MRU)', 'x(t) = x₀ + v₀t + ½at² (MRUA)', 'v = ωR, a_c = v²/R = ω²R'],
      example: {
        problem: '<p>Un móvil parte del reposo con <strong>a = 2 m/s²</strong>. ¿Qué velocidad lleva a los <strong>5 s</strong> y qué distancia recorre?</p>',
        solution: '<p>v = v₀ + at = 0 + 2·5 = <strong>10 m/s</strong></p><p>x = ½at² = ½·2·25 = <strong>25 m</strong></p>',
      },
    },
    oscillator: {
      theoryIntro: 'El oscilador armónico aparece al linearizar fuerzas restauradoras. Amortiguamiento y forzamiento enriquecen el comportamiento.',
      formulas: ['x(t) = A cos(ωt + φ)', 'ω = √(k/m)', 'ẍ + 2βẋ + ω₀²x = F₀ cos Ωt'],
      example: {
        problem: '<p>Resorte con <strong>k = 16 N/m</strong> y masa <strong>m = 1 kg</strong>. ¿Periodo y frecuencia angular?</p>',
        solution: '<p>ω = √(16/1) = 4 rad/s</p><p>T = 2π/ω ≈ <strong>1.57 s</strong></p>',
      },
    },
    orbit: {
      theoryIntro: 'Fuerzas centrales conservativas producen órbitas planas. Ley de áreas y energía determinan la forma de la trayectoria.',
      formulas: ['F = −GMm/r² r̂', 'L = μ r² θ̇ = const', 'E = ½μṙ² + L²/(2μr²) − GMm/r'],
      example: {
        problem: '<p>Órbita circular de radio <strong>R</strong> alrededor de masa <strong>M</strong>. ¿Velocidad orbital?</p>',
        solution: '<p>Igualando gravitación y centrípeta: GMm/R² = mv²/R → v = <strong>√(GM/R)</strong></p>',
      },
    },
    collision: {
      theoryIntro: 'En choques se conserva el momento lineal; la energía cinética solo se conserva en choques elásticos.',
      formulas: ['p⃗_total = const', 'e = (v₂−v₁)/(u₁−u₂) coeficiente de restitución', 'K_f = K_i solo si elástico'],
      example: {
        problem: '<p>Masa <strong>2 kg</strong> a 3 m/s choca elásticamente con <strong>1 kg</strong> en reposo, colisión frontal.</p>',
        solution: '<p>Conservando p y K: v₁′ = 1 m/s, v₂′ = <strong>4 m/s</strong> (resultado clásico 2:1 elástico)</p>',
      },
    },
    thermo: {
      theoryIntro: 'La termodinámica relaciona calor, trabajo y funciones de estado. Las leyes restringen qué procesos son posibles.',
      formulas: ['ΔU = Q − W', 'dS ≥ δQ/T', 'PV = nRT (gas ideal)', 'η_Carnot = 1 − T_c/T_h'],
      example: {
        problem: '<p>Gas ideal recibe <strong>500 J</strong> de calor a volumen constante. ¿ΔU si no realiza trabajo?</p>',
        solution: '<p>W = 0 → ΔU = Q = <strong>500 J</strong></p>',
      },
    },
    electrostatic: {
      theoryIntro: 'La electrostática estudia cargas en reposo, campos E⃗ y potencial V. Superposición y simetría simplifican cálculos.',
      formulas: ['F = k q₁q₂/r²', 'E⃗ = −∇V', '∮ E⃗·dA⃗ = Q_enc/ε₀'],
      example: {
        problem: '<p>Dos cargas <strong>+2 μC</strong> y <strong>−2 μC</strong> separadas <strong>10 cm</strong>. ¿Fuerza sobre una tercera carga +1 μC en el punto medio?</p>',
        solution: '<p>Cada carga cercana repela/atrae; por simetría la fuerza neta apunta hacia la negativa con magnitud calculable por Coulomb → <strong>~7.2 N</strong> (orden de magnitud)</p>',
      },
    },
    complex: {
      theoryIntro: 'El plano complejo z = x + iy permite analizar funciones diferenciables. Analiticidad implica ecuaciones de Cauchy-Riemann.',
      formulas: ['z = r e^{iθ}', '∂u/∂x = ∂v/∂y, ∂u/∂y = −∂v/∂x', '∮ f(z)dz = 2πi Σ Res'],
      example: {
        problem: '<p>Calcula <strong>|3 + 4i|</strong> y <strong>Arg(3 + 4i)</strong>.</p>',
        solution: '<p>|z| = 5, Arg z = arctan(4/3) ≈ <strong>53.13°</strong></p>',
      },
    },
    ode: {
      theoryIntro: 'Las EDO modelan oscilaciones, decaimiento y difusión. Segundo orden con coeficientes constantes usa exponenciales o senos/cosenos.',
      formulas: ['y″ + ω²y = 0 → y = A cos ωt + B sin ωt', 'W(y₁,y₂) ≠ 0 → independencia lineal'],
      example: {
        problem: '<p>Resuelve <strong>y″ + 4y = 0</strong> con y(0)=1, y′(0)=0.</p>',
        solution: '<p>ω = 2 → y(t) = <strong>cos(2t)</strong></p>',
      },
    },
    specialfn: {
      theoryIntro: 'Funciones especiales surgen al separar variables en ecuaciones de la física: Bessel en cilindros, Legendre en esferas, Hermite en el oscilador cuántico.',
      formulas: ['Γ(n+1) = n!', 'J₀(x) = Σ (−1)^k (x/2)^{2k}/(k!)²', 'P_l(cos θ) armónicos en esfera'],
      example: {
        problem: '<p>Calcula <strong>Γ(5)</strong> y <strong>J₀(0)</strong>.</p>',
        solution: '<p>Γ(5) = 4! = <strong>24</strong></p><p>J₀(0) = <strong>1</strong></p>',
      },
    },
    maxwell: {
      theoryIntro: 'Las ecuaciones de Maxwell unifican electricidad y magnetismo y predicen ondas electromagnéticas en el vacío.',
      formulas: ['∇·E = ρ/ε₀', '∇×E = −∂B/∂t', '∇×B = μ₀J + μ₀ε₀∂E/∂t', 'c = 1/√(μ₀ε₀)'],
      example: {
        problem: '<p>Onda plana E = E₀ cos(kx − ωt). ¿Relación entre k y ω en vacío?</p>',
        solution: '<p>ω = ck con c ≈ <strong>3×10⁸ m/s</strong></p>',
      },
    },
    newton: {
      theoryIntro: 'Las leyes de Newton conectan fuerza neta y aceleración en marcos inerciales. Diagramas de cuerpo libre son la herramienta básica.',
      formulas: ['ΣF⃗ = m a⃗', 'F₁₂ = −F₂₁', 'Peso P = mg'],
      example: {
        problem: '<p>Bloque <strong>5 kg</strong> sobre mesa sin roce, fuerza horizontal <strong>20 N</strong>. ¿Aceleración?</p>',
        solution: '<p>a = F/m = 20/5 = <strong>4 m/s²</strong></p>',
      },
    },
    conservation: {
      theoryIntro: 'Simetrías y leyes de conservación están ligadas: momento si homogeneidad espacial, energía si no hay fricción explícita dependiente del tiempo.',
      formulas: ['W = ∫F·dx', 'K = ½mv²', 'E = K + U', 'p⃗ = mv⃗'],
      example: {
        problem: '<p>Partícula cae desde reposo <strong>10 m</strong>. ¿Velocidad al llegar al suelo? (g=10)</p>',
        solution: '<p>mgH = ½mv² → v = √(2gH) = <strong>14.1 m/s</strong></p>',
      },
    },
    matrix: {
      theoryIntro: 'Matrices ortogonales representan rotaciones: preservan longitudes y ángulos. Composición = producto matricial.',
      formulas: ['R(θ) = [[cos θ, −sin θ],[sin θ, cos θ]]', 'x′ = R x', 'det R = 1'],
      example: {
        problem: '<p>Rota el vector (1,0) un ángulo <strong>90°</strong>.</p>',
        solution: '<p>Resultado: <strong>(0, 1)</strong></p>',
      },
    },
    vectorcalc: {
      theoryIntro: 'Gradiente, divergencia y rotacional describen campos escalares y vectoriales. Teoremas integrales los conectan con integrales de volumen.',
      formulas: ['∇f', '∇·F', '∇×F', '∮ F·dr = ∬ (∇×F)·dA'],
      example: {
        problem: '<p>Campo F = (0, 0, z). Calcula ∇·F.</p>',
        solution: '<p>∂F_z/∂z = <strong>1</strong></p>',
      },
    },
    coordinates: {
      theoryIntro: 'Coordenadas curvilíneas adaptan la geometría del problema: polar en simetría axial, esféricas en cargas puntuales.',
      formulas: ['x = r cos θ', 'y = r sin θ', 'ds² = dr² + r²dθ²'],
      example: {
        problem: '<p>Convierte (r, θ) = (5, 90°) a cartesianas.</p>',
        solution: '<p>(x, y) ≈ <strong>(0, 5)</strong></p>',
      },
    },
    rotating: {
      theoryIntro: 'En marcos rotatorios aparecen fuerzas ficticias centrífuga y de Coriolis que permiten escribir la segunda ley en el marco acelerado.',
      formulas: ['F_cf = −m Ω×(Ω×r)', 'F_Coriolis = −2m Ω×v′'],
      example: {
        problem: '<p>Plataforma ω = 2 rad/s. Masa en reposo en el marco rotante a R = 1 m. ¿Centrífuga?</p>',
        solution: '<p>|F_cf| = mω²R = <strong>4m N</strong> (por unidad de masa)</p>',
      },
    },
    rigid: {
      theoryIntro: 'Un cuerpo rígido tiene distancias interpartículas fijas. El tensor de inercia generaliza I para rotaciones 3D.',
      formulas: ['τ = I α', 'I = Σ m_i r_i²', 'I_parallel = I_cm + Md²'],
      example: {
        problem: '<p>Barra delgada masa M, longitud L, eje en un extremo. ¿Momento de inercia?</p>',
        solution: '<p>I = <strong>ML²/3</strong></p>',
      },
    },
    lagrange: {
      theoryIntro: 'La mecánica lagrangiana usa coordenadas generalizadas y el principio de mínima acción S = ∫L dt.',
      formulas: ['L = T − V', 'd/dt(∂L/∂q̇) − ∂L/∂q = 0'],
      example: {
        problem: '<p>Péndulo simple: L = ½ml²θ̇² + mgl cos θ. ¿Ecuación de movimiento?</p>',
        solution: '<p>θ̈ + (g/l) sin θ = 0</p>',
      },
    },
    curves: {
      theoryIntro: 'Curvas en el espacio se describen con curvatura κ y torsión τ del triedro de Frenet-Serret.',
      formulas: ['κ = |dr/ds × d²r/ds²| / |dr/ds|³', 'v = ds/dt'],
      example: {
        problem: '<p>Circunferencia radio R: ¿curvatura?</p>',
        solution: '<p>κ = <strong>1/R</strong> (constante)</p>',
      },
    },
    magnetostatic: {
      theoryIntro: 'Corrientes estacionarias generan campos B⃗. Biot-Savart y Ampère son herramientas complementarias.',
      formulas: ['dB = (μ₀/4π) I dl×r̂/r²', '∮ B·dl = μ₀ I_enc'],
      example: {
        problem: '<p>Alambre recto infinito con I = 10 A. ¿B a 2 cm?</p>',
        solution: '<p>B = μ₀I/(2πr) ≈ <strong>1×10⁻⁴ T</strong></p>',
      },
    },
  };

  function pickPrimaryVariant(title, variants, topicIndex) {
    const titleL = title.toLowerCase();
    const keywordMap = [
      { keys: ['covector', 'dual'], v: 'covector' },
      { keys: ['levi', 'cruz', 'índice'], v: 'levi_civita' },
      { keys: ['tensor'], v: 'tensor_lineal' },
      { keys: ['matriz', 'rotacion'], v: 'rotacion_2d' },
      { keys: ['curvatura', 'torsión', 'curvas'], v: 'curvatura' },
      { keys: ['rectilíneo', 'mru'], v: 'mru' },
      { keys: ['acelerado'], v: 'mrua' },
      { keys: ['coordenada'], v: 'cartesianas' },
      { keys: ['galilei', 'inercial'], v: 'inercial' },
      { keys: ['fuerza y masa'], v: 'fuerza_masa' },
      { keys: ['acción', 'reacción', 'equilibrio'], v: 'accion_reaccion' },
      { keys: ['momento lineal', 'momento angular'], v: 'momento_lineal' },
      { keys: ['trabajo', 'cinética'], v: 'trabajo' },
      { keys: ['conservativ', 'potencial'], v: 'potencial' },
      { keys: ['fricción', 'mecánica'], v: 'energia_mecanica' },
      { keys: ['centro de masa', 'partículas'], v: 'centro_masa' },
      { keys: ['lagrange', 'euler'], v: 'lagrangiano' },
      { keys: ['no-amortiguado', 'amortiguado y'], v: 'simple' },
      { keys: ['forzado', 'green'], v: 'forzado' },
      { keys: ['acoplados', 'modos'], v: 'acoplados' },
      { keys: ['dos cuerpos'], v: 'dos_cuerpos' },
      { keys: ['kepler'], v: 'kepler' },
      { keys: ['momento angular orbital', 'órbitas'], v: 'momento_angular' },
      { keys: ['dispersión', 'rutherford'], v: 'dispersion' },
      { keys: ['choque', 'elástico', 'inelástico'], v: 'elastico' },
      { keys: ['blanco fijo', 'sección eficaz'], v: 'blanco_fijo' },
      { keys: ['centrífuga', 'coriolis'], v: 'centrifuga' },
      { keys: ['equivalencia'], v: 'equivalencia' },
      { keys: ['punto fijo', 'euler'], v: 'punto_fijo' },
      { keys: ['sin un punto', 'chasde'], v: 'generales' },
      { keys: ['tensor de inercia'], v: 'tensor_inercia' },
      { keys: ['ejes principales'], v: 'ejes_principales' },
      { keys: ['poisson'], v: 'euler_ecuaciones' },
      { keys: ['plano complejo'], v: 'plano' },
      { keys: ['cauchy-riemann'], v: 'cauchy_riemann' },
      { keys: ['residuo'], v: 'residuo' },
      { keys: ['bessel'], v: 'bessel' },
      { keys: ['gamma'], v: 'gamma' },
      { keys: ['carnot'], v: 'carnot' },
      { keys: ['entropía'], v: 'entropia' },
      { keys: ['coulomb'], v: 'coulomb' },
      { keys: ['gauss'], v: 'gauss' },
      { keys: ['gradiente'], v: 'gradiente' },
      { keys: ['faraday'], v: 'faraday' },
      { keys: ['maxwell', 'onda'], v: 'ondas' },
    ];
    for (const { keys, v } of keywordMap) {
      if (keys.some((k) => titleL.includes(k)) && variants.includes(v)) return v;
    }
    return variants[Math.min(topicIndex, variants.length - 1)];
  }

  function getSimConfig(courseId, flatIndex) {
    const list = UNIT_SIM[courseId];
    if (!list || !list[flatIndex]) {
      return { type: 'generic', variants: ['caso_a', 'caso_b', 'caso_c', 'limite'] };
    }
    return list[flatIndex];
  }

  function buildRegistry() {
    const topics = [];
    let flatCounters = {};

    (window.FISICA_PROPEDEUTICOS || []).forEach((course) => {
      flatCounters[course.id] = 0;
      course.units.forEach((unit, ui) => {
        unit.topics.forEach((raw, ti) => {
          const title = typeof raw === 'string' ? raw : raw.text;
          const optional = typeof raw === 'object' && raw.optional;
          const flatIdx = flatCounters[course.id]++;
          const simCfg = getSimConfig(course.id, flatIdx);
          const id = `${course.id}-${ui}-${ti}-${slugify(title)}`;

          const primaryVariantId = pickPrimaryVariant(title, simCfg.variants, ti);
          const topicContentFn = window.getTopicContent || (() => ({}));
          const topicContent = topicContentFn(
            title,
            unit.title,
            simCfg.type,
            primaryVariantId,
            variantLabel(primaryVariantId)
          );

          const primaryIdx = simCfg.variants.indexOf(primaryVariantId);
          const variants = simCfg.variants.map((vid, vi) => ({
            id: vid,
            label: variantLabel(vid),
            primary: vi === primaryIdx,
            simGuide: topicContentFn(title, unit.title, simCfg.type, vid, variantLabel(vid)).simGuide,
          })).sort((a, b) => (b.primary ? 1 : 0) - (a.primary ? 1 : 0));

          const topic = {
            id,
            title,
            optional,
            courseId: course.id,
            courseTitle: course.title,
            courseColor: course.color,
            courseIcon: course.icon,
            unitIndex: ui,
            unitTitle: unit.title,
            topicIndex: ti,
            simType: simCfg.type,
            primaryVariant: primaryVariantId,
            variants,
            theory: buildTheory({ title }, course, unit, topicContent),
            example: buildExample({ title }, topicContent),
            simGuide: topicContent.simGuide,
            definition: topicContent.definition,
            exam: window.buildExamReasoning
              ? window.buildExamReasoning({ title }, course, unit, simCfg.type)
              : null,
            simCaption: topicContent.simGuide,
          };
          topics.push(topic);
        });
      });
    });

    return topics;
  }

  window.FISICA_TOPIC_INDEX = buildRegistry();

  window.getFisicaTopic = function (id) {
    return window.FISICA_TOPIC_INDEX.find((t) => t.id === id);
  };

  window.getAdjacentTopics = function (id) {
    const idx = window.FISICA_TOPIC_INDEX.findIndex((t) => t.id === id);
    if (idx < 0) return { prev: null, next: null };
    return {
      prev: idx > 0 ? window.FISICA_TOPIC_INDEX[idx - 1] : null,
      next: idx < window.FISICA_TOPIC_INDEX.length - 1 ? window.FISICA_TOPIC_INDEX[idx + 1] : null,
    };
  };
})();
