import shoppingCarteDark from '@/assets/shopping-cart-outline-sharp_dark.svg'
import shoppingCart from '@/assets/shopping-cart-outline-sharp.svg'
import strikedOutShoppingCart from '@/assets/striked-out-cart-shopping.svg'
import strikedOutShoppingCartDark from '@/assets/striked-out-cart-shopping_dark.svg'
import { useShoppingCartStore } from '@/stores/shoppingCart'

export const useShoppingCartIcon = (nftId?: string) => {
  const { isDarkMode } = useTheme()
  const shoppingCartIcon = computed(() =>
    isDarkMode.value ? shoppingCarteDark : shoppingCart
  )
  const strikedOutShoppingCartIcon = computed(() =>
    isDarkMode.value ? strikedOutShoppingCartDark : strikedOutShoppingCart
  )

  const cartIcon = computed(() => {
    if (nftId) {
      return useShoppingCartStore().isItemInCart(nftId as string)
        ? strikedOutShoppingCartIcon.value
        : shoppingCartIcon.value
    }

    return shoppingCartIcon.value
  })

  return { shoppingCartIcon, strikedOutShoppingCartIcon, cartIcon }
}
