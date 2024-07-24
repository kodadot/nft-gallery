import type { ChainVM, Option, Prefix } from '@kodadot1/static'
import { ENDPOINT_MAP, NAMES, chainList } from '@kodadot1/static'
import { chainPropListOf } from '@/utils/config/chain.config'

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

export const disableChains = ['dot', 'rmrk', 'ksm']
export const disableChainListOnBetaEnv = ['dot', 'rmrk', 'ksm'] // 'ahr'

export const availablePrefixes = (): Option[] => {
  return allPrefixes().filter(chain => !disableChains.includes(String(chain.value)))
}

export const allPrefixes = (): Option[] => {
  const chains = chainList()

  if (isProduction || isBeta) {
    return chains.filter(
      chain => !disableChainListOnBetaEnv.includes(String(chain.value)),
    )
  }
  return chains
}

export const getAvailableChainsByVM = (vm: ChainVM) =>
  availablePrefixes().filter(
    ({ value: prefix }) => vm === chainPropListOf(prefix as Prefix).vm,
  )

export const getAvailablePrefix = (prefix: string): string => {
  return availablePrefixes().some(chain => chain.value === prefix)
    ? prefix
    : ''
}

export const chainIcons = {
  ahk: '/token/kusama_asset_hub.svg',
  ahp: '/token/polkadot_asset_hub.svg',
  ksm: '/token/ksm.svg',
  rmrk: '/token/ksm.svg',
  dot: '/token/dot.svg',
  // ahr: '/token/kusama_asset_hub.svg',
}

export const availablePrefixWithIcon = () => {
  return availablePrefixes().map((chain) => {
    return {
      ...chain,
      icon: chainIcons[chain.value] || '',
    }
  })
}
export const allPrefixWithIcon = () => {
  return allPrefixes().map((chain) => {
    return {
      ...chain,
      icon: chainIcons[chain.value] || '',
    }
  })
}

export const popularChains = ['ksm', 'ahk', 'ahp']
