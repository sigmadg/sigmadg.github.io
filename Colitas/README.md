# Colitas Abandonadas - Portal de Adopción Responsable

Portal web migrado a Nuxt 3 para adopción responsable de mascotas.

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

El servidor de desarrollo estará disponible en `http://localhost:3000`

### Producción

```bash
npm run build
npm run preview
```

### Generación Estática

```bash
npm run generate
```

## 📁 Estructura del Proyecto

```
Colitas/
├── assets/          # CSS y recursos
│   ├── css/         # Estilos personalizados
│   └── ...
├── components/       # Componentes Vue reutilizables
│   ├── Header.vue
│   └── Footer.vue
├── layouts/         # Layouts de página
│   └── default.vue
├── pages/           # Páginas (rutas automáticas)
│   ├── index.vue
│   ├── about-us.vue
│   ├── contact-us.vue
│   └── ...
├── plugins/         # Plugins de Nuxt
├── public/          # Archivos estáticos (imágenes, JS, etc.)
└── nuxt.config.ts   # Configuración de Nuxt
```

## 📝 Páginas Disponibles

- `/` - Inicio
- `/about-us` - Sobre Nosotros
- `/contact-us` - Contacto
- `/veterinarios` - Directorio de Veterinarios
- `/services` - Servicios
- `/faq` - Preguntas Frecuentes
- `/events` - Eventos
- `/testimonial` - Testimonios
- `/photo-gallery` - Galería de Fotos
- `/sign-up-or-login` - Registro/Login
- `/search-result` - Resultados de Búsqueda
- `/blog-grid` - Blog (Grid)
- `/blog-list` - Blog (Lista)
- `/blog-single` - Artículo de Blog
- `/404` - Página No Encontrada
- `/coming-soon` - Próximamente

## 🔧 Tecnologías

- **Nuxt 3** - Framework Vue.js
- **Bootstrap 4** - Framework CSS
- **jQuery** - Librería JavaScript
- **Revolution Slider** - Slider de imágenes
- **Owl Carousel** - Carrusel
- **Font Awesome** - Iconos

## 📦 Dependencias

Las dependencias principales están en `package.json`. Los plugins de jQuery (Bootstrap, Owl Carousel, etc.) se cargan desde la carpeta `public/plugins/`.

## 🎨 Estilos

Los estilos principales están en:
- `assets/css/kidz.css` - Estilos del tema
- `assets/css/nav-separators.css` - Separadores del menú

## 📱 Responsive

El sitio es completamente responsive y se adapta a diferentes tamaños de pantalla.

## 🔄 Migración

Este proyecto fue migrado desde HTML estático a Nuxt 3. El proyecto original se encuentra en `../Colitas-backup-*`.

## 📄 Licencia

Copyright © 2024 Colitas Abandonadas - Portal de Adopción Responsable de Mascotas

