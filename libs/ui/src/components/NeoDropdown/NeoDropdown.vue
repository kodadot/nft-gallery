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
  }
)
</script>

<style lang="scss">
@import '@oruga-ui/oruga/dist/oruga-full-vars.min.css';
@import '../../scss/variable.scss';

:root {
  --oruga-dropdown-menu-padding: 0;
  --oruga-dropdown-menu-margin: 1rem 0;
  --oruga-dropdown-menu-border-radius: 0;
}
:root.light-mode {
  --oruga-dropdown-menu-box-shadow: 4px 4px hsl(0deg, 0%, 4%);
  --oruga-dropdown-item-hover-color: #1f1f1f;
  --oruga-dropdown-item-hover-background-color: #ffe5f3;

  .o-drop__item {
    border-bottom: 1px solid #0a0a0a;
  }
  .o-drop__menu {
    border: 1px solid #0a0a0a;
  }
}
:root.dark-mode {
  --oruga-dropdown-menu-box-shadow: 4px 4px white;
  --oruga-dropdown-menu-background: #181717;
  --oruga-dropdown-item-color: #f8f4f6;
  --oruga-dropdown-item-hover-background-color: #ff7ac3;

  .o-drop__item {
    border-bottom: 1px solid hsl(0deg, 0%, 100%);
  }
  .o-drop__menu {
    border: 1px solid hsl(0deg, 0%, 100%);
  }
}
</style>
