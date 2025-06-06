<template>
  <NeoModal
    :value="isModalActive"
    class="z-1000"
    content-class="w-[unset]!"
    @close="onClose"
  >
    <ModalBody
      :title="$t('confirmPurchase.action')"
      :loading="loading"
      @close="onClose"
    >
      <div>
        <ModalIdentityItem />
      </div>

      <div class="mt-4 flex flex-col gap-4">
        <ConfirmNftPurchaseItemRow
          v-for="nft in items"
          :key="nft.id"
          :nft="nft"
        />
      </div>

      <hr class="my-4">

      <div>
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs">{{ $t('confirmPurchase.priceForNFTs') }}</span>
          <CommonTokenMoney :value="totalNFTsPrice" />
        </div>
        <div class="flex justify-between text-k-grey text-xs mb-2">
          <div>
            {{ $t('mint.nft.modal.serviceFee') }}
            ({{ SUPPORT_FEE_PERCENT * 100 }}%)
            <NeoTooltip
              class="cursor-pointer"
              position="top"
              multiline-width="14rem"
              :label="$t('tooltip.supportFee')"
              multiline
            >
              <KIcon name="i-mdi:help-circle-outline" />
            </NeoTooltip>
          </div>
          <CommonTokenMoney :value="supportFee" />
        </div>
        <div class="flex justify-between text-k-grey text-xs">
          {{ $t('confirmPurchase.royalties') }}
          <CommonTokenMoney :value="totalRoyalties" />
        </div>
      </div>

      <hr class="my-4">

      <div class="flex justify-between pb-4">
        {{ $t('confirmPurchase.youWillPay') }}
        <div class="flex">
          <CommonTokenMoney
            :value="total"
            class="text-k-grey"
          />
          <span class="font-bold ml-2"> {{ priceUSD }}$ </span>
        </div>
      </div>

      <div class="flex justify-between pt-5">
        <AutoTeleportActionButton
          ref="autoteleport"
          :amount="total"
          :label="$t('nft.action.confirm')"
          :disabled="disabled"
          :actions="actions"
          early-success
          auto-close-modal
          :auto-close-modal-delay-modal="0"
          @confirm="confirm"
          @actions:completed="$emit('completed')"
        />
      </div>
    </ModalBody>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoModal, NeoTooltip } from '@kodadot1/brick'
import { totalPriceUsd } from '../shoppingCart/utils'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import { sum } from '@/utils/math'
import { usePreferencesStore } from '@/stores/preferences'
import { useShoppingCartStore } from '@/stores/shoppingCart'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'
import { type AutoTeleportAction } from '@/composables/autoTeleport/types'
import { type AutoTeleportActionButtonConfirmEvent } from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'
import { useBuySupportFee } from '@/composables/transaction/utils'

const emit = defineEmits(['confirm', 'completed', 'close'])
const props = defineProps<{
  action: AutoTeleportAction
  loading: boolean
}>()

const prefrencesStore = usePreferencesStore()
const shoppingCartStore = useShoppingCartStore()
const { isLogIn } = useAuth()
const { urlPrefix } = usePrefix()

const autoteleport = ref()
const actions = computed(() => [props.action])

const loading = computed(() => !autoteleport.value?.isReady || props.loading)

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
  sum(items.value.map(nft => Number(nft.price))),
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

const disabled = computed(
  () => !isLogIn.value,
)

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
  emit('confirm', { ...params, items: items.value })
  prefrencesStore.setCompletePurchaseModalOpen(false)
}
</script>

<style lang="scss" scoped>
:deep(.identity-name-font-weight-regular) {
  .identity-name {
    font-weight: unset !important;
  }
}
</style>
