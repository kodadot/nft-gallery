<template>
  <NeoModal
    v-model="isModalActive"
    no-shadow
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
      <div class="px-6 py-4">
        <div
          class="rounded border shade-border-color is-flex is-justify-content-start is-flex-grow-1 pl-3">
          <IdentityItem
            v-if="isLogIn"
            :label="$t('confirmPurchase.connectedWith')"
            :prefix="urlPrefix"
            :account="accountId"
            data-cy="item-creator" />
        </div>
      </div>
      <ShoppingCartItemRow v-for="nft in items" :key="nft.id" :nft="nft" />
      <div class="py-4 mx-6 border-top border-bottom card-border-color">
        <div class="is-flex is-justify-content-space-between mb-3">
          {{ $t('confirmPurchase.priceForNFTs') }}
          <Money :value="totalNFTsPrice" />
        </div>
        <div class="is-flex is-justify-content-space-between has-text-grey">
          {{ $t('confirmPurchase.royalties') }}
          <Money :value="totalRoyalties" />
        </div>
      </div>
      <div class="is-flex is-justify-content-space-between py-4 px-6">
        {{ $t('confirmPurchase.youWillPay') }}
        <div class="is-flex">
          <Money
            :value="totalNFTsPrice + totalRoyalties"
            class="has-text-grey" />
          <span class="has-text-weight-bold ml-4"> {{ priceUSD }}$ </span>
        </div>
      </div>

      <div class="is-flex is-justify-content-space-between py-4 px-6">
        <NeoButton
          :label="$t('nft.action.confirm')"
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
import ShoppingCartItemRow from './shoppingCart/ShoppingCartItemRow.vue'
import { sum } from '@/utils/math'
import Money from '@/components/shared/format/Money.vue'
import { usePreferencesStore } from '@/stores/preferences'
import { useShoppingCartStore } from '@/stores/shoppingCart'
import { totalPriceUsd } from './shoppingCart/utils'

const prefrencesStore = usePreferencesStore()
const shoppingCartStore = useShoppingCartStore()
const { isLogIn, accountId } = useAuth()
const { urlPrefix } = usePrefix()
const emit = defineEmits(['confirm'])

const mode = computed(() => prefrencesStore.getCompletePurchaseModal.mode)

const items = computed(() => {
  if (mode.value === 'shopping-cart') {
    return shoppingCartStore.getItemsByPrefix(urlPrefix.value)
  }
  return shoppingCartStore.getItemToBuy ? [shoppingCartStore.getItemToBuy] : []
})

const isModalActive = computed(
  () => prefrencesStore.getCompletePurchaseModal.isOpen
)

const totalNFTsPrice = computed(() =>
  sum(items.value.map((nft) => Number(nft.price)))
)
const totalRoyalties = computed(() =>
  sum(items.value.map((nft) => Number(nft.royalty?.amount ?? 0)))
)
const disabled = ref(false)

watch(
  () => totalNFTsPrice.value + totalRoyalties.value,
  (price) => {
    const { isBalanceEnough } = useIsBalanceEnough(price)
    disabled.value = !isBalanceEnough.value || !isLogIn.value
  }
)

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

.top {
  z-index: 100;
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
</style>
