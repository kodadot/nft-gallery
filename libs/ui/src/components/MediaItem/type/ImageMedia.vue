<template>
  <figure
    class="image-container"
    :class="{
      'is-square image': !original,
      'is-detail': isDetail,
    }">
    <NuxtImg
      loading="lazy"
      provider="myProvider"
      :nuxtimgconfig="{
        format: 'webp',
      }"
      fit="cover"
      width="200"
      height="100"
      :src="src"
      class="is-block image-media__image no-border-radius"
      :alt="alt"
      data-testid="type-image"
      @error.once="onError" />
  </figure>
</template>

<script lang="ts" setup>
import consola from 'consola'

const props = defineProps<{
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
    target.src = props.placeholder
  }
}
</script>

<style>
.image-container.is-square.is-detail > img {
  object-fit: none;
}

.image-container.is-square > img {
  object-fit: cover;
}
</style>
