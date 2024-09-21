import { WagmiPlugin, useSwitchChain, useChainId, useAccount } from '@wagmi/vue'
import { defineNuxtPlugin } from 'nuxt/app'
import { base, immutableZkEvm, mantle } from '@wagmi/vue/chains'
import { defaultWagmiConfig } from '@web3modal/wagmi/vue'
import type { Prefix } from '@kodadot1/static'

export default defineNuxtPlugin((nuxtApp) => {
  const wagmiConfig = (projectId: string) => {
    const metadata = {
      name: 'Koda',
      description: 'Koda - Generative Art Marketplace',
      url: 'https://koda.art/',
      icons: ['https://avatars.githubusercontent.com/u/37784886'],
    }

    return defaultWagmiConfig({
      chains: [base, immutableZkEvm, mantle],
      projectId,
      metadata,
    })
  }

  const projectId = useRuntimeConfig().public.walletConnectProjectId
  const config = wagmiConfig(projectId)

  nuxtApp.vueApp.use(WagmiPlugin, { config })

  const { switchChain } = useSwitchChain()
  const { urlPrefix } = usePrefix()
  const { getIsEvm } = storeToRefs(useWalletStore())
  const chainId = useChainId()

  const changeChain = (prefix: Prefix) => {
    if (getIsEvm.value) {
      const chain = PREFIX_TO_CHAIN[prefix]
      if (chain && chainId.value !== chain.id) {
        switchChain({ chainId: chain.id })
      }
    }
  }

  watch(urlPrefix, changeChain)

  if (getIsEvm.value) {
    const stop = watch(useAccount().isConnected, (connected) => {
      if (connected) {
        changeChain(urlPrefix.value)
        stop()
      }
    }, { immediate: true })
  }

  // By default, you don't need to pass the config as long as you are using composables from @wagmi/vue.
  // If you still need to pass the config, you can do so through the useConfig() composable.
  // If you need the config outside of the plugin, such as from a Pinia store, you can access it through useNuxtApp().$wagmiConfig.
  return {
    provide: {
      wagmiConfig: config,
    },
  }
})
