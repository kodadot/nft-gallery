import type { Config } from '@wagmi/core'

declare module '#app' {
  interface NuxtApp {
    $wagmiConfig: Config
  }
}
