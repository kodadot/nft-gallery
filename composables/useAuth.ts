export default function useAuth() {
  const { $store } = useNuxtApp()

  const accountId = computed(() => $store.getters.getAuthAddress)
  const isLogin = computed(() => Boolean($store.getters.getAuthAddress))
  const balance = computed(() => $store.getters.getAuthBalance)

  return { accountId, isLogin, balance }
}
