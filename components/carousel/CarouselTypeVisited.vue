<template>
  <CarouselIndex :title="`${$t('nft.visited')}`" :nfts="nfts" />
</template>

<script lang="ts" setup>
import CarouselIndex from './CarouselIndex.vue'
import { useCarouselVisited } from './utils/useCarousel'

const { nfts } = useCarouselVisited()
</script>
