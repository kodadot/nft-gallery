<template>
  <NeoModal
    :value="isModalActive"
    :can-cancel="['outside', 'escape']"
    @close="onClose"
  >
    <ModalBody
      :title="$t('success')"
      @close="onClose"
    >
      <SuccessfulModalBody
        :tx-hash="txHash"
        :share="share"
        :status="status"
        :action-buttons="actionButtons"
      >
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
import type {
  ActionButtonsProp,
  ShareProp,
} from './SuccessfulModalBody.vue'
import SuccessfulModalBody from './SuccessfulModalBody.vue'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import type { TransactionStatus } from '@/composables/useTransactionStatus'

defineEmits(['modelValue'])
const props = defineProps<{
  modelValue: boolean
  txHash?: string
  share: ShareProp
  actionButtons: ActionButtonsProp
  status: TransactionStatus
}>()

const isModalActive = useVModel(props, 'modelValue')

const onClose = () => {
  isModalActive.value = false
}
</script>
