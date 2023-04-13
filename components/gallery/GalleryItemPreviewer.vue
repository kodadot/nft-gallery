<template>
  <b-modal
    v-model="isFullscreen"
    :destroy-on-hide="false"
    :can-cancel="false"
    full-screen
    custom-class="gallery-item-modal"
    custom-content-class="gallery-item-modal-content">
    <NeoButton class="back-button" @click.native="emit('input', false)">
      <NeoIcon icon="chevron-left" />
      {{ $t('go back') }}
    </NeoButton>

    <div class="gallery-item-modal-container">
      <MediaItem
        class="gallery-item-media"
        :src="nftImage"
        :placeholder="placeholder"
        :animation-src="nftAnimation"
        :mime-type="nftMimeType"
        :title="nft?.name || nft?.id"
        original />
    </div>
  </b-modal>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { MediaItem, NeoButton, NeoIcon } from '@kodadot1/brick'
import { useGalleryItem } from './useGalleryItem'
const { nft, nftImage, nftAnimation, nftMimeType } = useGalleryItem()
const { isDarkMode } = useTheme()

const props = defineProps<{
  value: boolean
}>()
const emit = defineEmits(['input'])
const isFullscreen = useVModel(props, 'value', emit)
const placeholder = computed(() =>
  isDarkMode ? '/placeholder.webp' : '/placeholder-white.webp'
)
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.gallery-item-modal {
  position: fixed;
  :deep &-content {
    height: calc(100% - $navbar-desktop-min-height + 1px) !important;
    margin-top: calc($navbar-desktop-min-height - 1px) !important;
    border: none !important;
    @include mobile {
      height: calc(100% - $navbar-mobile-min-height + 1px) !important;
      margin-top: calc($navbar-mobile-min-height - 1px) !important;
    }
  }
  :deep {
    figure,
    img {
      height: 100%;
      width: 100%;
    }
    img {
      object-fit: contain;
    }
  }
  .back-button {
    position: absolute;
    right: 2rem;
    top: 2rem;
    z-index: 99;
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
</style>
