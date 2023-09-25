<template>
  <NeoModalExtend
    :active="fullscreen"
    :destroy-on-hide="false"
    :can-cancel="false"
    full-screen
    root-class="neo-modal gallery-item-modal"
    content-class="gallery-item-modal-content">
    <NeoButton class="back-button" @click.native="toggleFullscreen()">
      <NeoIcon icon="chevron-left" />
      {{ $t('go back') }}
    </NeoButton>

    <div class="gallery-item-modal-container">
      <MediaItem
        class="gallery-item-media"
        :src="previewItemSrc"
        :placeholder="placeholder"
        :animation-src="nftAnimation"
        :mime-type="nftMimeType"
        :title="nft?.name || nft?.id"
        original />
    </div>
  </NeoModalExtend>
</template>

<script setup lang="ts">
import type { NFT } from '@/components/rmrk/service/scheme'
import { MediaItem, NeoButton, NeoIcon, NeoModalExtend } from '@kodadot1/brick'
const { placeholder } = useTheme()

defineProps<{
  fullscreen: boolean
  toggleFullscreen: () => void
}>()

const nft = inject<NFT>('nft')
const nftMimeType = inject<string>('nftMimeType')
const nftAnimation = inject<string>('nftAnimation')
const previewItemSrc = inject<string>('previewItemSrc')
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.gallery-item-modal {
  position: fixed;

  :deep(.gallery-item-modal-content) {
    height: calc(100% - $navbar-desktop-min-height + 1px) !important;
    margin-top: calc($navbar-desktop-min-height - 1px) !important;
    width: 100%;
    max-height: 80vh;

    @include mobile {
      height: calc(100% - $navbar-mobile-min-height + 1px) !important;
      margin-top: calc($navbar-mobile-min-height - 1px) !important;
    }
  }

  .back-button {
    position: absolute;
    left: 0.75rem;
    top: 2rem;
    z-index: 99;
    @include desktop {
      left: $fluid-container-padding;
    }
  }

  &-container {
    @include ktheme() {
      background-color: theme('background-color');
    }
    height: 100%;
    width: 100%;
    padding: 0;
    .media-object {
      height: 100%;
      box-shadow: none;
      border: none;
    }
  }
}

.gallery-item-media :deep(figure) {
  height: 100%;
  width: 100%;
}

.gallery-item-media :deep(img) {
  height: 100%;
  width: 100%;
  object-fit: contain;
}
</style>
