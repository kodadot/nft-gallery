<template>
  <o-modal
    class="neo-modal"
    scroll="clip"
    :active.sync="isModalActive"
    :destroy-on-hide="destroyOnHide"
    :can-cancel="canCancel"
    :full-screen="fullScreen"
    :content-class="contentClass"
    :root-class="rootClass"
    @close="updateClose">
    <slot />
  </o-modal>
</template>

<script lang="ts" setup>
import { OModal } from '@oruga-ui/oruga-next'

const props = withDefaults(
  defineProps<{
    value: boolean
    destroyOnHide?: boolean
    canCancel?: boolean
    fullScreen?: boolean
    contentClass?: string
    rootClass?: string
  }>(),
  {
    destroyOnHide: true,
    canCancel: true,
    fullScreen: false,
    contentClass: '',
    rootClass: '',
  }
)

const emit = defineEmits(['close'])

const isModalActive = useVModel(props, 'value')

const updateClose = () => {
  emit('close', false)
}
</script>

<style lang="scss">
@import './NeoModal.scss';
</style>
