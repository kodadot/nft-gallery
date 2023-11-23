<template>
  <CarouselIndex
    :key="ids"
    data-testid="generative-activity"
    :title="$t('general.generativeActivity')"
    :nfts="nfts"
    action-type="pagination" />
</template>

<script lang="ts" setup>
import { useCarouselGenerativeNftEvents } from './utils/useCarouselEvents'

const { nfts, ids } = await useCarouselGenerativeNftEvents(
  ['176'],
  ['38', '40'],
)
</script>
