<template>
  <div class="h-full flex flex-col">
    <GalleryItemOffersTable
      :nft-id="nftId"
    />
  </div>
</template>

<script setup lang="ts">
import GalleryItemOffersTable from './GalleryItemOffersTable.vue'

defineProps<{
  nftId: string
}>()
</script>
