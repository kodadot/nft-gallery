import { openConnectWalletModal } from '@/components/common/ConnectWallet/useConnectWallet'

export default function (instance) {
  const doAfterLogin = (
    callback: (account?: string) => void,
    onCancel?: () => void
  ) => {
    const { isLogIn } = useAuth()
    if (!isLogIn.value) {
      openConnectWalletModal(instance, {
        onConnect: callback,
        onCancel,
        closeAfterConnect: true,
      })
    } else {
      callback()
    }
  }
  return {
    doAfterLogin,
  }
}
