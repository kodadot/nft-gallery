import { CHAINS } from '@kodadot1/static'
import { AssetItem } from '@/components/bsx/Asset/types'
import { ChainProperties } from '../api/Query'
import { Prefix } from './types'

export const BLOCK_EXPLORER_WITH_QUERY = ['snek']

export const chainPropListOf = (prefix: Prefix | string): ChainProperties => {
  const oldPrefix = prefix === 'rmrk' ? 'ksm' : prefix
  return CHAINS[oldPrefix]
}

export const ss58Of = (prefix: Prefix | string): number => {
  return chainPropListOf(prefix).ss58Format
}

export const blockExplorerOf = (
  prefix: Prefix | string
): string | undefined => {
  return chainPropListOf(prefix).blockExplorer
}

export const chainAssetOf = (prefix: Prefix | string): AssetItem => {
  const { tokenDecimals: decimals, tokenSymbol: symbol } =
    chainPropListOf(prefix)
  return {
    id: '0',
    name: symbol,
    symbol,
    decimals,
  }
}
