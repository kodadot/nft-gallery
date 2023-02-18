<template>
  <CarouselIndex :title="`${$t('nft.related')}`" :nfts="nfts" />
</template>

<script lang="ts" setup>
import { useCarouselRelated } from './utils/useCarousel'

const props = defineProps<{
  collectionId: string
}>()

const { nfts } = useCarouselRelated({ collectionId: props.collectionId })
</script>
