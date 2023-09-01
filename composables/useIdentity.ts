import { accountToPublicKey } from '@/utils/account'
import { ComputedRef } from 'vue/types'

import shortAddress from '@/utils/shortAddress'

type IdentityFields = Record<string, string>

export default function useIdentity({
  address = computed(() => ''),
  customNameOption = '',
}: {
  address: ComputedRef
  customNameOption?: string
}) {
  const isFetchingIdentity = ref(false)

  const { urlPrefix } = usePrefix()

  const publicKey = computed(
    () => address.value && accountToPublicKey(address.value)
  )

  const identity = computed<IdentityFields>(() => data.value?.identity || {})

  const { data, refetch, loading } = useGraphql({
    clientName: ['dot', 'ahp'].includes(urlPrefix.value) ? 'pid' : 'kid',
    queryName: 'identityById',
    variables: {
      id: publicKey.value,
    },
    disabled: computed(() => !address.value),
  })
  const shortenedAddress = computed(() => shortAddress(address.value))
  const twitter = computed(() => identity?.value?.twitter)
  const discord = computed(() => identity?.value?.discord)
  const instagram = computed(() => identity?.value?.instagram)
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
    discord,
    instagram,
    display,
    name,
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
