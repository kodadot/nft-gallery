export default function () {
  const { $store } = useNuxtApp()

  const accountId = computed(() => $store.getters.getAuthAddress)
  const isLogIn = computed(() => Boolean($store.getters.getAuthAddress))
  const balance = computed(() => $store.getters.getAuthBalance)

  return {
    accountId,
    isLogIn,
    balance,
  }
}
