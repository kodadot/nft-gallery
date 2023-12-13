<template>
  <div class="py-5">
    <ListingCartItemDetails :nft="item">
      <template #right>
        <div class="flex items-end">
          {{ itemPrice }}
        </div>
      </template>

      <template #footer>
        <div class="mt-5 flex justify-between">
          <div>
            {{ $t('listingCart.floorPrice') }}
          </div>
          <div>
            {{ collectionPrice }}
          </div>
        </div>
      </template>
    </ListingCartItemDetails>

    <hr class="my-5" />

    <div class="has-text-weight-bold">{{ $t('listingCart.chooseAPrice') }}</div>

    <ListingCartFloorPrice v-model="floorPricePercentAdjustment" />

    <ListingCartPriceInput
      v-model.number="fixedPrice"
      class="pt-2"
      full-width />
  </div>
</template>

<script setup lang="ts">
import { useListingCartStore } from '@/stores/listingCart'
import ListingCartItemDetails from '../shared/ListingCartItemDetails.vue'
import ListingCartFloorPrice from '../shared/ListingCartFloorPrice.vue'
import ListingCartPriceInput from '../shared/ListingCartPriceInput.vue'
import formatBalance from '@/utils/format/balance'

const emit = defineEmits([
  'setFixedPrice',
  'update:fixedPrice',
  'update:floorPricePercentAdjustment',
])

const props = defineProps<{
  fixedPrice?: number
  floorPricePercentAdjustment?: number
}>()

const fixedPrice = useVModel(props, 'fixedPrice')

const floorPricePercentAdjustment = useVModel(
  props,
  'floorPricePercentAdjustment',
)

const listingCartStore = useListingCartStore()
const { chainSymbol, decimals } = useChain()

const item = computed(() => listingCartStore.itemsInChain[0])

const itemPrice = computed(() => formatWithBlank(Number(item.value.price)))

const collectionPrice = computed(() =>
  formatWithBlank(Number(item.value.collection.floor)),
)

const formatWithBlank = (value: number) => {
  return value ? formatBalance(value, decimals.value, chainSymbol.value) : '--'
}

watch(
  () => props.fixedPrice,
  (value) => emit('setFixedPrice', value),
)

watch(
  () => item.value?.listPrice,
  (value) => {
    if (value) {
      fixedPrice.value = value
    }
  },
)
</script>
