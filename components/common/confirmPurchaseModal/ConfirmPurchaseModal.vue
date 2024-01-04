<template>
  <NeoModal
    :value="isModalActive"
    :can-cancel="['outside', 'escape']"
    scroll="clip"
    class="top"
    content-class="modal-width"
    @close="onClose">
    <ModalBody
      :title="$t('confirmPurchase.action')"
      :loading="loading"
      @close="onClose">
      <div>
        <ModalIdentityItem />
      </div>
      <div class="py-2">
        <ConfirmNftPurchaseItemRow
          v-for="nft in items"
          :key="nft.id"
          :nft="nft"
          class="py-2" />
      </div>

      <div class="py-4 border-top border-bottom card-border-color">
        <div class="flex justify-between items-center mb-2">
          <span class="is-size-7">{{
            $t('confirmPurchase.priceForNFTs')
          }}</span>
          <CommonTokenMoney :value="totalNFTsPrice" />
        </div>
        <div class="flex justify-between has-text-grey is-size-7">
          {{ $t('confirmPurchase.royalties') }}
          <CommonTokenMoney :value="totalRoyalties" />
        </div>
      </div>
      <div class="flex justify-between py-4">
        {{ $t('confirmPurchase.youWillPay') }}
        <div class="flex">
          <CommonTokenMoney :value="total" class="has-text-grey" />
          <span class="has-text-weight-bold ml-2"> {{ priceUSD }}$ </span>
        </div>
      </div>

      <div class="flex justify-between pt-5">
        <AutoTeleportActionButton
          ref="autoteleport"
          :amount="total"
          :label="$t('nft.action.confirm')"
          :disabled="disabled"
          :actions="actions"
          @confirm="confirm"
          @actions:completed="$emit('completed')" />
      </div>
    </ModalBody>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import { sum } from '@/utils/math'
import { usePreferencesStore } from '@/stores/preferences'
import { useShoppingCartStore } from '@/stores/shoppingCart'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import { totalPriceUsd } from '../shoppingCart/utils'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'
import { type AutoTeleportAction } from '@/composables/autoTeleport/types'
import { type AutoTeleportActionButtonConfirmEvent } from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'
import { useBuySupportFee } from '@/composables/transaction/utils'

const emit = defineEmits(['confirm', 'completed', 'close'])
const props = defineProps<{
  action: AutoTeleportAction
}>()

const prefrencesStore = usePreferencesStore()
const shoppingCartStore = useShoppingCartStore()
const { isLogIn } = useAuth()
const { urlPrefix } = usePrefix()

const autoteleport = ref()
const actions = computed(() => [props.action])

const loading = computed(() => !autoteleport.value?.isReady)

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

const { supportFee } = useBuySupportFee(urlPrefix, totalNFTsPrice)

const total = computed(
  () => totalNFTsPrice.value + totalRoyalties.value + supportFee.value,
)

const disabled = computed(() => !isLogIn.value)

const priceUSD = computed(() => {
  const { nfts, royalties } = totalPriceUsd(items.value)
  return (nfts + royalties).toFixed(1)
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
