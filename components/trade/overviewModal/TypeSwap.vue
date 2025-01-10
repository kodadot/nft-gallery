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
      <BaseCartItemDetails
        v-if="trade.isEntireCollectionDesired"
        :name="trade.considered.name"
        :second-name="$t('collection')"
        :image="sanitizeIpfsUrl(trade.considered.image)"
      />
      <CartItemDetails
        v-else-if="desired"
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
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import type { NFT } from '@/types'

const props = defineProps<{
  desired?: NFT
  offered: NFT
  trade: TradeNftItem
}>()

const desiredFormatted = ref('')

const { isMyTrade } = useIsTradeOverview(computed(() => props.trade))
const { decimals, chainSymbol } = useChain()

if (!props.trade.isEntireCollectionDesired) {
  desiredFormatted.value = useAmount(
    computed(() => props.desired?.price),
    decimals,
    chainSymbol,
  ).formatted.value
}

const { formatted: oferredFormatted } = useAmount(
  computed(() => props.offered.price),
  decimals,
  chainSymbol,
)
</script>
