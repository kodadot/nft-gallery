import IVueI18n from 'vue-i18n'

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '#app' {
  interface NuxtAppCompat {
    $i18n: IVueI18n
  }
}
