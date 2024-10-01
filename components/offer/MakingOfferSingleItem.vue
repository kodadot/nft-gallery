<template>
  <div class="py-5">
    <CartItemDetails :nft="item">
      <template #right>
        <div class="flex items-end">
          {{ trimmedItemPrice }}
        </div>
      </template>

      <template #footer>
        <hr class="my-4">

        <div class="mb-2 flex justify-between">
          <div>
            {{ $t('offer.bestOffer') }}
          </div>
          <div>
            {{ trimmedHighestOfferPrice }}
          </div>
        </div>
        <div class="flex justify-between">
          <div>
            {{ $t('offer.collectionFloorPrice') }}
          </div>
          <div>
            {{ trimmedCollectionFloorPrice }}
          </div>
        </div>
      </template>
    </CartItemDetails>

    <hr class="my-4">

    <div class="font-bold">
      {{ $t('offer.yourOfferAmount') }}
    </div>

    <OfferPriceInput
      v-model="offerPriceStoreItem"
      class="pt-2"
    />
    <div class="font-bold pt-4">
      {{ $t('offer.expiration') }}
    </div>

    <OfferExpirationSelector
      v-model="offerExpirationStoreItem"
      class="pt-2"
    />
  </div>
</template>

<script setup lang="ts">
import OfferPriceInput from '@/components/offer/OfferPriceInput.vue'
import OfferExpirationSelector from '@/components/offer/OfferExpirationSelector.vue'
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
const trimmedItemPrice = computed (() => trimDuplicateZeroes(itemPrice.value))

const formatWithBlank = (value: number) => {
  return value ? formatBalance(value, decimals.value, chainSymbol.value) : '--'
}
const offerPriceStoreItem = computed({
  get: () => offerStore.getItem(item.value?.id)?.offerPrice,
  set: price => offerStore.updateItem({ id: item.value.id, offerPrice: price }),
})
const offerExpirationStoreItem = computed({
  get: () => offerStore.getItem(item.value?.id)?.offerExpiration,
  set: v => offerStore.updateItem({ id: item.value.id, offerExpiration: v }),
})

const highestOfferPrice = computed(() => formatWithBlank(Number(item.value.highestOffer) || 0) || '--')
const trimmedHighestOfferPrice = computed(() => trimDuplicateZeroes(highestOfferPrice.value))

const collectionFloorPrice = computed(() =>
  formatWithBlank(Number(item.value.collection.floorPrice?.[0]?.price || '0')) || '--',
)
const trimmedCollectionFloorPrice = computed(() => trimDuplicateZeroes(collectionFloorPrice.value))

const trimDuplicateZeroes = (price: string): string => {
  const [amount, chainSymbol] = price.split(' ')

  const trimmedAmount = parseFloat(amount).toString()

  return `${trimmedAmount} ${chainSymbol}`
}

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
