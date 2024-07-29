import { openConnectWalletModal } from '@/components/common/ConnectWallet/useConnectWallet'

interface DoAfterLoginParams {
  onLoginSuccess: (account?: string) => void
  onCancel?: () => void
  componentProps?: Record<string, any>
}

export default function (instance) {
  const doAfterLogin = ({ onLoginSuccess, onCancel, componentProps }: DoAfterLoginParams) => {
    const { isLogIn } = useAuth()
    if (!isLogIn.value) {
      openConnectWalletModal(instance, {
        onConnect: onLoginSuccess,
        onCancel,
        closeAfterConnect: true,
        componentProps,
      })
    }
    else {
      onLoginSuccess()
    }
  }
  return {
    doAfterLogin,
  }
}
