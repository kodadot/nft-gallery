<template>
  <div class="py-5">
    <CartItemDetails :nft="item">
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
    </CartItemDetails>

    <hr class="my-5">

    <div class="font-bold">
      {{ $t('listingCart.chooseAPrice') }}
    </div>

    <ListingCartFloorPrice v-model="floorPricePercentAdjustment" />

    <ListingCartPriceInput
      v-model.number="fixedPrice"
      class="pt-2"
      full-width
    />
  </div>
</template>

<script setup lang="ts">
import ListingCartFloorPrice from '../shared/ListingCartFloorPrice.vue'
import ListingCartPriceInput from '../shared/ListingCartPriceInput.vue'
import CartItemDetails from '@/components/common/CartItemDetails.vue'
import { useListingCartStore } from '@/stores/listingCart'

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

const { formatted: itemPrice } = useAmount(computed(() => (item.value.price || 0)), decimals, chainSymbol, { withBlank: true })
const { formatted: collectionPrice } = useAmount(computed(() => item.value.collection.floor || 0), decimals, chainSymbol, { withBlank: true })

watch(
  () => props.fixedPrice,
  value => emit('setFixedPrice', value),
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
