import { useFiatStore } from '@/stores/fiat'
import type { ChainProperties, Prefix } from '@kodadot1/static'
import { ComputedRef } from 'vue/types'
import { chainPropListOf } from '@/utils/config/chain.config'
import { groupByNestedProperty } from '@/utils/array'

export interface TokenDetails {
  symbol: string
  value: number | string | null
  icon: string
  chains: Prefix[]
}

export default function useToken(
  availableChains: ComputedRef<Prefix[]> = computed(() => ['bsx', 'dot', 'ksm'])
) {
  const { getCurrentTokenValue } = useFiatStore()
  const { getTokenIconBySymbol } = useIcon()

  const chainsProperties = computed(() => {
    return availableChains.value.reduce((reducer, chain: Prefix) => {
      return {
        ...reducer,
        [chain]: chainPropListOf(chain),
      }
    }, {}) as { [k in Prefix]: ChainProperties }[]
  })

  const groupedTokensByChains = computed(() =>
    groupByNestedProperty(chainsProperties.value, 'tokenSymbol')
  )

  const getTokenChain = (token: string): Prefix[] =>
    groupedTokensByChains.value[token] || []

  const tokens: ComputedRef<TokenDetails[]> = computed(() => {
    return Object.keys(chainsProperties.value).map((chain) => {
      const chainProperties = chainsProperties.value[chain]
      const tokenSymbol = chainProperties.tokenSymbol

      return {
        symbol: tokenSymbol as string,
        value: getCurrentTokenValue(tokenSymbol),
        icon: getTokenIconBySymbol(tokenSymbol),
        chains: getTokenChain(tokenSymbol),
      }
    })
  })

  return {
    tokens,
  }
}
