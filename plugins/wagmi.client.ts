import { reconnect } from '@wagmi/core'

export default defineNuxtPlugin(() => {
  const config = buildWagmiConfig()

  reconnect(config)

  return {
    provide: {
      // important use same config across the app
      wagmiConfig: config,
    },
  }
})
