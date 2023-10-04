import type { ComputedRef } from 'vue'
import { accountToPublicKey, getss58AddressByPrefix } from '@/utils/account'
import { chainPropListOf } from '@/utils/config/chain.config'

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

  const identityUnit = computed(
    () => chainPropListOf(identityPrefix.value)?.tokenSymbol
  )

  const identityApi = computed(() => apiInstanceByPrefix(identityPrefix.value))
  const clientName = computed(() => (isDotAddress.value ? 'pid' : 'kid'))

  const { data, refetch, loading } = useGraphql({
    clientName,
    queryName: 'identityById',
    variables: {
      id: id.value,
    },
    disabled: computed(() => !address.value),
  })

  const identity = computed<IdentityFields>(() => data.value?.identity || {})

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
    identityUnit,
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
