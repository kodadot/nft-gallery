<template>
  <NeoNftCard
    v-if="nft"
    ref="hoverable"
    :nft="nft"
    :placeholder="placeholder"
    :prefix="urlPrefix"
    :show-price="isAvailableToBuy"
    :variant="variant"
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
    media-hover-on-cover-play>
    <template #action>
      <div v-if="!userIsOwner && isAvailableToBuy" class="is-flex">
        <NeoButton
          :label="buyLabel"
          data-testid="item-buy"
          no-shadow
          :loading="showActionSection"
          class="is-flex-grow-1 btn-height"
          loading-with-label
          @click.prevent="onClickBuy">
        </NeoButton>
        <NeoButton
          data-testid="item-add-to-cart"
          no-shadow
          class="fixed-width p-1 no-border-left btn-height override-wrapper-width"
          @click.prevent="onClickShoppingCart">
          <img :src="cartIcon" class="image is-16x16" alt="cart icon" />
        </NeoButton>
      </div>
      <div v-else-if="userIsOwner" class="is-flex">
        <template v-if="isStack">
          <NeoButton
            v-if="countOfNFTSAbailableToList !== undefined"
            :label="listLabel"
            data-testid="item-buy"
            no-shadow
            class="is-flex-grow-1 btn-height"
            @click.prevent="onClickListingCart">
          </NeoButton>
        </template>

        <template v-else>
          <NeoButton
            :label="listLabel"
            data-testid="item-buy"
            no-shadow
            class="is-flex-grow-1 btn-height"
            @click.prevent="onClickListingCart">
          </NeoButton>
        </template>
      </div>
    </template>
  </NeoNftCard>
</template>

<script setup lang="ts">
// PLEASE FIX bind-key href => to
import { resolveComponent } from 'vue'
import { NeoButton, NeoNftCard } from '@kodadot1/brick'
import type { NftCardVariant } from '@kodadot1/brick'
import type { NFTWithMetadata, TokenEntity } from '@/composables/useNft'
import { useShoppingCartStore } from '@/stores/shoppingCart'
import { useListingCartStore } from '@/stores/listingCart'
import { usePreferencesStore } from '@/stores/preferences'
import {
  nftToListingCartItem,
  nftToShoppingCartItem,
} from '@/components/common/shoppingCart/utils'

import useNftMetadata, { useNftCardIcon } from '@/composables/useNft'
import { useNftActions } from './useNftActions'
const { urlPrefix } = usePrefix()
const { placeholder } = useTheme()
const { isLogIn } = useAuth()
const { doAfterLogin } = useDoAfterlogin(getCurrentInstance())
const shoppingCartStore = useShoppingCartStore()
const listingCartStore = useListingCartStore()
const preferencesStore = usePreferencesStore()
const { $i18n } = useNuxtApp()
const NuxtLink = resolveComponent('NuxtLink')

const props = defineProps<{
  nft: NFTWithMetadata | TokenEntity
  variant?: NftCardVariant
}>()

const {
  fetchNft,
  isAvailableToBuy,
  isStack,
  nftForShoppingCart,
  userIsOwner,
  hoverable,
  getNftsForListingCart,
  countOfNFTSAbailableToList,
} = useNftActions(props.nft)

const { showCardIcon, cardIcon } = await useNftCardIcon(
  computed(() => props.nft),
)

const variant = computed(() =>
  isStack.value ? `stacked-${props.variant}` : props.variant,
)

const { nft: nftMetadata } = useNftMetadata(props.nft as NFTWithMetadata)

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
  if (isStack.value) {
    return countOfNFTSAbailableToList.value === 0
      ? $i18n.t('transaction.price.change')
      : $i18n.t('listingCart.listForSale')
  } else {
    const label = Number(nftForShoppingCart.value?.price)
      ? $i18n.t('transaction.price.change')
      : $i18n.t('listingCart.listForSale')
    return label + (listingCartStore.isItemInCart(props.nft.id) ? ' ✓' : '')
  }
})

const { cartIcon } = useShoppingCartIcon(props.nft.id)

const { nft } = useNft(props.nft as NFTWithMetadata)

const openCompletePurcahseModal = () => {
  preferencesStore.setCompletePurchaseModal({
    isOpen: true,
    mode: 'buy-now',
  })
}

const onCancelPurchase = () => {
  shoppingCartStore.removeItemToBuy()
}

const onClickBuy = async () => {
  if (isAvailableToBuy.value) {
    const nft = await fetchNft()
    shoppingCartStore.setItemToBuy(nftToShoppingCartItem(nft))
    doAfterLogin({
      onLoginSuccess: openCompletePurcahseModal,
      onCancel: onCancelPurchase,
    })
  }
}

const onClickShoppingCart = async () => {
  if (shoppingCartStore.isItemInCart(props.nft.id)) {
    shoppingCartStore.removeItem(props.nft.id)
  } else {
    const nft = await fetchNft()
    shoppingCartStore.setItem(nftToShoppingCartItem(nft))
  }
}

const onClickListingCart = async () => {
  const nftsToProcess = await getNftsForListingCart()
  const floorPrice = '0'

  for (const nft of nftsToProcess) {
    if (listingCartStore.isItemInCart(nft.id)) {
      listingCartStore.removeItem(nft.id)
    } else {
      const item = nftToListingCartItem(nft, floorPrice)
      listingCartStore.setItem(item)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.w-half {
  width: 50%;
}
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
