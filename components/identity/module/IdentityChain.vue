<template v-else>
  <div>
    <span v-if="showOnchainIdentity" class="is-inline-flex items-center">
      {{ shortenedAddress }}
      <img
        v-if="isFetchingIdentity"
        src="/infinity.svg"
        class="ml-1 infinity-loader" />
      <template v-else>
        <span v-if="identity?.display" class="ml-1">
          ({{ identity?.display }})
        </span>
      </template>
    </span>
    <template v-else-if="!hideIdentityPopover && !isMobileDevice">
      <IdentityPopover v-if="address">
        <template #content>
          <span>{{ name }}</span>
        </template>
      </IdentityPopover>
    </template>
    <span v-else>
      {{ name }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { GenericAccountId } from '@polkadot/types/generic/AccountId'
import { isMobileDevice } from '@/utils/extension'
import IdentityPopover from './IdentityPopover.vue'

type IdentityFields = Record<string, string>
type Address = string | GenericAccountId | undefined

defineProps<{
  showOnchainIdentity?: boolean
  hideIdentityPopover?: boolean
  isFetchingIdentity?: boolean
  showClipboard?: boolean
  identity?: IdentityFields
  address?: Address
  shortenedAddress?: string
  name?: string | object
}>()
</script>

<style scoped>
.infinity-loader {
  height: 20px;
}
</style>
