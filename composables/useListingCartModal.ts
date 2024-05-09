import {
  nftToListingCartItem,
  shoppingCartItemToListingCartItem,
} from '@/components/common/shoppingCart/utils'
import { ShoppingCartItem } from '@/components/common/shoppingCart/types'
import { NFTWithMetadata } from './useNft'
import { ListCartItemMediaUrl } from '@/stores/listingCart'

export default ({
  clearItemsOnModalClose = false,
  clearItemsOnBeforeUnmount = false,
  closeModalOnBeforeUnmount = false,
}: {
  clearItemsOnModalClose?: boolean
  clearItemsOnBeforeUnmount?: boolean
  closeModalOnBeforeUnmount?: boolean
} = {}) => {
  const listingCartStore = useListingCartStore()
  const preferencesStore = usePreferencesStore()
  const { isItemInCart } = listingCartStore

  const getFloorPrice = (cartItem: ShoppingCartItem | NFTWithMetadata) =>
    cartItem.collection.floorPrice[0]?.price || '0'

  const tryAddingItemToListingCart = (item: ListCartItem) => {
    if (!isItemInCart(item.id)) {
      listingCartStore.setItem(item)
    }
  }

  const listNftByShoppingCartItem = (cartItem: ShoppingCartItem) => {
    tryAddingItemToListingCart(
      shoppingCartItemToListingCartItem(cartItem, getFloorPrice(cartItem)),
    )
  }

  const listNftByNftWithMetadata = (
    nftWithMetadata: NFTWithMetadata,
    mediaUrl?: ListCartItemMediaUrl,
  ) => {
    tryAddingItemToListingCart(
      nftToListingCartItem(
        nftWithMetadata,
        getFloorPrice(nftWithMetadata),
        mediaUrl,
      ),
    )
  }

  const openListingCartModal = () =>
    (preferencesStore.listingCartModalOpen = true)

  const clearItemsInChain = () => {
    listingCartStore.itemsInChain.forEach((item) =>
      listingCartStore.removeItem(item.id),
    )
  }

  onBeforeUnmount(() => {
    if (closeModalOnBeforeUnmount) {
      preferencesStore.listingCartModalOpen = false
    }
    if (clearItemsOnBeforeUnmount) {
      clearItemsInChain()
    }
  })

  if (clearItemsOnModalClose) {
    watch(
      () => preferencesStore.listingCartModalOpen,
      (isOpen, wasOpen) => {
        if (!isOpen && wasOpen) {
          clearItemsInChain()
        }
      },
    )
  }

  return {
    listNftByShoppingCartItem,
    listNftByNftWithMetadata,
    openListingCartModal,
  }
}
