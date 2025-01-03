<template>
  <div
    class="py-5"
  >
    <TokenInCollection
      v-if="trade.isAnyTokenInCollectionDesired"
      :trade="trade"
      :send-item="sendItem"
      @send-item:select="$emit('send-item:select', $event)"
      @send-item:clear="$emit('send-item:clear')"
    />

    <TokenItemDetails
      v-else-if="desired"
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
import TokenItemDetails from './TokenItemDetails.vue'
import TokenInCollection from './TokenInCollection.vue'
import type { NFT } from '@/types'

defineEmits(['send-item:select', 'send-item:clear'])
defineProps<{
  trade: TradeNftItem
  desired?: NFT
  sendItem: NFT | null
}>()
</script>
