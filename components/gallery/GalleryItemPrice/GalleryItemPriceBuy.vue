<template>
  <GalleryItemPriceSection v-if="nft?.price" title="Price" :price="nft?.price">
    <div v-if="Number(nft.price)"><button>Buy</button></div>
    <div v-else>Not Listed</div>
  </GalleryItemPriceSection>
</template>

<script setup lang="ts">
import { useGalleryItem } from '../useGalleryItem'
import GalleryItemPriceSection from './GalleryItemPriceSection.vue'

const { nft } = useGalleryItem()
</script>

<style scoped></style>
