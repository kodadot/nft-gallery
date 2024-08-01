import type { Locale, Path, Values } from 'vue-i18n/types'
import VueI18n from 'vue-i18n/types'

/**
 * Overloads VueI18n interface to avoid needing to cast return value to string.
 * @see https://github.com/kazupon/vue-i18n/issues/410
 */
declare module 'vue-i18n/types' {
  export default class VueI18n {
    t(key: Path, locale: Locale, values?: Values): string
    t(key: Path, values?: Values): string
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $t: typeof VueI18n.prototype.t
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface VueConstructor<V extends Vue = Vue> {
    i18n: typeof VueI18n.prototype
  }
}

export default VueI18n
