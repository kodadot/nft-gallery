<template>
  <div class="buttons content-start gallery-button">
    <div data-testid="gallery-item-share-button">
      <ShareDropdown :sharing-content="customSharingContent" />
    </div>

    <GalleryItemMoreActionBtn
      :ipfs-image="nftMetadata?.image"
      :mime-type="nftMimeType"
      :name="nft?.name"
      :current-owner="nft?.currentOwner"
      :price="nft?.price"
      data-testid="gallery-item-more-button" />
  </div>
</template>

<script setup lang="ts">
import GalleryItemMoreActionBtn from './GalleryItemMoreActionBtn.vue'
import { GalleryItem } from '../useGalleryItem'
import { extractTwitterIdFromDescription } from '@/utils/parse'

const props = defineProps<{
  galleryItem: GalleryItem
}>()
const { $i18n } = useNuxtApp()
const nft = computed(() => props.galleryItem.nft.value)
const nftMimeType = computed(() => props.galleryItem.nftMimeType.value)
const nftMetadata = computed(() => props.galleryItem.nftMetadata.value)

const customSharingContent = computed(() => {
  const twitterId = nft.value?.meta?.description
    ? extractTwitterIdFromDescription(nft.value.meta.description)
    : ''

  return twitterId ? `${$i18n.t('sharing.nftWithArtist')} @${twitterId}` : ''
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.gallery-button {
  display: flex;
  gap: 1rem;

  @include mobile {
    flex-direction: column-reverse;
  }
}
</style>
