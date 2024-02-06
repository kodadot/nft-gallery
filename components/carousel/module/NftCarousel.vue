<template>
  <CarouselModuleCarouselAgnostic
    :items="nfts"
    :step="step"
    :breakpoints="breakpoints">
    <template #default="{ item, index }">
      <NuxtLink
        class="h-full flex flex-col"
        :to="urlOf({ id: item.id, url, chain: item.chain })"
        rel="nofollow">
        <CarouselMedia :item="item" :index="index" :length="nfts.length" />
        <slot name="card-info" :item="item">
          <CarouselInfo :item="item" />
        </slot>
      </NuxtLink>
    </template>
  </CarouselModuleCarouselAgnostic>
</template>

<script lang="ts" setup>
import CarouselMedia from './CarouselMedia.vue'
import CarouselInfo from './CarouselInfo.vue'
import type { CarouselNFT } from '@/components/base/types'

import { useCarouselUrl } from '../utils/useCarousel'

const breakpoints = {
  '640px': { slides: { perView: 2.2, spacing: 16 } },
  '768px': {
    slides: { perView: 2.5, spacing: 24 },
  },
  '1024px': {
    slides: { perView: 4, spacing: 24 },
  },
  '1280px': {
    slides: { perView: 5, spacing: 24 },
  },
  '1540px': {
    slides: { perView: 6, spacing: 24 },
  },
}

defineProps<{
  nfts: CarouselNFT[]
  step: number
}>()

const { urlOf } = useCarouselUrl()

const url = inject('itemUrl', 'gallery') as string
const isCollection = computed(() => url.includes('collection'))
provide('isCollection', isCollection.value)
</script>
