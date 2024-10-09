<template>
  <NftCard
    v-if="entityOnChain"
    :nft="entityOnChain"
    :link-to="linkTo"
    :placeholder="placeholder"
    :prefix="urlPrefix"
    :show-price="isAvailableToBuy"
    :variant="variant"
    :hide-media-info="hideMediaInfo"
    :class="{
      'in-cart-border':
        shoppingCartStore.isItemInCart(nftForShoppingCart.id)
        || listingCartStore.isItemInCart(entity.id),
    }"
    :show-action-on-hover="!showActionSection"
    :link="NuxtLink"
    bind-key="to"
    :media-player-cover="entity.image"
    :media-static-video="hideVideoControls"
    :lazy-loading="lazyLoading"
    media-hover-on-cover-play
  >
    <template
      v-if="!hideAction"
      #action
    >
      <div
        v-if="!isOwner && isAvailableToBuy"
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
              shoppingCartStore.isItemInCart(nftForShoppingCart.id)
                ? 'fa-striked-out-cart-shopping'
                : 'fa-shopping-cart-outline-sharp'
            "
            pack="fa-kit"
          />
        </NeoButton>
      </div>
      <div
        v-else-if="isOwner && !hideListing"
        class="flex"
      >
        <template v-if="isStack">
          <NeoButton
            v-if="isThereAnythingToList !== undefined"
            :label="listLabel"
            data-testid="item-buy"
            no-shadow
            class="flex-grow"
            @click.prevent="onClickListingCart"
          />
        </template>

        <template v-else-if="listVisible(urlPrefix)">
          <NeoButton
            :label="listLabel"
            data-testid="item-buy"
            no-shadow
            class="flex-grow"
            @click.prevent="onClickListingCart"
          />
        </template>
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
import { getTokensNfts, useNftActions } from './useNftActions'
import type { NftCardVariant } from '@/components/shared/nftCard/types'
import type { TokenEntity } from '@/composables/useNft'
import { useShoppingCartStore } from '@/stores/shoppingCart'
import { useListingCartStore } from '@/stores/listingCart'
import { usePreferencesStore } from '@/stores/preferences'
import { listVisible } from '@/utils/config/permission.config'
import { nftToShoppingCartItem } from '@/components/common/shoppingCart/utils'
import { tokenIdToRoute } from '@/components/unique/utils'
import { fetchOdaToken } from '@/services/oda'

const { urlPrefix } = usePrefix()
const { placeholder } = useTheme()
const { isLogIn } = useAuth()
const { doAfterLogin } = useDoAfterlogin()
const shoppingCartStore = useShoppingCartStore()
const listingCartStore = useListingCartStore()
const preferencesStore = usePreferencesStore()
const { listNftByNftWithMetadata } = useListingCartModal()
const { $i18n } = useNuxtApp()
const NuxtLink = resolveComponent('NuxtLink')

const props = defineProps<{
  entity: TokenEntity
  variant?: NftCardVariant
  hideMediaInfo?: boolean
  hideAction?: boolean
  hideVideoControls?: boolean
  lazyLoading?: boolean
  skeletonVariant: string
  hideListing?: boolean
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

const linkTo = computed(() =>
  isStack.value
    ? `/${urlPrefix.value}/collection/${props.entity.collection.id}`
    : `/${urlPrefix.value}/gallery/${props.entity.cheapest.id}`,
)

const variant = computed(() =>
  isStack.value ? `stacked-${props.variant}` : props.variant,
)

const showActionSection = computed(() => {
  return (
    !isLogIn.value
    && shoppingCartStore.getItemToBuy?.id !== undefined
    && shoppingCartStore.getItemToBuy?.id === cheapestNFT.value?.id
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
  const shouldListForSale
    = (isStack.value && isThereAnythingToList.value) || !isPriceAvailable
  const isInCart = listingCartStore.isItemInCart(props.entity.id)

  const label = shouldListForSale
    ? $i18n.t('listingCart.listForSale')
    : $i18n.t('transaction.price.change')

  return isInCart ? label + ' ✓' : label
})

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
  }
  else {
    const nft = await getNFTForBuying()
    shoppingCartStore.setItem(nftToShoppingCartItem(nft))
  }
}

const onClickListingCart = async () => {
  const nftsToProcess = await getTokensNfts([props.entity])

  for (const nft of nftsToProcess) {
    listNftByNftWithMetadata(nft, { toggle: true })
  }
}

onMounted(async () => {
  cheapestNFT.value = await getNFTForBuying()
})

const entityOnChain = ref(props.entity)
const { isAssetHub } = useIsChain(urlPrefix)

onMounted(async () => {
  // until fixed on indexer side
  // ref: https://github.com/kodadot/nft-gallery/pull/10934#issuecomment-2335128843
  if (variant.value === 'minimal' && isAssetHub.value) {
    const { id: collectionId, item: tokenId } = tokenIdToRoute(props.entity.cheapest.id)
    const metadata = await fetchOdaToken(urlPrefix.value, collectionId, tokenId)

    if (metadata.metadata) {
      entityOnChain.value = {
        ...props.entity,
        name: metadata.metadata.name,
      }
    }
  }
})
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
