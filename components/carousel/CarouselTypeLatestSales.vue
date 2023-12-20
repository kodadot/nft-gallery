<template>
  <CarouselIndex
    data-testid="latest-sales"
    :title="$t('general.latestSales')"
    :subtitle="`${$t('general.latestSalesheading')} ${urlPrefix}`"
    :nfts="nfts.value"
    action-type="pagination" />
</template>

<script lang="ts" setup>
import { useCarouselNftEvents } from './utils/useCarouselEvents'

const { urlPrefix } = usePrefix()
const nfts = useCarouselNftEvents({ type: 'latestSales' })
</script>
