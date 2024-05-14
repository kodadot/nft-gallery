import type { ComputedRef } from 'vue'
import { accountToPublicKey, getss58AddressByPrefix } from '@/utils/account'
import { type Prefix } from '@kodadot1/static'
import shortAddress from '@/utils/shortAddress'

export type IdentityFields = Record<string, string>

export const useIdentityQuery = (urlPrefix: Ref<Prefix>) => {
  const isDotAddress = computed(() => ['dot', 'ahp'].includes(urlPrefix.value))
  const isBaseAddress = computed(() => ['base'].includes(urlPrefix.value))

  const getIdentityId = (address: string) =>
    isBaseAddress
      ? address
      : isDotAddress.value
        ? accountToPublicKey(address)
        : getss58AddressByPrefix(address, 'rmrk')

  return { isDotAddress, getIdentityId }
}

export default function useIdentity({
  address = computed(() => ''),
  customNameOption = '',
}: {
  address: ComputedRef
  customNameOption?: string
}) {
  const { urlPrefix } = usePrefix()
  const { getIdentityId } = useIdentityQuery(urlPrefix)

  const id = computed(() => address.value && getIdentityId(address.value))

  const { profile, pending: loading } = useFetchProfile(id)

  const shortenedAddress = computed(() => shortAddress(address.value))
  const twitter = computed(
    () =>
      profile?.value?.socials?.find((s) => s.platform === 'Twitter')?.handle,
  )
  const web = computed(
    () =>
      profile?.value?.socials?.find((s) => s.platform === 'Website')?.handle,
  )
  const farcaster = computed(
    () =>
      profile?.value?.socials?.find((s) => s.platform === 'Farcaster')?.handle,
  )
  const display = computed(() => profile?.value?.name)
  const name = computed(() =>
    displayName({
      customNameOption,
      profileName: display.value,
      shortenedAddress,
    }),
  )

  const identity = computed(() =>
    profile.value
      ? {
          address: address.value,
          name: name.value,
          display: display.value,
          twitter: twitter.value,
          web: web.value,
          farcaster: farcaster.value,
        }
      : null,
  )

  const hasIdentity = computed(() => Boolean(profile.value))

  return {
    isFetchingIdentity: loading,
    shortenedAddress,
    twitter,
    display,
    name,
    hasIdentity,
    identity,
  }
}

const displayName = ({
  customNameOption,
  profileName,
  shortenedAddress,
}): string => {
  if (customNameOption) {
    return customNameOption
  }

  if (profileName?.length > 20) {
    return shortenedAddress.value
  }

  return profileName || shortenedAddress.value
}
