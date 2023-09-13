import consola from 'consola'
import IVueI18n from 'vue-i18n'

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '#app' {
  interface NuxtAppCompat {
    $consola: typeof consola
    $i18n: IVueI18n
  }
}
