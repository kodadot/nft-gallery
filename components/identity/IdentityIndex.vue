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
const identity = ref<IdentityFields>()
const shortenedAddress = ref<string>()
const name = ref<string>()
const twitter = ref<string>()
const discord = ref<string>()
const isFetchingIdentity = ref(false)

watchEffect(async () => {
  isFetchingIdentity.value = true
  const fields = await useIdentity({
    address: props.address,
    customNameOption: props.customNameOption,
  })
  identity.value = fields.identity.value
  shortenedAddress.value = fields.shortenedAddress.value
  name.value = fields.name.value
  twitter.value = fields.twitter.value
  discord.value = fields.discord.value
  isFetchingIdentity.value = fields.isFetchingIdentity.value
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
