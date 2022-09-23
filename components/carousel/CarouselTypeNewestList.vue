<template>
  <CarouselIndex
    :title="`${$t('general.newestListHeading')}`"
    :subtitle="`${$t('general.newestListDesc')}`"
    :nfts="nfts"
    action-type="link"
    :link-url="`/${urlPrefix}/explore?search=&sort=updatedAt_DESC&tab=GALLERY`"
    :link-text="`${$t('helper.seeMore')}`" />
</template>

<script lang="ts" setup>
import CarouselIndex from './CarouselIndex.vue'
import {
  useCarouselNftEvents,
  useCarouselNftEventsOld,
} from './utils/useCarousel'

const { redesign } = useExperiments()
const { urlPrefix } = usePrefix()
const { nfts } = redesign.value
  ? useCarouselNftEvents({ type: 'newestList' })
  : useCarouselNftEventsOld({ type: 'newestList' })
</script>
