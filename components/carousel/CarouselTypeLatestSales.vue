<template>
  <CarouselIndex
    data-cy="latest-sales"
    :title="`${$t('general.latestSales')}`"
    :subtitle="`${$t('general.latestSalesheading')} ${urlPrefix}`"
    :nfts="nfts"
    action-type="pagination" />
</template>

<script lang="ts" setup>
import CarouselIndex from './CarouselIndex.vue'
import {
  useCarouselNftEvents,
  useCarouselNftEventsOld,
} from './utils/useCarousel'

const { redesign } = useExperiments()
const { urlPrefix } = usePrefix()
const { nfts } = redesign.value
  ? useCarouselNftEvents({ type: 'latestSales' })
  : useCarouselNftEventsOld({ type: 'latestSales' })
</script>
