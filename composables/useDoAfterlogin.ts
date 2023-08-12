import { openConnectWalletModal } from '@/components/common/ConnectWallet/useConnectWallet'

interface DoAfterLoginParams {
  onLoginSuccess: (account?: string) => void
  onCancel?: () => void
}

export default function (instance) {
  const doAfterLogin = ({ onLoginSuccess, onCancel }: DoAfterLoginParams) => {
    const { isLogIn } = useAuth()
    if (!isLogIn.value) {
      openConnectWalletModal(instance, {
        onConnect: onLoginSuccess,
        onCancel,
        onClose: onCancel,
        closeAfterConnect: true,
      })
    } else {
      onLoginSuccess()
    }
  }
  return {
    doAfterLogin,
  }
}
