<template>
  <div
    v-if="(showTwitter && twitter) || !showTwitter"
    class="flex-wrap flex-grow"
  >
    <IdentitySocial
      v-if="showTwitter && twitter"
      :twitter="twitter"
      :show-twitter="showTwitter"
    />
    <IdentityChain
      v-else
      :show-onchain-identity="showOnchainIdentity"
      :hide-identity-popover="hideIdentityPopover"
      :is-fetching-identity="isFetchingIdentity"
      :address="address"
      :show-clipboard="showClipboard"
      :show-badge="showIdentityBadge"
      :shortened-address="shortenedAddress"
      :hide-display-name="hideDisplayName"
      :display="display"
      :name="name"
    />
  </div>
</template>

<script lang="ts" setup>
import type { GenericAccountId } from '@polkadot/types/generic/AccountId'

type Address = string | GenericAccountId | undefined

const IdentitySocial = defineAsyncComponent(
  () => import('./module/IdentitySocial.vue'),
)
const IdentityChain = defineAsyncComponent(
  () => import('./module/IdentityChain.vue'),
)

const props = defineProps<{
  address?: Address
  emit?: boolean
  showTwitter?: boolean
  showDiscord?: boolean
  showOnchainIdentity?: boolean
  showBadge?: boolean
  hideIdentityPopover?: boolean
  showClipboard?: boolean
  customNameOption?: string
  hideDisplayName?: boolean
}>()

const {
  isFetchingIdentity,
  shortenedAddress,
  twitter,
  name,
  display,
  identity,
  hasIdentity,
} = useIdentity({
  address: computed(() => props.address),
  customNameOption: props.customNameOption || '',
})

const showIdentityBadge = computed(() =>
  Boolean(props.showBadge && hasIdentity.value),
)

provide(
  'address',
  computed(() => props.address),
)
provide(
  'shortenedAddress',
  computed(() => shortenedAddress.value),
)
provide(
  'identity',
  computed(() => identity.value),
)

const emitChange = defineEmits(['change'])

watch(identity, () => {
  if (props.emit) {
    emitChange('change', identity.value)
  }
})
</script>
