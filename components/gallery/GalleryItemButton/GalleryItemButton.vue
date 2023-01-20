<template>
  <div class="buttons is-align-content-start gallery-button">
    <GalleryItemShareBtn />
    <GalleryItemMoreActionBtn />
  </div>
</template>

<script setup lang="ts">
import GalleryItemShareBtn from './GalleryItemShareBtn.vue'
import GalleryItemMoreActionBtn from './GalleryItemMoreActionBtn.vue'
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.gallery-button {
  display: flex;
  gap: 1rem;

  @include mobile {
    flex-direction: column-reverse;
  }
}
</style>
