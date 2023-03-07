<template>
  <figure
    class="image-container"
    :class="{
      'is-square image': !original,
      'is-detail': isDetail,
    }">
    <img
      v-if="isLoading"
      class="is-block image-media__image"
      src="/placeholder.webp"
      :alt="alt"
      data-cy="type-image" />
    <img
      v-if="isReady"
      class="is-block image-media__image"
      :src="cfImage"
      :alt="alt"
      data-cy="type-image" />
    <img
      v-if="error"
      class="is-block image-media__image"
      :src="src"
      :alt="alt"
      data-cy="type-image" />
  </figure>
</template>

<script lang="ts" setup>
import { useImage } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    original: boolean
    isDetail?: boolean
    placeholder?: string
  }>(),
  {
    src: '',
    alt: '',
    placeholder: '/placeholder.webp',
  }
)

let cfImage = computed(() => {
  if (props.src) {
    return (
      props.src.replace(
        /https:\/\/image(-beta)?.w.kodadot.xyz\/ipfs\//,
        'https://imagedelivery.net/jk5b6spi_m_-9qC4VTnjpg/'
      ) + '/public'
    )
  }

  return ''
})

const { isLoading, error, isReady } = useImage({ src: cfImage.value })
</script>

<style>
.image-container.is-square.is-detail > img {
  object-fit: contain;
}

.image-container.is-square > img {
  object-fit: cover;
}
</style>
