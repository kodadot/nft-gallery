<template>
  <CarouselIndex
    :title="`${$t('general.popularCollectionsHeading')}`"
    :subtitle="`${$t('general.popularCollectionsDesc')}`"
    :nfts="nfts"
    action-type="pagination" />
</template>

<script lang="ts" setup>
import CarouselIndex from './CarouselIndex.vue'
import { popularCollections } from './utils/useCarouselData'

const { nfts } = popularCollections()
</script>
