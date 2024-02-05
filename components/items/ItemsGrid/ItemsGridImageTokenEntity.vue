<template>
  <NftCard
    v-if="entity"
    :nft="entity"
    :link-to="linkTo"
    :placeholder="placeholder"
    :prefix="urlPrefix"
    :show-price="isAvailableToBuy"
    :variant="variant"
    :hide-media-info="hideMediaInfo"
    :display-name-with-sn="displayNameWithSn"
    :class="{
      'in-cart-border':
        shoppingCartStore.isItemInCart(nftForShoppingCart.id) ||
        listingCartStore.isItemInCart(entity.id),
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
      <div v-if="!isOwner && isAvailableToBuy" class="flex">
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
            class="icon"
            :icon="
              shoppingCartStore.isItemInCart(nftForShoppingCart.id)
                ? 'fa-striked-out-cart-shopping'
                : 'fa-shopping-cart-outline-sharp'
            "
            pack="fa-kit" />
        </NeoButton>
      </div>
      <div v-else-if="isOwner" class="flex">
        <template v-if="isStack">
          <NeoButton
            v-if="isThereAnythingToList !== undefined"
            :label="listLabel"
            data-testid="item-buy"
            no-shadow
            class="flex-grow btn-height"
            @click.prevent="onClickListingCart">
          </NeoButton>
        </template>

        <template v-else>
          <NeoButton
            :label="listLabel"
            data-testid="item-buy"
            no-shadow
            class="flex-grow btn-height"
            @click.prevent="onClickListingCart">
          </NeoButton>
        </template>
      </div>
    </template>
  </NftCard>
</template>

<script setup lang="ts">
// PLEASE FIX bind-key href => to
import { resolveComponent } from 'vue'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import type { NftCardVariant } from '@/components/shared/nftCard/types'
import type { TokenEntity } from '@/composables/useNft'
import { useShoppingCartStore } from '@/stores/shoppingCart'
import { useListingCartStore } from '@/stores/listingCart'
import { usePreferencesStore } from '@/stores/preferences'
import {
  nftToListingCartItem,
  nftToShoppingCartItem,
} from '@/components/common/shoppingCart/utils'

import useNftMetadata, { useNftCardIcon } from '@/composables/useNft'
import { getTokensNfts, useNftActions } from './useNftActions'
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
  entity: TokenEntity
  variant?: NftCardVariant
  hideMediaInfo?: boolean
  hideAction?: boolean
  hideVideoControls?: boolean
  displayNameWithSn?: boolean
}>()

const {
  getNFTForBuying,
  isAvailableToBuy,
  isStack,
  nftForShoppingCart,
  isOwner,
  isThereAnythingToList,
} = useNftActions(props.entity)
const cheapestNFT = ref<NFTWithMetadata>()

const { showCardIcon, cardIcon } = await useNftCardIcon(
  computed(() => props.entity),
)

const linkTo = computed(() =>
  isStack.value
    ? `/${urlPrefix.value}/collection/${props.entity.collection.id}`
    : `/${urlPrefix.value}/gallery/${props.entity.cheapest.id}`,
)

const variant = computed(() =>
  isStack.value ? `stacked-${props.variant}` : props.variant,
)

const { nft: nftMetadata } = useNftMetadata(props.entity)

const mediaPlayerCover = computed(() => nftMetadata.value?.image)

const showActionSection = computed(() => {
  return (
    !isLogIn.value &&
    shoppingCartStore.getItemToBuy?.id !== undefined &&
    shoppingCartStore.getItemToBuy?.id === cheapestNFT.value?.id
  )
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
  const isPriceAvailable = Number(nftForShoppingCart.value?.price)
  const shouldListForSale =
    (isStack.value && isThereAnythingToList.value) || !isPriceAvailable
  const isInCart = listingCartStore.isItemInCart(props.entity.id)

  const label = shouldListForSale
    ? $i18n.t('listingCart.listForSale')
    : $i18n.t('transaction.price.change')

  return isInCart ? label + ' ✓' : label
})

const { nft: entity } = useNft(props.entity)

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
    const nft = await getNFTForBuying()
    shoppingCartStore.setItemToBuy(nftToShoppingCartItem(nft))
    doAfterLogin({
      onLoginSuccess: openCompletePurcahseModal,
      onCancel: onCancelPurchase,
    })
  }
}

const onClickShoppingCart = async () => {
  if (shoppingCartStore.isItemInCart(nftForShoppingCart.value.id)) {
    shoppingCartStore.removeItem(nftForShoppingCart.value.id)
  } else {
    const nft = await getNFTForBuying()
    shoppingCartStore.setItem(nftToShoppingCartItem(nft))
  }
}

const onClickListingCart = async () => {
  const nftsToProcess = await getTokensNfts([props.entity])

  const floorPrice = nftsToProcess[0].collection.floorPrice[0]?.price || '0'

  for (const nft of nftsToProcess) {
    if (listingCartStore.isItemInCart(nft.id)) {
      listingCartStore.removeItem(nft.id)
    } else {
      listingCartStore.setItem(nftToListingCartItem(nft, floorPrice))
    }
  }
}

onMounted(async () => {
  cheapestNFT.value = await getNFTForBuying()
})
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
