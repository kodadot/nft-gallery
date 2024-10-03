<template>
  <GalleryItem />
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { useGalleryItem } from '@/components/gallery/useGalleryItem'
import { fetchOdaCollectionAbi } from '@/services/oda'

const nftStore = useNftStore()

const {
  nft,
  nftMetadata,
  nftImage,
  nftAnimation,
  nftAnimationMimeType,
  nftMimeType,
} = useGalleryItem()

const { urlPrefix } = usePrefix()
const { data: abi } = useQuery({
  queryKey: ['collection-abi', nft.value?.collection.id],
  queryFn: () => isEvm(urlPrefix.value) ? fetchOdaCollectionAbi(urlPrefix.value, nft.value?.collection.id as string) : Promise.resolve(null),
  enabled: computed(() => Boolean(nft.value)),
})

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
