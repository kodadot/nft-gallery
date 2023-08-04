import ConnectWalletModal from './ConnectWalletModal.vue'
import { ModalProgrammatic as Modal } from 'buefy'
import { BModalComponent, BModalConfig } from 'buefy/types/components'
export const ConnectWalletModalConfig = {
  component: ConnectWalletModal,
  canCancel: ['escape', 'outside'],
  customClass: 'connect-wallet-modal',
  autoFocus: false,
}

export const openConnectWalletModal = (instance) => {
  const modal = ref<BModalComponent | null>()

  modal.value = Modal.open({
    parent: instance?.proxy,
    onCancel: () => {
      modal.value = null
      document.body.classList.remove('is-clipped')
    },
    ...ConnectWalletModalConfig,
  } as unknown as BModalConfig)
}
