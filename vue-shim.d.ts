declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

import { ApolloClientMethods } from 'vue-apollo/types/vue-apollo'
import { BuefyNamespace } from 'buefy'
import consola from 'consola'
import { IVueI18n } from 'vue-i18n'

declare module '#app' {
  interface NuxtAppCompat {
    $apollo: ApolloClientMethods
    $buefy: BuefyNamespace
    $consola: typeof consola
    $i18n: IVueI18n
  }
}
