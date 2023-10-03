<template>
  <o-button
    :class="{
      active: active,
      'is-fixed-width': fixedWidth,
      'no-shadow': noShadow,
      'loading-with-label': loadingWithLabel,
    }"
    :size="size"
    :icon-right="icon"
    :variant="variant"
    :disabled="disabled"
    :expanded="expanded"
    :icon-pack="iconPack || 'fasr'"
    :label="label"
    class="is-neo"
    :rounded="rounded"
    :tag="tag"
    v-bind="$attrs">
    <slot />
  </o-button>
</template>

<script lang="ts" setup>
import { OButton } from '@oruga-ui/oruga'
import { NeoButtonVariant } from '@kodadot1/brick'

defineProps<{
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
  rounded?: boolean
  tag?: string
  loadingWithLabel?: boolean
}>()
</script>

<style lang="scss">
@import './NeoButton.scss';
</style>
