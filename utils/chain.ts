import type { Option, Prefix } from '@kodadot1/static'
import { ENDPOINT_MAP, chainList } from '@kodadot1/static'

export const getChainEndpointByPrefix = (prefix: string) => {
  const endpoint: string | undefined = ENDPOINT_MAP[prefix]

  return endpoint
}

export const getChainNameByPrefix = (prefix: string) => {
  if (prefix === 'ksm') {
    return 'rmrk2'
  }

  return prefix
}

export const isProduction = window.location.hostname === 'kodadot.xyz'
export const isBeta = window.location.hostname === 'beta.kodadot.xyz'

export const disableChains = ['dot']
export const disableChainListOnBetaEnv = ['dot', 'movr', 'glmr', 'snek']

export const availablePrefixes = (): Option[] => {
  const chains = chainList()

  if (isProduction || isBeta) {
    return chains.filter(
      (chain) => !disableChainListOnBetaEnv.includes(String(chain.value))
    )
  }

  return chains.filter((chain) => !disableChains.includes(String(chain.value)))
}

export const getAvailablePrefix = (prefix: string): string => {
  return availablePrefixes().some((chain) => chain.value === prefix)
    ? prefix
    : ''
}

export enum Network {
  KUSAMA = 'kusama',
  BASILISK = 'basilisk',
  BASILISK_TESTNET = 'basilisk-testnet',
  STATEMINE = 'statemine',
  STATEMINT = 'statemint',
  POLKADOT = 'polkadot',
  MOONRIVER = 'moonriver',
  MOONBEAM = 'moonbeam',
}

export const networkToPrefix: Record<Network, Prefix> = {
  [Network.POLKADOT]: 'dot',
  [Network.KUSAMA]: 'ksm',
  [Network.STATEMINT]: 'ahp',
  [Network.BASILISK]: 'bsx',
  [Network.BASILISK_TESTNET]: 'snek',
  [Network.STATEMINE]: 'ahk',
  [Network.MOONRIVER]: 'movr',
  [Network.MOONBEAM]: 'glmr',
}
