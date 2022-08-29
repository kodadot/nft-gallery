<template>
  <CarouselIndex :title="`${$t('nft.related')}`" :nfts="nfts" />
</template>

<script lang="ts" setup>
import CarouselIndex from './CarouselIndex.vue'
import { relatedNft } from './utils/useCarouselData'

const props = defineProps<{
  collectionId: string
}>()

const { nfts } = relatedNft({ collectionId: props.collectionId })
</script>
