import { useIdentityStore } from '@/stores/identity'
import { getKusamaAssetId } from '@/utils/api/bsx/query'

export default function () {
  const { urlPrefix } = usePrefix()
  const identityStore = useIdentityStore()

  const getBalance = (prefix: string, token: string) => {
    token = token.toLocaleLowerCase()
    switch (prefix) {
      case 'rmrk':
      case 'ksm':
      case 'ahk':
      case 'ahp':
      case 'dot':
        return identityStore.getAuthBalance
      case 'bsx':
        return identityStore.multiBalances.chains.basilisk?.[token]
          ?.nativeBalance
      case 'snek':
        return identityStore.multiBalances.chains['basilisk-testnet']?.[token]
          ?.nativeBalance
      default:
        return identityStore.getTokenBalanceOf(getKusamaAssetId(prefix))
    }
  }

  const balance = computed(() => getBalance(urlPrefix.value, 'KSM'))

  return {
    balance,
    getBalance,
  }
}
