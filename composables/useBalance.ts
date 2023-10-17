import { useIdentityStore } from '@/stores/identity'
import { getKusamaAssetId } from '@/utils/api/bsx/query'
import { Prefix } from '@kodadot1/static'

export default function () {
  const { urlPrefix } = usePrefix()
  const identityStore = useIdentityStore()

  const getBalance = (token: string, prefix: Prefix|null = null) => {
    prefix = prefix ? prefix : urlPrefix.value
    token = token.toLocaleLowerCase()
    switch (prefix) {
      case 'rmrk':
      case 'ksm':
      case 'ahk':
      case 'ahp':
      case 'dot':
        const balance = computed(() => identityStore.auth.balance)
        return balance.value ? balance.value[prefix] || '0' : '0'
      case 'bsx':
        return identityStore.multiBalances.chains.basilisk?.[token]
          ?.nativeBalance
      case 'snek':
        return identityStore.multiBalances.chains['basilisk-testnet']?.[token]
          ?.nativeBalance
      default:
        return identityStore.getTokenBalanceOf(
          getKusamaAssetId(prefix),
        )
    }
  }

  const balance = computed(() => getBalance('KSM'))

  return {
    balance,
    getBalance,
  }
}
