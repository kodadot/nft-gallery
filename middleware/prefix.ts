import { chainPrefixes } from '@/utils/chain'

export default function ({ store, route }): void {
  const prefix = route.params.prefix || route.path.split('/')[1]
  const chains = ['rmrk', ...chainPrefixes]
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
