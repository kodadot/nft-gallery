<template>
  <NeoNftCard :nft="nft" :prefix="urlPrefix" :show-price="showPrice" />
</template>

<script lang="ts" setup>
import { NeoNftCard } from '@kodadot1/brick'
import type { NFT } from '@/components/rmrk/service/scheme'
import type { CarouselNFT } from '@/components/base/types'

const { urlPrefix } = usePrefix()

const props = defineProps<{
  nft: NFT | CarouselNFT
}>()

const showPrice = computed((): boolean => {
  return Number(props.nft?.price) > 0
})
</script>
