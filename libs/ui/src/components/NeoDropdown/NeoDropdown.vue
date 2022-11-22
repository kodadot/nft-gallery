<template>
  <o-dropdown aria-role="list">
    <template #trigger="{ active }">
      <o-button variant="primary">
        <span>Click me!</span>
        <o-icon :icon="active ? 'caret-up' : 'caret-down'" />
      </o-button>
    </template>

    <o-dropdown-item aria-role="listitem"> Action </o-dropdown-item>
    <o-dropdown-item aria-role="listitem"> Another action </o-dropdown-item>
    <o-dropdown-item aria-role="listitem"> Something else </o-dropdown-item>
  </o-dropdown>
</template>

<script lang="ts" setup>
import { ODropdown, ODropdownItem } from '@oruga-ui/oruga'

defineProps<{
  size?: string
  icon?: string
  label?: string
}>()
</script>

<style lang="scss" scoped>
@import '@oruga-ui/oruga/dist/oruga.min.css';
@import '@oruga-ui/oruga/dist/oruga-full-vars.min.css';

.is-neo {
  border-radius: 0;
  color: hsl(0deg, 0%, 4%);
  background: hsl(0deg, 0%, 100%);
  border: 1px solid hsl(0deg, 0%, 4%);
  -webkit-box-shadow: 4px 4px hsl(0deg, 0%, 4%);
  box-shadow: 4px 4px hsl(0deg, 0%, 4%);

  &:hover {
    background: #ffe5f3 !important;
  }
}

.dark-mode .is-neo {
  color: hsl(0deg, 0%, 100%);
  background: hsl(330, 4%, 9%);
  border: 1px solid hsl(0deg, 0%, 100%);
  -webkit-box-shadow: 4px 4px hsl(0deg, 0%, 100%);
  box-shadow: 4px 4px hsl(0deg, 0%, 100%);

  &:hover {
    background: #ff47ac !important;
  }
}
</style>
