import { accountToPublicKey, getss58AddressByPrefix } from '@/utils/account'
import { ComputedRef } from 'vue/types'

import shortAddress from '@/utils/shortAddress'

export type IdentityFields = Record<string, string>

export default function useIdentity({
  address = computed(() => ''),
  customNameOption = '',
}: {
  address: ComputedRef
  customNameOption?: string
}) {
  const { urlPrefix } = usePrefix()
  const { apiInstanceByPrefix } = useApi()
  const isDotAddress = computed(() => ['dot', 'ahp'].includes(urlPrefix.value))
  const id = computed(
    () =>
      address.value &&
      (isDotAddress.value
        ? accountToPublicKey(address.value)
        : getss58AddressByPrefix(address.value, 'rmrk'))
  )

  const identityPrefix = computed(() => (isDotAddress.value ? 'dot' : 'rmrk'))

  const identityApi = computed(() => apiInstanceByPrefix(identityPrefix.value))

  const identity = computed<IdentityFields>(() => data.value?.identity || {})

  const { data, refetch, loading } = useGraphql({
    clientName: computed(() => (isDotAddress.value ? 'pid' : 'kid')),
    queryName: 'identityById',
    variables: {
      id: id.value,
    },
    disabled: computed(() => !address.value),
  })
  const shortenedAddress = computed(() => shortAddress(address.value))
  const twitter = computed(() => identity?.value?.twitter)
  const display = computed(() => identity?.value?.display)
  const name = computed(() =>
    displayName({ customNameOption, identity, shortenedAddress })
  )

  watch(urlPrefix, () => {
    refetch()
  })
  return {
    identity,
    isFetchingIdentity: loading,
    shortenedAddress,
    twitter,
    display,
    name,
    identityApi,
    identityPrefix,
    refetchIdentity: refetch,
  }
}

const displayName = ({
  customNameOption,
  identity,
  shortenedAddress,
}): string => {
  if (customNameOption) {
    return customNameOption
  }

  const display = identity.value?.display
  if (display?.length > 20) {
    return shortAddress(display)
  }

  return display || shortenedAddress.value
}
