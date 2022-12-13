<template>
  <GalleryItemPriceSection v-if="nft?.price" title="Price" :price="nft?.price">
    Buy
  </GalleryItemPriceSection>
</template>

<script setup lang="ts">
import { useGalleryItem } from '../useGalleryItem'
import GalleryItemPriceSection from './GalleryItemPriceSection.vue'

const { nft } = useGalleryItem()
</script>

<style scoped></style>
