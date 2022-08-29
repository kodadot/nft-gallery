<template>
  <CarouselIndex
    v-if="showCarousel"
    :title="`${$t('nft.visited')}`"
    :nfts="nfts" />
</template>

<script lang="ts" setup>
import { MIN_CAROUSEL_NFT } from '@/utils/constants'
import { visitedNFT } from '@/utils/localStorage'

import CarouselIndex from './CarouselIndex.vue'
import { useCarouselVisited } from './utils/useCarousel'

const getVisitedNFT = visitedNFT().map((nft) => nft.id)
const ids = computed(() => getVisitedNFT)

const { nfts } = useCarouselVisited({ ids: ids.value })
const showCarousel = computed(() => nfts.value.length > MIN_CAROUSEL_NFT)
</script>
