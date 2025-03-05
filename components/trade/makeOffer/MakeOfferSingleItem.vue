<template>
  <div class="py-5">
    <CartItemDetails :nft="item">
      <template #right>
        <div
          v-if="showPrice"
          class="flex items-end"
        >
          {{ itemPrice }}
        </div>
      </template>

      <template #footer>
        <hr class="my-4">

        <div class="mb-2 flex justify-between">
          <div>
            {{ $t('offer.bestOffer') }}
          </div>
          <div>
            {{ highestOfferPrice }}
          </div>
        </div>
        <div class="flex justify-between">
          <div>
            {{ $t('offer.collectionFloorPrice') }}
          </div>
          <div>
            {{ collectionFloorPrice }}
          </div>
        </div>
      </template>
    </CartItemDetails>

    <hr class="my-4">

    <div class="font-bold">
      {{ $t('offer.yourOfferAmount') }}
    </div>

    <TradePriceInput
      v-model="offerPriceStoreItem"
      class="pt-2"
    />
    <div class="font-bold pt-4">
      {{ $t('offer.expiration') }}
    </div>

    <TradeExpirationSelector
      v-model="offerExpirationStoreItem"
      class="pt-2"
    />
  </div>
</template>

<script setup lang="ts">
import { useMakingOfferStore } from '@/stores/makeOffer'
import CartItemDetails from '@/components/common/CartItemDetails.vue'

const emit = defineEmits([
  'setOfferPrice',
  'update:offerPrice',
])

const props = defineProps<{
  offerPrice?: number
  showPrice?: boolean
}>()

const offerPrice = useVModel(props, 'offerPrice')

const offerStore = useMakingOfferStore()
const { chainSymbol, decimals } = useChain()

const item = computed(() => offerStore.items[0])

const { formatted: itemPrice } = useAmount(computed(() => item.value.price), decimals, chainSymbol, { withBlank: true })

const offerPriceStoreItem = computed({
  get: () => offerStore.getItem(item.value?.id)?.offerPrice,
  set: price => offerStore.updateItem({ id: item.value.id, offerPrice: price }),
})
const offerExpirationStoreItem = computed({
  get: () => offerStore.getItem(item.value?.id)?.offerExpiration,
  set: v => offerStore.updateItem({ id: item.value.id, offerExpiration: v }),
})

const { formatted: highestOfferPrice } = useAmount(computed(() => item.value.highestOffer || 0), decimals, chainSymbol, { withBlank: true })
const { formatted: collectionFloorPrice } = useAmount(computed(() => item.value.collection.floorPrice?.[0]?.price || 0), decimals, chainSymbol, { withBlank: true })

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
