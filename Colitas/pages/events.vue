<template>
  <div class="main-wrapper">



  <!-- ====================================
  ———	BREADCRUMB
  ===================================== -->
  <section class="breadcrumb-bg" style="background-image: url(/background/page-title-bg-img.jpg); ">
    <div class="container">
      <div class="breadcrumb-holder">
        <div>
          <h1 class="breadcrumb-title">Eventos de Adopción</h1>
          <ul class="breadcrumb breadcrumb-transparent">
            <li class="breadcrumb-item">
              <NuxtLink class="text-white" to="/">Inicio</NuxtLink>
            </li>
            <li class="breadcrumb-item text-white active" aria-current="page">Eventos de Adopción</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

<!-- ====================================
———	EVENTS SECTION
===================================== -->
<section class="pt-7 pb-9 pt-md-10">
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <div class="media media-events-list bg-warning">
          <NuxtLink class="media-img" to="/events">
            <img src="/events/events-img1.jpg" alt="events-image">
            <div class="media-img-overlay p-4">
              <span class="badge badge-warning badge-rounded "> 10 <br> July</span>
            </div>
          </NuxtLink>
      
          <div class="media-body">
            <h3 class="media-heading mb-4">
              <NuxtLink class="text-white text-capitalize d-block text-truncate" to="/events">Jornada de Adopción Responsable</NuxtLink>
            </h3>
      
            <ul class="list-unstyled mb-2">
              <li class="text-white mb-1">
                <i class="fa fa-calendar-o mr-2" aria-hidden="true"></i>10 de Julio, 2024
              </li>
              <li class="text-white">
                <i class="fa fa-clock-o mr-2" aria-hidden="true"></i>9:00 AM - 5:00 PM
              </li>
            </ul>
      
            <p class="text-white mb-5">Evento especial de adopción con múltiples refugios verificados. Ven a conocer a los animales disponibles y encuentra tu compañero perfecto.</p>
            <div class="mb-1">
              <NuxtLink to="/events" class="btn btn-white btn-sm text-uppercase text-hover-success">Leer más</NuxtLink>
            </div>            
          </div>
        </div>
      </div>

      <div class="col-md-6">
				<div class="media media-events-list bg-success">
          <NuxtLink class="media-img" to="/events">
            <img src="/events/events-img2.jpg" alt="events-image">
            <div class="media-img-overlay p-4">
              <span class="badge badge-success badge-rounded "> 10 <br> July</span>
            </div>
          </NuxtLink>

          <div class="media-body">
            <h3 class="media-heading mb-4">
              <NuxtLink class="text-white text-capitalize d-block text-truncate" to="/events">Taller de Cuidado Animal</NuxtLink>
            </h3>

            <ul class="list-unstyled mb-2">
              <li class="text-white mb-1">
                <i class="fa fa-calendar-o mr-2" aria-hidden="true"></i>15 de Julio, 2024
              </li>
              <li class="text-white">
                <i class="fa fa-clock-o mr-2" aria-hidden="true"></i>10:00 AM - 12:00 PM
              </li>
            </ul>

            <p class="text-white mb-5">Taller educativo sobre cuidado responsable de mascotas. Aprende sobre alimentación, salud y bienestar animal con expertos veterinarios.</p>

            <div class="mb-1">
              <NuxtLink to="/events" class="btn btn-white btn-sm text-uppercase text-hover-success">Leer más</NuxtLink>
            </div>            
          </div>
        </div>
      </div>

      <div class="col-md-6">
				<div class="media media-events-list bg-danger">
          <NuxtLink class="media-img position-relative" to="/events">
            <img src="/events/events-img3.jpg" alt="events-image">
            <div class="media-img-overlay p-4">
              <span class="badge badge-danger badge-rounded "> 10 <br> July</span>
            </div>
          </NuxtLink>

          <div class="media-body">
            <h3 class="media-heading mb-4">
              <NuxtLink class="text-white text-capitalize d-block text-truncate" to="/events">Campaña de Esterilización</NuxtLink>
            </h3>

            <ul class="list-unstyled mb-2">
              <li class="text-white mb-1">
                <i class="fa fa-calendar-o mr-2" aria-hidden="true"></i>20 de Julio, 2024
              </li>
              <li class="text-white">
                <i class="fa fa-clock-o mr-2" aria-hidden="true"></i>9:00 AM - 5:00 PM
              </li>
            </ul>

            <p class="text-white mb-5">Evento especial para promover la adopción responsable de animales</p>
            <div class="mb-1">
              <NuxtLink to="/events" class="btn btn-white btn-sm text-uppercase text-hover-danger">Leer más</NuxtLink>
            </div>            
          </div>
        </div>
      </div>

      <div class="col-md-6">
				<div class="media media-events-list bg-info">
          <NuxtLink class="media-img position-relative" to="/events">
            <img src="/events/events-img4.jpg" alt="events-image">
            <div class="media-img-overlay p-4">
              <span class="badge badge-info badge-rounded "> 10 <br> July</span>
            </div>
          </NuxtLink>

          <div class="media-body">
            <h3 class="media-heading mb-4">
              <NuxtLink class="text-white text-capitalize d-block text-truncate" to="/events">Suspendisse eleifend ipsum.</NuxtLink>
            </h3>

            <ul class="list-unstyled mb-2">
              <li class="text-white mb-1">
                <i class="fa fa-calendar-o mr-2" aria-hidden="true"></i>Evento de Adopción
              </li>
              <li class="text-white">
                <i class="fa fa-clock-o mr-2" aria-hidden="true"></i>9:00 AM - 5:00 PM
              </li>
            </ul>

            <p class="text-white mb-5">Evento especial para promover la adopción responsable de animales</p>
            <div class="mb-1">
              <NuxtLink to="/events" class="btn btn-white btn-sm text-uppercase text-hover-info">Leer más</NuxtLink>
            </div>            
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="media media-events-list bg-purple">
          <NuxtLink class="media-img position-relative" to="/events">
            <img src="/events/events-img1.jpg" alt="events-image">
            <div class="media-img-overlay p-4">
              <span class="badge badge-purple badge-rounded"> 10 <br> July</span>
            </div>
          </NuxtLink>

          <div class="media-body">
            <h3 class="media-heading mb-4">
              <NuxtLink class="text-white text-capitalize d-block text-truncate" to="/events">Praesent quis felis non.</NuxtLink>
            </h3>

            <ul class="list-unstyled mb-2">
              <li class="text-white mb-1">
                <i class="fa fa-calendar-o mr-2" aria-hidden="true"></i>Evento de Adopción
              </li>
              <li class="text-white">
                <i class="fa fa-clock-o mr-2" aria-hidden="true"></i>9:00 AM - 5:00 PM
              </li>
            </ul>

            <p class="text-white mb-5">Evento especial para promover la adopción responsable de animales</p>
            <div class="mb-1">
              <NuxtLink to="/events" class="btn btn-white btn-sm text-uppercase text-hover-purple">Leer más</NuxtLink>
            </div>            
          </div>
        </div>
      </div>

      <div class="col-md-6">
				<div class="media media-events-list bg-pink ">
          <NuxtLink class="media-img position-relative" to="/events">
            <img src="/events/events-img2.jpg" alt="events-image">
            <div class="media-img-overlay p-4">
              <span class="badge badge-pink badge-rounded"> 10 <br> July</span>
            </div>
          </NuxtLink>

          <div class="media-body">
            <h3 class="media-heading mb-4">
              <NuxtLink class="text-white text-capitalize d-block text-truncate" to="/events">Fusce feugiat diam ac metus.</NuxtLink>
            </h3>

            <ul class="list-unstyled mb-2">
              <li class="text-white mb-1">
                <i class="fa fa-calendar-o mr-2" aria-hidden="true"></i>Evento de Adopción
              </li>
              <li class="text-white">
                <i class="fa fa-clock-o mr-2" aria-hidden="true"></i>9:00 AM - 5:00 PM
              </li>
            </ul>

            <p class="text-white mb-5">Evento especial para promover la adopción responsable de animales</p>
            <div class="mb-1">
              <NuxtLink to="/events" class="btn btn-white btn-sm text-uppercase text-hover-pink">Leer más</NuxtLink>
            </div>            
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-6">
		<!-- ====================================
———	PAGINATION
===================================== -->
<section class="py-5">
  <div class="container">
    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center align-items-center">
          <li class="page-item"><a class="page-link" href="#">
            <i class="fa fa-arrow-left mr-1" aria-hidden="true"></i>
            Prev
          </a>
          </li>
          <li class="page-item page-link" ><a class="page-link" href="#">1</a></li>
          <li class="page-item page-link" ><a class="page-link" href="#">2</a></li>
          <li class="page-item page-link" ><a class="page-link" href="#">3</a></li>
          <li class="page-item page-link" ><a class="page-link" href="#">...</a></li>
          <li class="page-item page-link" ><a class="page-link" href="#">15</a></li>
          <li class="page-item page-link" ><a class="page-link" href="#">
            Next <i class="fa fa-arrow-right ml-1" aria-hidden="true"></i>
          </a>
          </li>
        </ul>
      </nav>
  </div>
</section>
  </div>
</section>


  </div>
</template>

<script setup>
useHead({
  title: 'Eventos - Colitas Abandonadas - Colitas Abandonadas'
})

onMounted(() => {
  if (process.client) {
    setTimeout(() => {
      if (window.WOW) new window.WOW().init()
    }, 100)
  }
})
</script>
