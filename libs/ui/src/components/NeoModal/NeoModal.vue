<template>
  <teleport to="body" :disabled="!appendToBody">
    <o-modal
      v-model:active="isModalActive"
      class="neo-modal"
      :class="{ 'append-to-body': appendToBody }"
      scroll="clip"
      :destroy-on-hide="destroyOnHide"
      :can-cancel="canCancel"
      :full-screen="fullScreen"
      :content-class="[
        ...contentClassName,
        noShadow ? 'no-shadow' : '',
        enableMobile ? 'enable-mobile' : '',
      ]"
      :mobile-breakpoint="mobileBreakpoint"
      :root-class="rootClass"
      :style="{
        '--max-height': maxHeight,
      }"
      @close="updateClose">
      <slot />
    </o-modal>
  </teleport>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useVModel } from '@vueuse/core'
import { OModal } from '@oruga-ui/oruga-next'

const props = withDefaults(
  defineProps<{
    value: boolean
    destroyOnHide?: boolean
    canCancel?: boolean | string[]
    fullScreen?: boolean
    contentClass?: string | string[]
    rootClass?: string
    noShadow?: boolean
    enableMobile?: boolean
    maxHeight?: string | number
    mobileBreakpoint?: string
    appendToBody?: boolean
  }>(),
  {
    destroyOnHide: true,
    canCancel: true,
    fullScreen: false,
    contentClass: '',
    rootClass: '',
    noShadow: false,
    enableMobile: true,
    maxHeight: '80vh',
    mobileBreakpoint: '768px',
    appendToBody: true,
  },
)

const emit = defineEmits(['close'])

const maxHeight = computed(() => {
  if (typeof props.maxHeight === 'number') {
    return `${props.maxHeight}px`
  }
  return props.maxHeight
})

const isModalActive = useVModel(props, 'value')

const contentClassName = computed(() => {
  if (Array.isArray(props.contentClass)) {
    return [...props.contentClass]
  }
  return [props.contentClass]
})
const updateClose = () => {
  emit('close', false)
}
</script>

<style lang="scss">
@import './NeoModal.scss';
</style>
