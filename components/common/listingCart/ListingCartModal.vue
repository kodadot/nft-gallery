<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <NeoModal
      v-model="preferencesStore.listingCartModalOpen"
      scroll="clip"
      @close="preferencesStore.listingCartModalOpen = false">
      <div class="modal-width">
        <header
          class="py-5 px-6 is-flex is-justify-content-space-between border-bottom">
          <span class="modal-card-title is-size-6 has-text-weight-bold">
            List {{ listingCartStore.count }} {{ $t('items') }}
          </span>

          <NeoButton
            variant="text"
            no-shadow
            icon="close"
            @click.native="preferencesStore.listingCartModalOpen = false" />
        </header>

        <div class="px-6 pt-4">
          <div
            class="rounded border border-k-shade is-flex is-justify-content-start is-flex-grow-1 pl-3">
            <IdentityItem
              v-if="isLogIn"
              :label="$t('confirmPurchase.connectedWith')"
              hide-identity-popover
              disable-identity-link
              :prefix="urlPrefix"
              :account="accountId"
              class="identity-name-font-weight-regular"
              data-testid="item-creator" />
          </div>

          <ListingCartSingleItemCart
            v-if="listingCartStore.count === 1"
            v-bind.sync="cartData"
            @setFixedPrice="setFixedPrice" />

          <ListingCartMultipleItemsCart
            v-else
            v-bind.sync="cartData"
            @setFixedPrice="setFixedPrice" />
        </div>

        <div
          class="is-flex border-top is-justify-content-space-between py-4 px-6">
          {{ $t('listingCart.potentialEarnings') }}
          <div class="is-flex">
            <span class="ml-2 has-text-grey"
              >{{ totalNFTsPrice.toFixed(4) }} {{ chainSymbol }}</span
            >
            <span class="has-text-weight-bold ml-2"> ${{ priceUSD }} </span>
          </div>
        </div>

        <div class="is-flex is-justify-content-space-between pb-5 px-6">
          <NeoButton
            :disabled="Boolean(listingCartStore.incompleteListPrices)"
            :label="confirmListingLabel"
            variant="k-accent"
            no-shadow
            class="is-flex is-flex-grow-1 py-5"
            @click.native="confirm" />
        </div>
      </div>
    </NeoModal>
  </div>
</template>
<script setup lang="ts">
import { Interaction } from '@kodadot1/minimark/v1'
import { prefixToToken } from '@/components/common/shoppingCart/utils'
import IdentityItem from '@/components/identity/IdentityItem.vue'
import { NeoButton, NeoModal } from '@kodadot1/brick'
import { usePreferencesStore } from '@/stores/preferences'
import { TokenToList } from '@/composables/transaction/types'
import { ListCartItem, useListingCartStore } from '@/stores/listingCart'
import { calculateBalance } from '@/utils/format/balance'
import { warningMessage } from '@/utils/notification'
import { useFiatStore } from '@/stores/fiat'
import { calculateExactUsdFromToken } from '@/utils/calculation'
import { sum } from '@/utils/math'
import ListingCartSingleItemCart from './singleItemCart/ListingCartSingleItemCart.vue'
import ListingCartMultipleItemsCart from './multipleItemsCart/ListingCartMultipleItemsCart.vue'

const { isLogIn, accountId } = useAuth()
const { urlPrefix } = usePrefix()
const preferencesStore = usePreferencesStore()
const listingCartStore = useListingCartStore()
const { transaction, isLoading, status } = useTransaction()
const { $i18n } = useNuxtApp()

const { chainSymbol } = useChain()

const cartData = ref<{
  fixedPrice?: number | string
  floorPricePercentAdjustment: number
}>({
  fixedPrice: undefined,
  floorPricePercentAdjustment: 1,
})

function setFixedPrice() {
  const fixedPrice = cartData.value.fixedPrice

  const rate =
    fixedPrice === undefined || fixedPrice === null || fixedPrice === ''
      ? null
      : Number(fixedPrice)

  listingCartStore.setFixedPrice(rate)
}

watch(
  () => cartData.value.floorPricePercentAdjustment,
  (rate) => {
    listingCartStore.setFloorPrice(rate)
  }
)

const fiatStore = useFiatStore()
const priceUSD = computed(() =>
  calculateExactUsdFromToken(
    totalNFTsPrice.value,
    Number(fiatStore.getCurrentTokenValue(prefixToToken[urlPrefix.value]))
  )
)

const setFloorPriceButtonDisabled = computed(
  () =>
    !listingCartStore.itemsInChain
      .map((item) => item.collection.floor || 0)
      .some(Boolean)
)

const totalNFTsPrice = computed(() =>
  Number(
    sum(
      listingCartStore.itemsInChain.map((nft) => Number(nft.listPrice))
    ).toFixed(4)
  )
)

const confirmListingLabel = computed(() => {
  switch (listingCartStore.incompleteListPrices) {
    case 0:
      return $i18n.t('listingCart.complete')
    case 1:
      return $i18n.t('listingCart.missing1')
    default:
      return `${listingCartStore.incompleteListPrices} ${$i18n.t(
        'listingCart.missingMultiple'
      )}`
  }
})
async function confirm() {
  const token = listingCartStore.itemsInChain
    .filter((item): item is ListCartItem & { listPrice: number } =>
      Boolean(item.listPrice)
    )
    .map((item) => ({
      price: String(calculateBalance(item.listPrice)),
      nftId: item.id,
    })) as TokenToList[]

  try {
    await transaction({
      interaction: Interaction.LIST,
      urlPrefix: urlPrefix.value,
      token,
      successMessage: $i18n.t('transaction.price.success') as string,
      errorMessage: $i18n.t('transaction.price.error') as string,
    })
    listingCartStore.clear()
    preferencesStore.listingCartModalOpen = false
  } catch (error) {
    warningMessage(error)
  }
}

watch(
  () => listingCartStore.count,
  () => {
    if (listingCartStore.count === 0) {
      preferencesStore.listingCartModalOpen = false
    }
  }
)
</script>
<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.rounded {
  border-radius: 10rem;
}

.modal-width {
  width: 25rem;
  max-width: 30rem;
}

:deep .identity-name-font-weight-regular {
  .identity-name {
    font-weight: unset !important;
  }
}
</style>
