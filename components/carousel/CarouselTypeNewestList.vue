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
import { lastNftByEvent } from './utils/useCarouselData'

const { urlPrefix } = usePrefix()
const { nfts } = lastNftByEvent({ type: 'newestList' })
</script>
