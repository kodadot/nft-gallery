<template>
  <CarouselIndex
    data-cy="latest-sales"
    :title="`${$t('general.newestListHeading')}`"
    :subtitle="`${$t('general.newestListDesc')}`"
    :nfts="nfts" />
</template>

<script lang="ts" setup>
import CarouselIndex from './CarouselIndex.vue'
import { lastNftByEvent } from './utils/useCarouselData'

const { nfts } = lastNftByEvent({ type: 'newestList' })
</script>
