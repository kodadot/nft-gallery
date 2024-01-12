<template>
  <CarouselIndex
    data-testid="generative-activity"
    :title="$t('general.generativeActivity')"
    :nfts="nfts.value"
    action-type="pagination" />
</template>

<script lang="ts" setup>
import { useCarouselGenerativeNftEvents } from './utils/useCarouselEvents'

const nfts = useCarouselGenerativeNftEvents()
</script>
