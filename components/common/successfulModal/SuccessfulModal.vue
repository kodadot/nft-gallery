<template>
  <NeoModal
    :value="isModalActive"
    :can-cancel="['outside', 'escape']"
    scroll="clip"
    @close="onClose">
    <ModalBody :title="$t('success')" @close="onClose">
      <SuccessfulModalBody
        :tx-hash="txHash"
        :share="share"
        :action-buttons="actionButtons">
        <slot />

        <template #actions>
          <slot name="actions" />
        </template>
      </SuccessfulModalBody>
    </ModalBody>
  </NeoModal>
</template>
<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import SuccessfulModalBody, {
  ActionButtonsProp,
  ShareProp,
} from './SuccessfulModalBody.vue'

defineEmits(['modelValue'])
const props = defineProps<{
  modelValue: boolean
  txHash: string
  share: ShareProp
  actionButtons: ActionButtonsProp
}>()

const isModalActive = useVModel(props, 'modelValue')

const onClose = () => {
  isModalActive.value = false
}
</script>
