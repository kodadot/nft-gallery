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

<style lang="scss" scoped>
@import '@oruga-ui/oruga/dist/oruga-full-vars.min.css';

:root.light-mode {
  --oruga-dropdown-item-hover-color: #1f1f1f;
  --oruga-dropdown-item-hover-background-color: #ffe5f3;

  .o-drop__item {
    border-bottom: 1px solid #0a0a0a;
  }
}
:root.dark-mode {
  --oruga-dropdown-item-color: #f8f4f6;
  --oruga-dropdown-item-hover-background-color: #ff7ac3;

  .o-drop__item {
    border-bottom: 1px solid hsl(0deg, 0%, 100%);
  }
}
</style>
