<template>
  <NeoModal
    :value="isModalActive"
    :can-cancel="['outside', 'escape']"
    scroll="clip"
    class="top"
    @close="onClose">
    <div class="modal-width">
      <header
        class="py-5 pl-6 pr-5 is-flex is-justify-content-space-between is-align-items-center border-bottom">
        <span class="modal-card-title is-size-6 has-text-weight-bold">
          {{ $t('confirmPurchase.action') }}
        </span>

        <NeoButton
          class="py-1 px-2"
          variant="text"
          no-shadow
          icon="xmark"
          size="medium"
          @click="onClose" />
      </header>
      <div class="px-6 pt-4">
        <ModalIdentityItem />
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
          <CommonTokenMoney :value="totalWithRoyalties" class="has-text-grey" />
          <span class="has-text-weight-bold ml-2"> {{ priceUSD }}$ </span>
        </div>
      </div>

      <div class="is-flex is-justify-content-space-between py-5 px-6">
        <slot
          name="custom-action"
          :label="btnLabel"
          :disabled="disabled"
          :amount="totalWithRoyalties" />

        <NeoButton
          v-if="!$slots['custom-action']"
          :label="btnLabel"
          variant="k-accent"
          no-shadow
          :disabled="disabled"
          class="is-flex is-flex-grow-1 btn-height"
          @click="confirm" />
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
import ConfirmPurchaseItemRow from './ConfirmPurchaseItemRow.vue'
import { totalPriceUsd } from '../shoppingCart/utils'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'

const prefrencesStore = usePreferencesStore()
const shoppingCartStore = useShoppingCartStore()
const { isLogIn } = useAuth()
const { urlPrefix } = usePrefix()
const { $i18n } = useNuxtApp()
const { balance } = useBalance()
const emit = defineEmits(['confirm'])

const mode = computed(() => prefrencesStore.getCompletePurchaseModal.mode)

const items = computed(() => {
  if (mode.value === 'shopping-cart') {
    return shoppingCartStore.getItemsByPrefix(urlPrefix.value)
  }
  return shoppingCartStore.getItemToBuy ? [shoppingCartStore.getItemToBuy] : []
})

const isModalActive = computed(
  () => prefrencesStore.getCompletePurchaseModal.isOpen,
)

const totalNFTsPrice = computed(() =>
  sum(items.value.map((nft) => Number(nft.price))),
)
const totalRoyalties = computed(() =>
  sum(
    items.value.map(
      ({ price, royalty }) =>
        (Number(price ?? '0') * (royalty?.amount ?? 0)) / 100,
    ),
  ),
)

const totalWithRoyalties = computed(
  () => totalNFTsPrice.value + totalRoyalties.value,
)

const balanceIsEnough = computed(() => totalWithRoyalties.value < balance.value)

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
@import '@/assets/styles/abstracts/variables';

.top {
  z-index: 1000;
}
.shade-border-color {
  @include ktheme() {
    border-color: theme('k-shade');
  }
}
.modal-width {
  width: 25rem;
}
.btn-height {
  height: 3.5rem;
}

:deep(.identity-name-font-weight-regular) {
  .identity-name {
    font-weight: unset !important;
  }
}
</style>
