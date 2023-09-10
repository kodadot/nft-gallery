<template>
  <div>
    <div class="pt-4 has-text-weight-bold">Set All To</div>

    <ListingCartFloorPrice
      v-model="floorPricePercentAdjustment"
      show-current-floor-price />

    <div class="pt-3 has-text-grey">-Or-</div>
    <div class="pt-3">{{ $t('listingCart.fixedPrice') }}</div>

    <ListingCartPriceInput
      :value="fixedPrice"
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

const emit = defineEmits([
  'update:fixedPrice',
  'update:floorPricePercentAdjustment',
])

const listingCartStore = useListingCartStore()

const props = defineProps<{
  fixedPrice: number | null
  floorPricePercentAdjustment: number
}>()

const floorPricePercentAdjustment = useVModel(
  props,
  'floorPricePercentAdjustment',
  emit,
  { eventName: 'update:floorPricePercentAdjustment' }
)

function setFixedPrice(value) {
  emit('update:fixedPrice', value)
}
</script>

<style scoped></style>
