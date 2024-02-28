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

  const listNftByShoppingCartItem = async (cartItem: ShoppingCartItem) => {
    if (!isItemInCart(cartItem.id)) {
      const floorPrice = getFloorPrice(cartItem)

      listingCartStore.setItem(
        shoppingCartItemToListingCartItem(cartItem, floorPrice),
      )
    }
  }

  const listNftByNftWithMetadata = async (nftWithMetadata: NFTWithMetadata) => {
    if (!isItemInCart(nftWithMetadata.id)) {
      const floorPrice = getFloorPrice(nftWithMetadata)

      listingCartStore.setItem(
        nftToListingCartItem(nftWithMetadata, floorPrice),
      )
    }
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
