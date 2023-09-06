<template>
  <NeoModal
    v-model="isModalActive"
    :can-cancel="['outside', 'escape']"
    scroll="clip"
    class="top"
    @close="onClose">
    <div class="modal-width">
      <header
        class="py-5 px-6 is-flex is-justify-content-space-between border-bottom">
        <span class="modal-card-title is-size-6 has-text-weight-bold">
          {{ $t('confirmPurchase.action') }}
        </span>

        <NeoButton
          variant="text"
          no-shadow
          icon="close"
          @click.native="onClose" />
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
            data-cy="item-creator" />
        </div>
      </div>
      <div class="py-2">
        <ConfirmPurchaseItemRow
          v-for="nft in items"
          :key="nft.id"
          :nft="nft"
          class="py-2 px-6" />
      </div>
      <div class="py-4 mx-6 border-top border-bottom card-border-color">
        <div class="is-flex is-justify-content-space-between mb-2">
          <span class="is-size-7">{{
            $t('confirmPurchase.priceForNFTs')
          }}</span>
          <CommonTokenMoney :value="totalNFTsPrice" />
        </div>
        <div
          class="is-flex is-justify-content-space-between has-text-grey is-size-7">
          {{ $t('confirmPurchase.royalties') }}
          <CommonTokenMoney :value="totalRoyalties" />
        </div>
      </div>
      <div class="is-flex is-justify-content-space-between py-4 px-6">
        {{ $t('confirmPurchase.youWillPay') }}
        <div class="is-flex">
          <CommonTokenMoney
            :value="totalNFTsPrice + totalRoyalties"
            class="has-text-grey" />
          <span class="has-text-weight-bold ml-2"> {{ priceUSD }}$ </span>
        </div>
      </div>

      <div class="is-flex is-justify-content-space-between py-5 px-6">
        <NeoButton
          :label="btnLabel"
          variant="k-accent"
          no-shadow
          :disabled="disabled"
          class="is-flex is-flex-grow-1 py-5"
          @click.native="confirm" />
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoModal } from '@kodadot1/brick'
import { sum } from '@/utils/math'
import { usePreferencesStore } from '@/stores/preferences'
import { useShoppingCartStore } from '@/stores/shoppingCart'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import IdentityItem from '@/components/identity/IdentityItem.vue'
import ConfirmPurchaseItemRow from './ConfirmPurchaseItemRow.vue'
import { totalPriceUsd } from '../shoppingCart/utils'

const prefrencesStore = usePreferencesStore()
const shoppingCartStore = useShoppingCartStore()
const { isLogIn, accountId } = useAuth()
const { urlPrefix } = usePrefix()
const { $i18n } = useNuxtApp()
const { balance } = useBalance()
const emit = defineEmits(['confirm'])

const mode = computed(() => prefrencesStore.getCompletePurchaseModal.mode)

const items = computed(() => {
  if (mode.value === 'shopping-cart') {
    return shoppingCartStore.getItemsByPrefix(urlPrefix.value)
  }
  return shoppingCartStore.itemToBuy ? [shoppingCartStore.itemToBuy] : []
})

const isModalActive = computed(
  () => prefrencesStore.getCompletePurchaseModal.isOpen
)

const totalNFTsPrice = computed(() =>
  sum(items.value.map((nft) => Number(nft.price)))
)
const totalRoyalties = computed(() =>
  sum(
    items.value.map(
      ({ price, royalty }) =>
        (Number(price ?? '0') * (royalty?.amount ?? 0)) / 100
    )
  )
)

const balanceIsEnough = computed(
  () => totalNFTsPrice.value + totalRoyalties.value < balance.value
)

const btnLabel = computed(() => {
  if (balanceIsEnough.value) {
    return $i18n.t('nft.action.confirm')
  }

  return $i18n.t('confirmPurchase.notEnoughFuns')
})

const disabled = computed(() => !balanceIsEnough.value || !isLogIn.value)

const priceUSD = computed(() => {
  const { nfts, royalties } = totalPriceUsd(items.value)
  return (nfts + royalties).toFixed(2)
})

const onClose = () => {
  prefrencesStore.setCompletePurchaseModalOpen(false)
  shoppingCartStore.removeItemToBuy()
}

const confirm = () => {
  emit('confirm')
  prefrencesStore.setCompletePurchaseModalOpen(false)
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.rounded {
  border-radius: 10rem;
}

.modal-width {
  width: 25rem;
}

:deep .identity-name-font-weight-regular {
  .identity-name {
    font-weight: unset !important;
  }
}
</style>
