<template>
  <o-field
    :label="label"
    :grouped="grouped"
    :variant="variant"
    class="neo-field">
    <slot />
  </o-field>
</template>

<script lang="ts" setup>
import { OField } from '@oruga-ui/oruga'

defineProps<{
  label: string
  grouped: string
  variant: string
}>()
</script>

<style lang="scss">
@import './NeoField.scss';
</style>
