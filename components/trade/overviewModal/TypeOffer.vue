<template>
  <div
    class="py-5"
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

    <hr class="!my-5">

    <TradeOverviewModalDetails
      :trade="trade"
      :desired="desired"
    />
  </div>
</template>

<script setup lang="ts">
import { nftToOfferItem } from '@/components/common/shoppingCart/utils'
import type { NFT } from '@/types'

const props = defineProps<{
  desired: NFT
  trade: TradeNftItem
}>()

const { decimals, chainSymbol } = useChain()

const { formatted: desiredFormatted } = useAmount(
  computed(() => props.desired.price),
  decimals,
  chainSymbol,
)
</script>
