<template>
  <NeoNftCard
    v-if="nft"
    :nft="nft"
    :placeholder="placeholder"
    :prefix="urlPrefix"
    :show-price="Number(nft?.price) > 0"
    :variant="variant"
    :unloackable-icon="unlockableIcon"
    link="nuxt-link"
    bind-key="to">
    <template #hover-action>
      <div v-if="!isOwner && Number(nft?.price)" class="w-half is-flex">
        <NeoButton
          :label="buyLabel"
          data-cy="item-buy"
          no-shadow
          class="is-flex-grow-1 btn-height"
          :class="{ 'is-size-7 btn-height-minimal': variant === 'minimal' }"
          @click.native.prevent="onClickBuy" />
        <NeoButton
          data-cy="item-add-to-cart"
          no-shadow
          class="fixed-width p-1 no-border-left hover-color btn-height override-wrapper-width"
          :class="{
            'fixed-width-minimal btn-height-minimal': variant === 'minimal',
          }"
          @click.native.prevent="onClickShoppingCart">
          <img
            :src="cartIcon"
            class="image"
            :class="{ 'is-16x16': variant === 'minimal' }" />
        </NeoButton>
      </div>
    </template>
  </NeoNftCard>
</template>

<script setup lang="ts">
import { NeoButton, NeoNftCard } from '@kodadot1/brick'
import type { NftCardVariant } from '@kodadot1/brick'
import type { NFTWithMetadata } from '@/composables/useNft'
import { useShoppingCartStore } from '@/stores/shoppingCart'
import { usePreferencesStore } from '@/stores/preferences'
import { nftToShoppingCardItem } from '@/components/common/shoppingCart/utils'
import { openShoppingCart } from '@/components/common/shoppingCart/ShoppingCartModalConfig'
import { isOwner as checkOwner } from '@/utils/account'

const { urlPrefix } = usePrefix()
const { placeholder } = useTheme()
const { accountId } = useAuth()
const { unlockableIcon } = useUnlockableIcon()
const shoppingCartStore = useShoppingCartStore()
const preferencesStore = usePreferencesStore()
const { $i18n } = useNuxtApp()
const instance = getCurrentInstance()

const props = defineProps<{
  nft: NFTWithMetadata
  variant?: NftCardVariant
}>()

const buyLabel = computed(() => {
  if (shoppingCartStore.isItemInCart(props.nft.id)) {
    return $i18n.t('shoppingCart.gotToCart')
  }
  return $i18n.t(
    preferencesStore.getReplaceBuyNowWithYolo ? 'YOLO' : 'shoppingCart.buyNow'
  )
})

const { cartIcon } = useShoppingCartIcon(props.nft.id)

const { nft } = useNft(props.nft)

const isOwner = computed(() =>
  checkOwner(props.nft?.currentOwner, accountId.value)
)

const onClickBuy = () => {
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
  shoppingCartStore.setItem(nftToShoppingCardItem(props.nft))
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.w-half {
  width: 50%;
}
:deep .override-wrapper-width {
  .o-btn__wrapper {
    width: unset !important;
  }
}

.fixed-width {
  min-width: 35px;
}

.btn-height {
  height: 35px;
}

.fixed-width-minimal {
  min-width: 24px;
}
.btn-height-minimal {
  height: 24px;
}

.no-border-left {
  border-left: none !important;
}

.hover-color {
  &:hover {
    @include ktheme() {
      background-color: theme('background-color-inverse');
    }
    // can this be used in the composable to remove assets?
    img {
      filter: invert(1);
    }
  }
}
</style>
