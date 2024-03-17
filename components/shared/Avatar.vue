<template>
  <Identicon
    :data-key="value"
    :size="size"
    theme="polkadot"
    :value="value"
    data-testid="avatar-identity-icon"
    class="border border-border-color rounded-full" />
</template>

<script lang="ts" setup>
import Identicon from '@polkadot/vue-identicon'

withDefaults(
  defineProps<{
    value: string
    size?: number
  }>(),
  {
    value: '',
    size: 64,
  },
)
</script>
