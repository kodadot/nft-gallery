import consola from 'consola'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      consola,
    },
  }
})
