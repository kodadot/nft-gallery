import {
  nftToListingCartItem,
  shoppingCartItemToListingCartItem,
} from '@/components/common/shoppingCart/utils'
import { ShoppingCartItem } from '@/components/common/shoppingCart/types'
import { NFTWithMetadata } from './useNft'

export default () => {
  const listingCartStore = useListingCartStore()
  const preferencesStore = usePreferencesStore()

  const getFloorPrice = (cartItem: ShoppingCartItem | NFTWithMetadata) =>
    cartItem.collection.floorPrice[0]?.price || '0'

  const isItemInCart = (id: string) => listingCartStore.isItemInCart(id)

  const tryAddingItemToListingCart = (item: ListCartItem) => {
    if (!isItemInCart(item.id)) {
      listingCartStore.setItem(item)
    }
  }

  const listNftByShoppingCartItem = async (cartItem: ShoppingCartItem) => {
    tryAddingItemToListingCart(
      shoppingCartItemToListingCartItem(cartItem, getFloorPrice(cartItem)),
    )
  }

  const listNftByNftWithMetadata = async (nftWithMetadata: NFTWithMetadata) => {
    tryAddingItemToListingCart(
      nftToListingCartItem(nftWithMetadata, getFloorPrice(nftWithMetadata)),
    )
  }

  const openListingCartModal = () =>
    (preferencesStore.listingCartModalOpen = true)

  onBeforeUnmount(() => {
    preferencesStore.listingCartModalOpen = false
    listingCartStore.itemsInChain.forEach((item) =>
      listingCartStore.removeItem(item.id),
    )
  })

  return {
    listNftByShoppingCartItem,
    listNftByNftWithMetadata,
    openListingCartModal,
  }
}
