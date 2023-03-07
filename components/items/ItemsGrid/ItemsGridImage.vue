<template>
  <NeoNftCard
    v-if="item"
    :nft="item"
    :prefix="urlPrefix"
    :show-price="Number(item?.price) > 0" />
</template>

<script setup lang="ts">
import { NeoNftCard } from '@kodadot1/brick'
import { processSingleMetadata } from '@/utils/cachingStrategy'
import { sanitizeIpfsUrl } from '@/utils/ipfs'

import type { NFTWithMetadata } from './useItemsGrid'

const { urlPrefix } = usePrefix()

const props = defineProps<{
  nft: NFTWithMetadata
}>()

const item = ref<NFTWithMetadata>()

onBeforeMount(async () => {
  // set default values
  item.value = {
    ...props.nft,
    image: '/placeholder.webp',
  }

  if (props.nft.meta && props.nft.meta.image) {
    item.value = {
      ...props.nft,
      name: props.nft.name || props.nft.id,
      image: sanitizeIpfsUrl(props.nft.meta.image || ''),
      animation_url: sanitizeIpfsUrl(props.nft.meta.animation_url || ''),
      type: props.nft.meta.type || '',
    }

    return
  }

  const metadata = (await processSingleMetadata(
    props.nft.metadata
  )) as NFTWithMetadata

  if (urlPrefix.value === 'rmrk2' && props.nft.resources.length) {
    const { src, thumb } = props.nft.resources[0]
    console.log(src, thumb)
    item.value = {
      ...props.nft,
      image: sanitizeIpfsUrl(thumb || src || ''),
    }
    return
  }

  const image = sanitizeIpfsUrl(metadata.image || '')
  const animation_url = sanitizeIpfsUrl(metadata.animation_url || '')

  item.value = {
    ...props.nft,
    name: props.nft.name || metadata.name || props.nft.id,
    image,
    animation_url,
    type: metadata.type || '',
  }
})
</script>
