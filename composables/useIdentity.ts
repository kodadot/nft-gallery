import type { ComputedRef } from 'vue'
import { accountToPublicKey, getss58AddressByPrefix } from '@/utils/account'
import { chainPropListOf } from '@/utils/config/chain.config'
import { type Prefix } from '@kodadot1/static'
import shortAddress from '@/utils/shortAddress'

export type IdentityFields = Record<string, string>

export const useIdentityQuery = (urlPrefix: Ref<Prefix>) => {
  const isDotAddress = computed(() => ['dot', 'ahp'].includes(urlPrefix.value))
  const clientName = computed(() => (isDotAddress.value ? 'pid' : 'kid'))

  const getIdentityId = (address: string) =>
    isDotAddress.value
      ? accountToPublicKey(address)
      : getss58AddressByPrefix(address, 'rmrk')

  return { isDotAddress, getIdentityId, clientName }
}

export default function useIdentity({
  address = computed(() => ''),
  customNameOption = '',
}: {
  address: ComputedRef
  customNameOption?: string
}) {
  const { urlPrefix } = usePrefix()
  const { apiInstanceByPrefix } = useApi()
  const { isDotAddress, getIdentityId, clientName } =
    useIdentityQuery(urlPrefix)

  const id = computed(() => address.value && getIdentityId(address.value))

  const identityPrefix = computed(() => (isDotAddress.value ? 'dot' : 'rmrk'))

  const identityUnit = computed(
    () => chainPropListOf(identityPrefix.value)?.tokenSymbol,
  )

  const identityApi = computed(() => apiInstanceByPrefix(identityPrefix.value))

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
    displayName({ customNameOption, identity, shortenedAddress }),
  )

  const hasIdentity = computed(() => {
    const { display, legal, web, twitter, riot, email } = identity.value
    return Boolean(display || legal || web || twitter || riot || email)
  })

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
    hasIdentity,
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
