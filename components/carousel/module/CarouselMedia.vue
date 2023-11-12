<template>
  <div
    class="carousel-media"
    :class="{ 'carousel-media-collection': isCollection }">
    <nuxt-link
      :prefetch="false"
      :to="urlOf({ id: item.id, url, chain: item.chain })"
      :aria-label="`slide ${index + 1} of ${length}`"
      rel="nofollow">
      <img
        v-if="showCardIcon"
        class="card-icon"
        :src="cardIcon"
        alt="Card Icon" />
      <MediaItem
        class="carousel-media-wrapper"
        :src="imageSrc || ''"
        :animation-src="item.animationUrl || ''"
        :title="item.name"
        disable-operation
        :audio-player-cover="imageSrc || ''"
        audio-hover-on-cover-play />
    </nuxt-link>
  </div>
</template>

<script lang="ts" setup>
import { MediaItem } from '@kodadot1/brick'

import type { CarouselNFT } from '@/components/base/types'
import type { NFTWithMetadata } from '@/composables/useNft'

import { useCarouselUrl } from '../utils/useCarousel'

const props = defineProps<{
  item: CarouselNFT | NFTWithMetadata
  index: number
  length: number
}>()

const { urlOf } = useCarouselUrl()
const url = inject('itemUrl', 'gallery') as string
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

// onMounted(async () => {
//   if (!props.item.image) {

//   }
// })
</script>
<style lang="scss" scoped>
.card-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 1;
}
</style>
