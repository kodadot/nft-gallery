import { ENDPOINTS } from '@kodadot1/vuex-options'
import { chainList } from '@kodadot1/static'

import type { Option } from '@kodadot1/static'

const prefixes: Record<string, number> = {
  polkadot: 0,
  reserved1: 1,
  kusama: 2,
  reserved3: 3,
  katalchain: 4,
  plasm: 5,
  bifrost: 6,
  edgeware: 7,
  karura: 8,
  reynolds: 9,
  acala: 10,
  laminar: 11,
  polymesh: 12,
  substratee: 13,
  totem: 14,
  synesthesia: 15,
  kulupu: 16,
  dark: 17,
  darwinia: 18,
  geek: 19,
  stafi: 20,
  'dock-testnet': 21,
  'dock-mainnet': 22,
  shift: 23,
  zero: 24,
  'zero-alphaville': 25,
  jupiter: 26,
  patract: 27,
  cord: 29,
  phala: 30,
  litentry: 31,
  robonomics: 32,
  datahighway: 33,
  vln: 35,
  centrifuge: 36,
  nodle: 37,
  kilt: 38,
  mathchain: 39,
  'mathchain-testnet': 40,
  poli: 41,
  substrate: 42,
  reserved43: 43,
  chainx: 44,
  uniarts: 45,
  reserved46: 46,
  reserved47: 47,
  reserved48: 48,
}

export const getPrefixByStoreUrl = (apiUrl: any): string | undefined => {
  if (!apiUrl) {
    return 'undefined'
  }

  return getChainPrefixByUrl(apiUrl)
}

export const getChainPrefixByUrl = (url: string): string | undefined => {
  const option = ENDPOINTS.find(({ value }) => value === url)
  if (!option) {
    return undefined
  }

  return prefixes[option.info] ? String(prefixes[option.info]) : undefined
}

export const getChainEndpointByPrefix = (prefix: string) => {
  const endpoint = ENDPOINTS.find((node) => {
    return node.info === prefix
  })

  return endpoint?.value
}

export const getChainNameByPrefix = (prefix: string) => {
  if (prefix === 'ksm') {
    return 'rmrk2'
  }

  return prefix
}

export const isProduction = window.location.hostname === 'kodadot.xyz'
export const isBeta = window.location.hostname === 'beta.kodadot.xyz'

export const disableChainListOnBetaEnv = [
  'westend',
  'westmint',
  'movr',
  'glmr',
  'snek',
]

export const availablePrefixes = (): Option[] => {
  const chains = chainList()

  if (isProduction || isBeta) {
    return chains.filter(
      (chain) => !disableChainListOnBetaEnv.includes(String(chain.value))
    )
  }

  return chains
}
