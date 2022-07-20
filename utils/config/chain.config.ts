import { ChainProperties } from '../api/Query'
import { Config, Prefix } from './types'

export const toChainProperty = (
  ss58Format: number,
  tokenDecimals: number,
  tokenSymbol: string
): ChainProperties => {
  return {
    ss58Format,
    tokenDecimals,
    tokenSymbol,
  }
}

const DEFAULT_CHAIN_PROPERTIES: ChainProperties = toChainProperty(2, 12, 'KSM')

const chainPropertyMap: Config<ChainProperties> = {
  rmrk: DEFAULT_CHAIN_PROPERTIES,
  bsx: toChainProperty(10041, 12, 'BSX'),
  statemine: DEFAULT_CHAIN_PROPERTIES,
  westmint: DEFAULT_CHAIN_PROPERTIES,
  moonsama: toChainProperty(1285, 12, 'MOVR'),
}

export const chainPropListOf = (prefix: Prefix | string): ChainProperties => {
  console.log('prefix2: ', prefix, chainPropertyMap[prefix])
  return chainPropertyMap[prefix]
}

export const ss58Of = (prefix: Prefix | string): number => {
  return chainPropListOf(prefix).ss58Format
}
