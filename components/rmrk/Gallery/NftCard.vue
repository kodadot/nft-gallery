<template>
  <NeoNftCard :nft="nft" :prefix="urlPrefix" :show-price="showPrice" />
</template>

<script lang="ts" setup>
import { NeoNftCard } from '@kodadot1/brick'
import type { NFT } from '@/components/rmrk/service/scheme'

const { urlPrefix } = usePrefix()

const props = defineProps<{
  nft?: NFT
}>()

const showPrice = computed((): boolean => {
  return Number(props.nft?.price) > 0
})
</script>
