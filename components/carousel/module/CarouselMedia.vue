<template>
  <div
    class="carousel-media"
    :class="{ 'carousel-media-collection': isCollection }">
    <div :aria-label="`slide ${index + 1} of ${length}`">
      <img
        v-if="showCardIcon"
        class="absolute z-[1] right-4 top-4"
        :src="cardIcon"
        alt="Card Icon" />
      <BaseMediaItem
        class="carousel-media-wrapper"
        :src="imageSrc || ''"
        :animation-src="item.animationUrl || ''"
        :title="item.name"
        :image-component="NuxtImg"
        disable-operation
        :audio-player-cover="imageSrc || ''"
        audio-hover-on-cover-play />
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

const { urlPrefix } = usePrefix()
const imageSrc = ref(props.item.image)
const { showCardIcon, cardIcon } = useNftCardIcon(computed(() => props.item))

watch(
  () => props.item.image,
  async () => {
    const nft = await getNftMetadata(props.item, urlPrefix.value)
    imageSrc.value = nft.image
  },
)
</script>
