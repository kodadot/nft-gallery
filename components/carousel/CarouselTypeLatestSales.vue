<template>
  <CarouselIndex
    :key="nfts.length"
    data-cy="latest-sales"
    :title="$t('general.latestSales')"
    :subtitle="`${$t('general.latestSalesheading')} ${urlPrefix}`"
    :nfts="nfts"
    action-type="pagination" />
</template>

<script lang="ts" setup>
import { useCarouselNftEvents } from './utils/useCarousel'

const { urlPrefix } = usePrefix()
const { nfts } = useCarouselNftEvents({ type: 'latestSales' })
</script>
