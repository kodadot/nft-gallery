<template>
  <teleport
    to="body"
    :disabled="!appendToBody"
    v-bind="$attrs"
  >
    <o-modal
      ref="modal"
      v-model:active="isModalActive"
      class="neo-modal"
      :class="{ 'append-to-body': appendToBody }"
      scroll="clip"
      :destroy-on-hide="destroyOnHide"
      :can-cancel="canCancel"
      :full-screen="fullScreen"
      :data-testid="dataTestid"
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
      @close="updateClose"
    >
      <slot />
    </o-modal>
  </teleport>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useVModel } from '@vueuse/core'
import { OModal } from '@oruga-ui/oruga-next'

const emit = defineEmits(['close'])
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
    noOverlap?: boolean
    dataTestid?: string
  }>(),
  {
    destroyOnHide: true,
    canCancel: false,
    fullScreen: false,
    contentClass: '',
    rootClass: '',
    noShadow: false,
    enableMobile: true,
    maxHeight: '100vh',
    mobileBreakpoint: '768px',
    appendToBody: true,
    dataTestid: undefined,
  },
)

const modal = ref()

const isModalActive = useVModel(props, 'value')
const { closeOthers, openClosed } = useModalManager(modal)

const maxHeight = computed(() => {
  if (typeof props.maxHeight === 'number') {
    return `${props.maxHeight}px`
  }
  return props.maxHeight
})

const contentClassName = computed(() => {
  if (Array.isArray(props.contentClass)) {
    return [...props.contentClass]
  }
  return [props.contentClass]
})
const updateClose = () => {
  emit('close', false)
}

if (props.noOverlap) {
  watch(() => props.value, (value) => {
    if (value) {
      closeOthers()
    }
    else {
      openClosed()
    }
  })
}
</script>

<style lang="scss">
@import './NeoModal.scss';
</style>
