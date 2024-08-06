export default defineNuxtPlugin(() => {
  return {
    provide: {
      // important use same config across the app
      wagmiConfig: buildWagmiConfig(),
    },
  }
})
