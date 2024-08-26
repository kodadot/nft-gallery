<template>
  <div class="flex flex-col flex-grow justify-start mt-5">
    <!-- price -->
    <GalleryItemPriceBuy
      v-if="!isOwner && nft"
      :nft="nft"
    />
    <!-- make offer -->
    <GalleryItemOffer
      v-if="offerVisible(urlPrefix) && !isOwner && nft"
      :nft="nft"
      :highest-offer="highestOffer"
      class="mt-2"
    />

    <!-- change price as an owner -->
    <GalleryItemPriceRelist
      v-if="isOwner && nft?.id && nft?.price && nft?.collection.id && listVisible(urlPrefix)"
      :nft="nft"
      class="mt-2"
    />

    <!-- transfer item as an owner -->
    <GalleryItemPriceTransfer
      v-if="isOwner && nft?.id"
      :nft="nft"
      class="mt-2"
    />
  </div>
</template>

<script lang="ts" setup>
import GalleryItemPriceBuy from './GalleryItemActionType/GalleryItemBuy.vue'
import GalleryItemOffer from './GalleryItemActionType/GalleryItemOffer.vue'
import GalleryItemPriceRelist from './GalleryItemActionType/GalleryItemRelist.vue'
import GalleryItemPriceTransfer from './GalleryItemActionType/GalleryItemTransfer.vue'
import { listVisible, offerVisible } from '@/utils/config/permission.config'
import type { NFTOffer } from '@/composables/useNft'

import type { NFT } from '@/components/rmrk/service/scheme'

const props = defineProps<{
  nft: NFT | undefined
  highestOffer: NFTOffer
}>()

const { urlPrefix } = usePrefix()
const { isCurrentOwner } = useAuth()
const isOwner = computed(() => isCurrentOwner(props.nft?.currentOwner))
</script>

<style scoped></style>
