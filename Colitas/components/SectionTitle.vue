<template>
  <div class="section-title justify-content-center mb-4 mb-md-8 wow fadeInUp">
    <span class="shape shape-left bg-info"></span>
    <h2 :class="titleClass">{{ title }}</h2>
    <span class="shape shape-right bg-info"></span>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  titleClass: {
    type: String,
    default: 'text-danger'
  }
})
</script>

