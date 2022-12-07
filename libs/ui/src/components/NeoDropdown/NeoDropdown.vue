<template>
  <o-dropdown aria-role="list" :position="position">
    <template #trigger="{}">
      <slot />
    </template>
    <slot name="items" />
  </o-dropdown>
</template>

<script lang="ts" setup>
import { ODropdown } from '@oruga-ui/oruga'

defineProps<{
  position?: {
    type: string
    default: 'bottom-left'
  }
}>()
</script>

<style lang="scss">
.o-drop__menu {
  border: 1px solid #0a0a0a;
}
.o-drop__item {
  border-bottom: 1px solid #0a0a0a;
}
</style>
