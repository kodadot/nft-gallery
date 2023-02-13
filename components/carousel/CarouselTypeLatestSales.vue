<template>
  <CarouselIndex
    data-cy="latest-sales"
    :title="`${$t('general.latestSales')}`"
    :subtitle="`${$t('general.latestSalesheading')} ${urlPrefix}`"
    :nfts="nfts"
    action-type="pagination"
    :gallery-item-carousel="false" />
</template>

<script lang="ts" setup>
import CarouselIndex from './CarouselIndex.vue'
import { useCarouselNftEvents } from './utils/useCarousel'

const { urlPrefix } = usePrefix()
const { nfts } = useCarouselNftEvents({ type: 'latestSales' })
</script>
