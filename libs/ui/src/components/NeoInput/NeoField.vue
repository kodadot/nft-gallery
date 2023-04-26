<template>
  <o-field
    class="neo-field"
    :class="{ 'neo-field--error': error }"
    :label="label"
    v-bind="$attrs">
    <slot />
  </o-field>
</template>

<script setup lang="ts">
import { OField } from '@oruga-ui/oruga'

defineProps<{
  label: string
  error: boolean
}>()
</script>

<style lang="scss" scoped>
@import './NeoInput.scss';
</style>
