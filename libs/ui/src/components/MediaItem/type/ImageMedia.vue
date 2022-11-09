<template>
  <figure :class="{ 'is-square': !original }">
    <img
      class="is-block image-media__image"
      :src="src"
      :alt="alt"
      data-cy="type-image" />
  </figure>
</template>

<script lang="ts" setup>
defineProps<{
  src?: string
  alt?: string
  original: boolean
}>()
</script>

<style scoped>
figure > img.image-media__image {
  object-fit: cover;
}
</style>
