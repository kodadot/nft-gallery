<template>
  <div class="buttons content-start gallery-button">
    <div data-testid="gallery-item-share-button">
      <ShareDropdown :sharing-content="customSharingContent" />
    </div>

    <GalleryItemMoreActionBtn
      :nft="nft"
      :image-url="nftMetadata?.image"
      :image-data="imageData"
      :mime-type="nftMimeType"
      :abi="abi"
      data-testid="gallery-item-more-button"
    />
  </div>
</template>

<script setup lang="ts">
import GalleryItemMoreActionBtn from './GalleryItemMoreActionBtn.vue'
import { extractTwitterIdFromDescription } from '@/utils/parse'

const { $i18n } = useNuxtApp()
const imageData = ref()

const { getNft: nft, getNftMetadata: nftMetadata, getNftMimeType: nftMimeType } = storeToRefs(useNftStore())

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
