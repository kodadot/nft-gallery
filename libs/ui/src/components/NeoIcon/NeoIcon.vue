<template>
  <o-icon :pack="iconPack" :icon="icon" :size="size || 'medium'"> </o-icon>
</template>

<script lang="ts" setup>
import { OIcon } from '@oruga-ui/oruga'

const props = defineProps<{
  size?: 'small' | 'medium' | 'large'
  icon?: string
  iconPack?: string
}>()

const iconPack = computed(() => props?.iconPack || 'fa-sharp')
</script>

<style lang="scss" scoped>
@import './NeoIcon.scss';
</style>
