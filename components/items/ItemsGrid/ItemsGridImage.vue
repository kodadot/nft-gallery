<template>
  <NftCard
    v-if="nft"
    :nft="nft"
    :placeholder="placeholder"
    :prefix="urlPrefix"
    :show-price="Number(nft?.price) > 0"
    :variant="variant"
    :hide-media-info="hideMediaInfo"
    :display-name-with-sn="displayNameWithSn"
    :show-timestamp="showTimestamp"
    :collection-popover-hide="collectionPopoverHide"
    :class="{
      'in-cart-border':
        shoppingCartStore.isItemInCart(nft.id) ||
        listingCartStore.isItemInCart(nft.id),
    }"
    :card-icon="showCardIcon"
    :card-icon-src="cardIcon"
    :show-action-on-hover="!showActionSection"
    :link="NuxtLink"
    bind-key="to"
    :media-player-cover="mediaPlayerCover"
    :media-static-video="hideVideoControls"
    media-hover-on-cover-play>
    <template v-if="!hideAction" #action>
      <div v-if="!isOwner && Number(nft?.price)" class="flex">
        <NeoButton
          :label="buyLabel"
          data-testid="item-buy"
          no-shadow
          :loading="showActionSection"
          class="flex-grow btn-height"
          loading-with-label
          @click.prevent="onClickBuy">
        </NeoButton>
        <NeoButton
          data-testid="item-add-to-cart"
          no-shadow
          class="fixed-width p-1 border-l-0 btn-height override-wrapper-width"
          @click.prevent="onClickShoppingCart">
          <NeoIcon
            class="w-4 h-4"
            :icon="
              shoppingCartStore.isItemInCart(nft.id)
                ? 'fa-striked-out-cart-shopping'
                : 'fa-shopping-cart-outline-sharp'
            "
            pack="fa-kit" />
        </NeoButton>
      </div>
      <div v-else-if="isOwner" class="flex">
        <NeoButton
          :label="listLabel"
          data-testid="item-buy"
          no-shadow
          class="flex-grow btn-height"
          @click.prevent="onClickListingCart">
        </NeoButton>
      </div>
    </template>
  </NftCard>
</template>

<script setup lang="ts">
// PLEASE FIX bind-key href => to
import { resolveComponent } from 'vue'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import type { NftCardVariant } from '@/components/shared/nftCard/types'
import type { NFTWithMetadata } from '@/composables/useNft'
import { useShoppingCartStore } from '@/stores/shoppingCart'
import { useListingCartStore } from '@/stores/listingCart'
import { usePreferencesStore } from '@/stores/preferences'
import {
  nftToListingCartItem,
  nftToShoppingCartItem,
} from '@/components/common/shoppingCart/utils'
import useNftMetadata, { useNftCardIcon } from '@/composables/useNft'

const { placeholder } = useTheme()
const { isLogIn, isCurrentOwner } = useAuth()
const { urlPrefix } = usePrefix()
const { doAfterLogin } = useDoAfterlogin(getCurrentInstance())
const shoppingCartStore = useShoppingCartStore()
const listingCartStore = useListingCartStore()
const preferencesStore = usePreferencesStore()
const { $i18n } = useNuxtApp()
const NuxtLink = resolveComponent('NuxtLink')

const props = defineProps<{
  nft: NFTWithMetadata
  variant?: NftCardVariant
  hideMediaInfo?: boolean
  hideAction?: boolean
  hideVideoControls?: boolean
  displayNameWithSn?: boolean
  showTimestamp?: boolean
  collectionPopoverHide?: boolean
}>()

const { showCardIcon, cardIcon } = useNftCardIcon(computed(() => props.nft))

const { nft: nftMetadata } = useNftMetadata(props.nft)

const mediaPlayerCover = computed(() => nftMetadata.value?.image)

const showActionSection = computed(() => {
  return !isLogIn.value && shoppingCartStore.getItemToBuy?.id === props.nft.id
})

const buyLabel = computed(function () {
  if (showActionSection.value) {
    return $i18n.t('shoppingCart.wallet')
  }

  return $i18n.t(
    preferencesStore.getReplaceBuyNowWithYolo ? 'YOLO' : 'shoppingCart.buyNow',
  )
})

const listLabel = computed(() => {
  const label = Number(props.nft.price)
    ? $i18n.t('transaction.price.change')
    : $i18n.t('listingCart.listForSale')
  return label + (listingCartStore.isItemInCart(props.nft.id) ? ' ✓' : '')
})

const { nft } = useNft(props.nft)

const isOwner = computed(() => isCurrentOwner(props.nft?.currentOwner))

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
  shoppingCartStore.setItemToBuy(nftToShoppingCartItem(props.nft))
  doAfterLogin({
    onLoginSuccess: openCompletePurcahseModal,
    onCancel: onCancelPurchase,
  })
}

const onClickShoppingCart = () => {
  if (shoppingCartStore.isItemInCart(props.nft.id)) {
    shoppingCartStore.removeItem(props.nft.id)
  } else {
    shoppingCartStore.setItem(nftToShoppingCartItem(props.nft))
  }
}
const onClickListingCart = () => {
  if (listingCartStore.isItemInCart(props.nft.id)) {
    listingCartStore.removeItem(props.nft.id)
  } else {
    const floorPrice = props.nft.collection.floorPrice[0]?.price || '0'
    listingCartStore.setItem(nftToListingCartItem(props.nft, floorPrice))
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

:deep(.override-wrapper-width) {
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
