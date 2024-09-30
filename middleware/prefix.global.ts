import { chainPrefixes, type Prefix } from '@kodadot1/static'
import consola from 'consola'
import { useWalletStore } from '@/stores/wallet'

export default defineNuxtRouteMiddleware((route) => {
  const walletStore = useWalletStore()
  const prefixInPath = (route.params.prefix || route.path.split('/')[1]) as Prefix
  const { setUrlPrefix, urlPrefix } = usePrefix()

  const isAnyChainPrefixInPath = chainPrefixes.includes(prefixInPath)
  if (['rmrk', 'ksm', 'dot'].some(prefix => [urlPrefix.value, prefixInPath].includes(prefix as Prefix))
    && route.name !== 'prefix-transfer'
  ) {
    setUrlPrefix('ahp')
  }
  else if (
    urlPrefix.value !== prefixInPath
    && prefixInPath
    && isAnyChainPrefixInPath
  ) {
    setUrlPrefix(prefixInPath)
  }

  try {
    walletStore.switchChain(urlPrefix.value)
  }
  catch {
    consola.warn('Invalid chain prefix')
  }
})
