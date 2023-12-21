<template>
  <CarouselIndex
    data-testid="generative-activity"
    :title="$t('general.generativeActivity')"
    :nfts="nfts.value"
    action-type="pagination" />
</template>

<script lang="ts" setup>
import { AHK_GENERATIVE_DROPS, AHP_GENERATIVE_DROPS } from '@/utils/drop'
import { useCarouselGenerativeNftEvents } from './utils/useCarouselEvents'

const nfts = useCarouselGenerativeNftEvents(
  AHK_GENERATIVE_DROPS,
  AHP_GENERATIVE_DROPS,
)
</script>
