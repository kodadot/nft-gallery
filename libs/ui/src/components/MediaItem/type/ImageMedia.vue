<template>
  <figure
    v-if="equippedNftImages && equippedNftImages.length !== 0"
    class="image-container"
    :class="{
      'is-square image': !original,
      'is-detail': isDetail,
    }">
    <img
      v-for="(image, key) in equippedNftImages"
      :key="key"
      :src="image"
      class="is-block image-media__image"
      :alt="alt"
      data-cy="type-image"
      @error="onError" />
  </figure>
  <figure
    v-else
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
  placeholder: string
  isDetail?: boolean
  isDarkMode?: boolean
  equippedNftImages?: string[]
}>()

const onError = (e: Event) => {
  const target = e.target as HTMLImageElement
  if (target) {
    consola.log('[KODADOT::IMAGE] unable to load', e)
    target.src = props.placeholder
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
