import { NAMES } from './names'
import type { ChainProperties, ChainVM, Config, Option, Prefix } from './types'

export const toChainProperty = (
  ss58Format: number,
  tokenDecimals: number,
  tokenSymbol: string,
  blockExplorer?: string,
  vm: ChainVM = 'SUB'
): ChainProperties => {
  return {
    ss58Format,
    tokenDecimals,
    tokenSymbol,
    blockExplorer,
    vm,
  }
}

const DEFAULT_CHAIN_PROPERTIES: ChainProperties = toChainProperty(
  2,
  12,
  'KSM',
  'https://kusama.subscan.io/'
)

export const CHAINS: Config<ChainProperties> = {
  rmrk: DEFAULT_CHAIN_PROPERTIES,
  ksm: DEFAULT_CHAIN_PROPERTIES,
  ahk: toChainProperty(2, 12, 'KSM', 'https://statemine.subscan.io/'),
  dot: toChainProperty(0, 10, 'DOT', 'https://polkadot.subscan.io/'),
  ahp: toChainProperty(0, 10, 'DOT', 'https://statemint.subscan.io/'),
  imx: toChainProperty(42, 18, 'IMX', 'https://explorer.immutable.com/'), // ss58Format is not available
  base: toChainProperty(42, 18, 'ETH', 'https://basescan.org'), // ss58Format is not available
  // ahr: toChainProperty(42, 12, 'ROC', 'https://rockmine.subscan.io/'),
  // movr: toChainProperty(1285, 18, 'MOVR', 'https://moonriver.subscan.io/'),
  // glmr: toChainProperty(1284, 18, 'GLMR', 'https://moonbeam.subscan.io/'),
}

export const DEFAULT_PREFIX: Prefix = 'ahp'

export const chainPrefixes: Prefix[] = [
  'ahp',
  'ahk',
  'rmrk',
  'ksm',
  'dot',
  'imx',
  'base',
  // 'ahr',
  // 'movr',
  // 'glmr',
]
export const chainPrefixesMap = chainPrefixes.reduce(
  (acc: Partial<Record<Prefix, Prefix>>, prefix: Prefix) => ({
    ...acc,
    [prefix]: prefix,
  }),
  {}
) as Record<Prefix, Prefix>

export const chainInfo: Record<Prefix, string> = {
  rmrk: 'kusama',
  ksm: 'rmrk',
  ahk: 'statemine',
  dot: 'polkadot',
  ahp: 'statemint',
  imx: 'immutable',
  base: 'base',
  // ahr: 'rockmine',
  // movr: 'moonriver',
  // glmr: 'moonbeam',
}

export const chainNames: Record<Prefix, string> = {
  rmrk: 'Kusama',
  ksm: 'Kusama',
  ahk: 'Kusama AssetHub',
  dot: 'Polkadot',
  ahp: 'Polkadot AssetHub',
  imx: 'Immutable zkEVM',
  base: 'Base',
  // ahr: 'Rococo AssetHub',
  // movr: 'Moonriver',
  // glmr: 'Moonbeam',
}

export const chainList = (): Option[] => {
  return chainPrefixes.map((prefix) => ({
    info: chainInfo[prefix],
    text: NAMES[prefix],
    value: prefix,
  }))
}

// DEV: note that ED is different from the on-chain ED to prevent weird edge cases of XCM
export const teleportExistentialDeposit: Record<Prefix, number> = {
  ksm: 666666666,
  rmrk: 666666666,
  ahk: 666666666,
  dot: 15000000000,
  ahp: 5000000000,
  imx: 0,
  base: 0,
}

export const existentialDeposit: Record<Prefix, number> = {
  ksm: 333333333,
  rmrk: 333333333,
  ahk: 333333333,
  dot: 1e10,
  ahp: 1e8,
  imx: 0, // nothing like ED in EVM :)
  base: 0,
}
