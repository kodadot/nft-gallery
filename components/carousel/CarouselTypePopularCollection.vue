<template>
  <CarouselIndex
    :title="$t('general.popularCollectionsHeading')"
    :subtitle="$t('general.popularCollectionsDesc')"
    :nfts="nfts"
    action-type="pagination"
    item-url="collection" />
</template>

<script lang="ts" setup>
import { useCarouselPopularCollections } from './utils/useCarousel'

const { nfts } = useCarouselPopularCollections()
</script>
