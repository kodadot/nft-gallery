<template>
  <div>
    <!-- price -->
    <GalleryItemPriceBuy
      v-if="!isOwner"
      :nft-id="nft?.id"
      :nft-price="nft?.price"
      :collection-id="nft?.collection.id"
      :current-owner="nft?.currentOwner"
      @buy-success="emit('buy-success')" />

    <!-- highest offer -->
    <GalleryItemPriceOffer
      v-if="urlPrefix !== 'rmrk' && !isOwner && nft?.id && nft.currentOwner"
      :nft-id="nft.id"
      :account="nft.currentOwner"
      class="mt-5" />

    <!-- change price as an owner -->
    <GalleryItemPriceRelist
      v-if="isOwner && nft?.id && nft?.price && nft?.collection.id"
      :collection-id="nft.collection.id"
      :nft-id="nft.id"
      :nft-price="nft.price"
      class="mt-5" />

    <!-- transfer item as an owner -->
    <GalleryItemPriceTransfer
      v-if="isOwner && nft?.id"
      :nft-id="nft.id"
      class="mt-5" />
  </div>
</template>

<script lang="ts" setup>
import { isOwner as checkOwner } from '@/utils/account'

import GalleryItemPriceBuy from './GalleryItemActionType/GalleryItemBuy.vue'
import GalleryItemPriceOffer from './GalleryItemActionType/GalleryItemOffer.vue'
import GalleryItemPriceRelist from './GalleryItemActionType/GalleryItemRelist.vue'
import GalleryItemPriceTransfer from './GalleryItemActionType/GalleryItemTransfer.vue'

import { NFT } from '~~/components/rmrk/service/scheme'
const props = defineProps<{
  nft: NFT | undefined
}>()
const emit = defineEmits(['buy-success'])
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()
const isOwner = computed(() =>
  checkOwner(props.nft?.currentOwner, accountId.value)
)
</script>

<style scoped></style>
