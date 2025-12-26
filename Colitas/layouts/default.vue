<template>
  <div id="body" class="up-scroll">
    <!-- Preloader -->
    <div id="preloader" class="smooth-loader-wrapper">
      <div class="smooth-loader">
        <div class="loader">
          <span class="dot dot-1"></span>
          <span class="dot dot-2"></span>
          <span class="dot dot-3"></span>
          <span class="dot dot-4"></span>
        </div>
      </div>
    </div>

    <Header />
    
    <main>
      <slot />
    </main>

    <Footer />

    <!-- Scrolling -->
    <div class="scrolling">
      <a href="#pageTop" class="back-to-top" id="back-to-top">
        <i class="fa fa-arrow-up" aria-hidden="true"></i>
      </a>
    </div>
  </div>
</template>

<script setup>
useHead({
  script: [
    { src: '/plugins/jquery/jquery.min.js', defer: true },
    { src: '/plugins/bootstrap/js/bootstrap.bundle.min.js', defer: true },
    { src: '/plugins/owl-carousel/owl.carousel.min.js', defer: true },
    { src: '/plugins/fancybox/jquery.fancybox.min.js', defer: true },
    { src: '/plugins/isotope/isotope.min.js', defer: true },
    { src: '/plugins/syotimer/jquery.syotimer.min.js', defer: true },
    { src: '/plugins/select2/js/select2.min.js', defer: true },
    { src: '/plugins/no-ui-slider/nouislider.min.js', defer: true },
    { src: '/plugins/lazyestload/lazyestload.js', defer: true },
    { src: '/plugins/velocity/velocity.min.js', defer: true },
    { src: '/plugins/images-loaded/js/imagesloaded.pkgd.min.js', defer: true },
    { src: '/plugins/revolution/js/jquery.themepunch.tools.min.js', defer: true },
    { src: '/plugins/revolution/js/jquery.themepunch.revolution.min.js', defer: true },
    { src: '/plugins/wow/wow.min.js', defer: true },
    { src: '/js/kidz.js', defer: true }
  ],
  link: [
    { rel: 'stylesheet', href: '/plugins/font-awesome/css/font-awesome.min.css' },
    { rel: 'stylesheet', href: '/plugins/no-ui-slider/nouislider.min.css' },
    { rel: 'stylesheet', href: '/plugins/owl-carousel/owl.carousel.min.css' },
    { rel: 'stylesheet', href: '/plugins/owl-carousel/owl.theme.default.min.css' },
    { rel: 'stylesheet', href: '/plugins/fancybox/jquery.fancybox.min.css' },
    { rel: 'stylesheet', href: '/plugins/isotope/isotope.min.css' },
    { rel: 'stylesheet', href: '/plugins/animate/animate.css' },
    { rel: 'stylesheet', href: '/plugins/select2/css/select2.min.css' },
    { rel: 'stylesheet', href: '/plugins/revolution/css/settings.css' },
    { rel: 'stylesheet', href: '/plugins/revolution/css/layers.css' },
    { rel: 'stylesheet', href: '/plugins/revolution/css/navigation.css' }
  ]
})

onMounted(() => {
  // Initialize scripts after mount
  if (process.client) {
    setTimeout(() => {
      if (window.jQuery) {
        window.jQuery(document).ready(() => {
          // Initialize any jQuery plugins here
        })
      }
    }, 100)
  }
})
</script>

