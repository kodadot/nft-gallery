<template>
  <div
    class="py-5"
  >
    <div
      class="flex flex-col gap-5"
      :class="{
        'flex-col-reverse': isMyTrade && isSwap,
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

      <template v-if="isSwap">
        <NeoIcon
          class="rotate-90"
          icon="arrow-right-arrow-left"
        />

        <!-- Offered -->
        <TokenItemDetails
          :nft="offered"
        />
      </template>
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
import { useIsTradeOverview } from './utils'
import TokenItemDetails from './TokenItemDetails.vue'
import TokenInCollection from './TokenInCollection.vue'
import { type TradeNftItem } from '@/components/trade/types'
import type { NFT } from '@/types'

defineEmits(['send-item:select', 'send-item:clear'])
const props = defineProps<{
  desired?: NFT
  offered: NFT
  trade: TradeNftItem
  sendItem?: NFT | null
}>()

const { isMyTrade } = useIsTradeOverview(computed(() => props.trade))
const { isSwap } = useTradeType(computed(() => props.trade))
</script>
