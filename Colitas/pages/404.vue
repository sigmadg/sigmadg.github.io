<template>
  <div class="main-wrapper">



  <!-- ====================================
  ———	BREADCRUMB
  ===================================== -->
  <section class="breadcrumb-bg" style="background-image: url(/background/page-title-bg-img.jpg); ">
    <div class="container">
      <div class="breadcrumb-holder">
        <div>
          <h1 class="breadcrumb-title">Página No Encontrada</h1>
          <ul class="breadcrumb breadcrumb-transparent">
            <li class="breadcrumb-item">
              <NuxtLink class="text-white" to="/">Inicio</NuxtLink>
            </li>
            <li class="breadcrumb-item text-white active" aria-current="page">Página No Encontrada</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

<!-- ====================================
———	ERROR PAGE
===================================== -->
<section class="py-8 py-md-10">
  <div class="container">
    <div class="row">
      <div class="col-sm-4 offset-sm-1">
        <div class="image text-center text-xl-left">
          <img class="img-fluid img-responsive" src="/error.png" alt="Página no encontrada">
        </div>
      </div>

      <div class="col-sm-6 col-xs-12">
        <div class="errorInfo">
          <h1 class="mb-4 font-weight-bold display-4 font-size-48 font-dosis">¡Ups!</h1>
          <p class="mb-7 font-size-28 text-dark">Lo sentimos, la página que buscas no se encuentra disponible.</p>

          <form action="search-result.html" method="GET" role="form" class="homeContactContent errorSpace">
            <div class="form-group form-group-icon mb-6">
              <i class="fa fa-search mt-1"></i>
              <input type="text" name="q" class="form-control" placeholder="Buscar animales, refugios...">
            </div>

            <div class="form-group">
              <NuxtLink to="/" class="btn btn-danger text-uppercase shadow-sm">Volver al Inicio</NuxtLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>


  </div>
</template>

<script setup>
useHead({
  title: 'Página No Encontrada - Colitas Abandonadas - Colitas Abandonadas'
})

onMounted(() => {
  if (process.client) {
    setTimeout(() => {
      if (window.WOW) new window.WOW().init()
    }, 100)
  }
})
</script>
