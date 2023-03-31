<template>
  <div
    class="carousel-media"
    :class="{ 'carousel-media-collection': isCollection }">
    <nuxt-link :to="urlOf({ id: item.id, url, chain: item.chain })">
      <PreviewMediaResolver
        v-if="item.animationUrl"
        :src="item.animationUrl"
        :poster="imageSrc || ''"
        :metadata="item.metadata" />
      <BasicImage
        v-else
        :src="imageSrc"
        :alt="item.name"
        custom-class="carousel__image-wrapper" />
    </nuxt-link>
  </div>
</template>

<script lang="ts" setup>
import PreviewMediaResolver from '@/components/media/PreviewMediaResolver.vue'
import BasicImage from '@/components/shared/view/BasicImage.vue'

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
