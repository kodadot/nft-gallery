<template>
  <o-button :variant="variant" outlined class="button-override">
    <slot />
  </o-button>
</template>

<script lang="ts" setup>
import { OButton } from '@oruga-ui/oruga'
import { NeoButtonVariant } from '@kodadot1/brick'

defineProps<{
  variant?: NeoButtonVariant
}>()
</script>

<style lang="scss" scoped>
@import './NeoSecondaryButton.scss';
</style>
