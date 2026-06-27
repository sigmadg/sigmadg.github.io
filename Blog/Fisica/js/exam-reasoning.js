(function () {
  'use strict';

  /** Plantillas de razonamiento complejo por tipo de simulación / área */
  const EXAM_TEMPLATES = {
    vectors: {
      question: (t) => `<p>En un problema integrador se pide demostrar que tres vectores <strong>a</strong>, <strong>b</strong>, <strong>c</strong> son coplanares si y solo si <strong>a · (b × c) = 0</strong>, y luego calcular el volumen del paralelepípedo que forman cuando <strong>|a|=3</strong>, <strong>|b|=4</strong>, el ángulo entre ellos es <strong>60°</strong> y <strong>c</strong> es perpendicular al plano de <strong>a</strong> y <strong>b</strong> con <strong>|c|=2</strong>.</p><p>Relaciona tu respuesta con el tema: «${t}».</p>`,
      reasoning: (t) => `<p><strong>Cadena lógica:</strong> (1) b×c define un vector normal al plano de b y c; (2) a·n = 0 ⟺ a no tiene componente fuera de ese plano ⟺ coplanaridad; (3) |a·(b×c)| = |a||b×c|cos θ′ = volumen del paralelepípedo; (4) si c ⊥ plano(a,b), entonces |b×c| = |b||c| sin 90° = |b||c|.</p><p>En «${t}» la clave es no confundir producto escalar (proyección) con triple producto (volumen/orientación).</p>`,
      strategy: [
        'Dibuja los vectores y marca ángulos antes de calcular componentes.',
        'Decide si conviene base cartesiana o magnitudes + direcciones.',
        'Usa identidades vectoriales antes de expandir componente a componente.',
        'Verifica dimensiones: producto escalar → escalar; producto cruz → vector.',
      ],
      pitfalls: [
        'Invertir el orden en el producto cruz (anti conmutatividad: a×b = −b×a).',
        'Usar grados cuando las ecuaciones requieren radianes.',
        'Olvidar que el producto escalar puede ser cero sin que los vectores sean cero.',
      ],
      selfCheck: [
        '¿El resultado tiene las unidades correctas (m, m², m³)?',
        '¿El vector resultado de a×b es perpendicular a a y a b?',
        '¿Al cambiar el signo de un vector, cambian correctamente los signos esperados?',
      ],
      connections: ['Álgebra lineal', 'Cinemática (descomposición de v)', 'Producto cruz en torque'],
    },
    kinematics: {
      question: (t) => `<p>Un móvil puede describirse con MRUA en una recta y luego entrar en movimiento circular uniforme. Se te pide <strong>sin usar tablas</strong>: (a) demostrar continuidad de la velocidad tangencial en la transición; (b) explicar por qué la aceleración total no es continua aunque v lo sea; (c) calcular el radio mínimo del arco circular si la aceleración centrípeta no debe superar <strong>4g</strong>.</p><p>Tema: «${t}».</p>`,
      reasoning: (t) => `<p>La velocidad es continua porque es la misma magnitud tangencial al pasar de recta a curva (condición de pegado). Pero la aceleración en MRUA es paralela al movimiento y en MCU apunta al centro: hay un salto de dirección aunque |a| pueda ajustarse. El radio mínimo sale de <strong>a_c = v²/R ≤ 4g</strong>.</p><p>«${t}» exige distinguir <em>descripción del movimiento</em> (cinemática) de <em>causa</em> (dinámica).</p>`,
      strategy: [
        'Escribe x(t), v(t), a(t) en cada tramo con constantes desconocidas.',
        'Impón continuidad de x y v en el instante de unión.',
        'Identifica si el enunciado pide magnitud, componente o vector completo.',
        'Comprueba límites t→0 y comportamiento asintótico si aplica.',
      ],
      pitfalls: [
        'Usar ecuaciones de MRU cuando hay aceleración distinta de cero.',
        'Confundir velocidad angular ω (rad/s) con frecuencia en Hz.',
        'Olvidar que en MCU |v| puede ser constante pero v cambia de dirección.',
      ],
      selfCheck: ['¿v y a tienen sentido físico en cada tramo?', '¿Las unidades de R son metros?', '¿El resultado es finito y positivo?'],
      connections: ['Leyes de Newton', 'MCU y aceleración centrípeta', 'Coordenadas polares'],
    },
    newton: {
      question: (t) => `<p>Sistema con dos bloques unidos por cuerda sobre mesa con roce (μ) y polea ideal. Piden el diagrama de cuerpo libre, las ecuaciones de Newton en cada cuerpo y el rango de valores de μ para que el sistema se mueva. Debes justificar cada fuerza que dibujas.</p><p>Enlace con «${t}».</p>`,
      reasoning: (t) => `<p>El razonamiento examina si eliges <strong>marco inercial</strong>, si la tensión es la misma en toda la cuerda (polea ideal) y si el roce estático tiene un máximo μ_s N antes de deslizar. La condición de movimiento es que la fuerza neta supere el roce estático máximo.</p>`,
      strategy: ['Aislar cada cuerpo', 'Elegir ejes a lo largo del movimiento', 'ΣF = ma por componente', 'Comparar con μ_s mg'],
      pitfalls: ['Mezclar peso con normal en pendientes', 'Olvidar acción-reacción en distintos cuerpos', 'Usar μ_c cuando el enunciado pide μ_s'],
      selfCheck: ['¿Las unidades de cada ecuación son N = kg·m/s²?', '¿Si m→0 recuperas un caso límite razonable?'],
      connections: ['Acción-reacción', 'Trabajo y roce', 'Marcos no inerciales'],
    },
    conservation: {
      question: (t) => `<p>Partícula en presencia de fuerza conservativa F = −∇U con U(x) = ax² − bx⁴. (a) ¿Para qué x hay equilibrio? (b) ¿Cuáles son estables? (c) Si parte de x₀ con velocidad v₀, ¿para qué energía mecánica escapa a ±∞? Relaciona con «${t}».</p>`,
      reasoning: (t) => `<p>Equilibrio: F=0 → dU/dx=0. Estabilidad: mínimo local de U → estable; máximo → inestable. Escape: E_mec ≥ U(±∞) si el pozo está acotado inferiormente; aquí U→−∞ para |x| grande implica comportamiento distinto — hay que analizar el pozo finito.</p>`,
      strategy: ['Identificar si la fuerza es conservativa', 'Graficar U(x)', 'Marcar E_total como línea horizontal', 'Usar K ≥ 0 para acotar regiones permitidas'],
      pitfalls: ['Conservar energía cuando hay roce', 'Confundir equilibrio con punto de retorno', 'Olvidar que K no puede ser negativa'],
      selfCheck: ['¿E_mec es constante solo si no hay disipación?', '¿Las unidades de U son joules?'],
      connections: ['Oscilador armónico', 'Lagrange', 'Potencial gravitatorio'],
    },
    oscillator: {
      question: (t) => `<p>Oscilador amortiguado forzado: ẍ + 2βẋ + ω₀²x = F₀ cos Ωt. Piden (a) amplitud en régimen estacionario; (b) frecuencia de resonancia (aproximada para β pequeño); (c) desfase entre x y la fuerza en resonancia; (d) por qué la amplitud no diverge exactamente en β>0.</p><p>Tema: «${t}».</p>`,
      reasoning: (t) => `<p>Sustituyes x = A cos(Ωt − φ) en la EDO y obtienes A(Ω) con denominador ((ω₀²−Ω²)² + (2βΩ)²). En Ω = ω₀ el pico es finito porque β≠0 limita la amplitud. El desfase pasa por π/2 cerca de resonancia en amortiguamiento ligero.</p>`,
      strategy: ['Escribe solución particular en régimen estacionario', 'Separa magnitud y fase', 'Analiza límite β→0', 'Compara con simulación numérica'],
      pitfalls: ['Confundir ω₀ con f en Hz', 'Olvidar término transitorio al inicio', 'Resonancia exacta solo en β=0'],
      selfCheck: ['¿A tiene unidades de longitud?', '¿φ es continuo al cruzar resonancia?'],
      connections: ['EDO segundo orden', 'Fourier', 'Modos normales acoplados'],
    },
    orbit: {
      question: (t) => `<p>Cometa en órbita kepleriana: dado a, e y μ = GM. Calcula energía, momento angular, velocidades en perihelio y afelio, y demuestra la ley de áreas sin integrar la trayectoria completa.</p><p>«${t}».</p>`,
      reasoning: (t) => `<p>Usas E = −μ/(2a) y L = μ√(GMa(1−e²)). En perihelio r_p = a(1−e), v_p = L/(μ r_p). Ley de áreas: dA/dt = L/(2μ) = constante porque L se conserva bajo fuerza central.</p>`,
      strategy: ['Identificar integrales de movimiento: E y L', 'Relacionar r, v, θ con excentricidad', 'Usar simetría antes de integrar'],
      pitfalls: ['Confundir semieje a con radio en un punto', 'Olvidar que E<0 liga órbita cerrada', 'Mezclar masas m y reducida μ'],
      selfCheck: ['¿v_p > v_a siempre para e>0?', '¿Unidades de L son kg·m²/s?'],
      connections: ['Dispersión de Rutherford', 'Problema de dos cuerpos', 'Energía potencial 1/r'],
    },
    collision: {
      question: (t) => `<p>Choque oblicuo en laboratorio: masa m₁ entra con velocidad u en el marco del laboratorio y golpea m₂ en reposo. Piden ángulos de salida en CM y Lab, y demuestran que el ángulo de dispersión en CM depende solo de la geometría del choque elástico.</p><p>«${t}».</p>`,
      reasoning: (t) => `<p>Transformas a CM donde p_total=0. En elástico 1D en CM los módulos se intercambian si masas iguales. Vuelves al lab con v_lab = v_cm + v_rel. Los ángulos cumplen tan θ = sin θ_cm / (cos θ_cm + v_cm/v′).</p>`,
      strategy: ['Conserva p siempre', 'Conserva K solo si elástico', 'Trabaja primero en CM', 'Usa coeficiente de restitución si inelástico'],
      pitfalls: ['Vector velocidad vs magnitud', 'Olvidar componente tangencial sin impulso en choque central', 'Confundir marcos'],
      selfCheck: ['¿p antes = p después?', '¿K final ≤ K inicial si inelástico?'],
      connections: ['Momento lineal', 'Dispersión Rutherford', 'Centro de masa'],
    },
    rotating: {
      question: (t) => `<p>Partícula se desliza en anillo rotatorio horizontal con Ω constante. Obtén la ecuación de movimiento en el marco rotante incluyendo Coriolis y centrífuga, y explica en qué condiciones el equilibrio aparente es estable.</p><p>«${t}».</p>`,
      reasoning: (t) => `<p>En marco rotante: m a′ = F_real + F_cf + F_Coriolis. La centrífuga m Ω²r actúa hacia afuera. Coriolis −2m Ω×v′ desvía el movimiento. Estabilidad del equilibrio requiere analizar d²U_ef/ dr² con potencial efectivo incluyendo término centrífugo.</p>`,
      strategy: ['Escribe Ω y sentido de rotación', 'Incluye todas las fuerzas ficticias', 'Lineariza alrededor del equilibrio'],
      pitfalls: ['Olvidar Coriolis si hay velocidad relativa', 'Confundir marco inercial con rotante', 'Signo de Ω'],
      selfCheck: ['¿Recuperas Newton si Ω=0?', '¿Unidades consistentes?'],
      connections: ['Principio de equivalencia', 'MCU', 'Sistemas no inerciales'],
    },
    lagrange: {
      question: (t) => `<p>Péndulo doble: escribe T y V en coordenadas θ₁, θ₂, obtén las ecuaciones de Euler-Lagrange y discute cuántos grados de libertad tiene y por qué no se separan fácilmente en modos normales lineales sin aproximar sin(θ)≈θ.</p><p>«${t}».</p>`,
      reasoning: (t) => `<p>Dos ángulos → 2 GDL. L = T − V con acoplamiento en sin(θ₁−θ₂). Linealizando cerca de θ=0 recuperas matriz de acoplamiento y modos normales; sin linealizar el sistema es no lineal.</p>`,
      strategy: ['Cuenta GDL independientes', 'Escribe L', 'Calcula d/dt(∂L/∂q̇) − ∂L/∂q', 'Lineariza si piden modos pequeños'],
      pitfalls: ['Olvidar términos de acoplamiento', 'Confundir fuerzas generalizadas con fuerzas reales', 'Signos en V'],
      selfCheck: ['¿Dimensiones de cada término en L?', '¿Recuperas SHM para un péndulo simple?'],
      connections: ['Osciladores acoplados', 'Euler-Lagrange', 'Tensor de inercia'],
    },
    rigid: {
      question: (t) => `<p>Cuerpo rígido: dado tensor de inercia I en base principal, calcula energía cinética rotacional, precesión de L si τ=0 y explica por qué I no commute con ω en base fija en general.</p><p>«${t}».</p>`,
      reasoning: (t) => `<p>K_rot = ½ ω·I·ω. Si τ=0, L constante. En ejes principales I diagonal → ω paralelo a L. En base fija I(t) cambia → acoplamiento dinámico (ecuaciones de Euler).</p>`,
      strategy: ['Diagonaliza I si no lo está', 'Usa teorema de ejes paralelos', 'Identifica simetrías'],
      pitfalls: ['Confundir I con masa', 'Olvidar Steiner', 'Mezclar ω y L sin I'],
      selfCheck: ['¿I tiene unidades kg·m²?', '¿K ≥ 0 siempre?'],
      connections: ['Momento angular', 'Rotaciones finitas', 'Precesión'],
    },
    complex: {
      question: (t) => `<p>Evalúa ∫_{−∞}^{∞} dx/(1+x²)² usando residuos. Debes: elegir contorno, identificar polos, calcular residuo de orden 2, y justificar que la integral sobre el semicírculo grande → 0.</p><p>«${t}».</p>`,
      reasoning: (t) => `<p>Polo en z=i (semiplano superior). Res(f,i) con f = 1/(z+i)²(z−i)² requiere derivada para polo doble. Jordan: |∫_C f dz| ≤ ML → 0 si M~1/R³, L=πR.</p>`,
      strategy: ['Cierra contorno en semiplano con polos', 'Calcula residuos', 'Acota integral en arco', 'Toma parte real si hace falta'],
      pitfalls: ['Polo en eje real mal tratado', 'Olvidar factor 2πi', 'Contorno incorrecto'],
      selfCheck: ['¿Resultado es real y positivo?', '¿Coincide con cálculo directo?'],
      connections: ['Cauchy-Goursat', 'Series de Laurent', 'Transformada de Fourier'],
    },
    ode: {
      question: (t) => `<p>EDO y″ + p(x)y′ + q(x)y = 0: dos soluciones y₁, y₂. (a) Define Wronskiano; (b) prueba Abel W′ = −pW; (c) si W(x₀)≠0, ¿por qué son LI? (d) Aplica a y″ − y = 0.</p><p>«${t}».</p>`,
      reasoning: (t) => `<p>W = y₁y₂′ − y₂y₁′. Si W≠0 en un punto y p continua, W no se anula → LI. Para y″−y=0, y₁=e^x, y₂=e^{−x}, W = −2 ≠ 0.</p>`,
      strategy: ['Propón soluciones simples', 'Calcula W', 'Usa LI para solución general', 'Verifica condiciones iniciales'],
      pitfalls: ['Soluciones proporcionales', 'Olvidar término homogéneo vs particular', 'Confundir orden del Wronskiano'],
      selfCheck: ['¿n soluciones LI dan solución general?', '¿W tiene unidades correctas?'],
      connections: ['Sturm-Liouville', 'Frobenius', 'Función de Green'],
    },
    specialfn: {
      question: (t) => `<p>En coordenadas esféricas separas Laplace y obtienes ecuación de Legendre. Explica por qué solo P_l con l entero son físicamente aceptables y cómo la ortogonalidad permite expandir cualquier potencial en multipolos.</p><p>«${t}».</p>`,
      reasoning: (t) => `<p>Regularidad en θ=0,π elimina Q_l. Ortogonalidad ∫_{−1}^{1} P_l P_m dx = 0 si l≠m permite coeficientes tipo Fourier-Legendre para V(θ).</p>`,
      strategy: ['Identifica simetría esférica', 'Separa variables', 'Impone regularidad en polos', 'Usa ortogonalidad para coeficientes'],
      pitfalls: ['Confundir P_l y P_l^m', 'Olvidar normalización', 'Dominio incorrecto'],
      selfCheck: ['¿Simetría esférica reduce m=0?', '¿Unidades del potencial?'],
      connections: ['Armónicos esféricos', 'Multipolos EM', 'Bessel en cilindros'],
    },
    thermo: {
      question: (t) => `<p>Gas ideal sufre ciclo compuesto: isoterma + adiabática + isocora. Dibuja en PV, calcula trabajo neto, calor neto y ΔS del gas. Justifica reversible vs irreversible en cada tramo.</p><p>«${t}».</p>`,
      reasoning: (t) => `<p>W = ∮ P dV (área). Q = ΔU + W por 1.ª ley. ΔS gas: isoterma ΔS = nR ln(V_f/V_i); adiabática reversible ΔS=0; isocora W=0. Entropía total universo ≥ 0.</p>`,
      strategy: ['Marca cada tramo en diagrama PV', 'Usa ecuaciones de estado', 'Aplica 1.ª y 2.ª ley', 'Suma con signo de calor'],
      pitfalls: ['Confundir Q y W signos', 'Usar Cp en proceso isocoro', 'Olvidar que ΔU depende solo de T en ideal'],
      selfCheck: ['¿Ciclo cerrado ΔU=0?', '¿η ≤ η_Carnot si es motor?'],
      connections: ['Carnot', 'Entropía', 'Potenciales G y F'],
    },
    electrostatic: {
      question: (t) => `<p>Esfera conductora con cavidad excéntrica contiene carga puntual q en el interior. Piden campo fuera, carga en superficies, y explicación con Gauss y condiciones de contorno en conductores.</p><p>«${t}».</p>`,
      reasoning: (t) => `<p>Fuera: como carga puntual en centro si esfera es simétrica externamente — pero cavidad excéntrica induce distribución no uniforme en superficies interna y externa. Fuera sigue E ∝ 1/r² con Q_total. Dentro cavidad: superposición de q y cargas inducidas.</p>`,
      strategy: ['Identifica simetría exterior', 'Gauss en superficie externa', 'Campo cero en metal', 'Potencial continuo en superficies'],
      pitfalls: ['Campo ≠0 dentro conductor', 'Olvidar carga inducida', 'Confundir D y E en dieléctricos'],
      selfCheck: ['¿Gauss cierra con Q_enc?', '¿V continuo en interfaz?'],
      connections: ['Gauss', 'Multipolos', 'Capacitores'],
    },
    magnetostatic: {
      question: (t) => `<p>Alambre infinito + solenoide largo: obtén B con Ampère y Biot-Savart y demuestra consistencia en región de solapamiento. Discute por qué ∇·B=0 impide monopolos magnéticos.</p><p>«${t}».</p>`,
      reasoning: (t) => `<p>Ampère: ∮ B·dl = μ₀ I_enc. Biot-Savart integra contribución de elementos. Ambos dan B_φ = μ₀I/(2πr) para alambre. ∇·B=0 → flujo magnético cerrado, no fuentes aisladas.</p>`,
      strategy: ['Elige simetría (Ampère)', 'Define amperiana', 'Verifica con Biot-Savart en casos simples'],
      pitfalls: ['Amperiana que no abraza corriente', 'Olvidar dirección con regla de la mano', 'Confundir H y B'],
      selfCheck: ['¿B tiene unidades tesla?', '¿∇·B=0 numéricamente en tu campo?'],
      connections: ['Maxwell ∇·B=0', 'Vector potencial A', 'Fuerza Lorentz'],
    },
    maxwell: {
      question: (t) => `<p>Partiendo de las leyes de Maxwell en vacío, deriva la ecuación de onda para E y B, obtén la relación de dispersión ω = ck, y explica por qué las ondas planas son soluciones con E, B y k mutuamente perpendiculares.</p><p>«${t}».</p>`,
      reasoning: (t) => `<p>∇×(∇×E) = −∂²E/∂t²/(c²) en vacío → onda. Sustituyendo E ∝ e^{i(k·x−ωt)} da ω² = c²k². Transversalidad: ∇·E=0 → k·E=0.</p>`,
      strategy: ['Escribe Maxwell en forma diferencial', 'Usa identidades vectoriales', 'Propón solución plana', 'Impone ∇·E=0, ∇·B=0'],
      pitfalls: ['Olvidar término de corriente en medio material', 'Confundir fase y grupo', 'Signo en convención exp(i(kx−ωt))'],
      selfCheck: ['¿c = 1/√(με)?', '¿E y B están en fase en vacío?'],
      connections: ['Faraday', 'Energía del campo EM', 'Potencial escalar retardado'],
    },
    vectorcalc: {
      question: (t) => `<p>Campo F = (y, −x, z). Calcula ∇·F, ∇×F, circulación sobre círculo x²+y²=1, flujo por disco z=0, y verifica Stokes y Gauss en la región cilíndrica r≤1, 0≤z≤1.</p><p>«${t}».</p>`,
      reasoning: (t) => `<p>∇·F = 0+0+1 = 1. ∇×F = (0,0,−2). Stokes: ∮ F·dr = ∬ (∇×F)·dA = −2π. Gauss: ∬ F·dA + ∭ ∇·F dV = flujo + volumen.</p>`,
      strategy: ['Calcula operadores en cartesianas', 'Elige superficie acorde a simetría', 'Verifica teoremas con orientación correcta'],
      pitfalls: ['Signo en Stokes (orientación)', 'Confundir ∇×(∇f)=0 con todo campo', 'Jacobian en curvilíneas'],
      selfCheck: ['¿Teoremas coinciden numéricamente?', '¿Unidades de flujo?'],
      connections: ['Coordenadas curvilíneas', 'Electrostática', 'Magnetostática'],
    },
    matrix: {
      question: (t) => `<p>Composición de rotaciones R_z(α)R_y(β): ¿conmutan? Demuestra que el producto de dos rotaciones es rotación solo si conmutan o comparten eje. Calcula det(R) y R^T R.</p><p>«${t}».</p>`,
      reasoning: (t) => `<p>Matrices de rotación: R^T R = I, det R = 1. En general R₁R₂ ≠ R₂R₁ → resultado es rotación + posible error si se asume conmutación. Ángulos de Euler descomponen cualquier R en 3 rotaciones elementales.</p>`,
      strategy: ['Multiplica matrices', 'Verifica ortogonalidad', 'Interpreta geométricamente', 'Usa ángulos de Euler si 3D'],
      pitfalls: ['Confundir rotación con reflexión (det=−1)', 'Orden de multiplicación', 'Grados vs radianes'],
      selfCheck: ['¿det=1?', '¿Preserva longitudes?'],
      connections: ['Grupo SO(3)', 'Tensor de inercia', 'Marcos rotatorios'],
    },
    coordinates: {
      question: (t) => `<p>Transforma ∇²f de cartesianas a polares y esféricas. Explica por qué el laplaciano en esféricas tiene factores 1/r² y 1/sinθ, y en qué problemas de EM aparece cada coordenada.</p><p>«${t}».</p>`,
      reasoning: (t) => `<p>El laplaciano incluye curvatura de coordenadas: términos (1/r)∂/∂r y (1/r²)∂²/∂θ² surgen del elemento de volumen. Esféricas: simetría puntual (Coulomb). Cilíndricas: cables, solenoides.</p>`,
      strategy: ['Escribe métrica ds²', 'Usa fórmula general del laplaciano', 'Identifica simetría del problema'],
      pitfalls: ['Olvidar jacobiano en integrales', 'Confundir r con ρ en cilíndricas', 'Singularidad en θ=0'],
      selfCheck: ['¿∇² coincide en un punto de prueba?', '¿Unidades de laplaciano son 1/m²?'],
      connections: ['Armónicos esféricos', 'Gauss con simetría', 'Biot-Savart'],
    },
    curves: {
      question: (t) => `<p>Hélice circular: parametriza r(t), calcula κ y τ, y demuestra que una curva con τ=0 everywhere es plana. Relaciona con movimiento en espacio.</p><p>«${t}».</p>`,
      reasoning: (t) => `<p>κ = |r′×r″|/|r′|³. τ mide torsión fuera del plano osculador. τ≡0 → binormal constante → curva plana.</p>`,
      strategy: ['Parametriza con t', 'Deriva una sola vez la fórmula de Frenet', 'Interpreta κ como inverso del radio osculador'],
      pitfalls: ['Confundir κ con 1/R del movimiento circular', 'Derivadas respecto a s vs t'],
      selfCheck: ['¿κ>0 para círculo?', '¿τ=0 para círculo en plano?'],
      connections: ['Cinemática curvilínea', 'MCU', 'Base móvil'],
    },
    generic: {
      question: (t) => `<p>Problema integrador de examen sobre «${t}»: combina definición formal, aplicación numérica y argumento de consistencia dimensional. Debes explicar cada paso como si calificara un jurado que penaliza saltos lógicos.</p>`,
      reasoning: (t) => `<p>En exámenes de razonamiento complejo se valora: (1) enunciar hipótesis; (2) elegir ley física; (3) deducir sin circularidad; (4) comprobar unidades y límites; (5) interpretar el resultado.</p>`,
      strategy: ['Lista datos e incógnitas', 'Escribe leyes aplicables', 'Resuelve simbólicamente antes de números', 'Verifica límites físicos'],
      pitfalls: ['Circularidad en la demostración', 'Olvidar condiciones de validez', 'Resultado sin interpretación'],
      selfCheck: ['¿Respondiste qué se pidió?', '¿Unidades OK?', '¿Caso límite razonable?'],
      connections: ['Temas previos del mismo curso', 'Métodos matemáticos asociados'],
    },
  };

  /** Pistas extra por curso para enriquecer conexiones */
  const COURSE_CONTEXT = {
    mecanica: 'Mecánica clásica (Lagrange, simetrías, fuerzas centrales)',
    metodos: 'Métodos matemáticos (series, residuos, autofunciones)',
    termodinamica: 'Termodinámica (potenciales, equilibrio, entropía)',
    electromagnetismo: 'Electromagnetismo (campos, teoremas integrales, materia)',
  };

  function buildExamReasoning(topic, course, unit, simType) {
    const tpl = EXAM_TEMPLATES[simType] || EXAM_TEMPLATES.generic;
    const title = topic.title;

    return {
      question: tpl.question(title),
      reasoning: tpl.reasoning(title),
      strategy: tpl.strategy,
      pitfalls: tpl.pitfalls,
      selfCheck: tpl.selfCheck,
      connections: [
        ...tpl.connections,
        `Unidad: ${unit.title}`,
        COURSE_CONTEXT[course.id] || course.title,
      ],
    };
  }

  window.buildExamReasoning = buildExamReasoning;
})();
