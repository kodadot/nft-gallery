<template>
  <CarouselIndex
    :key="ids"
    data-testid="latest-sales"
    :title="$t('general.latestSales')"
    :subtitle="`${$t('general.latestSalesheading')} ${urlPrefix}`"
    :nfts="nfts"
    action-type="pagination" />
</template>

<script lang="ts" setup>
import { useCarouselNftEvents } from './utils/useCarouselEvents'

const { urlPrefix } = usePrefix()
const { nfts, ids } = await useCarouselNftEvents({ type: 'latestSales' })
</script>
