<template>
  <div class="is-flex is-align-items-center">
    <Avatar :size="48" :value="account" />
    <div v-if="variant === 'button'" class="identity-item-button pl-3">
      <div class="has-text-weight-bold identity-item-button-label mb-1">
        {{ label }}
      </div>
      <NeoButton
        v-safe-href="`/${prefix}/u/${account}`"
        no-shadow
        rounded
        tag="a"
        size="small"
        icon="arrow-right-long">
        {{ buttonLabel }}
      </NeoButton>
    </div>
    <div v-else class="identity-container">
      <div class="identity-label is-size-6">
        {{ label }}
      </div>
      <component
        :is="disableIdentityLink ? 'div' : NuxtLink"
        class="identity-name has-text-weight-bold"
        :to="`/${prefix}/u/${account}`">
        <Identity
          :address="account"
          :hide-identity-popover="hideIdentityPopover" />
      </component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import Avatar from '@/components/shared/Avatar.vue'
import Identity from '@/components/identity/IdentityIndex.vue'
import { resolveComponent } from 'vue'

const NuxtLink = resolveComponent('NuxtLink')

withDefaults(
  defineProps<{
    label: string
    account: string
    prefix: string
    variant?: 'normal' | 'button'
    buttonLabel?: string
    hideIdentityPopover?: boolean
    disableIdentityLink?: boolean
  }>(),
  {
    variant: 'normal',
    buttonLabel: 'View Profile',
    hideIdentityPopover: false,
    disableIdentityLink: false,
  },
)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.identity {
  &-item-button {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 3rem;

    &-label {
      line-height: 1;
    }
  }

  &-container {
    padding: 0.625rem;
  }

  &-label {
    @include ktheme() {
      color: theme('k-shade');
    }
  }
}
</style>
