<template>
  <div class="py-2">
    <div class="border-top border-k-shade">
      <ListingCartItemDetails :nft="nft">
        <template #right>
          <NeoButton
            class="has-text-grey pt-4"
            variant="text"
            no-shadow
            icon="trash"
            icon-pack="far"
            @click.native="listingCartStore.removeItem(nft.id)" />
        </template>
        <template #footer>
          <div class="mt-2 is-flex is-justify-content-space-between">
            <div class="is-flex is-flex-direction-column">
              <div class="has-text-grey is-size-7">
                {{ $t('activity.floor') }}
              </div>
              <span>{{ floor }}</span>
            </div>

            <div class="is-flex is-align-items-end pt-2">
              <ListingCartPriceInput
                v-model="listingCartStore.getItem(nft.id).listPrice" />
            </div>
          </div>
        </template>
      </ListingCartItemDetails>
    </div>
  </div>
</template>

<script setup lang="ts">
import ListingCartPriceInput from '../shared/ListingCartPriceInput.vue'
import { NeoButton } from '@kodadot1/brick'
import { ListCartItem, useListingCartStore } from '@/stores/listingCart'
import { formatBalance } from '@polkadot/util'
import ListingCartItemDetails from '../shared/ListingCartItemDetails.vue'
const { decimals, chainSymbol } = useChain()

const listingCartStore = useListingCartStore()

const props = defineProps<{
  nft: ListCartItem
}>()

const floor = computed(() =>
  formatBalance(props.nft.collection.floor, {
    decimals: decimals.value,
    withUnit: chainSymbol.value,
  })
)
</script>
<style scoped lang="scss">
.limit-width {
  max-width: 170px;
}

.line-height-1 {
  line-height: 1;
}
</style>
