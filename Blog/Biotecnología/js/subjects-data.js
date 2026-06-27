/* Catálogo de materias — Biotecnología */
window.BIO_CATALOG = [
  {
    id: 'quimica',
    title: 'Química y fundamentos',
    desc: 'Bases químicas, analítica y termodinámica aplicada a bioprocesos.',
    color: '#22c55e',
    icon: '⚗️',
    subgroups: [
      {
        title: 'Materias',
        subjects: [
          'Química',
          'Química analítica',
          'Termodinámica',
          'Bioquímica',
          'Fisicoquímica',
          'Balance de materia y energía',
        ],
      },
    ],
  },
  {
    id: 'biologia',
    title: 'Biología',
    desc: 'Desde la célula hasta genética molecular y diversidad biológica.',
    color: '#10b981',
    icon: '🧬',
    subgroups: [
      {
        title: 'Materias',
        subjects: [
          'Biología celular',
          'Microbiología y taxonomía microbiana',
          'Fisiología de plantas y animales',
          'Biología molecular I',
          'Biología molecular II',
          'Genética molecular bacteriana',
          'Biodiversidad y bioseguridad',
        ],
      },
    ],
  },
  {
    id: 'laboratorio',
    title: 'Técnicas de laboratorio',
    desc: 'Prácticas de bench y cultivo celular vegetal.',
    color: '#14b8a6',
    icon: '🔬',
    subgroups: [
      {
        title: 'Materias',
        subjects: [
          'Técnicas de laboratorio de biología',
          'Cultivo de tejidos vegetales I',
          'Cultivo de tejidos vegetales II',
        ],
      },
    ],
  },
  {
    id: 'ingenieria',
    title: 'Ingeniería de bioprocesos',
    desc: 'Reactores, operaciones unitarias, control y simulación.',
    color: '#06b6d4',
    icon: '⚙️',
    subgroups: [
      {
        title: 'Materias',
        subjects: [
          'Fenómenos de transporte',
          'Operaciones unitarias I',
          'Ingeniería de biorreactores I',
          'Ingeniería de biorreactores II',
          'Ingeniería de control de procesos',
          'Ingeniería de bioprocesos I',
          'Ingeniería de bioprocesos II',
          'Simulación dinámica de bioprocesos',
        ],
      },
    ],
  },
  {
    id: 'matematicas-herramientas',
    title: 'Matemáticas y herramientas',
    desc: 'Modelado numérico y bioinformática.',
    color: '#8b5cf6',
    icon: '📊',
    subgroups: [
      {
        title: 'Materias',
        subjects: ['Cálculo multivariado', 'Bioinformática'],
      },
    ],
  },
  {
    id: 'aplicaciones',
    title: 'Aplicaciones ambientales',
    desc: 'Soluciones biotecnológicas para el medio ambiente.',
    color: '#84cc16',
    icon: '🌿',
    subgroups: [
      {
        title: 'Materias',
        subjects: ['Biorremediación'],
      },
    ],
  },
];

window.BIO_CATEGORY_COLORS = {
  quimica: '#22c55e',
  biologia: '#10b981',
  laboratorio: '#14b8a6',
  ingenieria: '#06b6d4',
  'matematicas-herramientas': '#8b5cf6',
  aplicaciones: '#84cc16',
};
