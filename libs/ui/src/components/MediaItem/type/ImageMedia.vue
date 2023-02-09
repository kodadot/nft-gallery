<template>
  <figure
    class="image-container"
    :class="{
      'is-square image': !original && !isMobile,
      'is-detail': isDetail,
    }">
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
  isDetail?: boolean
}>()

const isMobile = ref(window.innerWidth < 768)
</script>

<style>
.image-container.is-square.is-detail > img {
  object-fit: contain;
}

.image-container.is-square > img {
  object-fit: cover;
}
</style>
