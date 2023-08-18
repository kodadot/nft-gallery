import { useFiatStore } from '@/stores/fiat'
import { type ChainProperties, type Prefix } from '@kodadot1/static'
import { chainPropListOf } from '@/utils/config/chain.config'
import { groupByNestedProperty } from '@/utils/objects'
import { availablePrefixes } from '@/utils/chain'

export interface TokenDetails {
  symbol: string
  value: number | string | null
  icon: string
  chains: Prefix[]
}

export default function useToken() {
  const { getCurrentTokenValue } = useFiatStore()
  const { getTokenIconBySymbol } = useIcon()

  const availableChains = availablePrefixes().map(
    (item) => item.value as Prefix
  )

  const availableTokens = ['BSX', 'DOT', 'KSM']

  const chainsProperties = computed(() => {
    return availableChains.reduce(
      (reducer, chain: Prefix) => ({
        ...reducer,
        [chain]: chainPropListOf(chain),
      }),
      {}
    ) as { [k in Prefix]: ChainProperties }[]
  })

  const groupedTokensByChains = computed(() =>
    groupByNestedProperty(chainsProperties.value, 'tokenSymbol')
  )

  const getTokenChain = (token: string): Prefix[] =>
    groupedTokensByChains.value[token] || []

  const tokens = computed<TokenDetails[]>(() => {
    const filteredTokens = Object.keys(groupedTokensByChains.value).filter(
      (token) => availableTokens.includes(token)
    )

    return filteredTokens.map((tokenSymbol) => {
      return {
        symbol: tokenSymbol as string,
        value: getCurrentTokenValue(tokenSymbol),
        icon: getTokenIconBySymbol(tokenSymbol),
        chains: getTokenChain(tokenSymbol),
      }
    })
  })

  const getPrefixByToken = (token: string): Prefix | null => {
    switch (token.toLowerCase()) {
      case 'bsx':
        return 'bsx'
      case 'dot':
        return 'dot'
      case 'ksm':
        return 'ksm'
      default:
        return null
    }
  }

  return {
    tokens,
    availableTokens,
    getPrefixByToken,
  }
}
