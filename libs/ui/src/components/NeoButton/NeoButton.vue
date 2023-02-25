<template>
  <o-button
    :class="{
      active: active,
      'is-fixed-width': fixedWidth,
      'no-shadow': noShadow,
    }"
    :size="size"
    :icon-right="icon"
    :variant="variant"
    :disabled="disabled"
    :expanded="expanded"
    :icon-pack="iconPack"
    :label="label"
    class="is-neo"
    v-bind="$attrs">
    <slot />
  </o-button>
</template>

<script lang="ts" setup>
import { OButton } from '@oruga-ui/oruga'
import { NeoButtonVariant } from '@kodadot1/brick'

const props = defineProps<{
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  expanded?: boolean
  icon?: string
  iconPack?: string
  label?: string
  active?: boolean
  fixedWidth?: boolean
  noShadow?: boolean
  variant?: NeoButtonVariant
}>()

const iconPack = computed(() => props?.iconPack || 'fa')
</script>

<style lang="scss" scoped>
@import './NeoButton.scss';
</style>
