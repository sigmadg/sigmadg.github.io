// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
  app: {
    baseURL: '/Colitas/',
    buildAssetsDir: '_nuxt/',
    head: {
      title: 'Colitas Abandonadas',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Portal web para adopción responsable de mascotas' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/Colitas/favicon.png' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Dosis:300,400,600,700|Open+Sans:300,400,600,700' }
      ],
      script: [
        { src: '/Colitas/plugins/jquery/jquery.min.js', defer: true },
        { src: '/Colitas/plugins/bootstrap/js/bootstrap.bundle.min.js', defer: true }
      ]
    }
  },

  css: [
    '~/assets/css/kidz.css',
    '~/assets/css/nav-separators.css',
    '~/assets/css/gallery-improvements.css'
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/_variables.scss" as *;'
        }
      }
    }
  },

  // Static generation
  nitro: {
    prerender: {
      routes: ['/']
    }
  },
  
  // SSG configuration
  ssr: false
})
