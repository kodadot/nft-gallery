<template>
  <div
    class="py-5"
  >
    <div
      class="flex flex-col gap-5"
      :class="{
        'flex-col-reverse': isMyTrade,
      }"
    >
      <!-- Desired  -->
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

      <NeoIcon
        class="rotate-90"
        icon="arrow-right-arrow-left"
      />

      <!-- Offered -->
      <TokenItemDetails
        :nft="offered"
      />
    </div>

    <hr class="!my-5">

    <TradeOverviewModalDetails
      :trade="trade"
      :desired="desired"
    />
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import TokenItemDetails from './TokenItemDetails.vue'
import TokenInCollection from './TokenInCollection.vue'
import { useIsTradeOverview } from './utils'
import type { NFT } from '@/types'

defineEmits(['send-item:select', 'send-item:clear'])
const props = defineProps<{
  desired?: NFT
  offered: NFT
  trade: TradeNftItem
  sendItem?: NFT | null
}>()

const { isMyTrade } = useIsTradeOverview(computed(() => props.trade))
</script>
