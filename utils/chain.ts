import type { Option, Prefix } from '@kodadot1/static'
import { ENDPOINT_MAP, NAMES, chainList } from '@kodadot1/static'

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

export const getChainName = (prefix: Prefix) => {
  return NAMES[prefix].replace(' [Beta]', '')
}

export const isProduction = window.location.hostname === 'kodadot.xyz'
export const isBeta = window.location.hostname === 'beta.kodadot.xyz'

export const disableChains = ['dot']
export const disableChainListOnBetaEnv = ['dot', 'snek']

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

export const availablePrefixWithIcon = () => {
  const menus = {
    ahk: '/token/kusama_asset_hub.svg',
    ahp: '/token/polkadot_asset_hub.svg',
    bsx: '/token/bsx.svg',
    snek: '/token/bsx.svg',
    ksm: '/token/ksm.svg',
    rmrk: '/token/ksm.svg',
  }

  return availablePrefixes().map((chain) => {
    return {
      ...chain,
      icon: menus[chain.value] || '',
    }
  })
}
