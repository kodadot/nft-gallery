import { useIdentityStore } from '@/stores/identity'
import { getKusamaAssetId } from '@/utils/api/bsx/query'

export default async function (price: number) {
  const { urlPrefix } = usePrefix()
  const { $consola } = useNuxtApp()
  const identityStore = useIdentityStore()

  const getBalance = () => {
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
  }

  const fetchBalance = async () => {
    if (!balance.value || balance.value === '0') {
      if (identityStore.getAuthAddress) {
        $consola.log('fetching balance...')
        await identityStore.fetchBalance({
          address: identityStore.getAuthAddress,
        })
        balance.value = getBalance()
      }
    }
  }
  const balance = ref(getBalance())

  if (!balance.value || balance.value === '0') {
    await fetchBalance()
    balance.value = getBalance()
  }

  const isBalanceEnough = computed(() => {
    return Number(balance.value) >= price
  })

  return {
    balance,
    isBalanceEnough,
  }
}
