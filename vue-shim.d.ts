declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

import { ApolloClientMethods } from 'vue-apollo/types/vue-apollo'
import { BuefyNamespace } from 'buefy'
import consola from 'consola'

declare module '#app' {
  interface NuxtAppCompat {
    $apollo: ApolloClientMethods
    $buefy: BuefyNamespace
    $consola: typeof consola
  }
}
