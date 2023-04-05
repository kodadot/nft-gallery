import { useIdentityStore } from '@/stores/identity'

export default function () {
  // const { $store } = useNuxtApp()
  const identityStore = useIdentityStore()

  const accountId = computed(() => identityStore.auth.address)
  const isLogIn = computed(() => Boolean(identityStore.auth.address))
  const balance = computed(() => identityStore.getAuthBalance)

  return {
    accountId,
    isLogIn,
    balance,
  }
}
