import ConnectWalletModal from './ConnectWalletModal.vue'

export const ConnectWalletModalConfig = {
  component: ConnectWalletModal,
  canCancel: ['escape', 'outside'],
  rootClass: 'connect-wallet-modal',
  trapFocus: false,
}

export interface OpenWalletModalConfig {
  onConnect?: (account: string) => void
  closeAfterConnect?: boolean
  onCancel?: () => void
}

export const isConnectWalletModalOpen = () =>
  Boolean(document.querySelector('.connect-wallet-modal'))

export const openConnectWalletModal = (config = {}) => {
  const preferencesStore = usePreferencesStore()
  const { neoModal } = useProgrammatic()

  preferencesStore.setConnectWalletModalCollapse(true)

  return neoModal.open({
    onCancel: () => {
      preferencesStore.setConnectWalletModalCollapse(false)
    },
    ...ConnectWalletModalConfig,
    // ...(isMobileDevice ? { animation: 'none' } : {}),
    ...config,
  })
}
