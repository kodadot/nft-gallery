import { useFiatStore } from '@/stores/fiat'
import { type Prefix } from '@kodadot1/static'
import { useIdentityStore } from '@/stores/identity'
import { defultTokenChain } from '@/utils/config/chain.config'

export interface TokenDetails {
  symbol: string
  value: number | string | null
  icon: string
  defaultChain: Prefix
}

const getAssetToken = (asset) => asset?.token || 'KSM'
const getUniqueArrayItems = (items: string[]) => [...new Set(items)]

export default function useToken() {
  const { getCurrentTokenValue } = useFiatStore()
  const { getTokenIconBySymbol } = useIcon()
  const { multiBalanceAssets } = useIdentityStore()

  const availableAssets = computed(() => multiBalanceAssets)
  const availableTokensAcrossAllChains = computed(() =>
    getUniqueArrayItems(
      Object.values(availableAssets.value).map(getAssetToken),
    ),
  )

  const tokens = computed<TokenDetails[]>(() => {
    return availableTokensAcrossAllChains.value.map((tokenSymbol) => {
      return {
        symbol: tokenSymbol as string,
        value: getCurrentTokenValue(tokenSymbol),
        icon: getTokenIconBySymbol(tokenSymbol),
        defaultChain: defultTokenChain[tokenSymbol],
      }
    })
  })

  return {
    tokens,
  }
}
