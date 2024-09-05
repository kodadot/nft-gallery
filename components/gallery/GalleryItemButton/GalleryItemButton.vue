<template>
  <div class="buttons content-start gallery-button">
    <div data-testid="gallery-item-share-button">
      <ShareDropdown :sharing-content="customSharingContent" />
    </div>

    <GalleryItemMoreActionBtn
      :image-url="nftMetadata?.image"
      :image-data="imageData"
      :mime-type="nftMimeType"
      :name="nft?.name"
      :nft-sn="nft?.sn"
      :collection-id="nft?.collection?.id"
      :collection-name="nft?.collection?.name"
      :current-owner="nft?.currentOwner"
      :price="nft?.price"
      data-testid="gallery-item-more-button"
    />
  </div>
</template>

<script setup lang="ts">
import GalleryItemMoreActionBtn from './GalleryItemMoreActionBtn.vue'
import { extractTwitterIdFromDescription } from '@/utils/parse'
import { useNftStore } from '@/stores/nft'

const { $i18n } = useNuxtApp()
const imageData = ref()

const nftStore = useNftStore()
const nft = computed(() => nftStore.nft)
const nftMimeType = computed(() => nftStore.nftMimeType)
const nftMetadata = computed(() => nftStore.nftMetadata)

const customSharingContent = computed(() => {
  const twitterId = nft.value?.meta?.description
    ? extractTwitterIdFromDescription(nft.value?.meta?.description)
    : ''

  return twitterId ? $i18n.t('sharing.nftWithArtist', [twitterId]) : ''
})

onKodahashRenderCompleted(({ payload }) => imageData.value = payload.image)
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
