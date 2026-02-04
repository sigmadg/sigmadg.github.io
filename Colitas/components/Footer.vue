<template>
  <footer class="footer-bg-img">
    <!-- Footer Color Bar -->
    <div class="color-bar">
      <div class="container-fluid">
        <div class="row">
          <div class="col color-bar bg-warning"></div>
          <div class="col color-bar bg-danger"></div>
          <div class="col color-bar bg-success"></div>
          <div class="col color-bar bg-info"></div>
          <div class="col color-bar bg-purple"></div>
          <div class="col color-bar bg-pink"></div>
          <div class="col color-bar bg-warning d-none d-md-block"></div>
          <div class="col color-bar bg-danger d-none d-md-block"></div>
          <div class="col color-bar bg-success d-none d-md-block"></div>
          <div class="col color-bar bg-info d-none d-md-block"></div>
          <div class="col color-bar bg-purple d-none d-md-block"></div>
          <div class="col color-bar bg-pink d-none d-md-block"></div>
        </div>
      </div>
    </div>

    <div class="pt-8 pb-7 bg-repeat" style="background-image: url(/background/footer-bg-img-1.png);">
      <div class="container">
        <div class="row">
          <div class="col-sm-6 col-lg-3 col-xs-12">
            <NuxtLink class="mb-6 d-block" to="/">
              <img class="img-fluid d-inline-block w-50 lazyestload" data-src="/logo-footer.png" src="/logo-footer.png" alt="Colitas Abandonadas">
            </NuxtLink>
            <p class="mb-6">Portal web para adopción responsable de mascotas. Sistema completo con cartas responsivas, identificación de adoptantes, seguimiento con fotos recurrentes y donaciones transparentes.</p>
            <p class="mb-6">Juntos podemos hacer la diferencia en la vida de los animales abandonados.</p>
          </div>

          <div class="col-sm-6 col-lg-3 col-xs-12">
            <h4 class="section-title-sm font-weight-bold text-white mb-6">Enlaces Útiles</h4>
            <ul class="list-unstyled">
              <li class="mb-4">
                <NuxtLink to="/#courses">
                  <i class="fa fa-angle-double-right mr-2" aria-hidden="true"></i>Animales Disponibles
                </NuxtLink>
              </li>
              <li class="mb-4">
                <NuxtLink to="/#teachers">
                  <i class="fa fa-angle-double-right mr-2" aria-hidden="true"></i>Refugios Verificados
                </NuxtLink>
              </li>
              <li class="mb-4">
                <NuxtLink to="/#gallery">
                  <i class="fa fa-angle-double-right mr-2" aria-hidden="true"></i>Galería de Adopciones
                </NuxtLink>
              </li>
              <li class="mb-4">
                <NuxtLink to="/#blog">
                  <i class="fa fa-angle-double-right mr-2" aria-hidden="true"></i>Noticias y Actualizaciones
                </NuxtLink>
              </li>
              <li class="mb-4">
                <NuxtLink to="/#grooming">
                  <i class="fa fa-angle-double-right mr-2" aria-hidden="true"></i>Servicios de Aseo
                </NuxtLink>
              </li>
              <li class="mb-3">
                <NuxtLink to="/contact-us">
                  <i class="fa fa-angle-double-right mr-2" aria-hidden="true"></i>
                  Contacto
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div class="col-sm-6 col-lg-3 col-xs-12">
            <h4 class="section-title-sm font-weight-bold text-white mb-6">Publicaciones Recientes</h4>
            <ul class="list-unstyled list-item-border-bottom">
              <li class="mb-4 pb-4">
                <div class="media">
                  <NuxtLink class="mr-2" to="/blog-single">
                    <img class="rounded-lg w-100 border-warning border-2 d-block" data-src="/blog/blog-sm-img5.jpg"
                      src="/blog/blog-sm-img5.jpg" alt="Nuevo Sistema de Seguimiento">
                  </NuxtLink>
                  <div class="media-body">
                    <h5 class="line-hight-16 mb-1">
                      <NuxtLink class="font-base font-size-14" to="/blog-single">Nuevo Sistema de Seguimiento</NuxtLink>
                    </h5>
                    <time class="text-white">Hace 2 días</time>
                  </div>
                </div>
              </li>

              <li class="mb-4 pb-4">
                <div class="media">
                  <NuxtLink class="mr-2" to="/blog-single">
                    <img class="rounded-lg w-100 border-success border-2 d-block" data-src="/blog/blog-sm-img-12.jpg"
                      src="/blog/blog-sm-img-12.jpg" alt="Historia de Éxito: Max">
                  </NuxtLink>
                  <div class="media-body">
                    <h5 class="line-hight-16 mb-1">
                      <NuxtLink class="font-base font-size-14" to="/blog-single">Historia de Éxito: Max</NuxtLink>
                    </h5>
                    <time class="text-white">Hace 1 semana</time>
                  </div>
                </div>
              </li>

              <li class="mb-4 pb-4">
                <div class="media">
                  <NuxtLink class="mr-2" to="/blog-single">
                    <img class="rounded-lg w-100 border-danger border-2 d-block" data-src="/blog/blog-sm-img-6.jpg"
                      src="/blog/blog-sm-img-6.jpg" alt="Cómo Donar de Forma Segura">
                  </NuxtLink>
                  <div class="media-body">
                    <h5 class="line-hight-16 mb-1">
                      <NuxtLink class="font-base font-size-14" to="/blog-single">Cómo Donar de Forma Segura</NuxtLink>
                    </h5>
                    <time class="text-white">Hace 3 semanas</time>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="col-sm-6 col-lg-3 col-xs-12">
            <h4 class="section-title-sm font-weight-bold text-white mb-6">Contacto</h4>
            <ul class="list-unstyled">
              <li class="mb-4">
                <div class="media align-items-center">
                  <span class="bg-warning icon-rounded-circle-small mr-2">
                    <i class="fa fa-map-marker text-white"></i>
                  </span>
                  <div class="media-body">
                    <p class="mb-0 text-white">Dirección del Refugio</p>
                  </div>
                </div>
              </li>
              <li class="mb-4">
                <div class="media align-items-center">
                  <span class="bg-success icon-rounded-circle-small mr-2">
                    <i class="fa fa-phone text-white"></i>
                  </span>
                  <div class="media-body">
                    <p class="mb-0"><a class="text-white" href="tel:+10000000000">+1 00 0000 0000</a></p>
                  </div>
                </div>
              </li>
              <li class="mb-4">
                <div class="media align-items-center">
                  <span class="bg-info icon-rounded-circle-small mr-2">
                    <i class="fa fa-envelope text-white"></i>
                  </span>
                  <div class="media-body">
                    <p class="mb-0"><a class="text-white" href="mailto:colitas.abandonadas@gmail.com">colitas.abandonadas@gmail.com</a></p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="copyright bg-dark py-4">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <p class="mb-0 text-white">© {{ currentYear }} Colitas Abandonadas. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

