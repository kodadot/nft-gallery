<template>
  <o-icon
    :pack="pack || 'fasr'"
    :icon="icon"
    :size="size || 'default'"
    :custom-size="customSize"
    :variant="variant" />
</template>

<script lang="ts" setup>
import { OIcon } from '@oruga-ui/oruga-next'

defineProps<{
  size?: 'small' | 'medium' | 'large'
  icon?: string
  pack?: string
  customSize?: string
  variant?: 'success' | 'primary' | 'k-grey'
}>()
</script>

<style lang="scss">
@import './NeoIcon.scss';
</style>
