<template>
  <NeoModal
    :value="value"
    :can-cancel="['outside', 'escape']"
    scroll="clip"
    class="top"
    @close="onClose">
    <div class="modal-width">
      <header
        class="modal-card-head is-flex is-justify-content-space-between is-align-items-center border-bottom">
        <span class="modal-card-title is-size-6 has-text-weight-bold">
          {{ $t('mint.nft.confirm.action') }}
        </span>
        <NeoButton
          class="py-1 px-2"
          variant="text"
          no-shadow
          icon="xmark"
          icon-pack="fa-sharp"
          size="medium"
          @click.native="onClose" />
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
            data-testid="item-creator" />
        </div>
      </div>
      <div class="px-6 mt-4 has-text-weight-bold">Mint Collection</div>
      <div class="py-4">
        <ConfirmMintItem :nft="extendedInformation" class="px-6" />
      </div>
      <div class="px-6">
        <PriceItem :nft="extendedInformation" />
      </div>
      <div class="is-flex is-justify-content-space-between py-5 px-6">
        <NeoButton
          :label="btnLabel"
          variant="k-accent"
          no-shadow
          :disabled="disabled"
          class="is-flex is-flex-grow-1 btn-height"
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
import IdentityItem from '@/components/identity/IdentityItem.vue'
import ConfirmMintItem from './ConfirmMintItem.vue'
import PriceItem from './PriceItem.vue'
import { BaseMintedCollection } from '../base/types'
import { availablePrefixes } from '@/utils/chain'
import { Royalty } from '@/utils/royalty'

export type NftInformation = {
  file: Blob
  selectedCollection: BaseMintedCollection
  name: string
  price: string | number
  urlPrefix: string
  hasRoyalty: boolean
  royalty: Royalty
}

export type ExtendedInformation = NftInformation & {
  chainSymbol: string
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

const prefrencesStore = usePreferencesStore()
const shoppingCartStore = useShoppingCartStore()
const { isLogIn, accountId } = useAuth()
const { urlPrefix } = usePrefix()
const { $i18n } = useNuxtApp()
const { balance } = useBalance()
const { chainSymbol } = useChain()
const emit = defineEmits(['confirm', 'input'])

const extendedInformation = computed(() => ({
  ...props.nftInformation,
  chainSymbol: chainSymbol.value,
}))

const mode = computed(() => prefrencesStore.getCompletePurchaseModal.mode)

const items = computed(() => {
  if (mode.value === 'shopping-cart') {
    return shoppingCartStore.getItemsByPrefix(urlPrefix.value)
  }
  return shoppingCartStore.getItemToBuy ? [shoppingCartStore.getItemToBuy] : []
})

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

const blockchain = computed(
  () =>
    availablePrefixes().filter((e) => e.value === urlPrefix.value)[0].text || ''
)

const btnLabel = computed(() => {
  if (balanceIsEnough.value) {
    return $i18n.t('mint.nft.confirm.notEnoughFund', [
      chainSymbol.value,
      blockchain.value,
    ])
  }

  return $i18n.t('confirmPurchase.notEnoughFuns')
})

const disabled = computed(() => !balanceIsEnough.value || !isLogIn.value)

const onClose = () => {
  emit('input', false)
}

const confirm = () => {
  emit('confirm')
}
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
:deep .identity-name-font-weight-regular {
  .identity-name {
    font-weight: unset !important;
  }
}
</style>
