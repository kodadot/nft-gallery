<template>
  <NeoModal
    :value="value"
    :can-cancel="['outside', 'escape']"
    scroll="clip"
    class="top"
    max-height="calc(100vh - 180px)"
    @close="onClose">
    <div class="modal-width">
      <header
        class="modal-card-head is-flex is-justify-content-space-between is-align-items-center border-bottom">
        <span class="modal-card-title is-size-6 has-text-weight-bold">
          {{ $t('mint.nft.modal.action') }}
        </span>
        <NeoButton
          class="py-1 px-2"
          variant="text"
          no-shadow
          icon="xmark"
          size="medium"
          @click.native="onClose" />
      </header>
      <div v-if="isLogIn" class="px-6 pt-4">
        <div
          class="rounded border shade-border-color is-flex is-justify-content-start is-flex-grow-1 pl-3">
          <IdentityItem
            :label="$t('confirmPurchase.connectedWith')"
            hide-identity-popover
            disable-identity-link
            :prefix="urlPrefix"
            :account="accountId"
            class="identity-name-font-weight-regular"
            data-testid="item-creator" />
        </div>
      </div>
      <div class="px-6 mt-4 has-text-weight-bold">
        {{ title }}
      </div>
      <div class="py-4">
        <ConfirmMintItem :nft="extendedInformation" class="px-6" />
      </div>
      <div class="px-6">
        <PriceItem :nft="extendedInformation" />
      </div>
      <div class="py-5">
        <div class="is-flex is-justify-content-space-between px-6">
          <NeoButton
            :label="btnLabel"
            variant="k-accent"
            no-shadow
            :disabled="disabled"
            class="is-flex is-flex-grow-1 btn-height"
            @click.native="confirm" />
        </div>
        <div v-if="disabled" class="is-flex mt-2 is-justify-content-center">
          <a class="mr-1 has-text-k-blue" @click="openRampModal"
            >+ {{ $t('mint.nft.modal.addFunds') }}</a
          >
          {{ $t('mint.nft.modal.conjunction') }}
          <a v-safe-href="teleportLink" class="ml-1 has-text-k-blue">{{
            $t('mint.nft.modal.teleport')
          }}</a>
        </div>
      </div>
      <OnRampModal v-model="rampActive" @close="closeRampModal" />
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoModal } from '@kodadot1/brick'
import type { ChainProperties, Option } from '@kodadot1/static'
import { BaseMintedCollection } from '@/components/base/types'
import IdentityItem from '@/components/identity/IdentityItem.vue'
import OnRampModal from '@/components/shared/OnRampModal.vue'
import { CreateComponent } from '@/composables/useCreate'
import { useFiatStore } from '@/stores/fiat'
import { usePreferencesStore } from '@/stores/preferences'
import { availablePrefixes } from '@/utils/chain'
import { getTransitionFee } from '@/utils/transactionExecutor'
import formatBalance, { calculateBalanceUsdValue } from '@/utils/format/balance'
import { BASE_FEE } from '@/utils/support'
import ConfirmMintItem from './ConfirmMintItem.vue'
import PriceItem from './PriceItem.vue'

export type NftInformation = {
  file: Blob | null
  selectedCollection?: BaseMintedCollection
  name: string
  listForSale?: boolean
  price?: string
  mintType: CreateComponent
  paidToken: ChainProperties
}

export type ExtendedInformation = NftInformation & {
  blockchain: Option
  networkFee: number
  existentialDeposit: number
  kodadotFee: number
  kodadotUSDFee: number
  carbonlessFee: number
  carbonlessUSDFee: number
  totalFee: number
  totalUSDFee: number
}

const props = withDefaults(
  defineProps<{
    value: boolean
    nftInformation: NftInformation
  }>(),
  {
    value: false,
  }
)

const { isLogIn, accountId } = useAuth()
const { urlPrefix } = usePrefix()
const { $i18n } = useNuxtApp()
const fiatStore = useFiatStore()
const preferencesStore = usePreferencesStore()

const {
  balance,
  metadataDeposit,
  collectionDeposit,
  existentialDeposit,
  itemDeposit,
} = useDeposit(urlPrefix)

const emit = defineEmits(['confirm', 'input'])

const rampActive = ref(false)
const networkFee = ref(0)

const isNFT = computed(
  () => props.nftInformation.mintType === CreateComponent.NFT
)
const blockchain = computed(() =>
  availablePrefixes().find((prefix) => prefix.value === urlPrefix.value)
)
const chainSymbol = computed(() => props.nftInformation.paidToken?.tokenSymbol)
const decimals = computed(() => props.nftInformation.paidToken?.tokenDecimals)
const tokenPrice = computed(() =>
  Number(fiatStore.getCurrentTokenValue(chainSymbol.value) ?? 0)
)
const kodadotFee = computed(
  () =>
    ((preferencesStore.hasSupport ? BASE_FEE : 0) / tokenPrice.value) *
    Math.pow(10, decimals.value)
)
const carbonlessFee = computed(
  () =>
    ((preferencesStore.hasCarbonOffset && isNFT.value ? BASE_FEE * 2 : 0) /
      tokenPrice.value) *
    Math.pow(10, decimals.value)
)
const totalFee = computed(() => {
  return (
    deposit.value + carbonlessFee.value + kodadotFee.value + networkFee.value
  )
})
const deposit = computed(
  () =>
    metadataDeposit.value +
    existentialDeposit.value +
    (isNFT.value ? itemDeposit.value : collectionDeposit.value)
)
const totalUSDFee = computed(() =>
  calculateBalanceUsdValue(totalFee.value * tokenPrice.value, decimals.value)
)
const title = computed(() =>
  isNFT.value
    ? $i18n.t('mint.nft.modal.title')
    : $i18n.t('mint.collection.modal.title')
)
const balanceIsEnough = computed(
  () =>
    parseFloat(formatBalance(totalFee.value.toString(), decimals.value, '')) <
    parseFloat(balance.value)
)
const btnLabel = computed(() => {
  if (!isLogIn.value) {
    return $i18n.t('mint.nft.modal.login')
  }
  if (!balanceIsEnough.value) {
    return $i18n.t('mint.nft.modal.notEnoughFund', [
      chainSymbol.value,
      blockchain.value?.text,
    ])
  }
  return $i18n.t('mint.nft.modal.process')
})
const disabled = computed(() => !(balanceIsEnough.value && isLogIn.value))
const teleportLink = computed(() => `/${urlPrefix.value}/teleport`)
const extendedInformation = computed(() => ({
  ...props.nftInformation,
  networkFee: networkFee.value,
  existentialDeposit: deposit.value,
  kodadotFee: kodadotFee.value,
  kodadotUSDFee: BASE_FEE,
  carbonlessFee: carbonlessFee.value,
  carbonlessUSDFee: BASE_FEE * 2,
  totalFee: totalFee.value,
  totalUSDFee: totalUSDFee.value,
  blockchain: blockchain.value,
}))

const openRampModal = () => {
  rampActive.value = true
}

const closeRampModal = () => {
  rampActive.value = false
}

const onClose = () => {
  emit('input', false)
}

const confirm = () => {
  emit('confirm')
}

const calculateNetworkFee = async () => {
  networkFee.value = 0
  const fee = await getTransitionFee(accountId.value, [''], decimals.value)
  networkFee.value = Number(fee)
}

watch(
  () => chainSymbol.value,
  () => {
    calculateNetworkFee()
  },
  {
    immediate: true,
  }
)
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

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
:deep(.identity-name-font-weight-regular) {
  .identity-name {
    font-weight: unset !important;
  }
}
:deep(.o-modal__content) {
  width: unset;
}
</style>
