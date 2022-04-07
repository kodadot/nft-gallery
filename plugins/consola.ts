import consola from 'consola'

declare module 'vue/types/vue' {
  // this.$seoMeta inside Vue components
  interface Vue {
    $consola
  }
}

const logger = consola.create({
  // level: 4,
  reporters: [new consola.JSONReporter()],
})

export default ({ app }, inject) => {
  inject('consola', logger)
}
