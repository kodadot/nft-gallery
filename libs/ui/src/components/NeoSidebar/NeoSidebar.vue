<template>
  <o-sidebar
    :position="position || 'static'"
    :mobile="mobile"
    :fullheight="fullheight"
    :fullwidth="fullwidth"
    :expand-on-hover="expandOnHover"
    :reduce="reduce"
    :open="open"
    :right="right"
    :overlay="overlay"
    :can-cancel="canCancel"
    :on-cancel="onCancel">
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
  right?: boolean
  overlay?: boolean
  canCancel?: Array<string> | boolean
  onCancel?: () => void
  position?: 'fixed' | 'absolute' | 'static'
}>()
</script>

<style lang="scss">
@import './NeoSidebar';
</style>
