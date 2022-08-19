<template>
  <div
    v-if="
      ((showTwitter && twitter) || !showTwitter) &&
      ((showDiscord && discord) || !showDiscord)
    "
    class="is-flex-wrap-wrap is-flex-grow-1">
    <IdentitySocial
      v-if="(showTwitter && twitter) || (showDiscord && discord)"
      :twitter="twitter"
      :show-twitter="showTwitter"
      :discord="discord"
      :show-discord="showDiscord" />
    <IdentityChain
      v-else
      :show-onchain-identity="showOnchainIdentity"
      :hide-identity-popover="hideIdentityPopover"
      :is-fetching-identity="isFetchingIdentity"
      :identity="identity"
      :address="address"
      :shortened-address="shortenedAddress"
      :name="name" />
  </div>
</template>

<script lang="ts" setup>
import { get, update } from 'idb-keyval'
import { hexToString, isHex } from '@polkadot/util'
import { Data } from '@polkadot/types'
import { GenericAccountId } from '@polkadot/types/generic/AccountId'
import { onApiConnect } from '@kodadot1/sub-api'

import useAPI from '@/composables/useApi'

import { emptyObject } from '@/utils/empty'
import { identityStore } from '@/utils/idbStore'
import shortAddress from '@/utils/shortAddress'
import shouldUpdate from '@/utils/shouldUpdate'

type Address = string | GenericAccountId | undefined
type IdentityFields = Record<string, string>

const IdentitySocial = defineAsyncComponent(
  () => import('@/components/shared/identity/IdentitySocial.vue')
)
const IdentityChain = defineAsyncComponent(
  () => import('@/components/shared/identity/IdentityChain.vue')
)

const props = defineProps<{
  address?: Address
  emit?: boolean
  showTwitter?: boolean
  showDiscord?: boolean
  showOnchainIdentity?: boolean
  hideIdentityPopover?: boolean
  customNameOption?: string
  inline?: boolean
}>()

const { apiInstance, apiUrl } = useAPI()

const identity = ref<IdentityFields>({})
const isFetchingIdentity = ref(false)
const totalCreated = ref(0)
const totalCollected = ref(0)
const firstMintDate = ref(new Date())
const lastBoughtDate = ref(new Date())

const resolveAddress = (account: Address): string => {
  return account instanceof GenericAccountId
    ? account.toString()
    : account || ''
}
const address = computed(() => resolveAddress(props.address))
const shortenedAddress = computed(() => shortAddress(address.value))
const name = computed(() => {
  if (props.customNameOption) {
    return props.customNameOption
  }

  const display = identity.value.display
  if (display?.length > 20) {
    return shortAddress(display)
  }

  return (display as string) || shortenedAddress.value
})
const twitter = computed(() => identity.value.twitter || '')
const discord = computed(() => identity.value.discord || '')
const display = computed(() => identity.value.display || '')

provide('address', address.value)
provide('shortenedAddress', shortenedAddress.value)
provide('firstMintDate', firstMintDate)
provide('lastBoughtDate', lastBoughtDate)
provide('totalCreated', totalCreated)
provide('totalCollected', totalCollected)
provide(
  'identity',
  computed(() => ({
    address: address.value,
    display: display.value,
    twitter: twitter.value,
  }))
)

onMounted(() => {
  get(resolveAddress(props.address), identityStore).then((identityCached) => {
    if (identityCached) {
      identity.value = identityCached
    } else {
      onApiConnect(apiUrl.value, async () => {
        identity.value = await identityOf(resolveAddress(props.address))
      })
    }
  })
})

const identityOf = async (account): Promise<IdentityFields> => {
  if (!account) {
    return Promise.resolve(emptyObject<IdentityFields>())
  }

  const identityCached = await get(address.value, identityStore)
  if (!identityCached) {
    return await fetchIdentity(address.value)
  }

  return identityCached
}

const fetchIdentity = async (address: string) => {
  isFetchingIdentity.value = true

  const api = await apiInstance.value
  const optionIdentity = await api?.query.identity?.identityOf(address)
  const identityFresh = optionIdentity?.unwrapOrDefault()

  if (!identityFresh?.size) {
    isFetchingIdentity.value = false

    return emptyObject<IdentityFields>()
  }

  const final = Array.from(identityFresh.info)
    .filter(([, value]) => !Array.isArray(value) && !value.isEmpty)
    .reduce((acc, [key, value]) => {
      acc[key] = handleRaw(value as unknown as Data)
      return acc
    }, {} as IdentityFields)

  update(address, () => final, identityStore)

  isFetchingIdentity.value = false

  return final
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

watch(address, (newAddress, oldAddress) => {
  if (shouldUpdate(newAddress, oldAddress)) {
    identityOf(newAddress).then((id) => (identity.value = id))
  }
})
</script>
