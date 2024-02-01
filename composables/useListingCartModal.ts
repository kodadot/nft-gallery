import { shoppingCartItemToListingCartItem } from '@/components/common/shoppingCart/utils'
import { ShoppingCartItem } from '~/components/common/shoppingCart/types'

export default () => {
  const listingCartStore = useListingCartStore()
  const preferencesStore = usePreferencesStore()

  const getFloorPrice = (cartItem: ShoppingCartItem) =>
    cartItem.collection.floorPrice[0]?.price || '0'

  const listNftByShoppingCartItem = async (cartItem: ShoppingCartItem) => {
    if (!listingCartStore.isItemInCart(cartItem.id)) {
      const floorPrice = getFloorPrice(cartItem)

      listingCartStore.setItem(
        shoppingCartItemToListingCartItem(cartItem, floorPrice),
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
    openListingCartModal,
  }
}
