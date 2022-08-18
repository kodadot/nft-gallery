<template v-else>
  <div>
    <span
      v-if="showOnchainIdentity"
      class="is-inline-flex is-align-items-center">
      {{ shortenedAddress }}
      <img
        v-if="isFetchingIdentity"
        src="/infinity.svg"
        class="ml-1 infinity-loader" />
      <template v-else>
        <span v-if="identity.display" class="ml-1"
          >({{ identity.display }})</span
        >
      </template>
    </span>
    <template v-else-if="!hideIdentityPopover">
      <IdentityPopover :identity="{ ...identity, address }">
        <template #trigger>
          {{ name }}
        </template>
      </IdentityPopover>
    </template>
    <span v-else>
      {{ name }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { GenericAccountId } from '@polkadot/types/generic/AccountId'

import { emptyObject } from '@/utils/empty'

type IdentityFields = Record<string, string>
type Address = string | GenericAccountId | undefined

const components = {
  IdentityPopover: () =>
    import('@/components/shared/identity/popover/IdentityPopover.vue'),
}

@Component({ components })
export default class IdentityChain extends Vue {
  @Prop() readonly showOnchainIdentity!: boolean
  @Prop() readonly hideIdentityPopover!: boolean
  @Prop() readonly isFetchingIdentity!: boolean
  @Prop({ default: emptyObject<IdentityFields>() }) readonly identity
  @Prop() readonly address!: Address
  @Prop() readonly shortenedAddress!: Address
  @Prop() readonly name!: Address
}
</script>

<style scoped>
.infinity-loader {
  height: 20px;
}
</style>
