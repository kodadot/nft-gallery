import { chainPrefixes } from '@kodadot1/static'

export const rmrk2ChainPrefixesInHostname = ['rmrk2', 'rmrk']

export default function ({ store, route }): void {
  const prefix = route.params.prefix || route.path.split('/')[1]
  const chains = [...chainPrefixes]
  const isAnyChainPrefixInPath = chains.some((prefix) =>
    route.path.includes(prefix)
  )
  const rmrk2ChainPrefixInHostname = rmrk2ChainPrefixesInHostname.find(
    (prefix) => location.hostname.startsWith(`${prefix}.`)
  )

  if (rmrk2ChainPrefixInHostname) {
    // fixed chain domain (for example: rmrk2.kodadot.xyz)

    if (
      isAnyChainPrefixInPath &&
      prefix &&
      prefix !== rmrk2ChainPrefixInHostname
    ) {
      window.open(
        // multi-chain domain (for example: kodadot.xyz)
        `${window.location.origin.replace(
          `${rmrk2ChainPrefixInHostname}.`,
          ''
        )}${route.fullPath}`,
        '_self'
      )
    } else if (store.getters.currentUrlPrefix !== rmrk2ChainPrefixInHostname) {
      store.dispatch('setUrlPrefix', 'ksm')
    }
  } else if (
    store.getters.currentUrlPrefix !== prefix &&
    prefix &&
    isAnyChainPrefixInPath
  ) {
    store.dispatch('setUrlPrefix', prefix)
  }
}
