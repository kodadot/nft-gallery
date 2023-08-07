import ShoppingCartModal from './ShoppingCartModal.vue'
import { ModalProgrammatic as Modal } from 'buefy'
import { BModalComponent, BModalConfig } from 'buefy/types/components'
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
  const modal = ref<BModalComponent | null>()
  const preferencesStore = usePreferencesStore()

  preferencesStore.setShoppingCartCollapse(true)
  modal.value = Modal.open({
    parent: instance?.proxy,
    onCancel: () => {
      modal.value = null
      preferencesStore.setShoppingCartCollapse(false)
      document.body.classList.remove('is-clipped')
    },
    ...ShoppingCartModalConfig,
  } as unknown as BModalConfig)
}
