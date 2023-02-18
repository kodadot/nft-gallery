<template>
  <CarouselIndex
    :key="spotlight.length && spotlight[0].id"
    :title="`${$t('spotlight.page')}`"
    :nfts="spotlight"
    action-type="pagination"
    item-url="collection" />
</template>

<script lang="ts" setup>
import useCarouselSpotlight from './utils/useCarouselSpotlight'

const { collections: spotlight } = useCarouselSpotlight()
</script>
