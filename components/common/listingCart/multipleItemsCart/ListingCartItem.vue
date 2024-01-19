<template>
  <div class="border-t border-k-shade py-5">
    <ListingCartItemDetails :nft="nft" :discarded="nft.discarded">
      <template #right>
        <NeoButton
          class="text-k-grey pt-4"
          variant="text"
          no-shadow
          :icon="nft.discarded ? 'plus' : 'trash'"
          icon-pack="far"
          @click="
            listingCartStore.setItemDiscardedState({
              id: nft.id,
              discarded: !nft.discarded,
            })
          " />
      </template>
      <template v-if="!nft.discarded" #footer>
        <div class="mt-4 flex justify-between items-start">
          <div class="flex flex-col">
            <div class="text-k-grey text-xs">
              {{ $t('activity.floor') }}
            </div>
            <span>{{ floor }}</span>
          </div>

          <div class="flex items-end">
            <ListingCartPriceInput v-model="listingCartItem" />
          </div>
        </div>
      </template>
    </ListingCartItemDetails>
  </div>
</template>

<script setup lang="ts">
import ListingCartPriceInput from '../shared/ListingCartPriceInput.vue'
import { NeoButton } from '@kodadot1/brick'
import { ListCartItem, useListingCartStore } from '@/stores/listingCart'
import formatBalance from '@/utils/format/balance'
import ListingCartItemDetails from '../shared/ListingCartItemDetails.vue'
const { decimals, chainSymbol } = useChain()

const listingCartStore = useListingCartStore()

const props = defineProps<{
  nft: ListCartItem
}>()

const floor = computed(() =>
  formatBalance(props.nft.collection.floor, decimals.value, chainSymbol.value),
)

const listingCartItem = computed({
  get: () => listingCartStore.getItem(props.nft.id).listPrice,
  set: (price) => listingCartStore.setItemPrice({ id: props.nft.id, price }),
})
</script>
