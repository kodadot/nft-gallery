import type { ConsolaInstance } from 'consola'
import type { Config } from '@wagmi/core'

declare module '#app' {
  interface NuxtApp {
    $consola: ConsolaInstance
    $wagmiConfig: Config
  }
}
