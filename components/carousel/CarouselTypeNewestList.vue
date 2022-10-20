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
import { useCarouselNftEvents } from './utils/useCarousel'

const { urlPrefix } = usePrefix()
const { nfts } = useCarouselNftEvents({ type: 'newestList' })
</script>
