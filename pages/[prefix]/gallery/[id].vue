<template>
  <GalleryItem />
</template>

<script setup lang="ts">
import { useGalleryItem } from '@/components/gallery/useGalleryItem'
import { useNftStore } from '@/stores/nft'

const nftStore = useNftStore()

const {
  nft,
  nftMetadata,
  nftImage,
  nftAnimation,
  nftAnimationMimeType,
  nftMimeType,
} = useGalleryItem()

watchEffect(() => {
  nftStore.nft = nft.value
  nftStore.nftMetadata = nftMetadata.value
  nftStore.nftImage = nftImage.value
  nftStore.nftAnimation = nftAnimation.value
  nftStore.nftAnimationMimeType = nftAnimationMimeType.value
  nftStore.nftMimeType = nftMimeType.value
})

definePageMeta({
  layout: 'gallery-item-layout',
})
</script>
