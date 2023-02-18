<template>
  <NeoNftCard
    v-if="item"
    :nft="item"
    :prefix="urlPrefix"
    :show-price="Number(item?.price) > 0" />
</template>

<script setup lang="ts">
import type { NFT, NFTMetadata } from '@/components/rmrk/service/scheme'
import { NeoNftCard } from '@kodadot1/brick'
import { processSingleMetadata } from '@/utils/cachingStrategy'
import { sanitizeIpfsUrl } from '@/utils/ipfs'

const { urlPrefix } = usePrefix()

const props = defineProps<{
  nft: NFT
}>()

type NFTWithMetadata = NFT & NFTMetadata

const item = ref<NFTWithMetadata>()

onBeforeMount(async () => {
  const metadata = (await processSingleMetadata(
    props.nft.metadata
  )) as NFTWithMetadata
  const image = sanitizeIpfsUrl(metadata.image || '')
  const animation_url = sanitizeIpfsUrl(metadata.animation_url || '')

  item.value = {
    ...props.nft,
    ...metadata,
    name: props.nft.name || metadata.name || props.nft.id,
    image,
    animation_url,
    type: metadata.type || '',
  }
})
</script>
