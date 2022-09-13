<template>
  <CarouselIndex
    :title="`${$t('general.spotlight')}`"
    :nfts="spotlight"
    action-type="pagination"
    item-url="collection" />
</template>

<script lang="ts" setup>
import CarouselIndex from './CarouselIndex.vue'

const { collections: spotlight } = useSpotlight()
</script>
