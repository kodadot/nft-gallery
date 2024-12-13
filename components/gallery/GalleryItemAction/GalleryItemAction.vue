<template>
  <div class="flex flex-col flex-grow justify-start mt-5">
    <!-- price -->
    <GalleryItemPriceBuy
      v-if="!isOwner && nft"
      :nft="nft"
    />
    <!-- make offer and swap -->
    <GalleryItemTrade
      v-if="tradeVisible(urlPrefix) && nft"
      :hide-action-button="isOwner"
      :nft="nft"
      :highest-offer="highestOffer"
      class="mt-2"
    />

    <!-- change price as an owner -->
    <GalleryItemPriceRelist
      v-if="isOwner && nft?.id && nft?.collection.id && listVisible(urlPrefix)"
      :nft="nft"
      class="mt-2"
    />
  </div>
</template>

<script lang="ts" setup>
import GalleryItemPriceBuy from './GalleryItemActionType/GalleryItemBuy.vue'
import GalleryItemTrade from './GalleryItemActionType/GalleryItemTrade.vue'
import GalleryItemPriceRelist from './GalleryItemActionType/GalleryItemRelist.vue'
import { listVisible, tradeVisible } from '@/utils/config/permission.config'
import type { NFTOffer } from '@/composables/useNft'
import type { NFT } from '@/types'

const props = defineProps<{
  nft: NFT | undefined
  highestOffer: NFTOffer | undefined
}>()

const { urlPrefix } = usePrefix()
const { isCurrentOwner } = useAuth()
const isOwner = computed(() => isCurrentOwner(props.nft?.currentOwner))
</script>
