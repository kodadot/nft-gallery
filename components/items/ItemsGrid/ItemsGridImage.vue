<template>
  <NftCard
    v-if="nft"
    :nft="nft"
    :placeholder="placeholder"
    :prefix="urlPrefix"
    :show-price="Number(nft?.price) > 0"
    :variant="variant"
    :hide-media-info="hideMediaInfo"
    :show-timestamp="showTimestamp"
    :collection-popover-hide="collectionPopoverHide"
    :lazy-loading="lazyLoading"
    :class="{ 'in-cart-border': shoppingCartStore.isItemInCart(nft.id) || isSelectActionItemInCart }"
    :show-action-on-hover="!showActionSection"
    :link="NuxtLink"
    bind-key="to"
    :media-static-video="hideVideoControls"
    media-hover-on-cover-play
    :link-target="linkTarget"
  >
    <template
      v-if="!hideAction"
      #action
    >
      <div
        v-if="!isOwner && Number(nft?.price) && !showAtomicSwapAction"
        class="flex"
      >
        <NeoButton
          :label="buyLabel"
          data-testid="item-buy"
          no-shadow
          :loading="showActionSection"
          class="flex-grow"
          loading-with-label
          @click.prevent="onClickBuy"
        />
        <NeoButton
          data-testid="item-add-to-cart"
          no-shadow
          class="p-1 !border-l-0"
          @click.prevent="onClickShoppingCart"
        >
          <NeoIcon
            class="w-4 h-4"
            :icon="
              shoppingCartStore.isItemInCart(nft.id)
                ? 'fa-striked-out-cart-shopping'
                : 'fa-shopping-cart-outline-sharp'
            "
            pack="fa-kit"
          />
        </NeoButton>
      </div>
      <div
        v-else-if="showSelectAction"
        class="flex"
      >
        <NeoButton
          :label="selectActionLabel"
          data-testid="item-buy"
          no-shadow
          class="flex-grow"
          @click.prevent="onSelectAction"
        />
      </div>
    </template>
  </NftCard>
  <NftCardSkeleton
    v-else
    :hide-media-info="hideMediaInfo"
    :variant="skeletonVariant"
  />
</template>

<script setup lang="ts">
// PLEASE FIX bind-key href => to
import { resolveComponent } from 'vue'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import useAtomicSwapAction from './useAtomicSwapAction'
import type { NftCardVariant } from '@/components/shared/nftCard/types'
import type { NFTWithMetadata } from '@/composables/useNft'
import { useShoppingCartStore } from '@/stores/shoppingCart'
import { useListingCartStore } from '@/stores/listingCart'
import { usePreferencesStore } from '@/stores/preferences'
import { nftToShoppingCartItem } from '@/components/common/shoppingCart/utils'

const { placeholder } = useTheme()
const { isLogIn, isCurrentAccount } = useAuth()
const { urlPrefix } = usePrefix()
const { doAfterLogin } = useDoAfterlogin()
const shoppingCartStore = useShoppingCartStore()
const listingCartStore = useListingCartStore()
const preferencesStore = usePreferencesStore()
const { listNftByNftWithMetadata } = useListingCartModal()
const { $i18n } = useNuxtApp()
const NuxtLink = resolveComponent('NuxtLink')

const props = defineProps<{
  nft: NFTWithMetadata
  variant?: NftCardVariant
  hideMediaInfo?: boolean
  hideAction?: boolean
  hideVideoControls?: boolean
  hideListing?: boolean
  showTimestamp?: boolean
  collectionPopoverHide?: boolean
  lazyLoading?: boolean
  skeletonVariant: string
  linkTarget?: string
}>()

const {
  onAtomicSwapSelect,
  showAtomicSwapAction,
  isItemSelected: isAtomicSwapItemSelected,
} = useAtomicSwapAction(props.nft)

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

const isOwner = computed(() => isCurrentAccount(props.nft?.currentOwner))

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
  }
  else {
    shoppingCartStore.setItem(nftToShoppingCartItem(props.nft))
  }
}

const onClickListingCart = () => listNftByNftWithMetadata(props.nft, { toggle: true })

const isSelectActionItemInCart = computed(() => isAtomicSwapItemSelected.value || listingCartStore.isItemInCart(props.nft.id))

const selectActionLabel = computed(() => isSelectActionItemInCart.value ? $i18n.t('remove') : $i18n.t('select'))

const showSelectAction = computed(() => showAtomicSwapAction.value || (isOwner.value && !props.hideListing))

const onSelectAction = () => {
  if (showAtomicSwapAction.value) {
    onAtomicSwapSelect()
  }
  else {
    onClickListingCart()
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.in-cart-border {
  @include ktheme() {
    outline: 2px solid theme('k-blue') !important;
    outline-offset: -1px;
    border-color: transparent !important;
    background-color: theme('blue-light-cards');
  }
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
