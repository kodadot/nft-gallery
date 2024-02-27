<template>
  <teleport to="body" :disabled="!appendToBody">
    <o-modal
      v-model:active="isModalActive"
      class="neo-modal"
      :class="[
        `max-h-[${maxHeight}] mx-auto`,
        { 'append-to-body': appendToBody },
      ]"
      :style="{ 'max-width': !isMobile ? width : '100%' }"
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
      @close="updateClose">
      <slot />
    </o-modal>
  </teleport>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useVModel } from '@vueuse/core'
import { OModal } from '@oruga-ui/oruga-next'

const { isMobile } = useViewport()

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
    width?: string | number
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
    width: '380px',
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
