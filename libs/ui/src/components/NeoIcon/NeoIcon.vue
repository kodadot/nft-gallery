<template>
  <o-icon
    :pack="iconPack"
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

const iconPack = computed(() => props?.pack || 'fa-sharp')
</script>

<style lang="scss" scoped>
@import './NeoIcon.scss';
</style>
