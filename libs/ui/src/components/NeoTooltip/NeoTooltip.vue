<template>
  <o-tooltip
    append-to-body
    class="neo-tooltip"
    :position="position"
    :label="label"
    @click.native.stop>
    <slot>
      <div />
    </slot>
  </o-tooltip>
</template>

<script setup lang="ts">
import { OTooltip } from '@oruga-ui/oruga'
import { LocaleMessage } from 'vue-i18n'
export interface Props {
  label: string | LocaleMessage
  position?: 'top' | 'bottom' | 'left' | 'right'
}
withDefaults(defineProps<Props>(), {
  position: 'top',
})
</script>

<style lang="scss">
// @import '@oruga-ui/oruga/dist/oruga.min.css';
@import './NeoTooltip.scss';
</style>
