import { useIdentityStore } from '@/stores/identity'
import { getKusamaAssetId } from '@/utils/api/bsx/query'

export default function (price: number) {
  const { urlPrefix } = usePrefix()
  const { $consola } = useNuxtApp()
  const identityStore = useIdentityStore()
  const balance = computed<string>(() => {
    switch (urlPrefix.value) {
      case 'rmrk':
      case 'ksm':
      case 'stmn':
        return identityStore.getAuthBalance
      case 'bsx':
        return identityStore.multiBalances.chains.basilisk?.ksm?.nativeBalance
      case 'snek':
        return identityStore.multiBalances.chains['basilisk-testnet']?.ksm
          ?.nativeBalance
      default:
        return identityStore.getTokenBalanceOf(
          getKusamaAssetId(urlPrefix.value)
        )
    }
  })
  const isBalanceEnough = computed(() => {
    if (!balance.value) {
      return false
    }
    return Number(balance.value) >= price
  })

  onMounted(async () => {
    if (identityStore.getAuthAddress) {
      $consola.log('fetching balance...')
      await identityStore.fetchBalance({
        address: identityStore.getAuthAddress,
      })
    }
  })

  return {
    balance,
    isBalanceEnough,
  }
}
