<template>
  <CarouselIndex
    data-cy="latest-sales"
    :title="`${$t('general.popularCollectionsHeading')}`"
    :subtitle="`${$t('general.popularCollectionsDesc')}`"
    :nfts="nfts" />
</template>

<script lang="ts" setup>
import CarouselIndex from './CarouselIndex.vue'
import { popularCollections } from './utils/useCarouselData'

const { nfts } = popularCollections()
</script>
