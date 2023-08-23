import { useFiatStore } from '@/stores/fiat'
import { CHAINS, type Prefix } from '@kodadot1/static'
import { useIdentityStore } from '@/stores/identity'
import { networkToPrefix } from '@/utils/chain'

export interface TokenDetails {
  symbol: string
  value: number | string | null
  icon: string
  chains: Prefix[]
  defaultChain: Prefix
  tokenDecimals: number
}

const getAssetToken = (asset) => asset?.token || 'KSM'
const getUniqueArrayItems = (items: string[]) => [...new Set(items)]

export default function useToken() {
  const { getCurrentTokenValue } = useFiatStore()
  const { getTokenIconBySymbol } = useIcon()
  const { getAvailableAssets } = useIdentityStore()

  const availableAssets = computed(() => getAvailableAssets)
  const availableTokensAcrossAllChains = computed(() =>
    getUniqueArrayItems(Object.values(availableAssets.value).map(getAssetToken))
  )

  const getTokenChains = (token: string): Prefix[] => {
    const chains = Object.values(availableAssets.value).reduce(
      (reducer: Prefix[], asset) => {
        const assetToken = getAssetToken(asset)
        const chainName = asset.chain
        if (token === assetToken) {
          return [...reducer, networkToPrefix[chainName] as Prefix]
        }
        return reducer
      },
      []
    )

    return chains
  }

  const tokens = computed<TokenDetails[]>(() => {
    return availableTokensAcrossAllChains.value.map((tokenSymbol) => {
      const chains = getTokenChains(tokenSymbol)
      const defaultChain = chains[0]

      return {
        symbol: tokenSymbol as string,
        value: getCurrentTokenValue(tokenSymbol),
        icon: getTokenIconBySymbol(tokenSymbol),
        chains: chains,
        defaultChain: defaultChain,
        tokenDecimals: CHAINS[defaultChain].tokenDecimals,
      }
    })
  })

  const isTokenValidForChain = (token: string, urlPrefix: Prefix) => {
    const isValidToken = availableTokensAcrossAllChains.value.includes(token)
    const isAvailableForCurrentChain = tokens.value
      .map((t) => t.chains.includes(urlPrefix) && t.symbol === token)
      .some(Boolean)
    return !!token && isValidToken && isAvailableForCurrentChain
  }

  return {
    tokens,
    availableTokensAcrossAllChains,
    isTokenValidForChain,
  }
}
