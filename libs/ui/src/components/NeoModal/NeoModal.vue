<template>
  <o-modal
    class="neo-modal"
    :active.sync="isImageModalActive"
    @close="updateClose">
    <slot />
  </o-modal>
</template>

<script lang="ts" setup>
import { OModal } from '@oruga-ui/oruga'

const props = defineProps<{
  value: boolean
}>()

const emit = defineEmits(['close'])

const isImageModalActive = useVModel(props, 'value')

const updateClose = () => {
  emit('close', false)
}
</script>

<style lang="scss">
@import './NeoModal.scss';
</style>
