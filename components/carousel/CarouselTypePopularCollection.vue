<template>
  <CarouselIndex
    :title="`${$t('general.popularCollectionsHeading')}`"
    :subtitle="`${$t('general.popularCollectionsDesc')}`"
    :nfts="nfts"
    action-type="pagination"
    item-url="collection"
    :gallery-item-carousel="false" />
</template>

<script lang="ts" setup>
import CarouselIndex from './CarouselIndex.vue'
import { useCarouselPopularCollections } from './utils/useCarousel'

const { nfts } = useCarouselPopularCollections()
</script>
