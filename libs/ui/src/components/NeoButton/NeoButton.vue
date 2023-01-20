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
    icon-pack="fas"
    class="is-neo">
    <slot v-if="label">
      {{ label }}
    </slot>
  </o-button>
</template>

<script lang="ts" setup>
import { OButton } from '@oruga-ui/oruga'
import { NeoButtonVariant } from '@kodadot1/brick'

withDefaults(
  defineProps<{
    size?: 'small' | 'medium' | 'large'
    disabled?: boolean
    icon?: string
    label?: string
    active?: boolean
    fixedWidth?: boolean
    noShadow?: boolean
    variant?: NeoButtonVariant
  }>(),
  {
    size: 'medium',
    icon: '',
    label: '',
    variant: 'primary',
  }
)
</script>

<style lang="scss" scoped>
@import './NeoButton.scss';
</style>
