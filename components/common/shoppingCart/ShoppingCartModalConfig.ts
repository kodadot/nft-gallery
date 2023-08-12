import ShoppingCartModal from './ShoppingCartModal.vue'
import { ModalProgrammatic as Modal } from 'buefy'
import { BModalConfig } from 'buefy/types/components'
import { usePreferencesStore } from '@/stores/preferences'

export const ShoppingCartModalConfig = {
  component: ShoppingCartModal,
  canCancel: ['outside'],
  customClass: 'shopping-cart-modal',
  autoFocus: false,
}

export const isShoppingCartOpen = () =>
  Boolean(document.querySelector('.shopping-cart-modal'))

export const openShoppingCart = (instance) => {
  const preferencesStore = usePreferencesStore()

  preferencesStore.setShoppingCartCollapse(true)
  Modal.open({
    parent: instance?.proxy,
    onCancel: () => {
      preferencesStore.setShoppingCartCollapse(false)
    },
    ...ShoppingCartModalConfig,
  } as unknown as BModalConfig)
}
