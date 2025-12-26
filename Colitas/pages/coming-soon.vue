<template>
  <div class="main-wrapper">
    <section class="coming-soon" style="background-image: url(/background/background-img-1.jpg);">
      <div class="container">
        <div class="row flex-column justify-content-center align-items-center" style="height: -webkit-fill-available;">
          <div class="col-xs-12">
            <div class="img text-center mb-10 mb-xl-8">
              <NuxtLink to="/">
                <img class="d-block mx-auto" src="/logo-school.png" alt="Colitas Abandonadas">
              </NuxtLink>
            </div>

            <div class="text-center">
              <h1 class="mb-4 font-weight-bold text-capitalize">Próximamente</h1>
              <p class="text-dark">Estamos trabajando en nuevas funcionalidades para mejorar el portal de adopción. Mantente al tanto.</p>
            </div>

            <div class="comming-soon-count">
              <div id="comming-soon" class="mb-6"></div>
            </div>

            <div class="input-group form-group-icon mb-5">
              <input type="email" class="form-control rounded border-purple" aria-describedby="basic-addon2" placeholder="Ingresa tu correo para recibir información">
              <button type="submit" class="input-group-addon w-100 border-0 btn bg-transparent shadow-none p-0" id="basic-addon2">
                <i class="fa fa-arrow-right" aria-hidden="true"></i>
              </button>
            </div>

            <ul class="list-inline d-flex justify-content-center">
              <li class="mx-2">
                <a class="icon-rounded-circle-small bg-warning" href="javascript:void(0)">
                  <i class="fa fa-facebook text-white" aria-hidden="true"></i>
                </a>
              </li>
              <li class="mx-2">
                <a class="icon-rounded-circle-small bg-success" href="javascript:void(0)">
                  <i class="fa fa-google-plus text-white" aria-hidden="true"></i>
                </a>
              </li>
              <li class="mx-2">
                <a class="icon-rounded-circle-small bg-danger" href="javascript:void(0)">
                  <i class="fa fa-twitter text-white" aria-hidden="true"></i>
                </a>
              </li>
              <li class="mx-2">
                <a class="icon-rounded-circle-small bg-info" href="javascript:void(0)">
                  <i class="fa fa-linkedin text-white" aria-hidden="true"></i>
                </a>
              </li>
              <li class="mx-2">
                <a class="icon-rounded-circle-small bg-purple" href="javascript:void(0)">
                  <i class="fa fa-instagram text-white" aria-hidden="true"></i>
                </a>
              </li>
              <li class="mx-2">
                <a class="icon-rounded-circle-small bg-pink" href="javascript:void(0)">
                  <i class="fa fa-pinterest-p text-white" aria-hidden="true"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'Próximamente - Colitas Abandonadas',
  meta: [
    { name: 'description', content: 'Portal de adopción responsable de mascotas - Próximamente' }
  ],
  script: [
    { src: '/plugins/jquery/jquery.min.js', defer: true },
    { src: '/plugins/bootstrap/js/bootstrap.bundle.min.js', defer: true },
    { src: '/plugins/syotimer/jquery.syotimer.min.js', defer: true },
    { src: '/js/kidz.js', defer: true }
  ]
})

onMounted(() => {
  if (process.client) {
    // Cargar scripts dinámicamente
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })
    }

    // Cargar scripts en orden
    Promise.all([
      loadScript('/plugins/jquery/jquery.min.js'),
      loadScript('/plugins/bootstrap/js/bootstrap.bundle.min.js'),
      loadScript('/plugins/syotimer/jquery.syotimer.min.js'),
      loadScript('/js/kidz.js')
    ]).then(() => {
      // Inicializar syotimer cuando jQuery esté disponible
      if (window.jQuery && window.jQuery.fn.syotimer) {
        window.jQuery('#comming-soon').syotimer({
          year: 2025,
          month: 12,
          day: 31,
          hour: 23,
          minute: 59
        })
      }
      
      // Inicializar WOW.js si está disponible
      if (window.WOW) {
        new window.WOW().init()
      }
    }).catch((error) => {
      console.error('Error cargando scripts:', error)
    })
  }
})
</script>
