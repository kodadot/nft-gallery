<template>
  <o-button :variant="variant" outlined class="button-override">
    <slot />
  </o-button>
</template>

<script lang="ts" setup>
import type { NeoButtonVariant } from '../../types'
import { OButton } from '@oruga-ui/oruga-next'

defineProps<{
  variant?: NeoButtonVariant
}>()
</script>

<style lang="scss" scoped>
@import './NeoSecondaryButton.scss';
</style>
