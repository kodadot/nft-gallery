<template>
  <LazyCarouselIndex
    v-if="showCarousel"
    :title="$t('nft.visited')"
    :nfts="nfts"
  />
</template>

<script lang="ts" setup>
import { useCarouselVisited } from './utils/useCarousel'
import { MIN_CAROUSEL_NFT } from '@/utils/constants'
import { visitedNFT } from '@/utils/localStorage'

const getVisitedNFT = visitedNFT().map(nft => nft.id)
const ids = computed(() => getVisitedNFT)

const { nfts } = useCarouselVisited({ ids: ids.value })
const showCarousel = computed(() => nfts.value.length > MIN_CAROUSEL_NFT)
</script>
