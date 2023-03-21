<template>
  <div
    class="carousel-media is-flex-grow-1"
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
import { sanitizeIpfsUrl } from '@/utils/ipfs'

import type { CarouselNFT } from '@/components/base/types'

import { useCarouselUrl } from '../utils/useCarousel'

const props = defineProps<{
  item: CarouselNFT
}>()

const { urlOf } = useCarouselUrl()
const url = inject('itemUrl', 'gallery') as string
const isCollection = inject('isCollection', false)

const { urlPrefix } = usePrefix()
const imageSrc = computed(() => {
  if (urlPrefix.value === 'rmrk2') {
    const thumb = props.item.resources?.length && props.item.resources[0].thumb
    return sanitizeIpfsUrl(thumb || '')
  }

  return props.item.image
})
</script>
