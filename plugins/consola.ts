import consola from 'consola'

declare module 'vue/types/vue' {
  // this.$seoMeta inside Vue components
  interface Vue {
    $consola
  }
}

export default ({ app }, inject) => {
  inject('consola', consola)
}
