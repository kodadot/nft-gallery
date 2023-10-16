import { useIdentityStore } from '@/stores/identity'
import { accountsAreSame } from '@/utils/account'

export default function () {
  const identityStore = useIdentityStore()

  const accountId = computed(() => identityStore.getAuthAddress)
  const isLogIn = computed(() => Boolean(identityStore.getAuthAddress))
  const balance = computed(() => identityStore.getAuthBalance)

  const isCurrentOwner = (address?: string) =>
    accountsAreSame(accountId.value, address)

  return {
    accountId,
    isLogIn,
    balance,
    isCurrentOwner,
  }
}
