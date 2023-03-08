<template>
  <NeoNftCard
    v-if="item"
    :nft="item"
    :prefix="urlPrefix"
    :show-price="Number(item?.price) > 0"
    :variant="variant" />
</template>

<script setup lang="ts">
import { NeoNftCard } from '@kodadot1/brick'
import { getNftMetadata } from '@/utils/nft'

import type { NftCardVariant } from '@kodadot1/brick'
import type { NFTWithMetadata } from '@/utils/nft'

const { urlPrefix } = usePrefix()

const props = defineProps<{
  nft: NFTWithMetadata
  variant?: NftCardVariant
}>()

const item = ref<NFTWithMetadata>()

onBeforeMount(async () => {
  item.value = await getNftMetadata(props.nft, urlPrefix.value)
})
</script>
