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

  const getAvailableAssetByToken = (token: string) =>
    Object.values(availableAssets.value).find(
      (asset) => token === getAssetToken(asset)
    )

  const tokens = computed<TokenDetails[]>(() => {
    return availableTokens.value.map((tokenSymbol) => ({
      symbol: tokenSymbol as string,
      value: getCurrentTokenValue(tokenSymbol),
      icon: getTokenIconBySymbol(tokenSymbol),
      tokenDecimals: CHAINS[urlPrefix.value].tokenDecimals,
      tokenId: getAvailableAssetByToken(tokenSymbol)?.tokenId,
    }))
  })

  const isTokenValidForChain = (token: string) =>
    !!token && availableTokens.value.includes(token)

  return {
    tokens,
    isTokenValidForChain,
  }
}
