<template>
  <o-button
    :class="{
      active: active,
      'is-fixed-width': fixedWidth,
      'no-shadow': noShadow,
      selected: selected,
    }"
    :size="size"
    :icon-right="icon"
    :variant="variant"
    icon-pack="fas"
    class="is-neo">
    {{ label }}
    <img v-if="selected" src="/checkmark.svg" class="check-icon" />
  </o-button>
</template>

<script lang="ts" setup>
import { OButton } from '@oruga-ui/oruga'
import { TranslateResult } from 'vue-i18n'
import { NeoButtonVariant } from '@kodadot1/brick'

defineProps<{
  size?: 'small' | 'medium' | 'large'
  icon?: string
  label?: string | TranslateResult
  active?: boolean
  fixedWidth?: boolean
  noShadow?: boolean
  selected?: boolean
  variant?: NeoButtonVariant
}>()
</script>

<style lang="scss" scoped>
@import './NeoButton.scss';
</style>
