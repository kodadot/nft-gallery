<template>
  <CartItemDetails
    :nft="nftToOfferItem(nft)"
  >
    <template #right>
      <div class="flex items-end flex-shrink-0">
        {{ formattedPrice }}
      </div>
    </template>
  </CartItemDetails>
</template>

<script setup lang="ts">
import { nftToOfferItem } from '@/components/common/shoppingCart/utils'
import type { NFT } from '@/types'

const props = defineProps<{
  nft: NFT
}>()

const { decimals, chainSymbol } = useChain()

const { formatted: formattedPrice } = useAmount(
  computed(() => props.nft.price),
  decimals,
  chainSymbol,
)
</script>
