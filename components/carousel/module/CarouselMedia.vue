<template>
  <div
    class="carousel-media"
    :class="{ 'carousel-media-collection': isCollection }">
    <nuxt-link
      :to="urlOf({ id: item.id, url, chain: item.chain })"
      rel="nofollow">
      <MediaItem
        class="carousel-media-wrapper"
        :src="imageSrc || ''"
        :animation-src="item.animationUrl || ''"
        :title="item.name" />
    </nuxt-link>
  </div>
</template>

<script lang="ts" setup>
import { MediaItem } from '@kodadot1/brick'

import type { CarouselNFT } from '@/components/base/types'
import type { NFTWithMetadata } from '@/composables/useNft'

import { useCarouselUrl } from '../utils/useCarousel'

const props = defineProps<{
  item: CarouselNFT & NFTWithMetadata
}>()

const { urlOf } = useCarouselUrl()
const url = inject('itemUrl', 'gallery') as string
const isCollection = inject('isCollection', false)

const { urlPrefix } = usePrefix()
const imageSrc = ref(props.item.image)

onMounted(async () => {
  if (!props.item.image) {
    const nft = await getNftMetadata(props.item, urlPrefix.value)
    imageSrc.value = nft.image
  }
})
</script>
