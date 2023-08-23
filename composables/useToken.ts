import { useFiatStore } from '@/stores/fiat'
import { CHAINS, type Prefix } from '@kodadot1/static'
import { networkToPrefix, useIdentityStore } from '@/stores/identity'
import { defultTokenChain } from '@/utils/config/chain.config'

type TokenDecimals = Record<Prefix, number>
export interface TokenDetails {
  symbol: string
  value: number | string | null
  icon: string
  chains: Prefix[]
  defaultChain: Prefix
  tokenDecimals: TokenDecimals
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
      const defaultChain = defultTokenChain[tokenSymbol]
      const tokenDecimals = chains.reduce(
        (reducer, chain) => ({
          ...reducer,
          [chain]: CHAINS[chain].tokenDecimals,
        }),
        {} as TokenDecimals
      )

      return {
        symbol: tokenSymbol as string,
        value: getCurrentTokenValue(tokenSymbol),
        icon: getTokenIconBySymbol(tokenSymbol),
        chains: chains,
        defaultChain: defaultChain,
        tokenDecimals: tokenDecimals,
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
