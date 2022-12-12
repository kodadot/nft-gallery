<template>
  <o-dropdown
    aria-role="list"
    :position="position"
    :append-to-body="appendToBody">
    <template #trigger="{}">
      <slot />
    </template>
    <slot name="items" />
  </o-dropdown>
</template>

<script lang="ts" setup>
import { ODropdown } from '@oruga-ui/oruga'

withDefaults(
  defineProps<{
    position?: string
    appendToBody?: boolean
  }>(),
  {
    position: 'bottom-left',
    appendToBody: false,
  }
)
</script>

<style lang="scss" scoped>
@import '@oruga-ui/oruga/dist/oruga-full-vars.min.css';

:host {
  --oruga-dropdown-menu-padding: 0;
  --oruga-dropdown-menu-margin: 1rem 0;
  --oruga-dropdown-menu-border-radius: 0;
}
:host.light-mode {
  --oruga-dropdown-menu-box-shadow: 4px 4px hsl(0deg, 0%, 4%);
  .o-drop__menu {
    border: 1px solid #0a0a0a;
  }
}
:host.dark-mode {
  --oruga-dropdown-menu-box-shadow: 4px 4px white;
  --oruga-dropdown-menu-background: #181717;

  .o-drop__menu {
    border: 1px solid hsl(0deg, 0%, 100%);
  }
}
</style>
