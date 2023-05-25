<template>
  <o-tooltip
    v-if="active"
    :append-to-body="appendToBody"
    :multiline="multiline"
    class="neo-tooltip"
    :style="{
      '--font-size': fontSize,
      '--multiline-width': multilineWidth,
    }"
    :position="position"
    :label="label"
    :delay="delay"
    @click.native="handleClick">
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
  multilineWidth?: string | number
  stopEvents?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  position: 'top',
  active: true,
  multiline: false,
  appendToBody: false,
  delay: undefined,
  fontSize: '1rem',
  multilineWidth: '10rem',
  stopEvents: false,
})

const fontSize = computed(() => {
  if (typeof props.fontSize === 'number') {
    return `${props.fontSize}px`
  }
  return props.fontSize
})

const multilineWidth = computed(() => {
  if (typeof props.multilineWidth === 'number') {
    return `${props.multilineWidth}px`
  }
  return props.multilineWidth
})

const handleClick = (event: MouseEvent) => {
  if (props.stopEvents) {
    event.stopPropagation()
  }
}
</script>

<style lang="scss">
// @import '@oruga-ui/oruga/dist/oruga.min.css';
@import './NeoTooltip.scss';
</style>
