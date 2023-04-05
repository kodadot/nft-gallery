<template>
  <NeoNftCard
    v-if="nft"
    :nft="nft"
    :is-dark-mode="isDarkMode"
    :prefix="urlPrefix"
    :show-price="Number(nft?.price) > 0"
    :variant="variant" />
</template>

<script setup lang="ts">
import { NeoNftCard } from '@kodadot1/brick'

import type { NftCardVariant } from '@kodadot1/brick'
import type { NFTWithMetadata } from '@/composables/useNft'

const { urlPrefix } = usePrefix()
const { isDarkMode } = useTheme()

const props = defineProps<{
  nft: NFTWithMetadata
  variant?: NftCardVariant
}>()

const { nft } = useNft(props.nft)
</script>
