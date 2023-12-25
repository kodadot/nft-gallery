import { useIdentityStore } from '@/stores/identity'
import { getKusamaAssetId } from '@/utils/api/bsx/query'

export default function () {
  const { urlPrefix } = usePrefix()
  const identityStore = useIdentityStore()

  const getBalance = (_token: string) => {
    switch (urlPrefix.value) {
      case 'rmrk':
      case 'ksm':
      case 'ahk':
      case 'ahp':
      case 'dot':
        // case 'ahr':
        return identityStore.getAuthBalance
      default:
        return identityStore.getTokenBalanceOf(
          getKusamaAssetId(urlPrefix.value),
        )
    }
  }

  const balance = computed(() => getBalance('KSM'))

  return {
    balance,
    getBalance,
  }
}
