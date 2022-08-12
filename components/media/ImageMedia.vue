<script lang="ts" setup>
import { defineProps } from '#app'

const { src, mimeType } = defineProps<{
  src?: string
  mimeType?: string
}>()
</script>

<template>
  <figure class="image is-square nft-image">
    <img class="image-media__image" :src="src" :alt="mimeType" />
  </figure>
</template>

<style scoped>
figure > img.image-media__image {
  object-fit: cover;
}
</style>
