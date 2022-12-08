<template>
  <o-dropdown-item aria-role="listitem" :disabled="disabled">
    {{ item }}
    <slot />
  </o-dropdown-item>
</template>

<script lang="ts" setup>
import { ODropdownItem } from '@oruga-ui/oruga'

defineProps<{
  item?: string
  disabled?: boolean
}>()
</script>

<style lang="scss"></style>
