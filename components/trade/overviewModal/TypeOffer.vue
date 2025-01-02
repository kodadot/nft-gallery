<template>
  <div
    class="py-5"
  >
    <CollectionItemDetails
      v-if="trade.isAnyTokenInCollectionDesired"
      :trade="trade"
    />
    <TokenItemDetails
      v-if="desired"
      :nft="desired"
    />

    <hr class="!my-5">

    <TradeOverviewModalDetails
      :trade="trade"
      :desired="desired"
    />
  </div>
</template>

<script setup lang="ts">
import CollectionItemDetails from './CollectionItemDetails.vue'
import TokenItemDetails from './TokenItemDetails.vue'
import type { NFT } from '@/types'

defineProps<{
  desired?: NFT
  trade: TradeNftItem
}>()
</script>
