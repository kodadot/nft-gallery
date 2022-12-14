<template>
  <div>
    <!-- price -->
    <GalleryItemPriceBuy />

    <!-- highest offer -->
    <GalleryItemPriceOffer
      v-if="urlPrefix !== 'rmrk' && nft?.id && nft.currentOwner"
      :nft-id="nft.id"
      :account="nft.currentOwner"
      class="mt-5" />
  </div>
</template>

<script lang="ts" setup>
import GalleryItemPriceBuy from './GalleryItemPriceSection/GalleryItemPriceBuy.vue'
import GalleryItemPriceOffer from './GalleryItemPriceSection/GalleryItemPriceOffer.vue'

import { useGalleryItem } from '../useGalleryItem'

const { urlPrefix } = usePrefix()
const { nft } = useGalleryItem()
</script>

<style scoped></style>
