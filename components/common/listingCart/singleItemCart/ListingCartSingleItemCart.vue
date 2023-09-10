<template>
  <div class="mb-4">
    <ListingCartItemDetails :nft="item">
      <template #right>
        <div class="is-flex is-align-items-end">
          {{ itemPrice }}
        </div>
      </template>

      <template #footer>
        <div class="mt-4 is-flex is-justify-content-space-between">
          <div>
            {{ $t('listingCart.floorPrice') }}
          </div>
          <div>
            {{ collectionPrice }}
          </div>
        </div>
      </template>
    </ListingCartItemDetails>

    <hr class="my-4" />

    <div class="has-text-weight-bold">{{ $t('listingCart.chooseAPrice') }}</div>

    <ListingCartFloorPrice v-model="floorPricePercentAdjustment" />

    <ListingCartPriceInput v-model="fixedPrice" class="pt-2" full-width />
  </div>
</template>

<script setup lang="ts">
import { useListingCartStore } from '@/stores/listingCart'
import ListingCartItemDetails from '../shared/ListingCartItemDetails.vue'
import ListingCartFloorPrice from '../shared/ListingCartFloorPrice.vue'
import ListingCartPriceInput from '../shared/ListingCartPriceInput.vue'

const emit = defineEmits([
  'update:fixedPrice',
  'update:floorPricePercentAdjustment',
])

const props = defineProps<{
  fixedPrice: number | null
  floorPricePercentAdjustment: number
}>()

const fixedPrice = useVModel(props, 'fixedPrice', emit, {
  eventName: 'update:fixedPrice',
})
const floorPricePercentAdjustment = useVModel(
  props,
  'floorPricePercentAdjustment',
  emit,
  { eventName: 'update:floorPricePercentAdjustment' }
)

const listingCartStore = useListingCartStore()
const { chainSymbol } = useChain()

const item = computed(() => listingCartStore.itemsInChain[0])

const itemPrice = computed(() =>
  !item.value.price ? `${item.value.price} ${chainSymbol.value}` : '--'
)
const collectionPrice = computed(() =>
  !!item.value.collection.floor
    ? `${item.value.collection.floor} ${chainSymbol.value}`
    : '--'
)
</script>
