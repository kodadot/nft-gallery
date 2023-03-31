<template>
  <figure
    class="image-container"
    :class="{
      'is-square image': !original,
      'is-detail': isDetail,
    }">
    <img
      :src="src"
      loading="lazy"
      class="is-block image-media__image"
      :alt="alt"
      data-cy="type-image"
      @error="onError" />
  </figure>
</template>

<script lang="ts" setup>
defineProps<{
  src?: string
  alt?: string
  original: boolean
  isDetail?: boolean
}>()
const { $consola } = useNuxtApp()
const { isDarkMode } = useTheme()
const placeholder = computed(() => {
  return isDarkMode.value ? '/placeholder.webp' : '/placeholder-white.webp'
})

const onError = (e: Event) => {
  const target = e.target as HTMLImageElement
  if (target) {
    $consola.log('image load error', e)
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
