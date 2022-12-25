<template>
  <o-tooltip
    v-if="active"
    append-to-body
    class="neo-tooltip"
    :position="position"
    :label="label"
    @click.native.stop>
    <slot>
      <div />
    </slot>
  </o-tooltip>
  <div v-else>
    <slot>
      <div />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { OTooltip } from '@oruga-ui/oruga'
import { LocaleMessage } from 'vue-i18n'
export interface Props {
  label: string | LocaleMessage
  position?: 'top' | 'bottom' | 'left' | 'right'
  active?: boolean
}
withDefaults(defineProps<Props>(), {
  position: 'top',
  active: true,
})
</script>

<style lang="scss">
// @import '@oruga-ui/oruga/dist/oruga.min.css';
@import './NeoTooltip.scss';
</style>
