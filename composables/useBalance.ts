import { useIdentityStore } from '@/stores/identity'

export default function () {
  const { urlPrefix } = usePrefix()
  const identityStore = useIdentityStore()

  const getBalance = (_token: string) => {
    switch (urlPrefix.value) {
      default:
        return identityStore.getAuthBalance
    }
  }

  const balance = computed(() => getBalance('KSM'))

  return {
    balance,
    getBalance,
  }
}
