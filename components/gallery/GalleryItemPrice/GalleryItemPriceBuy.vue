<template>
  <GalleryItemPriceSection v-if="nft?.price" title="Price" :price="nft?.price">
    <div v-if="Number(nft.price)">
      <NeoButton label="Buy" size="large" fixed-width variant="k-accent" />
    </div>
    <div v-else>Not Listed</div>
  </GalleryItemPriceSection>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

import { useGalleryItem } from '../useGalleryItem'
import GalleryItemPriceSection from './GalleryItemPriceSection.vue'

const { nft } = useGalleryItem()
</script>

<style scoped></style>
