<template>
  <div class="main-wrapper">



  <!-- ====================================
  ———	BREADCRUMB
  ===================================== -->
  <section class="breadcrumb-bg" style="background-image: url(/background/page-title-bg-img.jpg); ">
    <div class="container">
      <div class="breadcrumb-holder">
        <div>
          <h1 class="breadcrumb-title">Preguntas Frecuentes</h1>
          <ul class="breadcrumb breadcrumb-transparent">
            <li class="breadcrumb-item">
              <NuxtLink class="text-white" to="/">Inicio</NuxtLink>
            </li>
            <li class="breadcrumb-item text-white active" aria-current="page">Preguntas Frecuentes</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

<!-- ====================================
———	FAQ
===================================== -->
<section class="py-8 py-md-10">
  <div class="container">
    <div class="row">
      <div class="col-lg-9 col-sm-8 col-xs-12">
        <div class="accordion" id="accordionOne">
          <div class="card">
            <div class="card-header bg-warning" id="headingOne">
              <h5 class="icon-bg" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                <span>¿Cómo funciona el proceso de adopción?</span>
              </h5>
            </div>

            <div id="collapseOne" class="collapse show shadow-sm rounded-sm" aria-labelledby="headingOne" data-parent="#accordionOne">
              <div class="card-body">
                <p class="mb-6">El proceso de adopción en Colitas Abandonadas es simple pero riguroso. Primero, debes registrarte en el portal y completar un formulario de adopción. Luego, nuestro equipo revisará tu solicitud y te contactará para una entrevista.</p>

                <p class="mb-6">Una vez aprobada tu solicitud, deberás firmar una carta responsiva donde te comprometes a cuidar adecuadamente del animal. También se requiere identificación completa y verificación de tu información personal.</p>

                <p class="mb-0">Después de la adopción, nuestro sistema de seguimiento te solicitará fotos periódicas del animal para validar su bienestar y asegurar que está recibiendo el cuidado adecuado.</p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header bg-success" id="headingTwo">
              <h5 class="icon-bg collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                <span>¿Qué son las cartas responsivas?</span>
              </h5>
            </div>

            <div id="collapseTwo" class="collapse shadow-sm rounded-sm" aria-labelledby="headingTwo" data-parent="#accordionOne">
              <div class="card-body">
                <p class="mb-6">Las cartas responsivas son documentos legales donde el adoptante se compromete formalmente a:</p>

                <p class="mb-6">- Proporcionar alimento adecuado y agua fresca diariamente<br>
                - Brindar atención veterinaria cuando sea necesario<br>
                - Mantener al animal en un ambiente seguro y limpio<br>
                - No abandonar ni maltratar al animal<br>
                - Permitir el seguimiento mediante fotos periódicas</p>

                <p class="mb-0">Este documento es parte de nuestro compromiso con el bienestar animal y garantiza que cada adopción sea responsable.</p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header bg-danger" id="headingThree">
              <h5 class="icon-bg collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                <span>¿Cómo funciona el sistema de seguimiento?</span>
              </h5>
            </div>

            <div id="collapseThree" class="collapse shadow-sm rounded-sm" aria-labelledby="headingThree" data-parent="#accordionOne">
              <div class="card-body">
                <p class="mb-6">Nuestro sistema de seguimiento es una herramienta esencial para garantizar el bienestar de los animales adoptados. Después de la adopción, recibirás recordatorios automáticos para enviar fotos del animal en intervalos regulares (mensuales durante los primeros 6 meses, luego trimestrales).</p>
              
                <p class="mb-6">Las fotos deben mostrar claramente al animal en su entorno, permitiéndonos verificar su estado físico, condición corporal y ambiente. Este sistema nos ayuda a detectar tempranamente cualquier problema y brindar apoyo cuando sea necesario.</p>
              
                <p class="mb-0">Si no se reciben las fotos en el tiempo establecido, nuestro equipo se pondrá en contacto contigo para asegurar que todo esté bien. Este seguimiento es parte de nuestro compromiso con la adopción responsable.</p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header bg-info" id="headingFour">
              <h5 class="icon-bg collapsed" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                <span>¿Cómo puedo donar de forma segura?</span>
              </h5>
            </div>

            <div id="collapseFour" class="collapse shadow-sm rounded-sm" aria-labelledby="headingFour" data-parent="#accordionOne">
              <div class="card-body">
                <p class="mb-6">Todas las donaciones en Colitas Abandonadas son completamente transparentes. Puedes donar directamente a refugios verificados a través de nuestro portal, y cada donación es rastreada desde el origen hasta su destino final.</p>
              
                <p class="mb-6">Nuestro sistema garantiza que las donaciones lleguen directamente a los animales y sus refugios, sin intermediarios que puedan lucrar con el sufrimiento animal. Todos los refugios en nuestro directorio están verificados y auditados regularmente.</p>
              
                <p class="mb-0">Puedes ver el impacto de tu donación a través de reportes periódicos que muestran cómo se utilizaron los fondos. La transparencia es fundamental para nosotros.</p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header bg-purple" id="headingFive">
              <h5 class="icon-bg collapsed" data-toggle="collapse" data-target="#collapseFive" aria-expanded="false"
                aria-controls="collapseFive">
                <span>How do I list multiple rooms?</span>
              </h5>
            </div>
            <div id="collapseFive" class="collapse shadow-sm rounded-sm" aria-labelledby="headingFive" data-parent="#accordionOne"style="">
              <div class="card-body">
                <p class="mb-6">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of
                  classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at
                  Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum
                  passage, and going through the cites of the word in classical literature, discovered the undoubtable source.</p>
              
                <p class="mb-6">Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes
                  of
                  Good and Evil)
                  by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance.
                  The
                  first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>
              
                <p class="mb-0">There are many variations of passages of Lorem Ipsum available, but the majority have suffered
                  alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you
                  are going to use a passage of Lorem </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-sm-4 col-xs-12">
        <aside>
          <div class="">
            <div class="bg-warning rounded-top p-2">
              <div class="section-title">
                <h3 class="text-white font-weight-bold pl-0">Ask Questions?</h3>
              </div>
            </div>

            <div class="border rounded-bottom border-top-0">
              <div class="p-3">
                <form action="#" method="POST" role="form">
                  <div class="form-group form-group-icon">
                    <i class="fa fa-user"></i>
                    <input type="text" class="form-control border-warning" placeholder="First name" required="">
                  </div>

                  <div class="form-group form-group-icon">
                    <i class="fa fa-envelope "></i>
                    <input type="email" class="form-control border-success" placeholder="Email address" required="">
                  </div>

                  <div class="form-group form-group-icon">
                    <i class="fa fa-comments "></i>
                    <textarea class="form-control border-info" placeholder="Write message" rows="5"></textarea>
                  </div>

                  <div class="text-right">
                    <button type="submit" class="btn btn-danger text-uppercase">Send Message</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</section>


  </div>
</template>

<script setup>
useHead({
  title: 'Preguntas Frecuentes - Colitas Abandonadas - Colitas Abandonadas'
})

onMounted(() => {
  if (process.client) {
    setTimeout(() => {
      if (window.WOW) new window.WOW().init()
    }, 100)
  }
})
</script>
