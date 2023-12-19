<template>
  <CarouselIndex
    :key="ids"
    data-testid="generative-activity"
    :title="$t('general.generativeActivity')"
    :nfts="nfts"
    action-type="pagination" />
</template>

<script lang="ts" setup>
import { AHK_GENERATIVE_DROPS, AHP_GENERATIVE_DROPS } from '@/utils/drop'
import { useCarouselGenerativeNftEvents } from './utils/useCarouselEvents'

const { nfts, ids } = await useCarouselGenerativeNftEvents(
  AHK_GENERATIVE_DROPS,
  AHP_GENERATIVE_DROPS,
)
</script>
