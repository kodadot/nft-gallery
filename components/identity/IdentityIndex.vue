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
      :show-clipboard="showClipboard"
      :shortened-address="shortenedAddress"
      :name="name" />
  </div>
</template>

<script lang="ts" setup>
import { GenericAccountId } from '@polkadot/types/generic/AccountId'
import { defineEmits } from '#app'

import useIdentity from './utils/useIdentity'

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
  showClipboard?: boolean
  customNameOption?: string
}>()

const {
  identity,
  isFetchingIdentity,
  shortenedAddress,
  twitter,
  discord,
  name,
  whichIdentity,
} = useIdentity({
  address: props.address,
  customNameOption: props.customNameOption,
})

provide('address', props.address)
provide(
  'shortenedAddress',
  computed(() => shortenedAddress.value)
)
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

watch(
  () => props.address,
  (newAddress) => {
    whichIdentity(newAddress)
  }
)
</script>
