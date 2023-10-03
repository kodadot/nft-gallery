import { useShoppingCartStore } from '@/stores/shoppingCart'

export const useShoppingCartIcon = (nftId?: string) => {
  const { isDarkMode } = useTheme()
  const shoppingCartIcon = computed(() =>
    isDarkMode.value
      ? '/shopping-cart-outline-sharp_dark.svg'
      : '/shopping-cart-outline-sharp.svg',
  )
  const strikedOutShoppingCartIcon = computed(() =>
    isDarkMode.value
      ? '/striked-out-cart-shopping_dark.svg'
      : '/striked-out-cart-shopping.svg',
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
