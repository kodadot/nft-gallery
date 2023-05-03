<template>
  <NeoNftCard
    v-if="nft"
    :nft="nft"
    :placeholder="placeholder"
    :prefix="urlPrefix"
    :show-price="Number(nft?.price) > 0"
    :variant="variant"
    :unlockable="unlockable"
    :unloackable-icon="unloackableIcon" />
</template>

<script setup lang="ts">
import { NeoNftCard } from '@kodadot1/brick'

import type { NftCardVariant } from '@kodadot1/brick'
import type { NFTWithMetadata } from '@/composables/useNft'
import unloackableDark from '@/assets/unlockable-dark.svg'
import unloackable from '@/assets/unlockable.svg'

const { urlPrefix } = usePrefix()
const { placeholder, isDarkMode } = useTheme()

const unloackableIcon = computed(() =>
  isDarkMode.value ? unloackableDark : unloackable
)

const props = defineProps<{
  nft: NFTWithMetadata
  variant?: NftCardVariant
  unlockable?: boolean
}>()

const { nft } = useNft(props.nft)
</script>
