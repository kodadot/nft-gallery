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
      <CollectionItemDetails
        v-if="trade.isAnyTokenInCollectionDesired"
        :trade="trade"
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
import CollectionItemDetails from './CollectionItemDetails.vue'
import TokenItemDetails from './TokenItemDetails.vue'
import { useIsTradeOverview } from './utils'
import type { NFT } from '@/types'

const props = defineProps<{
  desired?: NFT
  offered: NFT
  trade: TradeNftItem
}>()

const { isMyTrade } = useIsTradeOverview(computed(() => props.trade))
</script>
