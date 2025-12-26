<template>
  <div class="main-wrapper">



  <!-- ====================================
  ———	BREADCRUMB
  ===================================== -->
  <section class="breadcrumb-bg" style="background-image: url(/background/page-title-bg-img.jpg); ">
    <div class="container">
      <div class="breadcrumb-holder">
        <div>
          <h1 class="breadcrumb-title">Directorio de Veterinarios</h1>
          <ul class="breadcrumb breadcrumb-transparent">
            <li class="breadcrumb-item">
              <NuxtLink class="text-white" to="/">Inicio</NuxtLink>
            </li>
            <li class="breadcrumb-item text-white active" aria-current="page">Veterinarios</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

<!-- ====================================
———	OUR TEACHER 1
===================================== -->
<section class="py-10 bg-white">
  <div class="container">
    <div class="section-title justify-content-center mb-4 mb-md-8">
      <span class="shape shape-left bg-info"></span>
      <h2 class="text-danger">Veterinarios Verificados</h2>
      <span class="shape shape-right bg-info"></span>
    </div>

    <div class="row">
      <div class="col-sm-4">
        <div class="card card-hover bg-transparent shadow-none">
          <div class="card-img-wrapper position-relative shadow-sm rounded-circle mx-auto">
            <img class="card-img-top rounded-circle" src="/avator/avator-img1.jpg" alt="Refugio verificado"/>
            <div class="card-img-overlay text-center rounded-circle">
              <ul class="list-unstyled mb-0 d-flex align-items-center h-100 justify-content-center">
                <li class="mr-2">
                  <a href="#" class="text-white">
  									<i class="fa fa-facebook" aria-hidden="true"></i>
  								</a>
                </li>
                <li class="mr-2">
                  <a href="#" class="text-white">
  									<i class="fa fa-twitter" aria-hidden="true"></i>
  								</a>
                </li>
                <li class="mr-2">
                  <a href="#" class="text-white">
  									<i class="fa fa-google-plus" aria-hidden="true"></i>
  								</a>
                </li>
                <li class="mr-2">
                  <a href="#" class="text-white">
  									<i class="fa fa-pinterest-p" aria-hidden="true"></i>
  								</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="card-body text-center">
            <NuxtLink class="text-danger font-size-20 font-weight-medium d-block mb-1" to="/veterinarios">Dr. Carlos Méndez</NuxtLink>
            <span class="text-muted font-size-15">Veterinario General</span>
          </div>
        </div>
      </div>

      <div class="col-sm-4">
        <div class="card card-hover bg-transparent shadow-none">
          <div class="card-img-wrapper position-relative shadow-sm rounded-circle mx-auto">
            <img class="card-img-top rounded-circle" src="/avator/avator-img2.jpg" alt="Refugio verificado"/>
            <div class="card-img-overlay text-center rounded-circle">
              <ul class="list-unstyled mb-0 d-flex align-items-center h-100 justify-content-center">
                <li class="mr-2">
                  <a href="#" class="text-white">
  									<i class="fa fa-facebook" aria-hidden="true"></i>
  								</a>
                </li>
                <li class="mr-2">
                  <a href="#" class="text-white">
  									<i class="fa fa-twitter" aria-hidden="true"></i>
  								</a>
                </li>
                <li class="mr-2">
                  <a href="#" class="text-white">
  									<i class="fa fa-google-plus" aria-hidden="true"></i>
  								</a>
                </li>
                <li class="mr-2">
                  <a href="#" class="text-white">
  									<i class="fa fa-pinterest-p" aria-hidden="true"></i>
  								</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="card-body position-relative text-center pb-0">
            <NuxtLink class="text-danger font-size-20 font-weight-medium d-block mb-1" to="/veterinarios">Dra. Ana García</NuxtLink>
            <span class="text-muted font-size-15">Veterinaria Especialista</span>
          </div>
        </div>
      </div>

      <div class="col-sm-4">
        <div class="card card-hover bg-transparent shadow-none">
          <div class="card-img-wrapper position-relative shadow-sm rounded-circle mx-auto">
            <img class="card-img-top rounded-circle" src="/avator/avator-img3.jpg" alt="Refugio verificado"/>
            <div class="card-img-overlay text-center rounded-circle">
              <ul class="list-unstyled mb-0 d-flex align-items-center h-100 justify-content-center">
                <li class="mr-2">
                  <a href="#" class="text-white">
  									<i class="fa fa-facebook" aria-hidden="true"></i>
  								</a>
  							</li>
                <li class="mr-2">
                  <a href="#" class="text-white">
  									<i class="fa fa-twitter" aria-hidden="true"></i>
  								</a>
  							</li>
                <li class="mr-2">
                  <a href="#" class="text-white">
  									<i class="fa fa-google-plus" aria-hidden="true"></i>
  								</a>
  							</li>
                <li class="mr-2">
                  <a href="#" class="text-white">
  									<i class="fa fa-pinterest-p" aria-hidden="true"></i>
  								</a>
  							</li>
              </ul>
            </div>
          </div>

          <div class="card-body position-relative text-center pb-0">
            <NuxtLink class="text-danger font-size-20 font-weight-medium d-block mb-1" to="/veterinarios">Dr. Luis Rodríguez</NuxtLink>
            <span class="text-muted font-size-15">Veterinario General</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ====================================
———	OUR TEACHER 2
===================================== -->
<section class="pt-10 pb-3 pb-md-7 pb-lg-8 bg-purple" style="background-image: url(/background/avator-bg.png);">
  <div class="container">
    <div class="section-title justify-content-center mb-4 mb-md-8">
      <span class="shape shape-left bg-danger"></span>
      <h2 class="text-white">Veterinarios Recomendados</h2>
      <span class="shape shape-right bg-danger"></span>
    </div>

    <div class="team-slider owl-carousel owl-theme" dir="ltr">
      <div class="card card-hover card-transparent shadow-none">
        <div class="card-img-wrapper position-relative shadow-sm rounded-circle mx-auto">
          <img class="card-img-top rounded-circle" src="/avator/avator-img1.jpg" alt="Refugio verificado"/>
          <div class="card-img-overlay text-center rounded-circle">
            <ul class="list-unstyled mb-0 d-flex align-items-center h-100 justify-content-center">
              <li class="mr-2">
                <a href="#" class="text-white">
									<i class="fa fa-facebook" aria-hidden="true"></i>
								</a>
              </li>
              <li class="mr-2">
                <a href="#" class="text-white">
									<i class="fa fa-twitter" aria-hidden="true"></i>
								</a>
              </li>
              <li class="mr-2">
                <a href="#" class="text-white">
									<i class="fa fa-google-plus" aria-hidden="true"></i>
								</a>
              </li>
              <li class="mr-2">
                <a href="#" class="text-white">
									<i class="fa fa-pinterest-p" aria-hidden="true"></i>
								</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="card-body text-center">
          <NuxtLink class="font-size-20 font-weight-medium d-block mb-1" to="/veterinarios">Dr. Carlos Méndez</NuxtLink>
          <span class="text-white font-size-15">Veterinario de Emergencias</span>
        </div>
      </div>

      <div class="card card-hover card-transparent shadow-none">
        <div class="card-img-wrapper position-relative shadow-sm rounded-circle mx-auto">
          <img class="card-img-top rounded-circle" src="/avator/avator-img2.jpg" alt="Refugio verificado"/>
          <div class="card-img-overlay text-center rounded-circle">
            <ul class="list-unstyled mb-0 d-flex align-items-center h-100 justify-content-center">
              <li class="mr-2">
                <a href="#" class="text-white">
									<i class="fa fa-facebook" aria-hidden="true"></i>
								</a>
              </li>
              <li class="mr-2">
                <a href="#" class="text-white">
									<i class="fa fa-twitter" aria-hidden="true"></i>
								</a>
              </li>
              <li class="mr-2">
                <a href="#" class="text-white">
									<i class="fa fa-google-plus" aria-hidden="true"></i>
								</a>
              </li>
              <li class="mr-2">
                <a href="#" class="text-white">
									<i class="fa fa-pinterest-p" aria-hidden="true"></i>
								</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="card-body position-relative text-center pb-0">
          <NuxtLink class="font-size-20 font-weight-medium d-block mb-1" to="/veterinarios">Dra. Ana García</NuxtLink>
          <span class="text-white font-size-15">Veterinaria de Pequeños Animales</span>
        </div>
      </div>

      <div class="card card-hover card-transparent shadow-none">
        <div class="card-img-wrapper position-relative shadow-sm rounded-circle mx-auto">
          <img class="card-img-top rounded-circle" src="/avator/avator-img3.jpg" alt="Refugio verificado"/>
          <div class="card-img-overlay text-center rounded-circle">
            <ul class="list-unstyled mb-0 d-flex align-items-center h-100 justify-content-center">
              <li class="mr-2">
                <a href="#" class="text-white">
									<i class="fa fa-facebook" aria-hidden="true"></i>
								</a>
							</li>
              <li class="mr-2">
                <a href="#" class="text-white">
									<i class="fa fa-twitter" aria-hidden="true"></i>
								</a>
							</li>
              <li class="mr-2">
                <a href="#" class="text-white">
									<i class="fa fa-google-plus" aria-hidden="true"></i>
								</a>
							</li>
              <li class="mr-2">
                <a href="#" class="text-white">
									<i class="fa fa-pinterest-p" aria-hidden="true"></i>
								</a>
							</li>
            </ul>
          </div>
        </div>
        <div class="card-body position-relative text-center pb-0">
          <NuxtLink class="font-size-20 font-weight-medium d-block mb-1" to="/veterinarios">Dr. Luis Rodríguez</NuxtLink>
          <span class="text-white font-size-15">Veterinaria Especialista</span>
        </div>
      </div>

      <div class="card card-hover card-transparent shadow-none">
        <div class="card-img-wrapper position-relative shadow-sm rounded-circle mx-auto">
          <img class="card-img-top rounded-circle" src="/avator/avator-img4.jpg" alt="Refugio verificado"/>
          <div class="card-img-overlay text-center rounded-circle">
            <ul class="list-unstyled mb-0 d-flex align-items-center h-100 justify-content-center">
              <li class="mr-2">
                <a href="#" class="text-white">
									<i class="fa fa-facebook" aria-hidden="true"></i>
								</a>
              </li>
              <li class="mr-2">
                <a href="#" class="text-white">
									<i class="fa fa-twitter" aria-hidden="true"></i>
								</a>
              </li>
              <li class="mr-2">
                <a href="#" class="text-white">
									<i class="fa fa-google-plus" aria-hidden="true"></i>
								</a>
              </li>
              <li class="mr-2">
                <a href="#" class="text-white">
									<i class="fa fa-pinterest-p" aria-hidden="true"></i>
								</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="card-body position-relative text-center pb-0">
          <NuxtLink class="font-size-20 font-weight-medium d-block mb-1" to="/veterinarios">Dra. María Fernández</NuxtLink>
          <span class="text-white font-size-15">Veterinario General</span>
        </div>
      </div>

      <div class="card card-hover card-transparent shadow-none">
        <div class="card-img-wrapper position-relative shadow-sm rounded-circle mx-auto">
          <img class="card-img-top rounded-circle" src="/avator/avator-img3.jpg" alt="Refugio verificado"/>
          <div class="card-img-overlay text-center rounded-circle">
            <ul class="list-unstyled mb-0 d-flex align-items-center h-100 justify-content-center">
              <li class="mr-2">
                <a href="#" class="text-white">
									<i class="fa fa-facebook" aria-hidden="true"></i>
								</a>
              </li>
              <li class="mr-2">
                <a href="#" class="text-white">
									<i class="fa fa-twitter" aria-hidden="true"></i>
								</a>
              </li>
              <li class="mr-2">
                <a href="#" class="text-white">
									<i class="fa fa-google-plus" aria-hidden="true"></i>
								</a>
              </li>
              <li class="mr-2">
                <a href="#" class="text-white">
									<i class="fa fa-pinterest-p" aria-hidden="true"></i>
								</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="card-body position-relative text-center pb-0">
          <NuxtLink class="font-size-20 font-weight-medium d-block mb-1" to="/veterinarios">Dr. Pedro Martínez</NuxtLink>
          <span class="text-white font-size-15">Veterinaria Especialista</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ====================================
———	OUR TEACHER 3
===================================== -->
<section class="py-10">
  <div class="container">
    <div class="section-title justify-content-center mb-4 mb-md-8">
      <span class="shape shape-left bg-info"></span>
      <h2 class="text-danger">Directorio Completo</h2>
      <span class="shape shape-right bg-info"></span>
    </div>

    <div class="row">
      <div class="col-sm-6 col-xs-12 mb-7 mb-md-8 mb-lg-9">
        <div class="media media-avator-view flex-column flex-sm-row">
          <NuxtLink class="media-img mb-5 mb-sm-0 mr-md-5 mr-lg-6 rounded-sm shadow-sm" to="/veterinarios">
            <img class="rounded-sm" src="/avator/avator-img1.jpg" alt="avator-img1.jpg">
          </NuxtLink>
          <div class="media-body">
            <NuxtLink class="font-size-20 font-weight-medium d-inline-block mb-1" to="/veterinarios">Dr. Carlos Méndez</NuxtLink>

            <span class="text-muted font-size-15 mb-1 d-block">Veterinario Cirujano</span>
            <p>Veterinario certificado con amplia experiencia en el cuidado y tratamiento de animales. Comprometido con el bienestar animal y la adopción responsable.</p>

            <div class="">
              <a class="icon-rounded-circle-small bg-warning mr-2" href="javascript:void(0)">
                <i class="fa fa-facebook text-white" aria-hidden="true"></i>
              </a>
              <a class="icon-rounded-circle-small bg-success mr-2" href="javascript:void(0)">
                <i class="fa fa-twitter text-white" aria-hidden="true"></i>
              </a>
              <a class="icon-rounded-circle-small bg-danger mr-2" href="javascript:void(0)">
                <i class="fa fa-google-plus text-white" aria-hidden="true"></i>
              </a>
              <a class="icon-rounded-circle-small bg-info mr-2" href="javascript:void(0)">
                <i class="fa fa-pinterest-p text-white" aria-hidden="true"></i>
              </a>
              <a class="icon-rounded-circle-small bg-purple" href="javascript:void(0)">
                <i class="fa fa-vimeo text-white" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-6 col-xs-12 mb-7 mb-md-8 mb-lg-9">
        <div class="media media-avator-view flex-column flex-sm-row">
          <NuxtLink class="media-img mb-5 mb-sm-0 mr-md-5 mr-lg-6 rounded shadow-sm" to="/veterinarios">
            <img class="rounded" src="/avator/avator-img2.jpg" alt="avator-img2.jpg">
          </NuxtLink>
          <div class="media-body">
            <NuxtLink class="font-size-20 font-weight-medium d-inline-block mb-1" to="/veterinarios">Dr. Carlos Méndez</NuxtLink>

            <span class="text-muted font-size-15 mb-1 d-block">English Teacher</span>
            <p>Veterinario certificado con amplia experiencia en el cuidado y tratamiento de animales. Comprometido con el bienestar animal y la adopción responsable.</p>

            <div class="">
              <a class="icon-rounded-circle-small bg-warning mr-2" href="javascript:void(0)">
                <i class="fa fa-facebook text-white" aria-hidden="true"></i>
              </a>
              <a class="icon-rounded-circle-small bg-success mr-2" href="javascript:void(0)">
                <i class="fa fa-twitter text-white" aria-hidden="true"></i>
              </a>
              <a class="icon-rounded-circle-small bg-danger mr-2" href="javascript:void(0)">
                <i class="fa fa-google-plus text-white" aria-hidden="true"></i>
              </a>
              <a class="icon-rounded-circle-small bg-info mr-2" href="javascript:void(0)">
                <i class="fa fa-pinterest-p text-white" aria-hidden="true"></i>
              </a>
              <a class="icon-rounded-circle-small bg-purple" href="javascript:void(0)">
                <i class="fa fa-vimeo text-white" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-6 col-xs-12 mb-7 mb-md-0">
        <div class="media media-avator-view flex-column flex-sm-row">
          <NuxtLink class="media-img mb-5 mb-sm-0 mr-md-5 mr-lg-6 rounded shadow-sm" to="/veterinarios">
            <img class="rounded" src="/avator/avator-img3.jpg" alt="avator-img-3.jpg">
          </NuxtLink>
          <div class="media-body">
            <NuxtLink class="font-size-20 font-weight-medium d-inline-block b-1" to="/veterinarios">Dr. Carlos Méndez</NuxtLink>

            <span class="text-muted font-size-15 mb-1 d-block">English Teacher</span>
            <p>Veterinario certificado con amplia experiencia en el cuidado y tratamiento de animales. Comprometido con el bienestar animal y la adopción responsable.</p>

            <div class="">
              <a class="icon-rounded-circle-small bg-warning mr-2" href="javascript:void(0)">
                <i class="fa fa-facebook text-white" aria-hidden="true"></i>
              </a>
              <a class="icon-rounded-circle-small bg-success mr-2" href="javascript:void(0)">
                <i class="fa fa-twitter text-white" aria-hidden="true"></i>
              </a>
              <a class="icon-rounded-circle-small bg-danger mr-2" href="javascript:void(0)">
                <i class="fa fa-google-plus text-white" aria-hidden="true"></i>
              </a>
              <a class="icon-rounded-circle-small bg-info mr-2" href="javascript:void(0)">
                <i class="fa fa-pinterest-p text-white" aria-hidden="true"></i>
              </a>
              <a class="icon-rounded-circle-small bg-purple" href="javascript:void(0)">
                <i class="fa fa-vimeo text-white" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-6 col-xs-12">
        <div class="media media-avator-view flex-column flex-sm-row">
          <NuxtLink class="media-img mb-5 mb-sm-0 mr-md-5 mr-lg-6 rounded shadow-sm" to="/veterinarios">
            <img class="rounded" src="/avator/avator-img4.jpg" alt="team-1.jpg">
          </NuxtLink>
          <div class="media-body">
            <NuxtLink class="font-size-20 font-weight-medium d-inline-block mb-1" to="/veterinarios">Dr. Carlos Méndez</NuxtLink>

            <span class="text-muted font-size-15 mb-1 d-block">English Teacher</span>
            <p>Veterinario certificado con amplia experiencia en el cuidado y tratamiento de animales. Comprometido con el bienestar animal y la adopción responsable.</p>

            <div class="">
              <a class="icon-rounded-circle-small bg-warning mr-2" href="javascript:void(0)">
                <i class="fa fa-facebook text-white" aria-hidden="true"></i>
              </a>
              <a class="icon-rounded-circle-small bg-success mr-2" href="javascript:void(0)">
                <i class="fa fa-twitter text-white" aria-hidden="true"></i>
              </a>
              <a class="icon-rounded-circle-small bg-danger mr-2" href="javascript:void(0)">
                <i class="fa fa-google-plus text-white" aria-hidden="true"></i>
              </a>
              <a class="icon-rounded-circle-small bg-info mr-2" href="javascript:void(0)">
                <i class="fa fa-pinterest-p text-white" aria-hidden="true"></i>
              </a>
              <a class="icon-rounded-circle-small bg-purple" href="javascript:void(0)">
                <i class="fa fa-vimeo text-white" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


  </div>
</template>

<script setup>
useHead({
  title: 'Directorio de Veterinarios - Colitas Abandonadas - Colitas Abandonadas'
})

onMounted(() => {
  if (process.client) {
    setTimeout(() => {
      if (window.WOW) new window.WOW().init()
    }, 100)
  }
})
</script>
