import { chainPrefixes } from '@kodadot1/static'

export const rmrk2ChainPrefixesInHostname = ['rmrk2', 'rmrk']

export default function ({ store, route }): void {
  const prefixInPath = route.params.prefix || route.path.split('/')[1]
  const { setUrlPrefix, urlPrefix } = usePrefix()

  const isAnyChainPrefixInPath = chainPrefixes.includes(prefixInPath)
  const rmrk2ChainPrefixInHostname = rmrk2ChainPrefixesInHostname.find(
    (prefix) => location.hostname.startsWith(`${prefix}.`)
  )

  if (rmrk2ChainPrefixInHostname) {
    // fixed chain domain (for example: rmrk2.kodadot.xyz)

    if (isAnyChainPrefixInPath && prefixInPath && prefixInPath !== 'ksm') {
      window.open(
        // multi-chain domain (for example: kodadot.xyz)
        `${window.location.origin.replace(
          `${rmrk2ChainPrefixInHostname}.`,
          ''
        )}${route.fullPath}`,
        '_self'
      )
    } else if (urlPrefix.value !== 'ksm') {
      store.dispatch('setUrlPrefix', 'ksm')
      setUrlPrefix('ksm')
    }
  } else if (
    urlPrefix.value !== prefixInPath &&
    prefixInPath &&
    isAnyChainPrefixInPath
  ) {
    store.dispatch('setUrlPrefix', prefixInPath)
  }
}
