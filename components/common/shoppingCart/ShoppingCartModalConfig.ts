import ShoppingCartModal from './ShoppingCartModal.vue'
import { usePreferencesStore } from '@/stores/preferences'

export const ShoppingCartModalConfig = {
  component: ShoppingCartModal,
  canCancel: ['outside'],
  rootClass: 'shopping-cart-modal',
  scroll: 'clip',
  autoFocus: false,
}

export const isShoppingCartOpen = () =>
  Boolean(document.querySelector('.shopping-cart-modal'))

export const openShoppingCart = (instance, config = {}) => {
  const preferencesStore = usePreferencesStore()
  const { $neoModal } = useNuxtApp()

  preferencesStore.setShoppingCartCollapse(true)

  $neoModal.closeAll()

  return $neoModal.open({
    parent: instance?.proxy,
    onCancel: () => {
      preferencesStore.setShoppingCartCollapse(false)
    },
    ...ShoppingCartModalConfig,
    ...config,
  })
}
