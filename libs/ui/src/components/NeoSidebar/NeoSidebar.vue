<template>
  <o-sidebar
    position="static"
    :mobile="mobile"
    :fullheight="fullheight"
    :fullwidth="fullwidth"
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
  expandOnHover?: boolean
  fullheight?: boolean
  fullwidth?: boolean
  reduce?: boolean
  open?: boolean
}>()
</script>

<style lang="scss">
@import './NeoSidebar';
</style>
