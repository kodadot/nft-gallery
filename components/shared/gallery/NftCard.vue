<template>
  <NeoNftCard
    :nft="nft"
    :prefix="urlPrefix"
    :show-price="showPrice"
    :variant="variant"
    :placeholder="placeholder" />
</template>

<script lang="ts" setup>
import { NeoNftCard, NftCardVariant } from '@kodadot1/brick'
import type { NFT } from '@/components/rmrk/service/scheme'
import type { CarouselNFT } from '@/components/base/types'

const { urlPrefix } = usePrefix()
const { isDarkMode } = useTheme()

const props = defineProps<{
  nft: NFT | CarouselNFT
  variant?: NftCardVariant
}>()

const placeholder = computed(() =>
  isDarkMode ? '/placeholder.webp' : '/placeholder-white.webp'
)

const showPrice = computed((): boolean => {
  return Number(props.nft?.price) > 0
})
</script>
