import { chainPrefixes } from '@kodadot1/static'
import type { Prefix } from '@kodadot1/static'
import { useWalletStore } from '@/stores/wallet'
import consola from 'consola'

export default defineNuxtRouteMiddleware((route) => {
  const walletStore = useWalletStore()
  const prefixInPath = (route.params.prefix ||
    route.path.split('/')[1]) as Prefix
  const { setUrlPrefix, urlPrefix } = usePrefix()

  const isAnyChainPrefixInPath = chainPrefixes.includes(prefixInPath)

  if (
    [urlPrefix.value, prefixInPath].includes('dot') &&
    route.name !== 'prefix-transfer'
  ) {
    setUrlPrefix('ahp')
    navigateTo(route.path.replace(prefixInPath, 'ahp'))
    return
  }

  if (
    urlPrefix.value !== prefixInPath &&
    prefixInPath &&
    isAnyChainPrefixInPath
  ) {
    setUrlPrefix(prefixInPath)
  }

  try {
    walletStore.switchChain(urlPrefix.value)
  } catch {
    consola.warn('Invalid chain prefix')
  }
})
