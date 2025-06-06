import { NAMES } from './names'
import type { ChainProperties, ChainVM, Config, Option, Prefix } from './types'

export const toChainProperty = (
  ss58Format: number,
  tokenDecimals: number,
  tokenSymbol: string,
  blockExplorer: string,
  vm: ChainVM,
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
  'https://kusama.subscan.io/',
  'SUB',
)

export const CHAINS: Config<ChainProperties> = {
  ksm: DEFAULT_CHAIN_PROPERTIES,
  ahk: toChainProperty(2, 12, 'KSM', 'https://assethub-kusama.subscan.io/', 'SUB'),
  dot: toChainProperty(0, 10, 'DOT', 'https://polkadot.subscan.io/', 'SUB'),
  ahp: toChainProperty(0, 10, 'DOT', 'https://assethub-polkadot.subscan.io/', 'SUB'),
  base: toChainProperty(42, 18, 'ETH', 'https://basescan.org', 'EVM'),
  ahw: toChainProperty(42, 12, 'WND', 'https://assethub-westend.subscan.io/', 'EVM'),
  // ahr: toChainProperty(42, 12, 'ROC', 'https://rockmine.subscan.io/'),
  // movr: toChainProperty(1285, 18, 'MOVR', 'https://moonriver.subscan.io/'),
  // glmr: toChainProperty(1284, 18, 'GLMR', 'https://moonbeam.subscan.io/'),
}

export const DEFAULT_VM_PREFIX: Record<ChainVM, Prefix> = {
  SUB: 'ahp',
  EVM: 'base',
}

export const DEFAULT_PREFIX: Prefix = 'ahp'

export const chainPrefixes: Prefix[] = [
  'ahp',
  'ahk',
  'ksm',
  'dot',
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
  {},
) as Record<Prefix, Prefix>

export const chainInfo: Record<Prefix, string> = {
  ksm: 'kusama',
  ahk: 'statemine',
  dot: 'polkadot',
  ahp: 'statemint',
  base: 'base',
  ahw: 'westend',
  // ahr: 'rockmine',
  // movr: 'moonriver',
  // glmr: 'moonbeam',
}

export const chainNames: Record<Prefix, string> = {
  ksm: 'Kusama',
  ahk: 'Kusama AssetHub',
  dot: 'Polkadot',
  ahp: 'Polkadot AssetHub',
  base: 'Base',
  ahw: 'Westend',
  // ahr: 'Rococo AssetHub',
  // movr: 'Moonriver',
  // glmr: 'Moonbeam',
}

export const ecosystemNames: Record<ChainVM, string> = {
  SUB: 'Polkadot',
  EVM: 'Ethereum',
}

export const chainList = (): Option[] => {
  return chainPrefixes.map(prefix => ({
    info: chainInfo[prefix],
    text: NAMES[prefix],
    value: prefix,
  }))
}

// DEV: note that ED is different from the on-chain ED to prevent weird edge cases of XCM
export const teleportExistentialDeposit: Record<Prefix, number> = {
  ksm: 666666666,
  ahk: 666666666,
  dot: 15000000000,
  ahp: 5000000000,
  base: 0,
  ahw: 0,
}

export const existentialDeposit: Record<Prefix, number> = {
  ksm: 333333333,
  ahk: 333333333,
  dot: 1e10,
  ahp: 1e8,
  base: 1e15,
  ahw: 0,
}
