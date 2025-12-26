<template>
  <div class="main-wrapper">



  <!-- ====================================
  ———	BREADCRUMB
  ===================================== -->
  <section class="breadcrumb-bg" style="background-image: url(/background/page-title-bg-img.jpg); ">
    <div class="container">
      <div class="breadcrumb-holder">
        <div>
          <h1 class="breadcrumb-title">Galería de Adopciones</h1>
          <ul class="breadcrumb breadcrumb-transparent">
            <li class="breadcrumb-item">
              <NuxtLink class="text-white" to="/">Inicio</NuxtLink>
            </li>
            <li class="breadcrumb-item text-white active" aria-current="page">Galería de Fotos</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

<!-- ====================================
———	GALLERY
===================================== -->
<section class="py-8 py-md-10">
	<div class="container">
		<div class="d-flex justify-content-center">
			<div id="filters" class="button-group">
				<button class="button is-checked" data-filter="*">Ver Todos</button>
				<button class="button" data-filter=".charity">Perros</button>
				<button class="button" data-filter=".nature">Gatos</button>
				<button class="button" data-filter=".children">Otros</button>
			</div>
		</div>

		<div id="gallery-grid">
			<div class="row grid">
				<div class="col-md-4 col-lg-3 col-xs-12 element-item nature">
					<div class="media media-hoverable justify-content-center">
						<div class="position-relative w-100">
							<img class="media-img w-100 lazyestload" data-src="/gallery/gallery-img1.jpg"
							 alt="Gato adoptado - Historia de éxito de adopción">
							<a class="media-img-overlay" data-fancybox="gallery" href="/gallery/gallery-lg-img1.jpg">
								<div class="btn btn-squre">
									<i class="fa fa-search-plus"></i>
								</div>
							</a>
						</div>
					</div>
				</div>
		
				<div class="col-md-4 col-lg-3 col-xs-12 element-item charity">
					<div class="media media-hoverable justify-content-center">
						<div class="position-relative w-100">
							<img class="media-img w-100 lazyestload" data-src="/gallery/gallery-img2.jpg"
							 alt="Perro adoptado - Familia feliz con su nueva mascota">
							<a class="media-img-overlay" data-fancybox="gallery" href="/gallery/gallery-lg-img2.jpg">
								<div class="btn btn-squre">
									<i class="fa fa-search-plus"></i>
								</div>
							</a>
						</div>
					</div>
				</div>
		
				<div class="col-md-4 col-lg-3 col-xs-12 element-item children nature">
					<div class="media media-hoverable justify-content-center">
						<div class="position-relative w-100">
							<img class="media-img w-100 lazyestload" data-src="/gallery/gallery-img3.jpg"
							 alt="Adopción exitosa - Mascota en su nuevo hogar">
							<a class="media-img-overlay" data-fancybox="gallery" href="/gallery/gallery-lg-img3.jpg">
								<div class="btn btn-squre">
									<i class="fa fa-search-plus"></i>
								</div>
							</a>
						</div>
					</div>
				</div>
		
				<div class="col-md-4 col-lg-3 col-xs-12 element-item children charity">
					<div class="media media-hoverable justify-content-center">
						<div class="position-relative w-100">
							<img class="media-img w-100 lazyestload" data-src="/gallery/gallery-img4.jpg"
							 alt="Perro rescatado - Adopción responsable">
							<a class="media-img-overlay" data-fancybox="gallery" href="/gallery/gallery-lg-img4.jpg">
								<div class="btn btn-squre">
									<i class="fa fa-search-plus"></i>
								</div>
							</a>
						</div>
					</div>
				</div>
		
				<div class="col-md-4 col-lg-3 col-xs-12 element-item nature">
					<div class="media media-hoverable justify-content-center">
						<div class="position-relative w-100">
							<img class="media-img w-100 lazyestload" data-src="/gallery/gallery-img5.jpg"
							 alt="Gato adoptado - Nueva familia">
							<a class="media-img-overlay" data-fancybox="gallery" href="/gallery/gallery-lg-img5.jpg">
								<div class="btn btn-squre">
									<i class="fa fa-search-plus"></i>
								</div>
							</a>
						</div>
					</div>
				</div>
		
				<div class="col-md-4 col-lg-3 col-xs-12 element-item children charity">
					<div class="media media-hoverable justify-content-center">
						<div class="position-relative w-100">
							<img class="media-img w-100 lazyestload" data-src="/gallery/gallery-img6.jpg"
							 alt="Adopción exitosa - Perro en su hogar definitivo">
							<a class="media-img-overlay" data-fancybox="gallery" href="/gallery/gallery-lg-img6.jpg">
								<div class="btn btn-squre">
									<i class="fa fa-search-plus"></i>
								</div>
							</a>
						</div>
					</div>
				</div>
		
				<div class="col-md-4 col-lg-3 col-xs-12 element-item children charity">
					<div class="media media-hoverable justify-content-center">
						<div class="position-relative w-100">
							<img class="media-img w-100 lazyestload" data-src="/gallery/gallery-img7.jpg"
							 alt="Mascota adoptada - Historia de éxito">
							<a class="media-img-overlay" data-fancybox="gallery" href="/gallery/gallery-lg-img7.jpg">
								<div class="btn btn-squre">
									<i class="fa fa-search-plus"></i>
								</div>
							</a>
						</div>
					</div>
				</div>
		
				<div class="col-md-4 col-lg-3 col-xs-12 element-item nature">
					<div class="media media-hoverable justify-content-center">
						<div class="position-relative w-100">
							<img class="media-img w-100 lazyestload" data-src="/gallery/gallery-img8.jpg"
							 alt="Gato rescatado - Adopción responsable">
							<a class="media-img-overlay" data-fancybox="gallery" href="/gallery/gallery-lg-img8.jpg">
								<div class="btn btn-squre">
									<i class="fa fa-search-plus"></i>
								</div>
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
  title: 'Galería de Fotos - Colitas Abandonadas - Colitas Abandonadas'
})

onMounted(() => {
  if (process.client) {
    setTimeout(() => {
      // Initialize WOW.js
      if (window.WOW) {
        new window.WOW().init()
      }
      
      // Initialize Isotope for gallery filtering
      if (window.jQuery && window.jQuery.fn.isotope) {
        const $grid = window.jQuery('#gallery-grid')
        $grid.isotope({
          itemSelector: '.element-item',
          layoutMode: 'fitRows'
        })
        
        // Filter buttons
        window.jQuery('#filters .button').on('click', function() {
          const filterValue = window.jQuery(this).attr('data-filter')
          $grid.isotope({ filter: filterValue })
          
          // Update active button
          window.jQuery('#filters .button').removeClass('is-checked')
          window.jQuery(this).addClass('is-checked')
        })
      }
      
      // Initialize Fancybox for image lightbox
      if (window.jQuery && window.jQuery.fn.fancybox) {
        window.jQuery('[data-fancybox="gallery"]').fancybox({
          buttons: ['slideShow', 'thumbs', 'close'],
          loop: true
        })
      }
    }, 500)
  }
})
</script>
