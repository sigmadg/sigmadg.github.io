export default defineNuxtPlugin(() => {
  if (process.client) {
    // Bootstrap will be loaded via CDN or from public folder
    // This plugin ensures Bootstrap is available
    return {
      provide: {
        bootstrap: () => {
          if (window.bootstrap) {
            return window.bootstrap
          }
        }
      }
    }
  }
})

