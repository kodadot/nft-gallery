<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-between items-center">
      <span class="text-k-grey text-xs">
        {{ $t('amount') }}
      </span>

      <p class="flex gap-2 items-center">
        <span>{{ formmatedOffer }}</span>
        <span class="text-k-grey text-xs">({{ offerUsd }})</span>
      </p>
    </div>

    <div
      v-if="isMyTrade"
      class="flex justify-between items-center"
    >
      <span class="text-k-grey text-xs">
        {{ $t('expiration') }}
      </span>

      <span v-if="trade.status === TradeStatus.EXPIRED">
        {{ $t('expired') }}
      </span>
      <span v-else>
        {{ trade.expirationDate ? formatToNow(trade.expirationDate, false) : '' }}
      </span>
    </div>

    <div
      v-if="isIncomingTrade"
      class="flex justify-between items-center"
    >
      <span class="text-k-grey text-xs">
        {{ $t('offer.floorDifference') }}
      </span>

      <span>
        {{ diff }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIsTradeOverview } from './utils'
import { formatToNow } from '@/utils/format/time'
import { TradeStatus } from '@/composables/useTrades'
import type { NFT } from '@/types'

const props = defineProps<{
  trade: TradeNftItem
  desired: NFT
}>()

const { decimals, chainSymbol } = useChain()
const { isMyTrade, isIncomingTrade } = useIsTradeOverview(computed(() => props.trade))

const getFormattedDifference = (a: number, b: number) => {
  const diff = ((b - a) / b) * 100

  return diff > 0
    ? `-${diff.toFixed()}%`
    : `+${Math.abs(diff).toFixed()}%`
}

const floorPrice = computed(() => Number(props.desired.collection.floorPrice[0].price) || 0)
const diff = computed(() => getFormattedDifference(Number(props.trade.price || 0), floorPrice.value))

const { formatted: formmatedOffer, usd: offerUsd } = useAmount(
  computed(() => props.trade?.price),
  decimals,
  chainSymbol,
)
</script>
