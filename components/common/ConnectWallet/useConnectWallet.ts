import ConnectWalletModal from './ConnectWalletModal.vue'
import { useProgrammatic } from '@oruga-ui/oruga-next'
import { ModelSync } from 'nuxt-property-decorator'

const { oruga } = useProgrammatic()

export const ConnectWalletModalConfig = {
  component: ConnectWalletModal,
  canCancel: ['escape', 'outside'],
  contentClass: 'connect-wallet-modal',
  autoFocus: false,
}

export const openConnectWalletModal = (instance) => {
  const modal = ref<BModalComponent | null>()

  modal.value = oruga.modal.open({
    parent: instance?.proxy,
    onCancel: () => {
      modal.value = null
      document.body.classList.remove('is-clipped')
    },
    ...ConnectWalletModalConfig,
  })
}
