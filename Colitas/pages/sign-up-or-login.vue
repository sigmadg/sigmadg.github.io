<template>
  <div class="main-wrapper">



  <!-- ====================================
  ———	BREADCRUMB
  ===================================== -->
  <section class="breadcrumb-bg" style="background-image: url(/background/page-title-bg-img.jpg); ">
    <div class="container">
      <div class="breadcrumb-holder">
        <div>
          <h1 class="breadcrumb-title">Registro / Iniciar Sesión</h1>
          <ul class="breadcrumb breadcrumb-transparent">
            <li class="breadcrumb-item">
              <NuxtLink class="text-white" to="/">Inicio</NuxtLink>
            </li>
            <li class="breadcrumb-item text-white active" aria-current="page">Registro / Iniciar Sesión</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

<!-- ====================================
———	SIGN-UP OR LOG-IN
===================================== -->
<section class="py-8 py-md-10">
  <div class="container">
    <div class="row">
      <div class="col-sm-6 offset-lg-2 col-lg-4">
        <div class="mb-4 mb-sm-0">
          <div class="bg-warning rounded-top p-2">
            <h3 class="text-white font-weight-bold mb-0 ml-2">Crear una Cuenta</h3>
          </div>

          <div class="border rounded-bottom-sm border-top-0">
            <div class="p-3">
              <form action="#" method="POST" role="form">
                <div class="form-group form-group-icon">
                  <input type="text" class="form-control border" placeholder="Nombre completo" required="">
                </div>

                <div class="form-group form-group-icon">
                  <input type="email" class="form-control border" placeholder="Correo electrónico" required="">
                </div>

                <div class="form-group form-group-icon">
                  <input type="tel" class="form-control border" placeholder="Teléfono" required="">
                </div>

                <div class="form-group form-group-icon">
                  <input type="password" class="form-control border" placeholder="Contraseña" required="">
                </div>

                <div class="form-group form-group-icon">
                  <input type="password" class="form-control border" placeholder="Re-Contraseña" required="">
                </div>

                <div class="form-group">
                  <button type="submit" class="btn btn-danger text-uppercase w-100">Registrarse</button>
                </div>

                <div class="form-group text-center text-secondary mb-0">
                  <p >¿Ya tienes una cuenta? <a class="mb-0 text-danger text-danger"href="#">Inicia sesión</a></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-6 col-lg-4">
        <div class="mb-4 mb-sm-0">
          <div class="bg-warning rounded-top p-2">
            <h3 class="text-white font-weight-bold mb-0 ml-2">Iniciar Sesión</h3>
          </div>
  
          <div class="border rounded-bottom-sm border-top-0">
            <div class="p-3">
              <form action="#" method="POST" role="form">
                <div class="form-group form-group-icon">
                  <input type="email" class="form-control border" placeholder="Correo electrónico" required="">
                </div>

                <div class="form-group form-group-icon">
                  <input type="password" class="form-control border" placeholder="Contraseña" required="">
                </div>

                <div class="form-group">
                  <button type="submit" class="btn btn-danger text-uppercase w-100">Iniciar Sesión</button>
                </div>

                <div class="form-group text-center text-secondary mb-0">
                  <a class="text-danger" href="#">¿Olvidaste tu contraseña?</a>
                </div>
              </form>
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
  title: 'Registro / Iniciar Sesión - Colitas Abandonadas - Colitas Abandonadas'
})

onMounted(() => {
  if (process.client) {
    setTimeout(() => {
      if (window.WOW) new window.WOW().init()
    }, 100)
  }
})
</script>
