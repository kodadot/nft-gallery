<template>
  <o-icon
    :pack="pack || 'fas'"
    :icon="icon"
    :size="size || 'small'"
    :variant="variant" />
</template>

<script lang="ts" setup>
import { OIcon } from '@oruga-ui/oruga'

const props = defineProps<{
  size?: 'small' | 'medium' | 'large'
  icon?: string
  pack?: string
  variant?: 'success'
}>()
</script>

<style lang="scss" scoped>
@import './NeoIcon.scss';
</style>
