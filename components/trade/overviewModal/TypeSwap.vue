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
      <CartItemDetails
        :nft="nftToOfferItem(desired)"
      >
        <template #right>
          <div class="flex items-end flex-shrink-0">
            {{ desiredFormatted }}
          </div>
        </template>
      </CartItemDetails>

      <NeoIcon
        class="rotate-90"
        icon="arrow-right-arrow-left"
      />

      <CartItemDetails
        :nft="nftToOfferItem(offered)"
      >
        <template #right>
          <div class="flex items-end flex-shrink-0">
            {{ oferredFormatted }}
          </div>
        </template>
      </CartItemDetails>
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
import { nftToOfferItem } from '@/components/common/shoppingCart/utils'
import type { NFT } from '@/types'

const props = defineProps<{
  desired: NFT
  offered: NFT
  trade: TradeNftItem
}>()

const { isMyTrade } = useIsTradeOverview(computed(() => props.trade))
const { decimals, chainSymbol } = useChain()

const { formatted: desiredFormatted } = useAmount(
  computed(() => props.desired.price),
  decimals,
  chainSymbol,
)

const { formatted: oferredFormatted } = useAmount(
  computed(() => props.desired.price),
  decimals,
  chainSymbol,
)
</script>
