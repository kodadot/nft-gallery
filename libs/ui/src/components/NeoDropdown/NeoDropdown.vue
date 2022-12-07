<template>
  <o-dropdown aria-role="list">
    <template #trigger="{}">
      <slot />
    </template>
    <o-dropdown-item
      v-for="(item, index) in items"
      :key="index"
      aria-role="listitem">
      {{ item }}
    </o-dropdown-item>
  </o-dropdown>
</template>

<script lang="ts" setup>
import { ODropdown, ODropdownItem } from '@oruga-ui/oruga'

defineProps<{
  items: string[]
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
