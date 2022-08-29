<template>
  <CarouselIndex :title="`${$t('nft.visited')}`" :nfts="nfts" />
</template>

<script lang="ts" setup>
import CarouselIndex from './CarouselIndex.vue'
import { visitedNft } from './utils/useCarouselData'

const { nfts } = visitedNft()
</script>
