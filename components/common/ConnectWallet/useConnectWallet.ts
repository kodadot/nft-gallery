import { type ChainVM } from '@kodadot1/static'
import ConnectWalletModal from './ConnectWalletModal.vue'
import { ModalCloseType } from '@/components/navbar/types'

const VM_PRESELECTED_ROUTES = [
  'prefix-drops-id',
  'prefix-gallery-id',
]

export const ConnectWalletModalConfig = {
  component: ConnectWalletModal,
  canCancel: ['escape', 'outside'],
  rootClass: 'connect-wallet-modal !z-[999] sm:!z-[998]',
  trapFocus: false,
}

export interface OpenWalletModalConfig {
  onConnect?: (account: string) => void
  closeAfterConnect?: boolean
  onCancel?: (type: ModalCloseType) => void
  preselected?: ChainVM
}

export const openConnectWalletModal = (
  { onConnect, closeAfterConnect, onCancel, preselected }: OpenWalletModalConfig = {},
) => {
  const { neoModal } = useProgrammatic()
  const { isMobile } = useDevice()
  const { vm } = useChain()
  const route = useRoute()

  const modal = ref()

  const closeModal = () => {
    modal.value?.close()
  }

  modal.value = neoModal.open({
    onCancel: () => {
      if (onCancel) {
        onCancel(ModalCloseType.BACK)
      }

      modal.value = null
    },
    events: {
      close: (type: ModalCloseType) => {
        if (onCancel) {
          onCancel(type)
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
    ...(isMobile ? { animation: 'none' } : {}),
    innerProps: {
      preselected: preselected ?? (VM_PRESELECTED_ROUTES.includes(route.name as string) ? vm.value : undefined),
    },
  })

  return modal
}
