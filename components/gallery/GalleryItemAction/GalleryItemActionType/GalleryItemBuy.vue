<template>
  <div data-cy="item-section-buy">
    <GalleryItemPriceSection
      v-if="nft.price"
      ref="root"
      title="Price"
      :price="nft.price">
      <div v-if="Number(nft.price)" class="is-flex desktop-full-w">
        <div class="is-flex buy-button-width">
          <NeoTooltip
            class="w-full"
            :active="disabled"
            :label="$t('tooltip.notEnoughBalance')"
            multiline>
            <NeoButton
              :label="label"
              size="large"
              class="button-height w-full"
              variant="k-accent"
              :disabled="disabled"
              data-cy="item-buy"
              @click.native="onClick" />
          </NeoTooltip>
        </div>

        <NeoButton
          class="button-height no-border-left"
          data-cy="item-add-to-cart"
          @click.native="onClickShoppingCart">
          <img :src="cartIcon" class="image is-32x32" />
        </NeoButton>
      </div>

      <div v-else>{{ $t('nft.notListed') }}</div>
    </GalleryItemPriceSection>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoTooltip } from '@kodadot1/brick'
import GalleryItemPriceSection from '../GalleryItemActionSection.vue'
import { getKusamaAssetId } from '@/utils/api/bsx/query'
import { ConnectWalletModalConfig } from '@/components/common/ConnectWallet/useConnectWallet'
import { useIdentityStore } from '@/stores/identity'
import { useShoppingCartStore } from '@/stores/shoppingCart'
import { usePreferencesStore } from '@/stores/preferences'

import Vue from 'vue'
import { openShoppingCart } from '@/components/common/shoppingCart/ShoppingCartModalConfig'
import { NFT } from '@/components/rmrk/service/scheme'
import { nftToShoppingCardItem } from '@/components/common/shoppingCart/utils'

const props = defineProps<{ nft: NFT }>()

const { urlPrefix } = usePrefix()
const { accountId } = useAuth()
const root = ref<Vue<Record<string, string>>>()
const { $i18n, $buefy } = useNuxtApp()
const preferencesStore = usePreferencesStore()
const shoppingCartStore = useShoppingCartStore()
const { cartIcon } = useShoppingCartIcon(props.nft.id)

const instance = getCurrentInstance()
const identityStore = useIdentityStore()
const connected = computed(() => Boolean(accountId.value))

const label = computed(() => {
  if (shoppingCartStore.isItemInCart(props.nft.id)) {
    return $i18n.t('shoppingCart.gotToCart')
  }
  return $i18n.t(
    preferencesStore.getReplaceBuyNowWithYolo ? 'YOLO' : 'nft.action.buy'
  )
})

const balance = computed<string>(() => {
  switch (urlPrefix.value) {
    case 'rmrk':
    case 'ksm':
    case 'stmn':
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
  if (shoppingCartStore.isItemInCart(props.nft.id)) {
    return false
  }
  if (!(Number(props.nft.price) && balance.value) || !connected.value) {
    return false
  }
  return Number(balance.value) <= Number(props.nft.price)
})

function onClick() {
  if (!connected.value) {
    $buefy.modal.open({
      parent: root?.value,
      ...ConnectWalletModalConfig,
    })
    return
  }

  if (shoppingCartStore.isItemInCart(props.nft.id)) {
    openShoppingCart(instance)
  } else {
    shoppingCartStore.setItemToBuy(nftToShoppingCardItem(props.nft))
    preferencesStore.setCompletePurchaseModal({
      isOpen: true,
      mode: 'buy-now',
    })
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
@import '@/styles/abstracts/variables';

:deep .button-height {
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
.no-border-left {
  border-left: none !important;
}

.desktop-full-w {
  @include until-widescreen {
    width: 100%;
  }
}
</style>
