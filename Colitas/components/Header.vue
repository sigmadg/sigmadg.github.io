<template>
  <header class="header" id="pageTop">
    <!-- Top Color Bar -->
    <div class="color-bars">
      <div class="container-fluid">
        <div class="row">
          <div class="col color-bar bg-warning d-none d-md-block"></div>
          <div class="col color-bar bg-success d-none d-md-block"></div>
          <div class="col color-bar bg-danger d-none d-md-block"></div>
          <div class="col color-bar bg-info d-none d-md-block"></div>
          <div class="col color-bar bg-purple d-none d-md-block"></div>
          <div class="col color-bar bg-pink d-none d-md-block"></div>
          <div class="col color-bar bg-warning"></div>
          <div class="col color-bar bg-success"></div>
          <div class="col color-bar bg-danger"></div>
          <div class="col color-bar bg-info"></div>
          <div class="col color-bar bg-purple"></div>
          <div class="col color-bar bg-pink"></div>
        </div>
      </div>
    </div>

    <!-- Top Bar-->
    <div class="bg-stone top-bar">
      <div class="container">
        <div class="row">
          <div class="col-lg-7 d-none d-lg-block">
            <ul class="list-inline d-flex justify-content-xl-start align-items-center h-100 mb-0">
              <li>
                <span class="bg-warning icon-header mr-xl-2">
                  <i class="fa fa-envelope" aria-hidden="true"></i>
                </span>
                <a href="mailto:colitas.abandonadas@gmail.com" class="mr-lg-4 mr-xl-6 text-white opacity-80">colitas.abandonadas@gmail.com</a>
              </li>
              <li>
                <span class="bg-success icon-header mr-xl-2">
                  <i class="fa fa-phone" aria-hidden="true"></i>
                </span>
                <a href="tel:+10000000000" class="mr-lg-4 mr-xl-6 text-white opacity-80"> +1 00 0000 0000 </a>
              </li>
              <li class="text-white">
                <span class="bg-pink icon-header">
                  <i class="fa fa-clock-o" aria-hidden="true"></i>
                </span>
                <span class="opacity-80">Abierto 24 horas</span>
              </li>
            </ul>
          </div>

          <div class="col-lg-5">
            <ul class="list-inline d-flex mb-0 justify-content-xl-end justify-content-center align-items-center mr-xl-2">
              <li>
                <span class="bg-info icon-header mr-lg-0 mr-xl-1">
                  <i class="fa fa-globe" aria-hidden="true"></i>
                </span>
              </li>
              <li class="mr-3 mr-md-4 mr-lg-3 mr-xl-5 dropdown dropdown-sm">
                <button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown"
                  aria-haspopup="true" aria-expanded="false"> Idiomas </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <a class="dropdown-item" href="#">Inglés</a>
                  <a class="dropdown-item" href="#">Español</a>
                  <a class="dropdown-item" href="#">Esperanto</a>
                </div>
              </li>

              <li class="text-white mr-md-3 mr-lg-2 mr-xl-5">
                <span class="bg-purple icon-header mr-1 mr-md-2 mr-lg-1 mr-xl-2">
                  <i class="fa fa-unlock-alt text-white font-size-13" aria-hidden="true"></i>
                </span>
                <NuxtLink to="/sign-up-or-login" class="text-white font-weight-medium opacity-80">
                  Inicia de sesión
                </NuxtLink>
                <span class="text-white opacity-80">o</span>
                <NuxtLink to="/sign-up-or-login" class="text-white font-weight-medium opacity-80">Crea una cuenta</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Navbar -->
    <nav class="navbar navbar-expand-md navbar-scrollUp navbar-sticky navbar-white">
      <div class="container">
        <NuxtLink class="navbar-brand" to="/">
          <img class="d-inline-block" src="/logo-school.png" alt="Colitas Abandonadas">
        </NuxtLink>

        <button class="navbar-toggler py-2" type="button" data-toggle="collapse" data-target="#navbarContent"
          aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
          <i class="fa fa-bars"></i>
        </button>

        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav ml-lg-auto">
            <li class="nav-item bg-warning">
              <NuxtLink class="nav-link" :class="{ active: $route.path === '/' }" to="/">
                <i class="fa fa-home nav-icon" aria-hidden="true"></i>
                <span>Inicio</span>
              </NuxtLink>
            </li>

            <li class="nav-item dropdown bg-danger">
              <a class="nav-link dropdown-toggle" href="javascript:void(0)" role="button" data-toggle="dropdown">
                <i class="fa fa-heart nav-icon" aria-hidden="true"></i>
                <span>Adopta</span>
              </a>
              <ul class="dropdown-menu">
                <li>
                  <NuxtLink class="dropdown-item" to="/#courses">Animales Disponibles</NuxtLink>
                </li>
                <li>
                  <NuxtLink class="dropdown-item" to="/#teachers">Refugios Verificados</NuxtLink>
                </li>
                <li>
                  <NuxtLink class="dropdown-item" to="/#gallery">Galería de Adopciones</NuxtLink>
                </li>
                <li>
                  <NuxtLink class="dropdown-item" to="/contact-us">Contacto</NuxtLink>
                </li>
              </ul>
            </li>
            <li class="nav-separator"></li>

            <li class="nav-item dropdown mega-dropdown bg-success">
              <a class="nav-link dropdown-toggle" href="javascript:void(0)" role="button"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fa fa-file-text-o nav-icon" aria-hidden="true"></i>
                <span>Requisitos</span>
              </a>
              <div class="dropdown-menu mega-menu">
                <div class="row">
                  <div class="col-12 col-md-4">
                    <ul class="list-unstyled">
                      <li><strong>Proceso de Adopción</strong></li>
                      <li><NuxtLink class="dropdown-item" to="/#gallery">Cartas Responsivas</NuxtLink></li>
                      <li><NuxtLink class="dropdown-item" to="/#gallery">Identificación de Adoptantes</NuxtLink></li>
                      <li><NuxtLink class="dropdown-item" to="/#gallery">Requisitos para Adoptar</NuxtLink></li>
                    </ul>
                  </div>
                  <div class="col-12 col-md-4">
                    <ul class="list-unstyled">
                      <li><strong>Seguimiento</strong></li>
                      <li><NuxtLink class="dropdown-item" to="/#blog">Sistema de Seguimiento</NuxtLink></li>
                      <li><NuxtLink class="dropdown-item" to="/#blog">Fotos Recurrentes</NuxtLink></li>
                      <li><NuxtLink class="dropdown-item" to="/#blog">Validación de Bienestar</NuxtLink></li>
                    </ul>
                  </div>
                  <div class="col-12 col-md-4">
                    <ul class="list-unstyled">
                      <li><strong>Donaciones</strong></li>
                      <li><NuxtLink class="dropdown-item" to="/#blog">Cómo Donar</NuxtLink></li>
                      <li><NuxtLink class="dropdown-item" to="/#blog">Refugios Verificados</NuxtLink></li>
                      <li><NuxtLink class="dropdown-item" to="/#blog">Transparencia</NuxtLink></li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
            <li class="nav-separator"></li>

            <li class="nav-item dropdown bg-info">
              <a class="nav-link dropdown-toggle" href="javascript:void(0)" id="stores"
                role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fa fa-paw nav-icon" aria-hidden="true"></i>
                <span>Anunciar</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="stores">
                <li>
                  <NuxtLink class="dropdown-item" to="/#teachers">Publicar Animal en Adopción</NuxtLink>
                </li>
                <li>
                  <NuxtLink class="dropdown-item" to="/#teachers">Registrar Refugio</NuxtLink>
                </li>
                <li>
                  <NuxtLink class="dropdown-item" to="/#teachers">Solicitar Verificación</NuxtLink>
                </li>
                <li>
                  <NuxtLink class="dropdown-item" to="/#blog">Sistema de Donaciones</NuxtLink>
                </li>
              </ul>
            </li>
            <li class="nav-separator"></li>

            <li class="nav-item bg-info">
              <NuxtLink class="nav-link" to="/#grooming">
                <i class="fa fa-scissors nav-icon" aria-hidden="true"></i>
                <span>Servicios de Aseo</span>
              </NuxtLink>
            </li>
            <li class="nav-separator"></li>

            <li class="nav-item bg-purple">
              <NuxtLink class="nav-link" to="/veterinarios">
                <i class="fa fa-stethoscope nav-icon" aria-hidden="true"></i>
                <span>Veterinarios</span>
              </NuxtLink>
            </li>

            <li class="nav-item bg-purple">
              <NuxtLink class="nav-link" to="/#blog">
                <i class="fa fa-newspaper-o nav-icon" aria-hidden="true"></i>
                <span>Noticias</span>
              </NuxtLink>
            </li>
            <li class="nav-separator"></li>

            <li class="nav-item bg-pink">
              <NuxtLink class="nav-link" to="/#blog">
                <i class="fa fa-heartbeat nav-icon" aria-hidden="true"></i>
                <span>Donaciones</span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
// Header component
</script>

