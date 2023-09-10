<template>
  <div>
    <div class="pt-4 has-text-weight-bold">Set All To</div>

    <ListingCartFloorPrice show-current-floor-price @change="setFloorPrice" />

    <div class="pt-3 has-text-grey">-Or-</div>
    <div class="pt-3">{{ $t('listingCart.fixedPrice') }}</div>

    <ListingCartPriceInput
      v-model="fixedPrice"
      check
      class="pt-2"
      @confirm="setFixedPrice" />

    <div class="py-2">
      <ListingCartItem
        v-for="nft in listingCartStore.itemsInChain"
        :key="nft.id"
        :nft="nft" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useListingCartStore } from '@/stores/listingCart'
import ListingCartItem from './ListingCartItem.vue'
import ListingCartPriceInput from '../shared/ListingCartPriceInput.vue'
import ListingCartFloorPrice from '../shared/ListingCartFloorPrice.vue'

const listingCartStore = useListingCartStore()

const fixedPrice = ref<number | null>(null)

function setFixedPrice() {
  listingCartStore.setFixedPrice(fixedPrice.value)
  fixedPrice.value = null
}

function setFloorPrice(value?: number) {
  listingCartStore.setFloorPrice(value)
}
</script>

<style scoped></style>
