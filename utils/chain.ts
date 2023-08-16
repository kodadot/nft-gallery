import type { Option } from '@kodadot1/static'
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

export const disableChainListOnBetaEnv = ['movr', 'glmr', 'snek']

export const availablePrefixes = (): Option[] => {
  const chains = chainList()

  if (isProduction || isBeta) {
    return chains.filter(
      (chain) => !disableChainListOnBetaEnv.includes(String(chain.value))
    )
  }

  return chains
}

export const getAvailablePrefix = (prefix: string): string => {
  return availablePrefixes().some((chain) => chain.value === prefix)
    ? prefix
    : ''
}
