<template>
  <CarouselIndex :title="`${$t('nft.related')}`" :nfts="formatNFT(nfts)" />
</template>

<script lang="ts" setup>
import { useCarouselRelated } from './utils/useCarousel'
import { formatNFT } from '@/utils/carousel'

const props = defineProps<{
  collectionId: string
}>()

const { nfts } = useCarouselRelated({ collectionId: props.collectionId })
</script>
