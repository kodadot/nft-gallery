import { chainPrefixes } from '@kodadot1/static'
import { useIdentityStore } from '@/stores/identity'
import { ss58Of } from '@/utils/config/chain.config'
import consola from 'consola'

export const rmrk2ChainPrefixesInHostname = ['rmrk2', 'rmrk']

export default defineNuxtRouteMiddleware((route) => {
  const identityStore = useIdentityStore()
  const prefixInPath = route.params.prefix || route.path.split('/')[1]
  const { setUrlPrefix, urlPrefix } = usePrefix()

  const isAnyChainPrefixInPath = chainPrefixes.includes(prefixInPath)
  const rmrk2ChainPrefixInHostname = rmrk2ChainPrefixesInHostname.find(
    (prefix) => process.client && location.hostname.startsWith(`${prefix}.`),
  )

  if (
    [urlPrefix.value, prefixInPath].includes('dot') &&
    route.name !== 'prefix-transfer'
  ) {
    setUrlPrefix('ahp')
    navigateTo(route.path.replace(prefixInPath, 'ahp'))
    return
  }

  if (rmrk2ChainPrefixInHostname) {
    // fixed chain domain (for example: rmrk2.kodadot.xyz)

    if (isAnyChainPrefixInPath && prefixInPath && prefixInPath !== 'ksm') {
      window.open(
        // multi-chain domain (for example: kodadot.xyz)
        `${window.location.origin.replace(
          `${rmrk2ChainPrefixInHostname}.`,
          '',
        )}${route.fullPath}`,
        '_self',
      )
    } else if (urlPrefix.value !== 'ksm') {
      setUrlPrefix('ksm')
    }
  } else if (
    urlPrefix.value !== prefixInPath &&
    prefixInPath &&
    isAnyChainPrefixInPath
  ) {
    setUrlPrefix(prefixInPath)
  }

  try {
    identityStore.setCorrectAddressFormat(ss58Of(urlPrefix.value))
  } catch {
    consola.warn('Invalid chain prefix')
  }
})
