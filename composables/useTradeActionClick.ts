import { useIdentityStore } from '@/stores/identity'
import { doAfterCheckCurrentChainVM } from '@/components/common/ConnectWallet/openReconnectWalletModal'

export default function (isOwner: ComputedRef<boolean>) {
  const identityStore = useIdentityStore()
  const { doAfterLogin } = useDoAfterlogin()

  const isLogIn = computed(() => Boolean(identityStore.getAuthAddress))

  const onTradeActionClick = (cb: () => void) => {
    const fn = () => {
      if (!isOwner.value) {
        cb()
      }
    }

    if (isLogIn.value) {
      doAfterCheckCurrentChainVM(fn)
    }
    else {
      doAfterLogin({ onLoginSuccess: fn })
    }
  }

  return {
    onTradeActionClick,
  }
}
