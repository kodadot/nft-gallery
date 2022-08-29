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
import { lastNftByEvent } from './utils/useCarouselData'

const { urlPrefix } = usePrefix()
const { nfts } = lastNftByEvent({ type: 'latestSales' })
</script>
