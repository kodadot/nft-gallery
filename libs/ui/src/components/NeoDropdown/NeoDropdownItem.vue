<template>
  <o-dropdown-item aria-role="listitem">
    {{ item }}
    <slot />
  </o-dropdown-item>
</template>

<script lang="ts" setup>
import { ODropdownItem } from '@oruga-ui/oruga'

defineProps<{
  item?: string
}>()
</script>

<style lang="scss"></style>
