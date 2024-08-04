import ReconnectWalletModal from '@/components/common/ConnectWallet/ReconnectWalletModal.vue'

interface DoAfterReconnectParams {
  onSuccess: (account?: string) => void
  onCancel?: () => void
  closeOnSuccess?: boolean
}

export default function () {
  const { neoModal } = useProgrammatic()

  const modal = ref()

  const closeModal = () => {
    modal.value?.close()
  }

  const openReconnectModal = ({ onCancel, onConnect, closeOnSuccess = true }) => {
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
          if (closeOnSuccess) {
            closeModal()
          }
        },
      },
      ...{
        component: ReconnectWalletModal,
        canCancel: ['escape', 'outside'],
        rootClass: 'connect-wallet-modal !z-[998]',
        trapFocus: false,
      },
    })
  }

  const doAfterReconnect = ({ onSuccess, onCancel }: DoAfterReconnectParams) => {
    openReconnectModal({
      onConnect: onSuccess,
      onCancel,
    })
  }

  return { doAfterReconnect }
}
