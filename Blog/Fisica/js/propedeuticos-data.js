/* Programa — Cursos propedéuticos de Física */
window.FISICA_PROPEDEUTICOS = [
  {
    id: 'mecanica',
    title: 'Mecánica clásica',
    desc: 'Cinemática, dinámica, conservación, oscilaciones, fuerzas centrales y cuerpo rígido.',
    color: '#f59e0b',
    icon: '⚛️',
    units: [
      {
        title: 'Geometría del espacio y álgebra lineal',
        topics: [
          'Espacio vectorial: vectores en el espacio y bases',
          'Espacio dual: covectores',
          'Producto cruz: símbolo de Levi-Civita (notación con índices)',
          'Tensores lineales',
          'Matrices: rotaciones y traslaciones',
        ],
      },
      {
        title: 'Cinemática',
        topics: [
          'Curvas en el espacio: curvatura y torsión',
          'Movimiento rectilíneo uniforme, movimiento acelerado y movimiento rotatorio',
          'Sistema de coordenadas en el plano y en el espacio',
        ],
      },
      {
        title: 'Leyes de Newton',
        topics: [
          'Marco de referencia inercial: grupo de Galilei',
          'Fuerza y masa',
          'Acción y reacción: equilibrio',
        ],
      },
      {
        title: 'Leyes de conservación',
        topics: [
          'Momento lineal y momento angular',
          'Trabajo y energía cinética',
          'Fuerzas conservativas y energía potencial',
          'Energía mecánica y fuerzas de fricción',
          'Sistemas de muchas partículas: centro de masa',
          'Función de Lagrange: ecuaciones de movimiento de Euler-Lagrange',
        ],
      },
      {
        title: 'Oscilaciones lineales',
        topics: [
          'Oscilador armónico unidimensional: no-amortiguado y amortiguado',
          'Oscilador armónico unidimensional forzado: impulso y función de Green',
          'Osciladores armónico-múltiples acoplados: modos normales',
        ],
      },
      {
        title: 'Fuerzas centrales',
        topics: [
          'Problema de dos cuerpos',
          'Problema de Kepler',
          'Órbitas: momento angular orbital',
          'Dispersión por una fuerza central',
          'Dispersión de Rutherford',
        ],
      },
      {
        title: 'Colisiones',
        topics: [
          'Choque de dos partículas',
          'Choques elásticos y choques inelásticos',
          'Dispersión por blancos fijos: sección eficaz',
        ],
      },
      {
        title: 'Sistemas no-inerciales',
        topics: [
          'Sistemas rotatorios: cambio de base vectorial y rotaciones infinitesimales',
          'Fuerza centrífuga y fuerza de Coriolis',
          'Principio de equivalencia',
        ],
      },
      {
        title: 'Cuerpo rígido',
        topics: [
          'Movimiento con un punto fijo: rotaciones finitas y grupo de rotaciones',
          'Movimiento sin un punto fijo',
          'Tensor de inercia',
          'Ejes principales: diagonalización de matrices simétricas',
          { text: 'Ecuaciones de movimiento de Euler — construcción de Poisson', optional: true },
        ],
      },
    ],
    bibliography: [
      'Classical Mechanics. J. R. Taylor; University Science Books 2005.',
      'Classical Mechanics (5th Edition). T. W. B. Kibble and F. H. Berkshire; Imperial College 2004.',
      'Classical Mechanics (3rd Edition). H. Goldstein, C. Poole, and J. Safko; Addison Wesley 2000.',
      'Intermediate Classical Mechanics. J. Norwood; Prentice-Hall 1979.',
    ],
  },
  {
    id: 'metodos',
    title: 'Métodos matemáticos',
    desc: 'Variable compleja, ecuaciones diferenciales y funciones especiales aplicadas a la física.',
    color: '#818cf8',
    icon: '∫',
    note: 'Curso de métodos matemáticos aplicados a la física: el énfasis está en la aplicación de conceptos y técnicas a problemas concretos, más que en demostraciones rigurosas.',
    units: [
      {
        title: 'Cálculo de variable compleja',
        topics: [
          'Plano complejo',
          'Función compleja de una variable compleja',
          'Diferenciación compleja: funciones analíticas',
          'Ecuaciones de Cauchy-Riemann',
          'Puntos singulares',
          'Integral de línea de una función de variable compleja',
          'Teorema de Cauchy-Goursat',
          'Fórmulas integrales de Cauchy',
          'Teoremas y series de Taylor y Laurent',
          'Aplicación del teorema del residuo al cálculo de integrales definidas',
        ],
      },
      {
        title: 'Ecuaciones diferenciales ordinarias',
        topics: [
          'Ecuaciones diferenciales lineales de segundo orden',
          'Wronskiano e independencia lineal',
          'Método de Frobenius',
          'Problema de Sturm-Liouville',
          'Series y transformadas de Fourier',
          'Funciones de Green',
        ],
      },
      {
        title: 'Funciones especiales',
        topics: [
          'Función gamma',
          'Funciones de Bessel',
          'Polinomios y funciones asociadas de Legendre',
          'Armónicos esféricos',
          'Polinomios de Hermite',
          'Polinomios y polinomios asociados de Laguerre',
        ],
      },
    ],
    bibliography: [
      'Mathematical Methods for Physics and Engineering (3rd Edition). K. F. Riley, M. P. Hobson, and S. J. Bence; Cambridge 2006.',
      'Advanced Engineering Mathematics (10th Edition). E. Kreyszig; Wiley 2011.',
      'Complex Variables (2nd Edition). M. R. Spiegel, S. Lipschutz, J. J. Schiller, and D. Spellman; McGraw-Hill 2009.',
      'Differential Equations (3rd Edition). R. Bronson and G. B. Costa; McGraw-Hill 2006.',
    ],
    bibliographyExtra: [
      'Mathematics of Classical and Quantum Physics. F. W. Byron and R. W. Fuller; Dover 1992.',
      'Mathematics for Physicists. P. Dennery and A. Krzywicki; Dover 1996.',
      'The Functions of Mathematical Physics. H. Hochstadt; Dover 1986.',
    ],
  },
  {
    id: 'termodinamica',
    title: 'Termodinámica',
    desc: 'Leyes termodinámicas, potenciales, estabilidad, transiciones de fase e irreversibilidad.',
    color: '#ef4444',
    icon: '🌡️',
    units: [
      {
        title: 'Conceptos básicos',
        topics: [
          'Equilibrio termodinámico',
          'Variables extensivas e intensivas',
          'Temperatura y reservorio térmico',
          'Trabajo y calor',
          'Procesos reversibles e irreversibles',
          'Ecuación de estado de una sustancia simple',
        ],
      },
      {
        title: 'Primera Ley',
        topics: [
          'Energía interna',
          'Entalpía',
          'Capacidades caloríficas',
        ],
      },
      {
        title: 'Segunda Ley',
        topics: [
          'Postulados de Kelvin y Clausius',
          'Máquina de Carnot',
          'Desigualdad de Clausius',
          'Entropía',
        ],
      },
      {
        title: 'Sistemas multicomponentes',
        topics: [
          'Potencial químico',
          'Reacciones químicas',
        ],
      },
      {
        title: 'Potenciales termodinámicos',
        topics: [
          'Energía libre de Helmholtz',
          'Energía libre de Gibbs',
          'Potencial de Landau',
          { text: 'Relaciones de Maxwell', optional: true },
          { text: 'Relación de Gibbs-Duhem', optional: true },
        ],
      },
      {
        title: 'Estabilidad de sistemas termodinámicos',
        topics: [
          'Fórmula de Einstein para fluctuaciones',
          { text: 'Principio de Le Chatelier', optional: true },
        ],
      },
      {
        title: 'Transiciones de fase',
        topics: [
          'Equilibrio entre fases',
          'Calores latentes',
          { text: 'Relación de Clausius-Clapeyron', optional: true },
        ],
      },
      {
        title: 'Termodinámica irreversible',
        topics: [
          'Producción de entropía',
          'Afinidades y flujos',
          'Relaciones de Onsager',
        ],
      },
    ],
    bibliography: [
      'Thermodynamics and an Introduction to Thermostatistics. H. B. Callen; Wiley 1985.',
      'Modern Thermodynamics (Second Edition). D. Kondepudi and I. Prigogine; Wiley 2015.',
      'Heat and Thermodynamics (Seventh Edition). M. W. Zemansky and R. H. Dittman; McGraw-Hill 1997.',
      'Fundamentals of Statistical and Thermal Physics. F. Reif; Waveland 1965.',
    ],
  },
  {
    id: 'electromagnetismo',
    title: 'Electromagnetismo',
    desc: 'Electrostática, magnetostática y fundamentos de electrodinámica.',
    color: '#38bdf8',
    icon: '⚡',
    units: [
      {
        title: 'Conceptos matemáticos',
        topics: [
          'Tensores cartesianos',
          'Operaciones diferenciales vectoriales: gradiente, divergencia y rotacional',
          'Integración vectorial: de línea, superficie y volumen',
          'Teoremas de Stokes y Gauss',
          'Coordenadas curvilíneas',
          'Análisis de Fourier',
          'Funciones generalizadas',
        ],
      },
      {
        title: 'Electrostática',
        topics: [
          'Ley de Coulomb',
          'Distribuciones de carga continuas',
          'Ley de Gauss',
          'Potencial escalar eléctrico',
          'Ecuaciones de Poisson y Laplace',
          'Expansión multipolar',
          'Conductores y capacitores',
          'Medios dieléctricos',
          'Energía de campos eléctricos',
        ],
      },
      {
        title: 'Magnetostática',
        topics: [
          'Ley de Biot-Savart',
          'Distribuciones de corriente continuas',
          'Ley de Ampère',
          'Potencial vectorial magnético',
          'Torcas y fuerzas sobre dipolos magnéticos',
          'Medios diamagnéticos y paramagnéticos',
          'Medios ferromagnéticos',
        ],
      },
      {
        title: 'Electrodinámica',
        optionalUnit: true,
        topics: [
          'Fuerza electromotriz',
          'Ley de Faraday',
          'Energía de campos magnéticos',
          'Conservación de la carga — Ecuación de continuidad',
          'Leyes de Maxwell',
          'Ecuaciones de onda para los campos electromagnéticos',
        ],
      },
    ],
    bibliography: [
      'Introduction to Electrodynamics (3rd Edition). D. J. Griffiths; Prentice-Hall 1999.',
      'Foundations of Electromagnetic Theory (4th Edition). J. R. Reitz, F. J. Milford, and R. W. Christy; Addison Wesley 1992.',
      'Electricity and Magnetism (3rd Edition). E. M. Purcell and D. J. Morin; Cambridge 2013.',
      'Electromagnetics (2nd Edition). J. A. Edminister; McGraw-Hill 1994.',
    ],
  },
];
