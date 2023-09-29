<template>
  <div>
    <div
      class="shopping-cart-modal-container theme-background-color border-left is-flex is-flex-direction-column">
      <NeoModalHead
        :title="$t('shoppingCart.title')"
        @close="closeShoppingCart(ModalCloseType.BACK)" />
      <div
        v-if="numberOfItems"
        class="mx-6 py-4 border-bottom border-k-shade is-flex is-justify-content-space-between is-align-items-center">
        <span> {{ numberOfItems }} {{ $t('items') }}</span>

        <NeoButton
          v-safe-href="`/${urlPrefix}/explore/items`"
          :label="$t('shoppingCart.clearAll')"
          no-shadow
          variant="text"
          @click="clearAllItems" />
      </div>
      <div v-if="numberOfItems" class="scroll-y">
        <div
          class="theme-background-color is-flex is-flex-grow-1 is-flex-direction-column py-2">
          <ShoppingCartItemRow
            v-for="item in sortedItems"
            :key="item.id"
            :nft="item"
            clickable
            class="px-6 py-2 limit-name-width"
            allow-delete
            @delete="shoppingCartStore.removeItem"
            @click-item="closeShoppingCart" />
        </div>
        <div
          class="is-flex is-justify-content-space-between mx-6 py-4 border-top border-k-shade">
          {{ $t('shoppingCart.total') }}
          <div class="is-flex">
            <CommonTokenMoney :value="totalPrice" class="has-text-grey" />
            <span class="has-text-weight-bold ml-4"> ${{ priceUSD }} </span>
          </div>
        </div>
        <div class="is-flex is-justify-content-center mx-6 pt-4 pb-5">
          <NeoButton
            :label="$t('shoppingCart.completePurchase')"
            :disabled="!numberOfItems"
            class="w-full fixed-height"
            no-shadow
            variant="k-accent"
            @click="onCompletePurchase" />
        </div>
      </div>
      <div
        v-else
        class="is-flex is-justify-content-space-between px-6 py-4 is-flex-direction-column h-full">
        <div
          class="is-flex is-align-items-center is-flex-direction-column pt-8">
          <img
            :src="emptyCartPlaceholder"
            alt="empty cart"
            width="140"
            class="mb-5" />
          <span class="has-text-weight-bold mb-2">{{
            $t('shoppingCart.emptyCart.line1')
          }}</span>
          <span class="text-align-center mb-5">{{
            $t('shoppingCart.emptyCart.line2')
          }}</span>
          <NeoButton
            v-safe-href="`/${urlPrefix}/explore/items`"
            :label="$t('shoppingCart.exploreNfts')"
            rounded
            no-shadow
            tag="a"
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
import { NeoButton, NeoModalHead } from '@kodadot1/brick'
import { usePreferencesStore } from '@/stores/preferences'
import { useShoppingCartStore } from '@/stores/shoppingCart'
import ShoppingCartItemRow from './ShoppingCartItemRow.vue'
import { sum } from '@/utils/math'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import { ModalCloseType } from '@/components/navbar/types'

import { totalPriceUsd } from './utils'

const prefrencesStore = usePreferencesStore()
const shoppingCartStore = useShoppingCartStore()
const { urlPrefix } = usePrefix()
const { doAfterLogin } = useDoAfterlogin(getCurrentInstance())
const { isDarkMode } = useTheme()

const emit = defineEmits(['close'])

const items = computed(() =>
  shoppingCartStore.getItemsByPrefix(urlPrefix.value)
)

const emptyCartPlaceholder = computed(() =>
  isDarkMode.value ? '/cart/empty-cart-dark.svg' : '/cart/empty-cart.svg'
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
  shoppingCartStore.clear()
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

const closeShoppingCart = (
  type: ModalCloseType = ModalCloseType.NAVIGATION
) => {
  emit('close', type)
  isOpen.value = false
  document.body.classList.remove('is-clipped')
}

const openCompletePurcahseModal = () => {
  prefrencesStore.setCompletePurchaseModal({
    isOpen: true,
    mode: 'shopping-cart',
  })
}

const onCompletePurchase = () => {
  closeShoppingCart()

  // fix: scroll clip mode not working
  setTimeout(() => {
    doAfterLogin({ onLoginSuccess: openCompletePurcahseModal })
  }, 100)
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';
.shopping-cart-modal {
  .shopping-cart-modal-container {
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    padding-top: 83px;
    max-width: 360px;
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
