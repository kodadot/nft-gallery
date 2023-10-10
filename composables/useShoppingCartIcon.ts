import { useShoppingCartStore } from '@/stores/shoppingCart'

export const useShoppingCartIcon = (nftId?: string) => {
  const colorMode = useColorMode()
  const shoppingCartIcon = computed(() =>
    colorMode.preference === 'dark'
      ? '/shopping-cart-outline-sharp_dark.svg'
      : '/shopping-cart-outline-sharp.svg',
  )
  const strikedOutShoppingCartIcon = computed(() =>
    colorMode.preference === 'dark'
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
