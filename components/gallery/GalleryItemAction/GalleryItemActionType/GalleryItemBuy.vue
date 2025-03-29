<template>
  <div data-testid="item-section-buy">
    <GalleryItemPriceSection
      v-if="nft.price"
      title="Price"
      :price="nft.price"
    >
      <div
        v-if="Number(nft.price)"
        class="flex desktop-full-w"
      >
        <div class="flex buy-button-width">
          <NeoButton
            :label="label"
            size="large"
            class="button-height w-full"
            variant="primary"
            data-testid="item-buy"
            @click="onClick"
          />
        </div>

        <NeoButton
          class="button-height square-button-width border-l-0"
          data-testid="item-add-to-cart"
          @click="onClickShoppingCart"
        >
          <KIcon
            size="medium"
            class="w-4 h-4"
            :name="
              shoppingCartStore.isItemInCart(nft.id)
                ? 'i-mdi:cart-off'
                : 'i-mdi:cart'
            "
          />
        </NeoButton>
      </div>

      <div v-else>
        {{ $t('nft.notListed') }}
      </div>
    </GalleryItemPriceSection>

    <OnRampModal
      v-model="showRampModal"
      @close="showRampModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import GalleryItemPriceSection from '../GalleryItemActionSection.vue'
import { useShoppingCartStore } from '@/stores/shoppingCart'
import { usePreferencesStore } from '@/stores/preferences'
import { openShoppingCart } from '@/components/common/shoppingCart/ShoppingCartModalConfig'
import type { NFT } from '@/types'
import { nftToShoppingCartItem } from '@/components/common/shoppingCart/utils'
import { doAfterCheckCurrentChainVM } from '@/components/common/ConnectWallet/openReconnectWalletModal'

const props = defineProps<{ nft: NFT }>()

const { $i18n } = useNuxtApp()
const preferencesStore = usePreferencesStore()
const shoppingCartStore = useShoppingCartStore()
const { doAfterLogin } = useDoAfterlogin()
const showRampModal = ref(false)

enum BuyStatus {
  BUY,
  CART,
}

const btnStatus = computed(() =>
  shoppingCartStore.isItemInCart(props.nft.id) ? BuyStatus.CART : BuyStatus.BUY,
)

const label = computed(() => {
  if (btnStatus.value === BuyStatus.CART) {
    return $i18n.t('shoppingCart.gotToCart')
  }
  return $i18n.t(
    preferencesStore.getReplaceBuyNowWithYolo ? 'YOLO' : 'nft.action.buy',
  )
})

const openCompletePurcahseModal = () => {
  doAfterCheckCurrentChainVM(() => {
    shoppingCartStore.setItemToBuy(nftToShoppingCartItem(props.nft))
    preferencesStore.setCompletePurchaseModal({
      isOpen: true,
      mode: 'buy-now',
    })
  })
}

function onClick() {
  if (btnStatus.value === BuyStatus.CART) {
    openShoppingCart()
  }
  else {
    doAfterLogin({ onLoginSuccess: openCompletePurcahseModal })
  }
}

const onClickShoppingCart = () => {
  if (shoppingCartStore.isItemInCart(props.nft.id)) {
    shoppingCartStore.removeItem(props.nft.id)
  }
  else {
    shoppingCartStore.setItem(nftToShoppingCartItem(props.nft))
  }
}
</script>

<style lang="scss" scoped>
:deep(.button-height) {
  height: 55px !important;
}

.square-button-width {
  width: 6.25rem;
}
.buy-button-width {
  width: 8.375rem;
  @apply bulma-until-widescreen:w-full bulma-until-widescreen:flex-grow;
}

.desktop-full-w {
  @apply bulma-until-widescreen:w-full;
}
</style>
