<template>
  <o-tab-item aria-role="listitem" :label="label" :value="value">
    <slot />
  </o-tab-item>
</template>

<script lang="ts" setup>
import { OTabItem } from '@oruga-ui/oruga'

defineProps<{
  label?: string
  value?: string
}>()
</script>
<style lang="scss">
@import './NeoTab.scss';
</style>
