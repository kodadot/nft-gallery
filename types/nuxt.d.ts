import type { ConsolaInstance } from 'consola'

declare module '#app' {
  interface NuxtApp {
    $consola: ConsolaInstance
  }
}
