<template>
  <GalleryItem />
</template>

<script setup lang="ts">
import { useGalleryItem } from '@/components/gallery/useGalleryItem'

const nftStore = useNftStore()

const {
  nft,
  nftMetadata,
  nftImage,
  nftAnimation,
  nftAnimationMimeType,
  nftMimeType,
} = useGalleryItem()

const abi = useCollectionAbi(computed(() => nft.value?.collection.id))

watchEffect(() => {
  nftStore.nft = nft.value
  nftStore.nftMetadata = nftMetadata.value
  nftStore.nftImage = nftImage.value
  nftStore.nftAnimation = nftAnimation.value
  nftStore.nftAnimationMimeType = nftAnimationMimeType.value
  nftStore.nftMimeType = nftMimeType.value
  nftStore.abi = abi.value ?? null
})

definePageMeta({
  layout: 'gallery-item-layout',
})
</script>
