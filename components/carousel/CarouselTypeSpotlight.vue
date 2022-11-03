<template>
  <CarouselIndex
    :title="`${$t('spotlight.page')}`"
    :nfts="spotlight"
    text-color="light"
    action-type="pagination"
    item-url="collection" />
</template>

<script lang="ts" setup>
import CarouselIndex from './CarouselIndex.vue'
import useCarouselSpotlight from './utils/useCarouselSpotlight'

const { collections: spotlight } = useCarouselSpotlight()
</script>
