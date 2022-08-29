<template>
  <CarouselIndex
    v-if="showCarousel"
    :title="`${$t('nft.visited')}`"
    :nfts="nfts" />
</template>

<script lang="ts" setup>
import { MIN_CAROUSEL_NFT } from '@/utils/constants'

import CarouselIndex from './CarouselIndex.vue'
import { useCarouselVisited } from './utils/useCarousel'

const { nfts } = useCarouselVisited()
const showCarousel = computed(() => nfts.value.length > MIN_CAROUSEL_NFT)
</script>
