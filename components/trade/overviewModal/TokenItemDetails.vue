<template>
  <div
    v-if="nft"
    class="flex flex-col gap-3"
  >
    <p
      v-if="title"
      class="text-k-grey text-sm"
    >
      {{ title }}
    </p>

    <CartItemDetails
      :nft="nftToOfferItem(nft)"
    >
      <template #right>
        <div class="flex items-end flex-shrink-0">
          <TradeActivityTableSurchargeTag
            v-if="surcharge"
            :value="surcharge"
          />

          <span v-else-if="isTradeOffer(type)"> {{ formattedPrice }} </span>
        </div>
      </template>
    </CartItemDetails>
  </div>
  <BaseCartItemDetailsSkeleton v-else />
</template>

<script setup lang="ts">
import { nftToOfferItem } from '@/components/common/shoppingCart/utils'
import type { NFT } from '@/types'
import type { SwapSurcharge } from '@/composables/transaction/types'
import type { TradeType } from '@/components/trade/types'

const props = defineProps<{
  nft?: NFT | null
  surcharge?: SwapSurcharge
  type: TradeType
  title?: string
}>()

const formattedPrice = ref()
const { decimals, chainSymbol } = useChain()

watchEffect(() => {
  const nft = props.nft
  if (nft) {
    formattedPrice.value = useAmount(
      computed(() => nft.price),
      decimals,
      chainSymbol,
    ).formatted.value
  }
})
</script>
