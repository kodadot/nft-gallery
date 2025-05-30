<template>
  <div
    class="py-5"
  >
    <div
      class="flex flex-col gap-4"
      :class="{
        'flex-col-reverse': isMyTrade && isSwap,
      }"
    >
      <!-- Desired  -->
      <TokenInCollection
        v-if="trade.isAnyTokenInCollectionDesired"
        :trade="trade"
        :send-item="sendItem"
        :title="desiredTitle"
        @send-item:select="$emit('send-item:select', $event)"
        @send-item:clear="$emit('send-item:clear')"
      />
      <TokenItemDetails
        v-else-if="desired"
        :nft="desired"
        :type="trade.type"
        :title="desiredTitle"
        :surcharge="isSwap && trade.surcharge === 'Receive' ? { direction: 'Send', amount: trade.price } : undefined"
      />

      <template v-if="isSwap">
        <KIcon
          class="rotate-90 text-k-grey"
          name="i-mdi:swap-horizontal"
        />

        <!-- Offered -->
        <TokenItemDetails
          :nft="offered"
          :type="trade.type"
          :title="offeredTitle"
          :surcharge="isSwap && trade.surcharge === 'Send' ? { direction: 'Send', amount: trade.price } : undefined"
        />
      </template>
    </div>

    <hr class="my-5!">

    <TradeOverviewModalDetails
      :trade="trade"
      :desired="desired"
    />
  </div>
</template>

<script setup lang="ts">
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

const { $i18n } = useNuxtApp()

const { isMyTrade } = useIsTradeOverview(computed(() => props.trade))
const { isSwap } = useTradeType(computed(() => props.trade))
const key = computed(() => `trades.${isMyTrade.value ? 'outgoing' : 'incoming'}`)
const offeredTitle = computed(() => isSwap.value ? $i18n.t(`${key.value}.send`) : undefined)
const desiredTitle = computed(() => isSwap.value ? $i18n.t(`${key.value}.receive`) : undefined)
</script>
