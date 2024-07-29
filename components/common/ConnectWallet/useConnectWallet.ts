import ConnectWalletModal from './ConnectWalletModal.vue'

export const ConnectWalletModalConfig = {
  component: ConnectWalletModal,
  canCancel: ['escape', 'outside'],
  rootClass: 'connect-wallet-modal !z-[999] sm:!z-[998]',
  trapFocus: false,
}

export interface OpenWalletModalConfig {
  onConnect?: (account: string) => void
  closeAfterConnect?: boolean
  onCancel?: () => void
  componentProps?: Record<string, any>
  modalConfig?: Record<string, any>
}

export const openConnectWalletModal = (
  instance,
  { onConnect, closeAfterConnect, onCancel, componentProps, modalConfig }: OpenWalletModalConfig = {},
) => {
  const { neoModal } = useProgrammatic()

  const modal = ref()

  const closeModal = () => {
    modal.value?.close()
  }

  modal.value = neoModal.open({
    onCancel: () => {
      if (onCancel) {
        onCancel()
      }

      modal.value = null
    },
    events: {
      close: () => {
        if (onCancel) {
          onCancel()
        }
      },
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
    ...modalConfig,
    innerProps: componentProps,
  })
}
