<template>
  <o-icon
    :pack="pack || 'fas'"
    :icon="icon"
    :size="size || 'small'"
    :custom-size="customSize"
    :variant="variant" />
</template>

<script lang="ts" setup>
import { OIcon } from '@oruga-ui/oruga'

defineProps<{
  size?: 'small' | 'medium' | 'large'
  icon?: string
  pack?: string
  customSize?: string
  variant?: 'success' | 'primary'
}>()
</script>

<style lang="scss" scoped>
@import './NeoIcon.scss';
</style>
