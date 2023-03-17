<template>
  <div
    class="carousel-media is-flex-grow-1"
    :class="{ 'carousel-media-collection': isCollection }">
    <nuxt-link :to="urlOf({ id: item.id, url, chain: item.chain })">
      <PreviewMediaResolver
        v-if="item.animationUrl"
        :src="item.animationUrl"
        :poster="item.image || ''"
        :metadata="item.metadata" />
      <BasicImage
        v-else
        :src="item.image"
        :alt="item.name"
        custom-class="carousel__image-wrapper" />
    </nuxt-link>
  </div>
</template>

<script lang="ts" setup>
import PreviewMediaResolver from '@/components/media/PreviewMediaResolver.vue'
import BasicImage from '@/components/shared/view/BasicImage.vue'

import type { CarouselNFT } from '@/components/base/types'

import { useCarouselUrl } from '../utils/useCarousel'

defineProps<{
  item: CarouselNFT
}>()

const { urlOf } = useCarouselUrl()
const url = inject('itemUrl', 'gallery') as string
const isCollection = inject('isCollection', false)
</script>
