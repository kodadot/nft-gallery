import ConnectWalletModal from './ConnectWalletModal.vue'
import { ModalProgrammatic as Modal } from 'buefy'
import { BModalComponent, BModalConfig } from 'buefy/types/components'
export const ConnectWalletModalConfig = {
  component: ConnectWalletModal,
  canCancel: ['escape', 'outside'],
  customClass: 'connect-wallet-modal',
  autoFocus: false,
}

export interface OpenWalletModalConfig {
  onConnect?: (account: string) => void
  closeAfterConnect?: boolean
}

export const openConnectWalletModal = (
  instance,
  { onConnect, closeAfterConnect }: OpenWalletModalConfig = {}
) => {
  const modal = ref<BModalComponent | null>()

  const onCancel = () => {
    modal.value = null
  }

  const closeModal = () => {
    modal.value?.close()
  }

  modal.value = Modal.open({
    parent: instance?.proxy,
    onCancel,
    events: {
      connect: (account: string) => {
        if (onConnect) {
          onConnect(account)
        }
        if (closeAfterConnect) {
          closeModal()
        }
      },
    },
    ...ConnectWalletModalConfig,
  } as unknown as BModalConfig)
}
