<template>
  <o-tooltip
    v-if="active"
    :append-to-body="appendToBody"
    :multiline="multiline"
    class="neo-tooltip"
    :style="{ '--computed-font-size': computedFontSize }"
    :position="position"
    :label="label"
    :delay="delay"
    @click.native.stop>
    <slot>
      <div />
    </slot>
  </o-tooltip>
  <div v-else class="wrapper">
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
  multiline?: boolean
  appendToBody?: boolean
  delay?: number
  fontSize?: string | number
}
const props = withDefaults(defineProps<Props>(), {
  position: 'top',
  active: true,
  multiline: false,
  appendToBody: false,
  delay: undefined,
  fontSize: '1rem',
})

const computedFontSize = computed(() => {
  if (typeof props.fontSize === 'number') {
    return `${props.fontSize}px`
  }
  return props.fontSize
})
</script>

<style lang="scss">
// @import '@oruga-ui/oruga/dist/oruga.min.css';
@import './NeoTooltip.scss';
</style>
