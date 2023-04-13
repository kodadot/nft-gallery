import { useIdentityStore } from '@/stores/identity'

export default function () {
  // const { $store } = useNuxtApp()
  const identityStore = useIdentityStore()

  const accountId = computed(() => identityStore.getAuthAddress)
  const isLogIn = computed(() => Boolean(identityStore.getAuthAddress))
  const balance = computed(() => identityStore.getAuthBalance)

  return {
    accountId,
    isLogIn,
    balance,
  }
}
