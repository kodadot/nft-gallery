import ShoppingCartModal from './ShoppingCartModal.vue'
import { useProgrammatic } from '@oruga-ui/oruga-next'
import { BModalComponent, BModalConfig } from 'buefy/types/components'
import { usePreferencesStore } from '@/stores/preferences'

const { oruga } = useProgrammatic()

export const ShoppingCartModalConfig = {
  component: ShoppingCartModal,
  canCancel: ['outside'],
  contentClass: 'shopping-cart-modal',
  autoFocus: false,
}

export const isShoppingCartOpen = () =>
  Boolean(document.querySelector('.shopping-cart-modal'))

export const openShoppingCart = (instance) => {
  const modal = ref<BModalComponent | null>()
  const preferencesStore = usePreferencesStore()

  preferencesStore.setShoppingCartCollapse(true)

  modal.value = oruga.modal.open({
    parent: instance?.proxy,
    onCancel: () => {
      modal.value = null
      preferencesStore.setShoppingCartCollapse(false)
      document.body.classList.remove('is-clipped')
    },
    ...ShoppingCartModalConfig,
  })
}
