import { type ChainVM } from '@kodadot1/static'
import { openConnectWalletModal } from '@/components/common/ConnectWallet/useConnectWallet'

export interface DoAfterLoginParams {
  onLoginSuccess: (account?: string) => void
  onCancel?: () => void
  preselected?: ChainVM
}

export default function () {
  const doAfterLogin = ({ onLoginSuccess, onCancel, preselected }: DoAfterLoginParams) => {
    const { isLogIn } = useAuth()
    if (!isLogIn.value) {
      openConnectWalletModal({
        onConnect: onLoginSuccess,
        onCancel,
        closeAfterConnect: true,
        preselected,
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
