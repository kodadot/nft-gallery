<template>
  <o-sidebar
    position="static"
    :mobile="mobile"
    :fullheight="fullheight"
    :expand-on-hover="expandOnHover"
    :reduce="reduce"
    :open="open">
    <slot />
  </o-sidebar>
</template>

<script lang="ts" setup>
import { OSidebar } from '@oruga-ui/oruga'

defineProps<{
  mobile?: string
  expandOnHover?: string
  fullheight?: boolean
  reduce?: boolean
  open?: boolean
}>()
</script>

<style lang="scss">
@import '@oruga-ui/oruga/dist/oruga-full-vars.min.css';

:root {
  // --oruga-sidebar-overlay:	hsla(0,0%,4%,.86);
  // --oruga-sidebar-box-shadow: inherit;
  --oruga-sidebar-box-shadow: 0;
  --oruga-sidebar-content-background-color: transparent;
  --oruga-sidebar-mobile-width: 80px;
  --oruga-sidebar-width: 260px;
  --oruga-sidebar-zindex: 38;
}
</style>
