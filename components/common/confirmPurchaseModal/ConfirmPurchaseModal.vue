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
        <AutoTeleportActionButton
          :amount="totalWithRoyalties"
          :label="$t('nft.action.confirm')"
          :disabled="disabled"
          :actions="actions"
          :fees="{ actions: supportFee }"
          @confirm="confirm"
          @actions:completed="$emit('completed')" />
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
import { type AutoTeleportAction } from '@/composables/autoTeleport/types'
import { type AutoTeleportActionButtonConfirmEvent } from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'
import { PERCENT as SUPPORT_FEE_PERCENT } from '@/utils/support'

const emit = defineEmits(['confirm', 'completed', 'close'])
const props = defineProps<{
  action: AutoTeleportAction
}>()

const prefrencesStore = usePreferencesStore()
const shoppingCartStore = useShoppingCartStore()
const { isLogIn } = useAuth()
const { urlPrefix } = usePrefix()
const { isRemark } = useIsChain(urlPrefix)

const actions = computed(() => [props.action])

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

const supportFee = computed(() =>
  isRemark.value ? totalNFTsPrice.value * SUPPORT_FEE_PERCENT : 0,
)

const disabled = computed(() => !isLogIn.value)

const priceUSD = computed(() => {
  const { nfts, royalties } = totalPriceUsd(items.value)
  return (nfts + royalties).toFixed(2)
})

const onClose = () => {
  prefrencesStore.setCompletePurchaseModalOpen(false)
  shoppingCartStore.removeItemToBuy()
  emit('close')
}

const confirm = (params: AutoTeleportActionButtonConfirmEvent) => {
  emit('confirm', params)
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
