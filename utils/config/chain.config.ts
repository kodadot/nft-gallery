import { CHAINS, rmrk2ToKsm } from '@kodadot1/static'
import { AssetItem } from '@/components/bsx/Asset/types'
import { ChainProperties } from '../api/Query'

import type { BackwardPrefix } from '@kodadot1/static'

export const BLOCK_EXPLORER_WITH_QUERY = ['snek']

export const chainPropListOf = (prefix: BackwardPrefix): ChainProperties => {
  return CHAINS[rmrk2ToKsm(prefix)]
}

export const ss58Of = (prefix: BackwardPrefix): number => {
  return chainPropListOf(prefix).ss58Format
}

export const blockExplorerOf = (prefix: BackwardPrefix): string | undefined => {
  return chainPropListOf(prefix).blockExplorer
}

export const chainAssetOf = (prefix: BackwardPrefix): AssetItem => {
  const { tokenDecimals: decimals, tokenSymbol: symbol } =
    chainPropListOf(prefix)
  return {
    id: '0',
    name: symbol,
    symbol,
    decimals,
  }
}
