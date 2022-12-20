<template>
  <NftCard :nft="nft" :prefix="urlPrefix" />
</template>

<script lang="ts" setup>
import { NftCard } from '@kodadot1/brick'
import type { NFT } from '@/components/rmrk/service/scheme'

const { urlPrefix } = usePrefix()

defineProps<{
  nft?: NFT
}>()
</script>
