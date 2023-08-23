import { useIdentityStore } from '@/stores/identity'
import { getKusamaAssetId } from '@/utils/api/bsx/query'

export default function () {
  const { urlPrefix } = usePrefix()
  const identityStore = useIdentityStore()

  const getBalance = (token: string) => {
    token = token.toLocaleLowerCase()
    if (['rmrk', 'ksm', 'ahk', 'ahp', 'dot'].includes(urlPrefix.value)) {
      return identityStore.getAuthBalance
    } else if (urlPrefix.value === 'bsx') {
      return identityStore.multiBalances.chains.basilisk?.[token]?.nativeBalance
    } else if (urlPrefix.value === 'snek') {
      return identityStore.multiBalances.chains['basilisk-testnet']?.[token]
        ?.nativeBalance
    } else {
      return identityStore.getTokenBalanceOf(getKusamaAssetId(urlPrefix.value))
    }
  }

  const balance = computed(() => getBalance('KSM'))

  return {
    balance,
    getBalance,
  }
}
