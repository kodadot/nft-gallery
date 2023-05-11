<template>
  <o-modal
    class="neo-modal"
    scroll="clip"
    :active.sync="isModalActive"
    :can-cancel="canCancel"
    @close="updateClose">
    <slot />
  </o-modal>
</template>

<script lang="ts" setup>
import { OModal } from '@oruga-ui/oruga'

const props = withDefaults(
  defineProps<{
    value: boolean
    canCancel?: string[] | boolean
  }>(),
  {
    canCancel: true,
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
