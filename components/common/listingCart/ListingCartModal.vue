<template>
  <NeoModal
    v-model="preferencesStore.listingCartModalOpen"
    :can-cancel="['outside', 'escape']"
    scroll="clip"
    class="top"
    @close="preferencesStore.listingCartModalOpen = false">
    <div class="modal-width">
      <header
        class="py-5 px-6 is-flex is-justify-content-space-between border-bottom">
        <span class="modal-card-title is-size-6 has-text-weight-bold">
          List {{ listingCartStore.count }} Items
        </span>

        <NeoButton
          variant="text"
          no-shadow
          icon="close"
          @click.native="preferencesStore.listingCartModalOpen = false" />
      </header>
      <div class="px-6 pt-4">
        <div
          class="rounded border shade-border-color is-flex is-justify-content-start is-flex-grow-1 pl-3">
          <IdentityItem
            v-if="isLogIn"
            :label="$t('confirmPurchase.connectedWith')"
            hide-identity-popover
            disable-identity-link
            :prefix="urlPrefix"
            :account="accountId"
            class="identity-name-font-weight-regular"
            data-cy="item-creator" />
        </div>
        <div class="pt-4"><b>Set All To</b></div>
        <div class="pt-4">Collection Floor Price</div>
        <div class="py-2 is-flex is-justify-content-start is-flex-grow-1">
          <NeoButton class="mr-2" label="-5%" rounded no-shadow />
          <NeoButton class="mr-2" label="Floor Price" rounded no-shadow />
          <NeoButton label="+5%" rounded no-shadow />
        </div>
        <div class="pt-3 has-text-grey">-Or-</div>
        <div class="pt-3">Fixed Price</div>
        <ListingCartPriceInput
          v-model="fixedPrice"
          check
          class="pt-2"
          @confirm="setFixedPrice" />
      </div>
      <div class="py-2">
        <ListingCartItem
          v-for="nft in listingCartStore.items"
          :key="nft.id"
          :nft="nft" />
      </div>
      <div
        class="is-flex border-top is-justify-content-space-between py-4 px-6">
        Potential Earnings
        <div class="is-flex">
          <CommonTokenMoney :value="totalNFTsPrice" class="has-text-grey" />
          <span class="has-text-weight-bold ml-2"> ${{ priceUSD }} </span>
        </div>
      </div>

      <div class="is-flex is-justify-content-space-between pb-5 px-6">
        <NeoButton
          :label="confirmListingLabel"
          variant="k-accent"
          no-shadow
          class="is-flex is-flex-grow-1 btn-height"
          @click.native="confirm" />
      </div>
    </div>
  </NeoModal>
</template>
<script setup lang="ts">
import ListingCartPriceInput from '~/components/common/listingCart/ListingCartPriceInput.vue'
import { totalPriceUsd } from '~/components/common/shoppingCart/utils'
import IdentityItem from '~/components/identity/IdentityItem.vue'
import CommonTokenMoney from '~/components/shared/CommonTokenMoney.vue'
import { TokenToBuy } from '~/composables/transaction/types'
import { NeoButton, NeoModal } from '@/libs/ui'
import { usePreferencesStore } from '@/stores/preferences'
import { useListingCartStore } from '~/stores/listingCart'
import { sum } from '~/utils/math'
import { warningMessage } from '~/utils/notification'
import { ShoppingActions } from '~/utils/shoppingActions'
const { isLogIn, accountId } = useAuth()
const { urlPrefix } = usePrefix()
const preferencesStore = usePreferencesStore()
const listingCartStore = useListingCartStore()
const { transaction } = useTransaction()
const { $i18n } = useNuxtApp()

const confirm = () => {
  console.log('confirm')
}

const fixedPrice = ref()
function setFixedPrice() {
  listingCartStore.setFixedPrice(fixedPrice.value)
  fixedPrice.value = undefined
}

const priceUSD = computed(() => {
  const { nfts, royalties } = totalPriceUsd(listingCartStore.items)
  return (nfts + royalties).toFixed(2)
})

const totalNFTsPrice = computed(() =>
  sum(listingCartStore.items.map((nft) => Number(nft.price)))
)

const handleBuy = async (nfts: TokenToBuy | TokenToBuy[]) => {
  try {
    await transaction({
      interaction: ShoppingActions.BUY,
      nfts,
      urlPrefix: urlPrefix.value,
      successMessage: $i18n.t('mint.successNewNfts'),
      errorMessage: $i18n.t('transaction.buy.error'),
    })
  } catch (error) {
    warningMessage(error)
  }
}
const confirmListingLabel = computed(() => 'Complete Listing')
// const onConfirm = () => {
//   if (preferencesStore.getCompletePurchaseModal.mode === 'shopping-cart') {
//     handleBuy(listingCartStore.items.map(ShoppingCartItemToTokenToBuy))
//   } else {
//     handleBuy(
//       ShoppingCartItemToTokenToBuy(
//         shoppingCartStore.getItemToBuy as ShoppingCartItem
//       )
//     )
//     shoppingCartStore.removeItemToBuy()
//   }
// }
</script>
<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.check-btn {
  height: 3rem;
}

.height-100 {
  height: 100%;
}

.top {
  z-index: 1000;
}
.shade-border-color {
  @include ktheme() {
    border-color: theme('k-shade');
  }
}

.rounded {
  border-radius: 10rem;
}

.modal-width {
  width: 25rem;
}
.btn-height {
  height: 3.5rem;
}

:deep .identity-name-font-weight-regular {
  .identity-name {
    font-weight: unset !important;
  }
}

.pointer {
  cursor: pointer;
}
</style>
