<template>
  <GalleryItem />
</template>

<script lang="ts" setup>
import GalleryItem from '@/components/gallery/GalleryItem.vue'

const { checkPrefixBeforeMount } = usePrefix()

onBeforeMount(checkPrefixBeforeMount)
</script>
