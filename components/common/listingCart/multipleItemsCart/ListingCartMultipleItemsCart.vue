<template>
  <div>
    <div class="mt-5 has-text-weight-bold">
      {{ $t('listingCart.setAllTo') }}
    </div>

    <ListingCartFloorPrice
      v-model="floorPricePercentAdjustment"
      show-current-floor-price />

    <div class="pt-3 has-text-grey">-Or-</div>
    <div class="pt-3">{{ $t('listingCart.fixedPrice') }}</div>

    <ListingCartPriceInput
      v-model.number="fixedPrice"
      class="pt-2"
      check
      @confirm="setFixedPrice" />

    <div class="mt-5">
      <ListingCartItem
        v-for="nft in allItemsInChain"
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
import sortBy from 'lodash/sortBy'

const emit = defineEmits(['update:fixedPrice', 'setFixedPrice'])

const listingCartStore = useListingCartStore()

const allItemsInChain = computed(() =>
  sortBy(listingCartStore.allItemsInChain, (item) => (item.discarded ? 0 : 1)),
)

const props = defineProps<{
  fixedPrice?: number
  floorPricePercentAdjustment?: number
}>()

const floorPricePercentAdjustment = useVModel(
  props,
  'floorPricePercentAdjustment',
)

const fixedPrice = useVModel(props, 'fixedPrice')

function setFixedPrice(value) {
  emit('setFixedPrice', value)
  emit('update:fixedPrice', '')
}
</script>
