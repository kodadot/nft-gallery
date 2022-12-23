<template>
  <div>
    <!-- price -->
    <GalleryItemPriceBuy v-if="!isOwner" />

    <!-- highest offer -->
    <GalleryItemPriceOffer
      v-if="urlPrefix !== 'rmrk' && nft?.id && nft.currentOwner"
      :nft-id="nft.id"
      :collection-id="nft.collection.id"
      :current-owner="nft.currentOwner"
      :account="nft.currentOwner"
      class="mt-5" />

    <!-- change price as an owner -->
    <GalleryItemPriceRelist v-if="isOwner" />

    <!-- transfer item as an owner -->
    <GalleryItemPriceTransfer v-if="isOwner" class="mt-5" />
  </div>
</template>

<script lang="ts" setup>
import { isOwner as checkOwner } from '@/utils/account'

import GalleryItemPriceBuy from './GalleryItemActionType/GalleryItemBuy.vue'
import GalleryItemPriceOffer from './GalleryItemActionType/GalleryItemOffer.vue'
import GalleryItemPriceRelist from './GalleryItemActionType/GalleryItemRelist.vue'
import GalleryItemPriceTransfer from './GalleryItemActionType/GalleryItemTransfer.vue'

import { useGalleryItem } from '../useGalleryItem'

const { $store } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { nft } = useGalleryItem()

const accountId = computed(() => $store.getters.getAuthAddress)
const isOwner = computed(() =>
  checkOwner(nft.value?.currentOwner, accountId.value)
)
</script>

<style scoped></style>
