(function () {
  'use strict';

  /** Resuelve variantId → modo visual con animación distinta (4–6 modos por simType) */
  const KEYWORD_MODES = {
    vectors: [
      { mode: 'dot', keys: ['producto_escalar', 'covector', 'dual', 'funcional', 'plano_dual', 'proyeccion'] },
      { mode: 'cross', keys: ['producto_cruz', 'levi', 'determinante', 'triple', 'indices', 'cruz'] },
      { mode: 'bases', keys: ['bases', 'base', 'tensor'] },
      { mode: 'sum', keys: ['suma', 'transformacion', 'deformacion'] },
    ],
    matrix: [
      { mode: 'rotate', keys: ['rotacion', 'composicion', 'so3', 'euler', 'angulos'] },
      { mode: 'translate', keys: ['traslacion', 'traslacion_rotacion', 'chasde', 'rodadura'] },
      { mode: 'eigen', keys: ['autovalor', 'diagonal', 'ejes', 'tensor', 'inercia', 'steiner', 'elipsoide'] },
      { mode: 'transform', keys: ['transformacion', 'deformacion', 'tensor_lineal'] },
    ],
    kinematics: [
      { mode: 'mru', keys: ['mru', 'inercial', 'galilei', 'uniforme'] },
      { mode: 'mrua', keys: ['mrua', 'acelerado', 'caida', 'fuerza_masa', 'segunda_ley'] },
      { mode: 'rotacion', keys: ['rotacion', 'circular', 'omega', 'centrifuga', 'coriolis'] },
      { mode: 'projectile', keys: ['transformacion', 'relatividad'] },
    ],
    coordinates: [
      { mode: 'polar', keys: ['polar', 'cilindric', 'esferic', 'jacobiano', 'elementos'] },
      { mode: 'cartesian', keys: ['cartesian'] },
    ],
    newton: [
      { mode: 'force', keys: ['fuerza', 'masa', 'segunda', 'diagrama', 'peso', 'tension', 'normal'] },
      { mode: 'equilibrium', keys: ['accion', 'reaccion', 'equilibrio'] },
      { mode: 'inertial', keys: ['inercial', 'galilei', 'transformacion', 'relatividad'] },
    ],
    conservation: [
      { mode: 'momentum', keys: ['momento', 'impulso', 'torque', 'centro_masa', 'particulas', 'reducido', 'cm'] },
      { mode: 'energy', keys: ['trabajo', 'cinetica', 'potencia', 'teorema', 'mecanica', 'friccion', 'disipacion', 'rendimiento'] },
      { mode: 'potential', keys: ['potencial', 'conservativ', 'gradiente', 'equipotencial'] },
    ],
    lagrange: [
      { mode: 'pendulum', keys: ['pendulo', 'lagrang', 'euler', 'coordenadas_generalizadas'] },
      { mode: 'energy', keys: ['energia', 'accion'] },
    ],
    oscillator: [
      { mode: 'simple', keys: ['simple', 'sin_amort'] },
      { mode: 'damped', keys: ['amortiguado', 'critico', 'sub', 'sobre'] },
      { mode: 'forced', keys: ['forzado', 'resonancia', 'green', 'impulso'] },
      { mode: 'coupled', keys: ['acoplado', 'modos', 'simetrico', 'antisimetrico'] },
    ],
    orbit: [
      { mode: 'kepler', keys: ['kepler', 'eliptica', 'parabolica', 'hiperbolica', 'excentricidad', 'energia_orbital'] },
      { mode: 'two_body', keys: ['dos_cuerpos', 'masa_reducida', 'baricentro', 'fuerza_central'] },
      { mode: 'angular', keys: ['momento_angular', 'ley_areas'] },
      { mode: 'scatter', keys: ['dispersion', 'rutherford', 'coulomb', 'impacto', 'seccion', 'alpha', 'nucleo', 'blanco'] },
    ],
    collision: [
      { mode: 'elastic', keys: ['elastico', 'coef_restitucion', 'parcialmente'] },
      { mode: 'inelastic', keys: ['inelastico'] },
      { mode: 'cm', keys: ['centro_masa', 'lab_cm', 'lab_lab', 'choque_1d'] },
      { mode: 'scatter', keys: ['blanco', 'seccion', 'hard_sphere', 'geometrica'] },
    ],
    rotating: [
      { mode: 'centrifugal', keys: ['centrifuga', 'base_rotante', 'omega', 'derivada', 'infinitesimal'] },
      { mode: 'coriolis', keys: ['coriolis', 'tren', 'presion'] },
      { mode: 'equivalence', keys: ['equivalencia', 'elevador', 'gravitacional', 'principio'] },
    ],
    rigid: [
      { mode: 'rotate', keys: ['rotacion', 'euler', 'punto_fijo', 'so3', 'finita', 'precesion', 'top', 'poisson'] },
      { mode: 'translate', keys: ['traslacion', 'generales', 'chasde', 'rodadura', 'sin_un'] },
      { mode: 'inertia', keys: ['inercia', 'steiner', 'ejes', 'diagonal', 'simetria', 'elipsoide', 'paralelos', 'perpendiculares'] },
    ],
    curves: [
      { mode: 'curvature', keys: ['curvatura', 'osculador', 'frenet'] },
      { mode: 'torsion', keys: ['torsión', 'torsi', 'helice'] },
    ],
    complex: [
      { mode: 'polar', keys: ['plano', 'modulo', 'argumento', 'forma_polar', 'regiones'] },
      { mode: 'map', keys: ['funcion', 'dominio', 'imagen', 'mapeo', 'holomorfa', 'analitica', 'derivada'] },
      { mode: 'conformal', keys: ['cauchy_riemann', 'grid', 'rotacion', 'dilatacion'] },
      { mode: 'residue', keys: ['residuo', 'polo', 'singular', 'integral', 'contorno', 'cauchy', 'laurent', 'taylor', 'serie'] },
    ],
    ode: [
      { mode: 'oscillate', keys: ['segundo_orden', 'homogenea', 'no_homogenea', 'coeficientes', 'oscil'] },
      { mode: 'damped', keys: ['amortigu', 'frobenius', 'serie_potencias'] },
      { mode: 'fourier', keys: ['fourier', 'serie', 'coeficientes', 'parseval', 'espectro', 'armonicos'] },
      { mode: 'sturm', keys: ['sturm', 'autovalor', 'autofuncion', 'ortogonal', 'wronskiano', 'independencia', 'green', 'impulso', 'respuesta', 'convolucion'] },
    ],
    specialfn: [
      { mode: 'bessel', keys: ['bessel', 'jn', 'yn', 'nodos'] },
      { mode: 'gamma', keys: ['gamma', 'factorial', 'integrales', 'propiedades'] },
      { mode: 'legendre', keys: ['legendre', 'pl', 'asociados', 'armonicos', 'esfericos', 'ylm', 'simetria', 'ortogonal'] },
      { mode: 'quantum', keys: ['hermite', 'laguerre', 'cuantico', 'oscilador', 'atomo', 'radial', 'polinomios'] },
    ],
    thermo: [
      { mode: 'carnot', keys: ['carnot', 'maquina', 'eficiencia', 'ciclo', 'refrigerador'] },
      { mode: 'entropy', keys: ['entropia', 'clausius', 'desigualdad', 'produccion', 'sigma', 'onsager'] },
      { mode: 'phase', keys: ['fase', 'clapeyron', 'latente', 'fusion', 'vapor', 'sublimacion', 'coexistencia', 'regla'] },
      { mode: 'pv', keys: ['gas', 'isoterma', 'ecuacion', 'van_der', 'presion', 'volumen', 'trabajo', 'calor', 'primera', 'entalpia', 'cp', 'cv', 'interna', 'delta_u', 'proceso', 'reversible', 'irreversible'] },
    ],
    vectorcalc: [
      { mode: 'gradient', keys: ['gradiente', 'laplaciano', 'potencial'] },
      { mode: 'divergence', keys: ['divergencia', 'gauss', 'flujo', 'tensor', 'contraccion'] },
      { mode: 'curl', keys: ['rotacional', 'stokes', 'circulacion'] },
      { mode: 'integral', keys: ['integral', 'superficie', 'volumen', 'delta', 'dirac', 'convolucion', 'green', 'identidades'] },
    ],
    electrostatic: [
      { mode: 'coulomb', keys: ['coulomb', 'dos_cargas', 'superposicion', 'fuerza'] },
      { mode: 'gauss', keys: ['gauss', 'flujo', 'simetria', 'carga_encerrada'] },
      { mode: 'potential', keys: ['potencial', 'equipotencial', 'poisson', 'laplace', 'fronteras', 'diferencia'] },
      { mode: 'multipole', keys: ['dipolo', 'multipolo', 'monopolo', 'cuadripolo', 'dielectric', 'polarizacion', 'conductor', 'capacitor', 'blindaje', 'induccion', 'continua', 'linea', 'superficie', 'energia_campo'] },
    ],
    magnetostatic: [
      { mode: 'wire', keys: ['biot', 'alambre', 'espira', 'arco', 'hilo', 'corriente', 'ampere', 'solenoide', 'ley'] },
      { mode: 'field', keys: ['campo_b', 'vector_potencial', 'gauge', 'rotacional', 'densidad', 'continuidad'] },
      { mode: 'dipole', keys: ['dipolo', 'torque', 'momento', 'energia'] },
      { mode: 'material', keys: ['diamagn', 'paramagn', 'ferromagn', 'histeresis', 'dominios', 'susceptibilidad', 'curva_mh', 'm'] },
    ],
    maxwell: [
      { mode: 'waves', keys: ['onda', 'propagacion', 'polarizacion', 'espectro', 'vacuum'] },
      { mode: 'faraday', keys: ['faraday', 'fem', 'induccion', 'flujo', 'lenz', 'generador', 'fem_movimiento'] },
      { mode: 'energy', keys: ['energia_b', 'inductancia', 'almacenamiento', 'densidad'] },
      { mode: 'maxwell', keys: ['maxwell', 'ecuaciones', 'continuidad', 'conservacion', 'carga', 'corriente', 'materia', 'simetria'] },
    ],
  };

  const DEFAULT_MODES = {
    vectors: 'sum',
    matrix: 'rotate',
    kinematics: 'mrua',
    coordinates: 'cartesian',
    newton: 'force',
    conservation: 'energy',
    lagrange: 'pendulum',
    oscillator: 'simple',
    orbit: 'kepler',
    collision: 'elastic',
    rotating: 'centrifugal',
    rigid: 'rotate',
    curves: 'curvature',
    complex: 'polar',
    ode: 'oscillate',
    specialfn: 'bessel',
    thermo: 'pv',
    vectorcalc: 'gradient',
    electrostatic: 'coulomb',
    magnetostatic: 'wire',
    maxwell: 'waves',
    generic: 'default',
  };

  function getVisualMode(simType, variantId) {
    const v = (variantId || '').toLowerCase();
    const rules = KEYWORD_MODES[simType];
    if (rules) {
      for (const { mode, keys } of rules) {
        if (keys.some((k) => v.includes(k))) return mode;
      }
    }
    return DEFAULT_MODES[simType] || 'default';
  }

  window.SimVariantModes = { getVisualMode, DEFAULT_MODES };
})();
