<template>
  <GalleryItem />
</template>

<script lang="ts" setup>
import GalleryItem from '@/components/gallery/GalleryItem.vue'

const { $store } = useNuxtApp()

const { checkPrefixBeforeMount } = usePrefix()

onBeforeMount(checkPrefixBeforeMount)
</script>
