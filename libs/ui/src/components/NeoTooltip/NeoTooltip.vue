<template>
  <o-tooltip
    v-if="active"
    ref="tooltipRef"
    :append-to-body="appendToBody"
    :auto-close="autoClose"
    :multiline="multiline"
    :content-class="contentClass"
    :root-class="rootClass"
    :style="{
      '--font-size': fontSize,
      '--multiline-width': multilineWidth,
      width: fullWidth ? '100%' : '',
    }"
    :position="position"
    :label="label"
    :delay="delay"
    :triggers="triggers"
    @open="handleOpen"
    @click="handleClick">
    <template #content>
      <slot name="content"></slot>
    </template>

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
import { computed, ref } from 'vue'
import { OTooltip } from '@oruga-ui/oruga-next'
import { LocaleMessage } from 'vue-i18n'
export interface Props {
  label?: string | LocaleMessage
  position?: 'top' | 'bottom' | 'left' | 'right'
  active?: boolean
  multiline?: boolean
  appendToBody?: boolean
  delay?: number
  fontSize?: string | number
  multilineWidth?: string | number
  fullWidth?: boolean
  stopEvents?: boolean
  autoClose?: string[] | boolean
  contentClass?: string
  rootClass?: string
  triggers?: string[]
}
const props = withDefaults(defineProps<Props>(), {
  label: '',
  position: 'top',
  active: true,
  multiline: false,
  appendToBody: false,
  delay: undefined,
  fullWidth: false,
  fontSize: '1rem',
  multilineWidth: '10rem',
  stopEvents: false,
  autoClose: true,
  contentClass: '',
  rootClass: '',
  triggers: () => ['hover'],
})

const rootClass = computed(() => {
  let classStr = props.rootClass
  if (props.appendToBody) {
    classStr += ' append-to-body'
  }
  return classStr
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

const tooltipRef = ref<InstanceType<typeof OTooltip>>(null)
const handleOpen = async () => {
  // wrapper element of tooltip generated dynamic
  // so we must manually set style when it opened
  if (props.appendToBody) {
    await nextTick()
    tooltipRef.value.bodyEl.style.zIndex = 'auto'
  }
}

const handleClick = (event: MouseEvent) => {
  if (props.stopEvents) {
    event.stopPropagation()
  }
}
</script>

<style lang="scss">
// @import '@oruga-ui/oruga-next/dist/oruga.min.css';
@import './NeoTooltip.scss';
</style>
