import { useIdentityStore } from '@/stores/identity'
import { accountsAreSame } from '@/utils/account'

export default function () {
  const identityStore = useIdentityStore()

  const accountId = computed(() => identityStore.getAuthAddress)
  const isLogIn = computed(() => Boolean(identityStore.getAuthAddress))
  const balance = computed(() => identityStore.getAuthBalance)
  const { urlPrefix } = usePrefix()
  const { isEvm } = useIsChain(urlPrefix)

  const isCurrentOwner = (address?: string) => {
    let accountAddress = accountId.value
    let compareAddress = address

    if (!accountAddress || !compareAddress) return false

    if (isEvm.value) {
      accountAddress = accountAddress.toLowerCase()
      compareAddress = compareAddress.toLowerCase()
    }

    return accountsAreSame(accountAddress, compareAddress)
  }

  return {
    accountId,
    isLogIn,
    balance,
    isCurrentOwner,
  }
}
