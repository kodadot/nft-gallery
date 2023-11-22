<template>
  <figure
    class="image-container"
    :class="{
      'is-square image': !original,
      'is-detail': isDetail,
    }">
    <NuxtImg
      :src="src"
      :sizes="sizes"
      class="is-block image-media__image no-border-radius"
      densities="x1"
      :alt="alt"
      data-testid="type-image"
      @error.once="onError" />
  </figure>
</template>

<script lang="ts" setup>
import consola from 'consola'

const props = defineProps<{
  sizes?: string
  src?: string
  alt?: string
  original: boolean
  placeholder: string
  isDetail?: boolean
  isDarkMode?: boolean
}>()

const onError = (e: Event) => {
  const target = e.target as HTMLImageElement
  if (target) {
    consola.log('[KODADOT::IMAGE] unable to load', props.src, e)
    target.removeAttribute('srcset')
    target.src = props.placeholder
  }
}
</script>

<style>
.image-container.is-square > img {
  object-fit: cover;
}
</style>
