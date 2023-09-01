<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
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
            <NeoButton
              class="mr-2"
              label="-5%"
              rounded
              no-shadow
              @click.native="listingCartStore.setFloorPrice(0.95)" />
            <NeoButton
              class="mr-2"
              label="Floor Price"
              rounded
              no-shadow
              @click.native="listingCartStore.setFloorPrice(1)" />
            <NeoButton
              label="+5%"
              rounded
              no-shadow
              @click.native="listingCartStore.setFloorPrice(1.05)" />
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
            :disabled="!!listingCartStore.incompleteListPrices"
            :label="confirmListingLabel"
            variant="k-accent"
            no-shadow
            class="is-flex is-flex-grow-1 btn-height"
            @click.native="confirm" />
        </div>
      </div>
    </NeoModal>
  </div>
</template>
<script setup lang="ts">
import { Interaction } from '@kodadot1/minimark/v1'
import ListingCartPriceInput from '~/components/common/listingCart/ListingCartPriceInput.vue'
import { totalPriceUsd } from '~/components/common/shoppingCart/utils'
import IdentityItem from '~/components/identity/IdentityItem.vue'
import CommonTokenMoney from '~/components/shared/CommonTokenMoney.vue'
import { NeoButton, NeoModal } from '@/libs/ui'
import { usePreferencesStore } from '@/stores/preferences'
import { TokenToList } from '~/composables/transaction/types'
import { useListingCartStore } from '~/stores/listingCart'
import { calculateBalance } from '~/utils/format/balance'
import { sum } from '~/utils/math'
import { warningMessage } from '~/utils/notification'
const { isLogIn, accountId } = useAuth()
const { urlPrefix } = usePrefix()
const preferencesStore = usePreferencesStore()
const listingCartStore = useListingCartStore()
const { transaction, isLoading, status } = useTransaction()
const { $i18n } = useNuxtApp()

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

const confirmListingLabel = computed(() => {
  switch (listingCartStore.incompleteListPrices) {
    case 0:
      return 'Complete Listing'
    case 1:
      return '1 Item Is Missing Price'
    default:
      return `${listingCartStore.incompleteListPrices} Items Are Missing Price`
  }
})
async function confirm() {
  const updateItems = {} as { [urlPrefix: string]: TokenToList[] }
  for (const item of listingCartStore.items) {
    if (item.listPrice) {
      if (!updateItems[item.urlPrefix]) {
        updateItems[item.urlPrefix] = []
      }
      updateItems[item.urlPrefix].push({
        price: String(calculateBalance(item.listPrice)),
        nftId: item.id,
      })
    }
  }
  try {
    for (const [urlPrefix, token] of Object.entries(updateItems)) {
      await transaction({
        interaction: Interaction.LIST,
        urlPrefix,
        token,
        successMessage: $i18n.t('transaction.price.success') as string,
        errorMessage: $i18n.t('transaction.price.error') as string,
      })
    }
    listingCartStore.clear()
    preferencesStore.listingCartModalOpen = false
  } catch (error) {
    warningMessage(error)
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

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
</style>
