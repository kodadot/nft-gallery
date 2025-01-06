<template>
  <CartItemDetails
    v-if="nft"
    :nft="nftToOfferItem(nft)"
  >
    <template #right>
      <div class="flex items-end flex-shrink-0">
        {{ formattedPrice }}
      </div>
    </template>
  </CartItemDetails>
  <BaseCartItemDetailsSkeleton v-else />
</template>

<script setup lang="ts">
import { nftToOfferItem } from '@/components/common/shoppingCart/utils'
import type { NFT } from '@/types'

const props = defineProps<{
  nft?: NFT
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
