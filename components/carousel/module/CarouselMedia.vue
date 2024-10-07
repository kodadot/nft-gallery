<template>
  <div
    class="carousel-media"
    :class="{ 'carousel-media-collection': isCollection }"
  >
    <div :aria-label="`slide ${index + 1} of ${length}`">
      <BaseMediaItem
        class="carousel-media-wrapper"
        :src="imageSrc || ''"
        :animation-src="item.animationUrl || ''"
        :title="item.name"
        :image-component="NuxtImg"
        disable-operation
        enable-normal-tag
        :audio-player-cover="imageSrc || ''"
        audio-hover-on-cover-play
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CarouselNFT } from '@/components/base/types'
import type { NFTWithMetadata } from '@/composables/useNft'

const props = defineProps<{
  item: CarouselNFT | NFTWithMetadata
  index: number
  length: number
}>()

const NuxtImg = resolveComponent('NuxtImg')

const isCollection = inject('isCollection', false)

const imageSrc = ref(props.item.image)
</script>
