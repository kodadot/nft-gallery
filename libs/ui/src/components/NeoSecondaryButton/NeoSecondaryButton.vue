<template>
  <o-button
    :variant="variant"
    outlined
    class="px-4 py-1.5 rounded-none"
  >
    <slot />
  </o-button>
</template>

<script lang="ts" setup>
import { OButton } from '@oruga-ui/oruga-next'
import type { NeoButtonVariant } from '../../types'

defineProps<{
  variant?: NeoButtonVariant
}>()
</script>
