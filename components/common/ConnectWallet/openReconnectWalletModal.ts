import ReconnectWalletModal from '@/components/common/ConnectWallet/ReconnectWalletModal.vue'

interface openReconnectWalletModalParams {
  onSuccess?: (account?: string) => void
  onCancel?: () => void
  closeOnSuccess?: boolean
}

export const openReconnectWalletModal = ({ onCancel, onSuccess, closeOnSuccess = true }: openReconnectWalletModalParams = {}) => {
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
        if (onSuccess) {
          onSuccess(account)
        }
        if (closeOnSuccess) {
          closeModal()
        }
      },
    },
    ...{
      component: ReconnectWalletModal,
      canCancel: ['escape', 'outside'],
      rootClass: 'connect-wallet-modal neo-modal !z-[998]',
      trapFocus: false,
    },
  })

  return modal.value
}
