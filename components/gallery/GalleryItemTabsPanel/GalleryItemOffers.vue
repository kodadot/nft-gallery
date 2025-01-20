<template>
  <div class="h-full flex flex-col">
    <GalleryItemTradesTable
      :nft-id="nftId"
      :type="TradeType.OFFER"
    />
  </div>
</template>

<script setup lang="ts">
import GalleryItemTradesTable from './GalleryItemTradesTable.vue'
import { TradeType } from '@/components/trade/types'

defineProps<{
  nftId: string
}>()
</script>
