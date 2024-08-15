<template>
  <o-icon
    :pack="pack || 'fasr'"
    :icon="icon"
    :size="size || 'default'"
    :custom-size="customSize"
    :variant="variant"
    :spin="spin"
  />
</template>

<script lang="ts" setup>
import { OIcon } from '@oruga-ui/oruga-next'

defineProps<{
  size?: 'small' | 'medium' | 'large'
  icon?: string
  pack?: string
  customSize?: string
  variant?: 'success' | 'primary' | 'k-grey'
  spin?: boolean
}>()
</script>

<style lang="scss">
@import './NeoIcon.scss';
</style>
