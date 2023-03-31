<template>
  <figure
    class="image-container"
    :class="{
      'is-square image': !original,
      'is-detail': isDetail,
    }">
    <nuxt-img
      :src="src"
      class="is-block image-media__image"
      :placeholder="placeholder"
      :alt="alt"
      loading="lazy"
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

const { isDarkMode } = useTheme()
const placeholder = computed(() => {
  return isDarkMode.value ? '/placeholder.webp' : '/placeholder-white.webp'
})
</script>

<style>
.image-container.is-square.is-detail > img {
  object-fit: contain;
}

.image-container.is-square > img {
  object-fit: cover;
}
</style>
