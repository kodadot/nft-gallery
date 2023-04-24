import ConnectWalletModal from './ConnectWalletModal.vue'

export const ConnectWalletModalConfig = {
  component: ConnectWalletModal,
  canCancel: ['escape', 'outside'],
  customClass: 'connect-wallet-modal',
  autoFocus: false,
}
