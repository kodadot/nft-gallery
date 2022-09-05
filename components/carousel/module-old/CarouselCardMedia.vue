<template>
  <div class="card-image p-4">
    <nuxt-link :to="urlOf({ id: list.id, url })">
      <PreviewMediaResolver
        v-if="list.animationUrl"
        :src="list.animationUrl"
        :poster="list.image || ''"
        :metadata="list.metadata" />
      <BasicImage
        v-else
        :src="list.image"
        :alt="list.name"
        custom-class="carousel__image-wrapper" />
    </nuxt-link>
  </div>
</template>

<script lang="ts" setup>
import type { CarouselNFT } from '@/components/base/types'
import PreviewMediaResolver from '@/components/media/PreviewMediaResolver.vue'
import BasicImage from '@/components/shared/view/BasicImage.vue'

import { useCarouselUrl } from '../utils/useCarousel'

const { urlOf } = useCarouselUrl()
const url = inject('itemUrl') as string

defineProps<{
  list: CarouselNFT
}>()
</script>

<style lang="scss" scoped>
.card-image {
  overflow: hidden;

  figure {
    transition: transform 0.2s;
  }

  figure:hover {
    transform: scale(1.1);
  }
}
</style>
