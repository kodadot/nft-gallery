<template>
  <o-dropdown-item
    aria-role="listitem"
    :disabled="disabled"
    :class="{ 'is-active': active }"
    class="neo-dropdown-item"
    v-bind="$attrs">
    {{ item }}
    <slot />
  </o-dropdown-item>
</template>

<script lang="ts" setup>
import { ODropdownItem } from '@oruga-ui/oruga'

defineProps<{
  item?: string
  disabled?: boolean
  active?: boolean
}>()
</script>
