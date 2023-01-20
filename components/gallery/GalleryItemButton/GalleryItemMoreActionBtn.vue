<template>
  <NeoDropdown>
    <NeoButton icon="ellipsis-v" />

    <template #items>
      <NeoDropdownItem
        v-if="currentGalleryItemImage.mimeType.includes('image')"
        item="Download"
        @click.native="downloadMedia" />
      <NeoDropdownItem disabled item="Report" />
    </template>
  </NeoDropdown>
</template>

<script setup lang="ts">
import { NeoButton, NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'
import { downloadImage } from '~/utils/download'

const { $store } = useNuxtApp()
const currentGalleryItemImage = $store.getters['history/getCurrentlyViewedItem']

const downloadMedia = () => {
  const { image, name } = currentGalleryItemImage
  image && downloadImage(image, name)
}
</script>
