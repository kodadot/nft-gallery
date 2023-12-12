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
import {
  AHK_GENERATIVE_DROPS,
  AHP_GENERATIVE_DROPS,
} from '@/components/collection/drop/const'

const { nfts, ids } = await useCarouselGenerativeNftEvents(
  AHK_GENERATIVE_DROPS,
  AHP_GENERATIVE_DROPS,
)
</script>
