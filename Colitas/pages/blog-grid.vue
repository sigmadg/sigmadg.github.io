<template>
  <div class="main-wrapper">



  <!-- ====================================
  ———	BREADCRUMB
  ===================================== -->
  <section class="breadcrumb-bg" style="background-image: url(/background/page-title-bg-img.jpg); ">
    <div class="container">
      <div class="breadcrumb-holder">
        <div>
          <h1 class="breadcrumb-title">Noticias</h1>
          <ul class="breadcrumb breadcrumb-transparent">
            <li class="breadcrumb-item">
              <NuxtLink class="text-white" to="/">Inicio</NuxtLink>
            </li>
            <li class="breadcrumb-item text-white active" aria-current="page">Noticias</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

<!-- ====================================
———	BLOG GRID
===================================== -->
<section class="py-8 py-md-10">
  <div class="container">
    <div class="row">
			<div class="col-md-6 col-lg-4">
        <div class="card">
					<div class="position-relative">
	          <NuxtLink to="/blog-single">
	            <img class="card-img-top" src="/blog/blog-course-1.jpg" alt="Nuevo Sistema de Seguimiento">
						</NuxtLink>
            <div class="card-img-overlay p-0">
              <span class="badge badge-rounded badge-warning m-4"> 10 <br> Jul</span>
            </div>
					</div>

          <div class="card-body border-top-5 px-3 rounded-bottom border-warning">
            <h3 class="card-title">
              <NuxtLink class="text-warning text-capitalize d-block text-truncate" to="/blog-single">Nuevo Sistema de Seguimiento</NuxtLink>
            </h3>
            <ul class="list-unstyled d-flex mb-1">
              <li class="mr-2">
								<NuxtLink class="text-muted" to="/blog-single">
									<i class="fa fa-user mr-2" aria-hidden="true"></i>Equipo Colitas
								</NuxtLink>
              </li>
              <li class="mr-2">
								<NuxtLink class="text-muted" to="/blog-single">
									<i class="fa fa-calendar mr-2" aria-hidden="true"></i>Hace 2 días
								</NuxtLink>
              </li>
            </ul>
            <p class="mb-2">Implementamos un nuevo sistema de seguimiento con fotos recurrentes para garantizar el bienestar de todos los animales adoptados.</p>
            <NuxtLink class="btn btn-link text-hover-warning pl-0" to="/blog-single">
              <i class="fa fa-angle-double-right mr-1" aria-hidden="true"></i> Leer Más
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4">
        <div class="card">
					<div class="position-relative">
						<NuxtLink to="/blog-single">
	            <img class="card-img-top" src="/blog/blog-course-2.jpg" alt="Historia de Éxito: Max">
						</NuxtLink>
            <div class="card-img-overlay p-0">
              <span class="badge badge-success badge-rounded m-4"> 14 <br> Jun</span>
            </div>
					</div>

          <div class="card-body border-top-5 px-3 rounded-bottom border-success">
            <h3 class="card-title">
              <NuxtLink class="text-success text-capitalize d-block text-truncate" to="/blog-single">Historia de Éxito: Max Encontró su Hogar</NuxtLink>
            </h3>
						<ul class="list-unstyled d-flex mb-1">
              <li class="mr-2">
								<NuxtLink class="text-muted" to="/blog-single">
									<i class="fa fa-user mr-2" aria-hidden="true"></i>Familia González
								</NuxtLink>
              </li>
              <li class="mr-2">
								<NuxtLink class="text-muted" to="/blog-single">
									<i class="fa fa-comments-o mr-2" aria-hidden="true"></i>4 Comments
								</NuxtLink>
              </li>
            </ul>
            <p class="mb-2"> It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
            <NuxtLink class="btn btn-link text-hover-success pl-0" to="/blog-single">
              <i class="fa fa-angle-double-right mr-1" aria-hidden="true"></i> Read More
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4">
        <div class="card">
					<div class="position-relative">
						<NuxtLink to="/blog-single">
	            <img class="card-img-top" src="/blog/blog-course-3.jpg" alt="Animal disponible para adopción">
						</NuxtLink>
	          <div class="card-img-overlay p-0">
	            <span class="badge badge-danger badge-rounded m-4"> 14 <br> Jun</span>
	          </div>
					</div>

          <div class="card-body border-top-5 px-3 rounded-bottom border-danger">
            <h3 class="card-title">
              <NuxtLink class="text-danger text-capitalize d-block text-truncate" to="/blog-single">Vestibulum congue massa vitae.</NuxtLink>
            </h3>
						<ul class="list-unstyled d-flex mb-1">
              <li class="mr-2">
								<NuxtLink class="text-muted" to="/blog-single">
									<i class="fa fa-user mr-2" aria-hidden="true"></i>Jone Doe
								</NuxtLink>
              </li>
              <li class="mr-2">
								<NuxtLink class="text-muted" to="/blog-single">
									<i class="fa fa-comments-o mr-2" aria-hidden="true"></i>4 Comments
								</NuxtLink>
              </li>
            </ul>
            <p class="mb-2"> It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
            <NuxtLink class="btn btn-link text-hover-danger pl-0" to="/blog-single">
              <i class="fa fa-angle-double-right mr-1" aria-hidden="true"></i> Read More
            </NuxtLink>
          </div>
        </div>
      </div>

			<div class="col-md-6 col-lg-4">
        <div class="card">
					<div class="position-relative">
						<NuxtLink to="/blog-single">
	            <img class="card-img-top" src="/blog/blog-course-4.jpg" alt="Animal disponible para adopción">
						</NuxtLink>
	          <div class="card-img-overlay p-0">
	            <span class="badge badge-info badge-rounded m-4"> 14 <br> Jun</span>
	          </div>
					</div>

          <div class="card-body border-top-5 px-3 rounded-bottom border-info">
            <h3 class="card-title">
              <NuxtLink class="text-info text-capitalize d-block text-truncate" to="/blog-single">Vestibulum congue massa vitae.</NuxtLink>
            </h3>
						<ul class="list-unstyled d-flex mb-1">
              <li class="mr-2">
								<NuxtLink class="text-muted" to="/blog-single">
									<i class="fa fa-user mr-2" aria-hidden="true"></i>Jone Doe
								</NuxtLink>
              </li>
              <li class="mr-2">
								<NuxtLink class="text-muted" to="/blog-single">
									<i class="fa fa-comments-o mr-2" aria-hidden="true"></i>4 Comments
								</NuxtLink>
              </li>
            </ul>
            <p class="mb-2"> It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
            <NuxtLink class="btn btn-link text-hover-info pl-0" to="/blog-single">
              <i class="fa fa-angle-double-right mr-1" aria-hidden="true"></i> Read More
            </NuxtLink>
          </div>
        </div>
      </div>

			<div class="col-md-6 col-lg-4">
        <div class="card">
					<div class="position-relative">
						<NuxtLink to="/blog-single">
	            <img class="card-img-top" src="/blog/blog-course-3.jpg" alt="Animal disponible para adopción">
						</NuxtLink>
	          <div class="card-img-overlay p-0">
	            <span class="badge badge-purple badge-rounded m-4"> 14 <br> Jun</span>
	          </div>
					</div>

          <div class="card-body border-top-5 px-3 rounded-bottom border-purple">
            <h3 class="card-title">
              <NuxtLink class="text-purple text-capitalize d-block text-truncate" to="/blog-single">Vestibulum congue massa vitae.</NuxtLink>
            </h3>
						<ul class="list-unstyled d-flex mb-1">
              <li class="mr-2">
								<NuxtLink class="text-muted" to="/blog-single">
									<i class="fa fa-user mr-2" aria-hidden="true"></i>Jone Doe
								</NuxtLink>
              </li>
              <li class="mr-2">
								<NuxtLink class="text-muted" to="/blog-single">
									<i class="fa fa-comments-o mr-2" aria-hidden="true"></i>4 Comments
								</NuxtLink>
              </li>
            </ul>
            <p class="mb-2"> It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
            <NuxtLink class="btn btn-link text-hover-purple pl-0" to="/blog-single">
              <i class="fa fa-angle-double-right mr-1" aria-hidden="true"></i> Read More
            </NuxtLink>
          </div>
        </div>
      </div>

			<div class="col-md-6 col-lg-4">
        <div class="card">
					<div class="position-relative">
						<NuxtLink to="/blog-single">
	            <img class="card-img-top" src="/blog/blog-course-4.jpg" alt="Animal disponible para adopción">
						</NuxtLink>
	          <div class="card-img-overlay p-0">
	            <span class="badge badge-pink badge-rounded m-4"> 14 <br> Jun</span>
	          </div>
					</div>

          <div class="card-body border-top-5 px-3 rounded-bottom border-pink">
            <h3 class="card-title">
              <NuxtLink class="text-pink text-capitalize d-block text-truncate" to="/blog-single">Vestibulum congue massa vitae.</NuxtLink>
            </h3>
						<ul class="list-unstyled d-flex mb-1">
              <li class="mr-2">
								<NuxtLink class="text-muted" to="/blog-single">
									<i class="fa fa-user mr-2" aria-hidden="true"></i>Jone Doe
								</NuxtLink>
              </li>
              <li class="mr-2">
								<NuxtLink class="text-muted" to="/blog-single">
									<i class="fa fa-comments-o mr-2" aria-hidden="true"></i>4 Comments
								</NuxtLink>
              </li>
            </ul>
            <p class="mb-2"> It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
            <NuxtLink class="btn btn-link text-hover-pink pl-0" to="/blog-single">
              <i class="fa fa-angle-double-right mr-1" aria-hidden="true"></i> Read More
            </NuxtLink>
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
  title: 'Noticias - Colitas Abandonadas - Colitas Abandonadas'
})

onMounted(() => {
  if (process.client) {
    setTimeout(() => {
      if (window.WOW) new window.WOW().init()
    }, 100)
  }
})
</script>
