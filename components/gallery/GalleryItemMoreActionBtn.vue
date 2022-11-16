<template>
  <b-dropdown aria-role="list" position="is-bottom-left">
    <template #trigger>
      <NeoButton label="⋮" />
    </template>

    <b-dropdown-item aria-role="listitem" @click="downloadMedia"
      >Download</b-dropdown-item
    >
    <b-dropdown-item aria-role="listitem" disabled> Report </b-dropdown-item>
  </b-dropdown>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { downloadImage } from '~/utils/download'

const { $store } = useNuxtApp()
const currentGalleryItemImage =
  $store.getters['history/getCurrentlyViewedItem'] || {}

const downloadMedia = () => {
  const { image, name } = currentGalleryItemImage
  image && downloadImage(image, name)
}
</script>
