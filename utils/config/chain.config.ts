import { CHAINS } from '@kodadot1/static'
import { AssetItem } from '@/components/bsx/Asset/types'
import { ChainProperties } from '../api/Query'

import type { Prefix } from '@kodadot1/static'

export const BLOCK_EXPLORER_WITH_QUERY = ['snek']

export const chainPropListOf = (prefix: Prefix): ChainProperties => {
  return CHAINS[prefix]
}

export const ss58Of = (prefix: Prefix): number => {
  return chainPropListOf(prefix).ss58Format
}

export const blockExplorerOf = (prefix: Prefix): string | undefined => {
  return chainPropListOf(prefix).blockExplorer
}

export const chainAssetOf = (prefix: Prefix): AssetItem => {
  const { tokenDecimals: decimals, tokenSymbol: symbol } =
    chainPropListOf(prefix)
  return {
    id: '0',
    name: symbol,
    symbol,
    decimals,
  }
}
