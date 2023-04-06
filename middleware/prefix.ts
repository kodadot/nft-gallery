import { chainPrefixes } from '@kodadot1/static'

export default function ({ store, route }): void {
  const prefix = route.params.prefix || route.path.split('/')[1]
  const chains = ['rmrk2', ...chainPrefixes]
  const isAnyChainPrefixInPath = chains.some((prefix) =>
    route.path.includes(prefix)
  )

  if (
    store.getters.currentUrlPrefix !== prefix &&
    prefix &&
    isAnyChainPrefixInPath
  ) {
    store.dispatch('setUrlPrefix', prefix)
  }
}
