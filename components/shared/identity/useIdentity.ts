import { get, update } from 'idb-keyval'
import { hexToString, isHex } from '@polkadot/util'
import { Data } from '@polkadot/types'
import { GenericAccountId } from '@polkadot/types/generic/AccountId'
import { onApiConnect } from '@kodadot1/sub-api'

import useAPI from '@/composables/useApi'
import { emptyObject } from '@/utils/empty'
import { identityStore } from '@/utils/idbStore'
import shortAddress from '@/utils/shortAddress'

type Address = string | GenericAccountId | undefined
type IdentityFields = Record<string, string>

const resolveAddress = (account: Address): string => {
  return account instanceof GenericAccountId
    ? account.toString()
    : account || ''
}

const handleRaw = (display: Data): string => {
  if (display?.isRaw) {
    return display.asRaw.toHuman() as string
  }

  if (isHex((display as any)?.Raw)) {
    return hexToString((display as any)?.Raw)
  }

  return display?.toString()
}

const fetchIdentity = async (address: string) => {
  const { apiInstance } = useAPI()
  const api = await apiInstance.value
  const optionIdentity = await api?.query.identity?.identityOf(address)
  const identityFresh = optionIdentity?.unwrapOrDefault()

  if (!identityFresh?.size) {
    return emptyObject<IdentityFields>()
  }

  const final = Array.from(identityFresh.info)
    .filter(([, value]) => !Array.isArray(value) && !value.isEmpty)
    .reduce((acc, [key, value]) => {
      acc[key] = handleRaw(value as unknown as Data)
      return acc
    }, {} as IdentityFields)

  update(address, () => final, identityStore)

  return final
}

export default function useIdentity({ address, customNameOption }) {
  const { apiUrl } = useAPI()
  const identity = ref<IdentityFields>({})
  const isFetchingIdentity = ref(false)
  const twitter = computed(() => identity.value.twitter || '')
  const discord = computed(() => identity.value.discord || '')
  const display = computed(() => identity.value.display || '')
  const shortenedAddress = computed(() => shortAddress(address))
  const name = computed(() => {
    if (customNameOption) {
      return customNameOption
    }

    const display = identity.value.display
    if (display?.length > 20) {
      return shortAddress(display)
    }

    return display || shortenedAddress.value
  })

  const whichIdentity = async () => {
    const identityCached = await get(resolveAddress(address), identityStore)

    if (identityCached) {
      identity.value = identityCached
    } else {
      isFetchingIdentity.value = true

      // better if get data from indexer
      // reference: https://github.com/kodadot/nft-gallery/issues/3783
      onApiConnect(apiUrl.value, async () => {
        identity.value = await fetchIdentity(address)
        isFetchingIdentity.value = false
      })
    }
  }

  onMounted(whichIdentity)
  watch(address, whichIdentity)

  return {
    identity,
    isFetchingIdentity,
    shortenedAddress,
    twitter,
    discord,
    display,
    name,
  }
}
