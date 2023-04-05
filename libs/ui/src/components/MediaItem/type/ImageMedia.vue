<template>
  <figure
    class="image-container"
    :class="{
      'is-square image': !original,
      'is-detail': isDetail,
    }">
    <img
      :src="src"
      class="is-block image-media__image"
      :alt="alt"
      data-cy="type-image"
      @error="onError" />
  </figure>
</template>

<script lang="ts" setup>
import consola from 'consola'

const props = defineProps<{
  src?: string
  alt?: string
  original: boolean
  isDetail?: boolean
  isDarkMode?: boolean
}>()

const placeholder = computed(() => {
  return props.isDarkMode ? '/placeholder.webp' : '/placeholder-white.webp'
})

const onError = (e: Event) => {
  const target = e.target as HTMLImageElement
  if (target) {
    consola.log('[KODADOT::IMAGE] unable to load', e)
    target.src = placeholder.value
  }
}
</script>

<style>
.image-container.is-square.is-detail > img {
  object-fit: contain;
}

.image-container.is-square > img {
  object-fit: cover;
}
</style>
