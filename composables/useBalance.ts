import { useIdentityStore } from '@/stores/identity'
import { getKusamaAssetId } from '@/utils/api/bsx/query'

export default function () {
  const { urlPrefix } = usePrefix()
  const identityStore = useIdentityStore()
  const balance = computed(() => {
    switch (urlPrefix.value) {
      case 'rmrk':
      case 'ksm':
      case 'ahk':
      case 'ahp':
      case 'dot':
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

  return {
    balance,
  }
}
