<template>
  <div class="flex items-center">
    <ProfileAvatar
      :address="account"
      :size="48"
    />
    <slot :label="label">
      <div class="identity-container">
        <div class="text-k-grey text-base">
          {{ label }}
        </div>
        <component
          :is="disableIdentityLink ? 'div' : NuxtLink"
          class="identity-name font-bold"
          :to="`/${prefix}/u/${account}`"
        >
          <Identity
            :address="account"
            :hide-identity-popover="hideIdentityPopover"
          />
        </component>
      </div>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { resolveComponent } from 'vue'
import Identity from '@/components/identity/IdentityIndex.vue'

const NuxtLink = resolveComponent('NuxtLink')

withDefaults(
  defineProps<{
    label: string
    account: string
    prefix: string
    hideIdentityPopover?: boolean
    disableIdentityLink?: boolean
  }>(),
  {
    hideIdentityPopover: false,
    disableIdentityLink: false,
  },
)
</script>

<style lang="scss" scoped>
.identity {
  &-container {
    padding: 0.625rem;
  }
}
</style>
