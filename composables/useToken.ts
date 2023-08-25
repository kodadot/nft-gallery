import { useFiatStore } from '@/stores/fiat'
import { CHAINS } from '@kodadot1/static'
import { networkToPrefix, useIdentityStore } from '@/stores/identity'

export interface TokenDetails {
  symbol: string
  value: number | string | null
  icon: string
  tokenDecimals: number
  tokenId: string | undefined
}

const getAssetToken = (asset) => asset?.token || 'KSM'
const getUniqueArrayItems = (items: string[]) => [...new Set(items)]

export default function useToken() {
  const { getCurrentTokenValue } = useFiatStore()
  const { getTokenIconBySymbol } = useIcon()
  const { getAvailableAssets } = useIdentityStore()
  const { urlPrefix } = usePrefix()

  const availableAssets = computed(() => {
    return getAvailableAssets.filter((asset) => {
      if (asset.chain === 'kusama') {
        return ['rmrk', 'ksm'].includes(urlPrefix.value)
      }
      return urlPrefix.value === networkToPrefix[asset.chain]
    })
  })

  const availableTokens = computed(() =>
    getUniqueArrayItems(Object.values(availableAssets.value).map(getAssetToken))
  )

  const getAvailableAssetByToken = (token: string) => {
    return Object.values(availableAssets.value).find(
      (asset) => token === getAssetToken(asset)
    )
  }

  const getChainTokenId = (token: string): string | undefined => {
    const asset = getAvailableAssetByToken(token)
    return asset?.tokenId
  }

  const tokens = computed<TokenDetails[]>(() => {
    return availableTokens.value.map((tokenSymbol) => {
      const tokenId = getChainTokenId(tokenSymbol)
      const chainProperties = CHAINS[urlPrefix.value]

      return {
        symbol: tokenSymbol as string,
        value: getCurrentTokenValue(tokenSymbol),
        icon: getTokenIconBySymbol(tokenSymbol),
        tokenDecimals: chainProperties.tokenDecimals,
        tokenId: tokenId,
      }
    })
  })

  const isTokenValidForChain = (token: string) => {
    const isValidToken = availableTokens.value.includes(token)
    return !!token && isValidToken
  }

  return {
    tokens,
    isTokenValidForChain,
  }
}
