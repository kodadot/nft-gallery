import { CHAINS } from '@kodadot1/static'

import type { Prefix, ChainProperties, ChainVM } from '@kodadot1/static'

export const chainPropListOf = (prefix: Prefix): ChainProperties => {
  return CHAINS[prefix]
}

export const vmOf = (prefix: Prefix): ChainVM => {
  return chainPropListOf(prefix).vm
}

export const arePrefixesOfSameVm = (a: Prefix, b: Prefix): boolean => {
  return vmOf(a) === vmOf(b)
}

export const ss58Of = (prefix: Prefix): number => {
  return chainPropListOf(prefix).ss58Format
}

export const decimalsOf = (prefix: Prefix): number => {
  return chainPropListOf(prefix).tokenDecimals
}

export const blockExplorerOf = (prefix: Prefix): string | undefined => {
  return chainPropListOf(prefix).blockExplorer
}

export const tokenSymbolOf = (prefix: Prefix): string => {
  return chainPropListOf(prefix).tokenSymbol
}

type AssetItem = {
  id: string
  name: string
  symbol: string
  decimals: number
}

export const chainAssetOf = (prefix: Prefix): AssetItem => {
  const { tokenDecimals: decimals, tokenSymbol: symbol }
    = chainPropListOf(prefix)
  return {
    id: '0',
    name: symbol,
    symbol,
    decimals,
  }
}

export const defultTokenChain: Record<string, Prefix> = {
  KSM: 'ksm',
  DOT: 'dot',
  // GLMR: 'glmr',
  // MOVR: 'movr',
}
