<template>
  <div class="main-wrapper">



  <!-- ====================================
  ———	BREADCRUMB
  ===================================== -->
  <section class="breadcrumb-bg" style="background-image: url(/background/page-title-bg-img.jpg); ">
    <div class="container">
      <div class="breadcrumb-holder">
        <div>
          <h1 class="breadcrumb-title">Resultados de Búsqueda</h1>
          <ul class="breadcrumb breadcrumb-transparent">
            <li class="breadcrumb-item">
              <NuxtLink class="text-white" to="/">Inicio</NuxtLink>
            </li>
            <li class="breadcrumb-item text-white active" aria-current="page">Resultados de Búsqueda</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

<!-- ====================================
———	SEARCH RESULT
===================================== -->
<section class="pt-7 pb-7 pt-md-10">
	<div class="container">
		<form class="shadow-sm rounded mb-8">
			<div class="input-group input-group-lg">
				<div class="input-group-prepend">
					<span class="input-group-text bg-light border-0 px-4">
						<i class="fa fa-search text-muted font-size-18" aria-hidden="true"></i>
					</span>
				</div>
				<input type="text" class="form-control bg-light border-0 form-control-lg" aria-label="Buscar"
				 placeholder="Buscar animales, refugios, veterinarios..." required="">
				<div class="input-group-append">
					<button type="submit" class="btn shadow-none btn-lg btn-danger text-uppercase">Buscar</button>
				</div>
			</div>
		</form>

		<h2 class="text-capitalize text-muted font-weight-bold mb-0">6 resultados de búsqueda para "perro"</h2>
	</div>
</section>

<section class="pb-md-10 pb-6">
	<div class=" container">
		<div class="list-fullwidth">
			<div class="media media-list-view mb-5">
				<a class="media-img" href="index.html#courses">
					<img src="/courses/courses-img1.jpg" alt="Max - Perro en Adopción">
					<div class="media-img-overlay">
						<span class="badge badge-warning badge-rounded-circle">Disponible</span>
					</div>
				</a>
		
				<div class="media-body">
					<h3>
						<a class="text-warning" href="index.html#courses">Max - Perro Rescatado</a>
					</h3>
		
					<ul class="list-unstyled d-flex text-muted mb-3">
						<li class="mr-3">
							<i class="fa fa-calendar-o mr-2" aria-hidden="true"></i>Edad: 2 años
						</li>
						<li>
							<i class="fa fa-paw mr-2" aria-hidden="true"></i>Tamaño: Mediano
						</li>
					</ul>
		
					<p class="text-justify mb-lg-2">Max es un perro juguetón y cariñoso, ideal para familias activas. Fue rescatado de la calle y está buscando un hogar lleno de amor. Se lleva bien con niños y otros animales.</p>
		
					<div class="">
						<a href="index.html#courses" class="btn btn-sm btn-white text-uppercase mb-1 mr-4 btn-hover-warning">
							<i class="fa fa-heart mr-2" aria-hidden="true"></i>Adoptar
						</a>
						<a class="btn btn-link text-hover-warning text-underline text-underline pl-0" href="index.html#courses">
							<i class="fa fa-angle-double-right mr-1" aria-hidden="true"></i> Más información
						</a>
					</div>
				</div>
			</div>
		
			<div class="media media-list-view mb-5">
				<a class="media-img" href="index.html#courses">
					<img src="/features/features-course-2.jpg" alt="Image">
					<div class="media-img-overlay">
						<span class="badge badge-success badge-rounded-circle">Disponible</span>
					</div>
				</a>
		
				<div class="media-body">
					<h3 class="mb-3 mb-lg-2 mb-xl-3">
						<a class="text-success text-capitalize font-weight-bold" href="index.html#courses">Phasellus
							convallis eros.</a>
					</h3>
		
					<ul class="list-unstyled d-flex text-muted mb-2">
						<li class="mr-3">
							<i class="fa fa-calendar-o mr-2" aria-hidden="true"></i>Edad: Variable
						</li>
						<li>
							<i class="fa fa-clock-o mr-2" aria-hidden="true"></i>Disponible
						</li>
					</ul>
		
					<p class="text-justify mb-lg-2">Animal disponible para adopción responsable. Proceso verificado con seguimiento continuo.</p>
		
					<div class="">
						<a href="index.html#courses" class="btn btn-sm btn-white text-uppercase mb-1 mr-4 btn-hover-success">
							<i class="fa fa-heart mr-2" aria-hidden="true"></i>Adoptar
						</a>
						<a class="btn btn-link text-hover-success text-underline pl-0" href="index.html#courses">
							<i class="fa fa-angle-double-right mr-1" aria-hidden="true"></i> More
						</a>
					</div>
				</div>
			</div>
		
			<div class="media media-list-view mb-5">
				<a class="media-img" href="index.html#courses">
					<img src="/features/features-course-3.jpg" alt="Image">
					<div class="media-img-overlay">
						<span class="badge badge-danger badge-rounded-circle">Disponible</span>
					</div>
				</a>
		
				<div class="media-body">
					<h3 class="mb-3 mb-lg-2 mb-xl-3">
						<a class="text-danger text-capitalize font-weight-bold" href="index.html#courses">Phasellus convallis
							eros.</a>
					</h3>
		
					<ul class="list-unstyled d-flex text-muted mb-2">
						<li class="mr-3">
							<i class="fa fa-calendar-o mr-2" aria-hidden="true"></i>Edad: Variable
						</li>
						<li>
							<i class="fa fa-clock-o mr-2" aria-hidden="true"></i>Disponible
						</li>
					</ul>
		
					<p class="text-justify mb-lg-2">Animal disponible para adopción responsable. Proceso verificado con seguimiento continuo.</p>
		
					<div class="">
						<a href="index.html#courses" class="btn btn-sm btn-white text-uppercase mb-1 mr-4 btn-hover-danger">
							<i class="fa fa-heart mr-2" aria-hidden="true"></i>Adoptar
						</a>
						<a class="btn btn-link text-hover-danger text-underline pl-0" href="index.html#courses">
							<i class="fa fa-angle-double-right mr-1" aria-hidden="true"></i> More
						</a>
					</div>
				</div>
			</div>
		
			<div class="media media-list-view mb-5">
				<a class="media-img" href="index.html#courses">
					<img src="/features/features-course-4.jpg" alt="Image">
					<div class="media-img-overlay">
						<span class="badge badge-info badge-rounded-circle">Disponible</span>
					</div>
				</a>
		
				<div class="media-body">
					<h3 class="mb-3 mb-lg-2 mb-xl-3">
						<a class="text-info text-capitalize font-weight-bold" href="index.html#courses">Phasellus convallis
							eros.</a>
					</h3>
		
					<ul class="list-unstyled d-flex text-muted mb-2">
						<li class="mr-3">
							<i class="fa fa-calendar-o mr-2" aria-hidden="true"></i>Edad: Variable
						</li>
						<li>
							<i class="fa fa-clock-o mr-2" aria-hidden="true"></i>Disponible
						</li>
					</ul>
		
					<p class="text-justify mb-lg-2">Animal disponible para adopción responsable. Proceso verificado con seguimiento continuo.</p>
		
					<div class="">
						<a href="index.html#courses" class="btn btn-sm btn-white text-uppercase mb-1 mr-4 btn-hover-info">
							<i class="fa fa-heart mr-2" aria-hidden="true"></i>Adoptar
						</a>
						<a class="btn btn-link text-hover-info text-underline pl-0" href="index.html#courses">
							<i class="fa fa-angle-double-right mr-1" aria-hidden="true"></i> More
						</a>
					</div>
				</div>
			</div>
		
			<div class="media media-list-view mb-5">
				<a class="media-img" href="index.html#courses">
					<img src="/features/features-course-1.jpg" alt="Image">
					<div class="media-img-overlay">
						<span class="badge badge-purple badge-rounded-circle">Disponible</span>
					</div>
				</a>
		
				<div class="media-body">
					<h3 class="mb-3 mb-lg-2 mb-xl-3">
						<a class="text-purple text-capitalize font-weight-bold" href="index.html#courses">Phasellus convallis
							eros.</a>
					</h3>
		
					<ul class="list-unstyled d-flex text-muted mb-2">
						<li class="mr-3">
							<i class="fa fa-calendar-o mr-2" aria-hidden="true"></i>Edad: Variable
						</li>
						<li>
							<i class="fa fa-clock-o mr-2" aria-hidden="true"></i>Disponible
						</li>
					</ul>
		
					<p class="text-justify mb-lg-2">Animal disponible para adopción responsable. Proceso verificado con seguimiento continuo.</p>
		
					<div class="">
						<a href="index.html#courses" class="btn btn-sm btn-white text-uppercase mb-1 mr-4 btn-hover-purple">
							<i class="fa fa-heart mr-2" aria-hidden="true"></i>Adoptar
						</a>
						<a class="btn btn-link text-hover-purple text-underline pl-0" href="index.html#courses">
							<i class="fa fa-angle-double-right mr-1" aria-hidden="true"></i> More
						</a>
					</div>
				</div>
			</div>
		
			<div class="media media-list-view mb-5">
				<a class="media-img" href="index.html#courses">
					<img src="/features/features-course-2.jpg" alt="Image">
					<div class="media-img-overlay">
						<span class="badge badge-pink badge-rounded-circle">Disponible</span>
					</div>
				</a>
		
				<div class="media-body">
					<h3 class="mb-3 mb-lg-2 mb-xl-3">
						<a class="text-pink text-capitalize font-weight-bold" href="index.html#courses">Phasellus convallis
							eros.</a>
					</h3>
		
					<ul class="list-unstyled d-flex text-muted mb-2">
						<li class="mr-3">
							<i class="fa fa-calendar-o mr-2" aria-hidden="true"></i>Edad: Variable
						</li>
						<li>
							<i class="fa fa-clock-o mr-2" aria-hidden="true"></i>Disponible
						</li>
					</ul>
		
					<p class="text-justify mb-lg-2">Animal disponible para adopción responsable. Proceso verificado con seguimiento continuo.</p>
		
					<div class="">
						<a href="index.html#courses" class="btn btn-sm btn-white text-uppercase mb-1 mr-4 btn-hover-pink">
							<i class="fa fa-heart mr-2" aria-hidden="true"></i>Adoptar
						</a>
						<a class="btn btn-link text-hover-pink text-underline pl-0" href="index.html#courses">
							<i class="fa fa-angle-double-right mr-1" aria-hidden="true"></i> More
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div class="mt-8">
		<!-- ====================================
———	PAGINATION
===================================== -->
<section class="py-5">
  <div class="container">
    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center align-items-center">
          <li class="page-item" ><a class="page-link" href="#">
            <i class="fa fa-arrow-left mr-1" aria-hidden="true"></i>
            Prev
          </a>
          </li>
          <li class="page-item" ><a class="page-link" href="#">1</a></li>
          <li class="page-item" ><a class="page-link" href="#">2</a></li>
          <li class="page-item" ><a class="page-link" href="#">3</a></li>
          <li class="page-item" ><a class="page-link" href="#">...</a></li>
          <li class="page-item" ><a class="page-link" href="#">15</a></li>
          <li class="page-item" ><a class="page-link" href="#">
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
  title: 'Resultados de Búsqueda - Colitas Abandonadas - Colitas Abandonadas'
})

onMounted(() => {
  if (process.client) {
    setTimeout(() => {
      if (window.WOW) new window.WOW().init()
    }, 100)
  }
})
</script>
