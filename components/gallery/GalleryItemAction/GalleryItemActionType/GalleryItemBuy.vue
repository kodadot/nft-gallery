<template>
  <div data-testid="item-section-buy">
    <GalleryItemPriceSection v-if="nft.price" title="Price" :price="nft.price">
      <div v-if="Number(nft.price)" class="is-flex desktop-full-w">
        <div class="is-flex buy-button-width">
          <NeoTooltip
            :active="disabled"
            class="w-full"
            content-class="buy-tooltip"
            :auto-close="isMobileDevice ? true : ['outside']"
            :position="isMobileDevice ? 'top' : 'left'"
            :triggers="[isMobileDevice ? 'click' : 'hover']"
            multiline>
            <template #content>
              <div class="is-size-6">
                {{
                  $t('tooltip.notEnoughBalanceChain', {
                    chain: chainNames[urlPrefix],
                  })
                }}
                <div>
                  {{ $t('tip') }}:
                  <nuxt-link :to="`/${urlPrefix}/teleport`" target="_blank">
                    {{ $t('useTeleport') }}</nuxt-link
                  >

                  {{ $t('or') }}

                  <a @click="addFunds"> {{ $t('addFunds') }}</a>
                </div>
              </div>
            </template>
            <NeoButton
              :label="label"
              size="large"
              class="button-height w-full"
              variant="k-accent"
              :disabled="disabled"
              data-testid="item-buy"
              @click="onClick" />
          </NeoTooltip>
        </div>

        <NeoButton
          class="button-height no-border-left"
          data-testid="item-add-to-cart"
          @click="onClickShoppingCart">
          <img :src="cartIcon" class="image is-32x32" />
        </NeoButton>
      </div>

      <div v-else>{{ $t('nft.notListed') }}</div>
    </GalleryItemPriceSection>

    <OnRampModal :value="showRampModal" @close="showRampModal = false" />
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoTooltip } from '@kodadot1/brick'
import GalleryItemPriceSection from '../GalleryItemActionSection.vue'
import { getKusamaAssetId } from '@/utils/api/bsx/query'
import { useIdentityStore } from '@/stores/identity'
import { useShoppingCartStore } from '@/stores/shoppingCart'
import { usePreferencesStore } from '@/stores/preferences'
import OnRampModal from '@/components/shared/OnRampModal.vue'
import { openShoppingCart } from '@/components/common/shoppingCart/ShoppingCartModalConfig'
import { NFT } from '@/components/rmrk/service/scheme'
import { nftToShoppingCardItem } from '@/components/common/shoppingCart/utils'
import { chainNames } from '@/libs/static/src/chains'

import { useWindowSize } from '@vueuse/core'

const props = defineProps<{ nft: NFT }>()
const isMobileDevice = computed(() => useWindowSize().width.value < 1024)

const { urlPrefix } = usePrefix()
const { accountId } = useAuth()
const { $i18n } = useNuxtApp()
const preferencesStore = usePreferencesStore()
const shoppingCartStore = useShoppingCartStore()
const { cartIcon } = useShoppingCartIcon(props.nft.id)

const instance = getCurrentInstance()
const { doAfterLogin } = useDoAfterlogin(instance)
const identityStore = useIdentityStore()
const connected = computed(() => Boolean(accountId.value))
const showRampModal = ref(false)

enum BuyStatus {
  BUY,
  CART,
}

const btnStatus = computed(() =>
  shoppingCartStore.isItemInCart(props.nft.id) ? BuyStatus.CART : BuyStatus.BUY
)

const label = computed(() => {
  if (btnStatus.value === BuyStatus.CART) {
    return $i18n.t('shoppingCart.gotToCart')
  }
  return $i18n.t(
    preferencesStore.getReplaceBuyNowWithYolo ? 'YOLO' : 'nft.action.buy'
  )
})

const addFunds = () => {
  showRampModal.value = true
}

const balance = computed<string>(() => {
  switch (urlPrefix.value) {
    case 'rmrk':
    case 'ksm':
    case 'ahk':
    case 'ahp':
      return identityStore.getAuthBalance
    case 'bsx':
      return identityStore.multiBalances.chains.basilisk?.ksm?.nativeBalance
    case 'snek':
      return identityStore.multiBalances.chains['basilisk-testnet']?.ksm
        ?.nativeBalance
    default:
      return identityStore.getTokenBalanceOf(getKusamaAssetId(urlPrefix.value))
  }
})
const disabled = computed(() => {
  if (btnStatus.value === BuyStatus.CART) {
    return false
  }
  if (!(Number(props.nft.price) && balance.value) || !connected.value) {
    return false
  }
  return Number(balance.value) <= Number(props.nft.price)
})

const openCompletePurcahseModal = () => {
  shoppingCartStore.setItemToBuy(nftToShoppingCardItem(props.nft))
  preferencesStore.setCompletePurchaseModal({
    isOpen: true,
    mode: 'buy-now',
  })
}

function onClick() {
  if (btnStatus.value === BuyStatus.CART) {
    openShoppingCart()
  } else {
    doAfterLogin({ onLoginSuccess: openCompletePurcahseModal })
  }
}

const onClickShoppingCart = () => {
  if (shoppingCartStore.isItemInCart(props.nft.id)) {
    shoppingCartStore.removeItem(props.nft.id)
  } else {
    shoppingCartStore.setItem(nftToShoppingCardItem(props.nft))
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

:deep(.button-height) {
  height: 55px !important;
}
.buy-button-width {
  width: 10rem;

  @include until-widescreen {
    width: 100%;
    flex-grow: 1;
  }
  .wrapper {
    width: 100%;
  }
}

.desktop-full-w {
  @include until-widescreen {
    width: 100%;
  }
}
</style>
