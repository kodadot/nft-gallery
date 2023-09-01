import ShoppingCartModal from './ShoppingCartModal.vue'
import { usePreferencesStore } from '@/stores/preferences'

export const ShoppingCartModalConfig = {
  component: ShoppingCartModal,
  canCancel: ['outside'],
  rootClass: 'shopping-cart-modal',
  trapFocus: false,
}

export const isShoppingCartOpen = () =>
  Boolean(document.querySelector('.shopping-cart-modal'))

export const openShoppingCart = (config = {}) => {
  const preferencesStore = usePreferencesStore()
  const { neoModal } = useProgrammatic()

  preferencesStore.setShoppingCartCollapse(true)

  neoModal.closeAll()

  return neoModal.open({
    onCancel: () => {
      preferencesStore.setShoppingCartCollapse(false)
    },
    ...ShoppingCartModalConfig,
    ...config,
  })
}
