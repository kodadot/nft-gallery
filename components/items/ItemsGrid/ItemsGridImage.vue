<template>
  <NeoNftCard
    v-if="nft"
    :nft="nft"
    :placeholder="placeholder"
    :prefix="urlPrefix"
    :show-price="Number(nft?.price) > 0"
    :variant="variant"
    :class="{
      'in-cart-border':
        shoppingCartStore.isItemInCart(nft.id) ||
        listingCartStore.isItemInCart(nft.id),
    }"
    :unloackable-icon="unlockableIcon"
    :show-action-on-hover="!showActionSection"
    link="nuxt-link"
    bind-key="to">
    <template #action>
      <div v-if="!isOwner && Number(nft?.price)" class="is-flex">
        <NeoButton
          :label="buyLabel"
          data-cy="item-buy"
          no-shadow
          :loading="showActionSection"
          class="is-flex-grow-1 btn-height"
          loading-with-label
          @click.native.prevent="onClickBuy">
        </NeoButton>
        <NeoButton
          data-cy="item-add-to-cart"
          no-shadow
          class="fixed-width p-1 no-border-left btn-height override-wrapper-width"
          @click.native.prevent="onClickShoppingCart">
          <img :src="cartIcon" class="image is-16x16" />
        </NeoButton>
      </div>
      <div v-else-if="isOwner" class="is-flex">
        <NeoButton
          :label="listLabel"
          data-cy="item-buy"
          no-shadow
          class="is-flex-grow-1 btn-height"
          @click.native.prevent="onClickListingCart">
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
import { useListingCartStore } from '@/stores/listingCart'
import { usePreferencesStore } from '@/stores/preferences'
import { nftToShoppingCardItem } from '@/components/common/shoppingCart/utils'
import { isOwner as checkOwner } from '@/utils/account'

const { urlPrefix } = usePrefix()
const { placeholder } = useTheme()
const { accountId, isLogIn } = useAuth()
const { doAfterLogin } = useDoAfterlogin(getCurrentInstance())
const { unlockableIcon } = useUnlockableIcon()
const shoppingCartStore = useShoppingCartStore()
const listingCartStore = useListingCartStore()
const preferencesStore = usePreferencesStore()
const { $i18n } = useNuxtApp()

const props = defineProps<{
  nft: NFTWithMetadata
  variant?: NftCardVariant
}>()

const showActionSection = computed(() => {
  return !isLogIn.value && shoppingCartStore.getItemToBuy?.id === nft.value.id
})

const buyLabel = computed(function () {
  if (showActionSection.value) {
    return $i18n.t('shoppingCart.wallet')
  }

  return $i18n.t(
    preferencesStore.getReplaceBuyNowWithYolo ? 'YOLO' : 'shoppingCart.buyNow'
  )
})

const listLabel = computed(() => {
  const label = Boolean(Number(props.nft.price))
    ? 'Change Price'
    : 'List For Sale'
  return label + (listingCartStore.isItemInCart(props.nft.id) ? ' ✓' : '')
})

const { cartIcon } = useShoppingCartIcon(props.nft.id)

const { nft } = useNft(props.nft)

const isOwner = computed(() =>
  checkOwner(props.nft?.currentOwner, accountId.value)
)

const openCompletePurcahseModal = () => {
  preferencesStore.setCompletePurchaseModal({
    isOpen: true,
    mode: 'buy-now',
  })
}

const onCancelPurchase = () => {
  shoppingCartStore.removeItemToBuy()
}

const onClickBuy = () => {
  shoppingCartStore.setItemToBuy(nftToShoppingCardItem(props.nft))
  doAfterLogin({
    onLoginSuccess: openCompletePurcahseModal,
    onCancel: onCancelPurchase,
  })
}

const onClickShoppingCart = () => {
  if (shoppingCartStore.isItemInCart(props.nft.id)) {
    shoppingCartStore.removeItem(props.nft.id)
  } else {
    shoppingCartStore.setItem(nftToShoppingCardItem(props.nft))
  }
}

const onClickListingCart = () => {
  console.log(listLabel)
  if (listingCartStore.isItemInCart(props.nft.id)) {
    listingCartStore.removeItem(props.nft.id)
  } else {
    listingCartStore.setItem(nftToShoppingCardItem(props.nft))
  }
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
.in-cart-border {
  @include ktheme() {
    outline: 2px solid theme('k-blue') !important;
    outline-offset: -1px;
    border-color: transparent !important;
    background-color: theme('blue-light-cards');
  }
}

.fixed-width {
  min-width: 35px;
}

.btn-height {
  height: 35px;
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
