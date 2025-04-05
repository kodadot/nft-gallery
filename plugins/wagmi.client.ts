import { WagmiPlugin } from '@wagmi/vue'
import { defineNuxtPlugin } from 'nuxt/app'
import { base } from '@wagmi/vue/chains'
import { defaultWagmiConfig } from '@web3modal/wagmi/vue'

export default defineNuxtPlugin((nuxtApp) => {
  const wagmiConfig = (projectId: string) => {
    const metadata = {
      name: 'Koda',
      description: 'Koda - Generative Art Marketplace',
      url: 'https://koda.art/',
      icons: ['https://avatars.githubusercontent.com/u/37784886'],
    }

    return defaultWagmiConfig({
      chains: [base],
      projectId,
      metadata,
    })
  }

  const projectId = useRuntimeConfig().public.walletConnectProjectId

  nuxtApp.vueApp.use(WagmiPlugin, { config: wagmiConfig(projectId) })

  // By default, you don't need to pass the config as long as you are using composables from @wagmi/vue.
  // If you still need to pass the config, you can do so through the useConfig() composable.
  // If you need the config outside of the plugin, such as from a Pinia store, you can access it through useNuxtApp().$wagmiConfig.
  return {
    provide: {
      wagmiConfig: wagmiConfig(projectId),
    },
  }
})
