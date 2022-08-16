<template>
  <figure class="image is-square nft-image">
    <img class="image-media__image" :src="src" :alt="mimeType" />
  </figure>
</template>

<script lang="ts" setup>
defineProps<{
  src?: string
  mimeType?: string
}>()
</script>

<style scoped>
figure > img.image-media__image {
  object-fit: cover;
}
</style>
