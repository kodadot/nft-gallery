<template>
  <div class="py-5">
    <CartItemDetails :nft="item">
      <template #right>
        <div class="flex items-end">
          {{ itemPrice }}
        </div>
      </template>
    </CartItemDetails>

    <hr class="my-5">

    <div class="font-bold">
      {{ $t('offer.yourOfferAmount') }}
    </div>

    <ListingCartPriceInput
      v-model="offerStoreItem"
      class="pt-2"
      full-width
    />
  </div>
</template>

<script setup lang="ts">
import ListingCartPriceInput from '@/components/common/listingCart/shared/ListingCartPriceInput.vue'
import { useMakingOfferStore } from '@/stores/makeOffer'
import formatBalance from '@/utils/format/balance'
import CartItemDetails from '@/components/common/CartItemDetails.vue'

const emit = defineEmits([
  'setOfferPrice',
  'update:offerPrice',
])

const props = defineProps<{
  offerPrice?: number
}>()

const offerPrice = useVModel(props, 'offerPrice')

const offerStore = useMakingOfferStore()
const { chainSymbol, decimals } = useChain()

const item = computed(() => offerStore.items[0])

const itemPrice = computed(() => formatWithBlank(Number(item.value.price)))

const formatWithBlank = (value: number) => {
  return value ? formatBalance(value, decimals.value, chainSymbol.value) : '--'
}
const offerStoreItem = computed({
  get: () => offerStore.getItem(item.value?.id)?.offerPrice,
  set: price => offerStore.updateItem({ id: item.value.id, offerPrice: price }),
})

watch(
  () => props.offerPrice,
  value => emit('setOfferPrice', value),
)

watch(
  () => item.value?.price,
  (value) => {
    if (value) {
      offerPrice.value = Number(value)
    }
  },
)
</script>
