<template>
  <CarouselIndex
    :title="`${$t('general.newestListHeading')}`"
    :subtitle="`${$t('general.newestListDesc')}`"
    :nfts="nfts"
    action-type="link"
    :link-url="`/${urlPrefix}/explore/items/?search=&sort=updatedAt_DESC`"
    :link-text="`${$t('helper.seeMore')}`" />
</template>

<script lang="ts" setup>
import { useCarouselNftEvents } from './utils/useCarousel'

const { urlPrefix } = usePrefix()
const { nfts } = useCarouselNftEvents({ type: 'newestList' })
</script>
