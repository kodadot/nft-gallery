<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <NeoModal
      v-model="preferencesStore.listingCartModalOpen"
      scroll="clip"
      @close="onClose">
      <div class="modal-width">
        <header
          class="py-5 px-6 is-flex is-justify-content-space-between border-bottom">
          <span class="modal-card-title is-size-6 has-text-weight-bold">
            {{ title }}
          </span>

          <NeoButton
            variant="text"
            no-shadow
            icon="close"
            @click.native="onClose" />
        </header>

        <div class="px-6 pt-4 limit-height">
          <ModalIdentityItem />

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
import { NeoButton, NeoModal } from '@kodadot1/brick'
import { usePreferencesStore } from '@/stores/preferences'
import { TokenToList } from '@/composables/transaction/types'
import { ListCartItem, useListingCartStore } from '@/stores/listingCart'
import { calculateBalance } from '@/utils/format/balance'
import { warningMessage } from '@/utils/notification'
import { useFiatStore } from '@/stores/fiat'
import { calculateExactUsdFromToken } from '@/utils/calculation'
import { sum } from '@/utils/math'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'

import ListingCartSingleItemCart from './singleItemCart/ListingCartSingleItemCart.vue'
import ListingCartMultipleItemsCart from './multipleItemsCart/ListingCartMultipleItemsCart.vue'

const { urlPrefix } = usePrefix()
const preferencesStore = usePreferencesStore()
const listingCartStore = useListingCartStore()
const { transaction, isLoading, status } = useTransaction()
const { $i18n } = useNuxtApp()

const { chainSymbol, decimals } = useChain()

const defaultCartData = {
  fixedPrice: undefined,
  floorPricePercentAdjustment: 1,
}

const cartData = ref<{
  fixedPrice?: number | string
  floorPricePercentAdjustment: number
}>({ ...defaultCartData })

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

const totalNFTsPrice = computed(() =>
  Number(
    sum(
      listingCartStore.itemsInChain.map((nft) => Number(nft.listPrice))
    ).toFixed(4)
  )
)

const cartHasNFTsWithPrice = computed(() =>
  listingCartStore.itemsInChain.map((nft) => Number(nft.price)).some(Boolean)
)
const showChangePriceModal = computed(
  () => cartHasNFTsWithPrice.value && listingCartStore.count === 1
)

const title = computed(() => {
  const items =
    listingCartStore.count === 1
      ? 'NFT'
      : `${listingCartStore.count} ${$i18n.t('items')}`

  return showChangePriceModal.value
    ? $i18n.t('transaction.price.change')
    : `List ${items}`
})

const confirmListingLabel = computed(() => {
  switch (listingCartStore.incompleteListPrices) {
    case 0:
      return showChangePriceModal.value
        ? $i18n.t('transaction.price.change')
        : $i18n.t('listingCart.complete')
    case 1:
      return listingCartStore.count === 1
        ? $i18n.t('listingCart.inputPriceFirst')
        : $i18n.t('listingCart.missing1')
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
      price: String(calculateBalance(item.listPrice, decimals.value)),
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
    resetCartData()
  } catch (error) {
    warningMessage(error)
  }
}

const onClose = () => {
  resetCartData()
  preferencesStore.listingCartModalOpen = false
}

const resetCartData = () => {
  cartData.value = { ...defaultCartData }
}

watch(
  () => listingCartStore.count,
  () => {
    if (listingCartStore.count === 0) {
      preferencesStore.listingCartModalOpen = false
    }
  }
)

onUnmounted(() => {
  preferencesStore.listingCartModalOpen = false
})
</script>
<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.rounded {
  border-radius: 10rem;
}

.limit-height {
  max-height: 50vh;
  overflow-y: auto;
}

.modal-width {
  width: 25rem;
  max-width: 30rem;
}

:deep(.identity-name-font-weight-regular) {
  .identity-name {
    font-weight: unset !important;
  }
}
</style>
