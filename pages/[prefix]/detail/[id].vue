<template>
  <GalleryItem />
</template>

<script setup lang="ts">
import { useRoute, navigateTo } from 'nuxt/app'

const route = useRoute()
const { prefix, id } = route.params

// Redirect to the gallery page
navigateTo(`/${prefix}/gallery/${id}`, { redirectCode: 301 })
</script>
