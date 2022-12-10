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
import { GenericAccountId } from '@polkadot/types/generic/AccountId'
import { defineEmits } from '#app'

import useIdentity, { IdentityFields } from './utils/useIdentity'

type Address = string | GenericAccountId | undefined

const IdentitySocial = defineAsyncComponent(
  () => import('./module/IdentitySocial.vue')
)
const IdentityChain = defineAsyncComponent(
  () => import('./module/IdentityChain.vue')
)

const props = defineProps<{
  address?: Address
  emit?: boolean
  showTwitter?: boolean
  showDiscord?: boolean
  showOnchainIdentity?: boolean
  hideIdentityPopover?: boolean
  customNameOption?: string
}>()

const name = ref<string>()
const shortenedAddress = ref<string>()
const identity = ref<IdentityFields>({})
const isFetchingIdentity = ref(false)
const twitter = ref<string>()
const discord = ref<string>()
const display = ref<string>()

watchEffect(() => {
  const identityItems = useIdentity({
    address: props.address,
    customNameOption: props.customNameOption,
  })
  name.value = identityItems.name.value
  shortenedAddress.value = identityItems.shortenedAddress.value
  identity.value = identityItems.identity.value
  isFetchingIdentity.value = identityItems.isFetchingIdentity.value
  twitter.value = identityItems.twitter.value
  discord.value = identityItems.discord.value
  display.value = identityItems.display.value
})

provide('address', props.address)
provide('shortenedAddress', shortenedAddress.value)
provide(
  'identity',
  computed(() => identity.value)
)

const emit = defineEmits(['change'])

watch(identity, () => {
  if (props.emit) {
    emit('change', identity.value)
  }
})
</script>
