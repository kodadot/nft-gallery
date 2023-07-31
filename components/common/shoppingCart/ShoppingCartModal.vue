<template>
  <div>
    <div
      class="shopping-cart-modal-container theme-background-color border-left is-flex is-flex-direction-column">
      <header
        class="py-5 px-6 is-flex is-justify-content-space-between border-bottom">
        <span class="modal-card-title is-size-6 has-text-weight-bold">
          {{ $t('shoppingCart.title') }}
        </span>
        <NeoButton
          variant="text"
          no-shadow
          icon="close"
          @click.native="onClose" />
      </header>
      <div
        v-if="numberOfItems"
        class="mx-6 py-4 border-bottom card-border-color is-flex is-justify-content-space-between is-align-items-center">
        <span> {{ numberOfItems }} {{ $t('items') }}</span>

        <NeoButton
          :label="$t('shoppingCart.clearAll')"
          no-shadow
          variant="text"
          :href="`/${urlPrefix}/explore/items`"
          @click.native="clearAllItems" />
      </div>
      <div v-if="numberOfItems" class="scroll-y">
        <div
          class="theme-background-color is-flex is-flex-grow-1 is-flex-direction-column py-1">
          <ShoppingCartItemRow
            v-for="item in sortedItems"
            :key="item.id"
            :nft="item"
            allow-delete
            @delete="shoppingCartStore.removeItem" />
        </div>
        <div
          class="is-flex is-justify-content-space-between mx-6 py-4 border-top card-border-color">
          {{ $t('shoppingCart.total') }}
          <div class="is-flex">
            <Money :value="totalPrice" class="has-text-grey" />
            <span class="has-text-weight-bold ml-4"> ${{ priceUSD }} </span>
          </div>
        </div>
        <div class="is-flex is-justify-content-center mx-6 pt-4">
          <NeoButton
            :label="$t('shoppingCart.completePurchase')"
            :disabled="!accountId || !numberOfItems"
            class="w-full fixed-height"
            no-shadow
            variant="k-accent"
            @click.native="onCompletePurchase" />
        </div>
      </div>
      <div
        v-else
        class="is-flex is-justify-content-space-between px-6 py-4 is-flex-direction-column h-full">
        <div
          class="is-flex is-align-items-center is-flex-direction-column pt-8">
          <img :src="emptyCart" alt="empty cart" width="140px" class="mb-5" />
          <span class="has-text-weight-bold mb-2">{{
            $t('shoppingCart.emptyCart.line1')
          }}</span>
          <span class="text-align-center mb-5">{{
            $t('shoppingCart.emptyCart.line2')
          }}</span>
          <NeoButton
            :label="$t('shoppingCart.exploreNfts')"
            rounded
            no-shadow
            tag="a"
            :href="`/${urlPrefix}/explore/items`"
            icon="magnifying-glass" />
        </div>
        <div class="pt-4">
          <NeoButton
            :label="$t('shoppingCart.completePurchase')"
            disabled
            class="w-full fixed-height"
            no-shadow
            variant="k-accent" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { usePreferencesStore } from '@/stores/preferences'
import { useShoppingCartStore } from '@/stores/shoppingCart'
import ShoppingCartItemRow from './ShoppingCartItemRow.vue'
import { sum } from '@/utils/math'
import Money from '@/components/shared/format/Money.vue'

import emptyCart from '@/assets/empty-cart.png'
import { totalPriceUsd } from './utils'

const prefrencesStore = usePreferencesStore()
const shoppingCartStore = useShoppingCartStore()
const { accountId } = useAuth()
const { urlPrefix } = usePrefix()
const emit = defineEmits(['close'])

const items = computed(() =>
  shoppingCartStore.getItemsByPrefix(urlPrefix.value)
)

const numberOfItems = computed(() => items.value.length)

const priceUSD = computed(() => {
  const { nfts, royalties } = totalPriceUsd(items.value)
  return (nfts + royalties).toFixed(2)
})

const isOpen = computed({
  get: () => prefrencesStore.getShoppingCartCollapse,
  set: (value) => prefrencesStore.setShoppingCartCollapse(value),
})

const clearAllItems = () => {
  shoppingCartStore.removeAll()
}

const sortedItems = computed(() =>
  items.value.sort((a, b) => b.addedAt - a.addedAt)
)

const totalPrice = computed(() =>
  sum(sortedItems.value.map((nft) => Number(nft.price)))
)

// properly close modal when being closed from outside,e.g. by changeing chain
watch(isOpen, (newValue, oldValue) => {
  if (newValue === false && oldValue === true) {
    emit('close')
  }
})

const onClose = () => {
  emit('close')
  isOpen.value = false
  document.body.classList.remove('is-clipped')
}

const onCompletePurchase = () => {
  prefrencesStore.setCompletePurchaseModal({
    isOpen: true,
    mode: 'shopping-cart',
  })

  onClose()
}
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';
.shopping-cart-modal {
  .shopping-cart-modal-container {
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    padding-top: 83px;
    max-width: 400px;
    width: 100%;
    @include mobile {
      padding-top: 58px;
      max-width: 100vw;
    }
  }
}

.scroll-y {
  overflow-y: auto;
}

.fixed-height {
  height: 3.5rem;
}
</style>
