<template>
  <NeoModal
    :value="isModalActive"
    :can-cancel="['outside', 'escape']"
    scroll="clip"
    class="top"
    content-class="modal-width"
    @close="onClose">
    <ModalBody :title="$t('signingModal')" @close="onClose">
      <SigningModalBody :title="title" :subtitle="subtitle" />
    </ModalBody>
  </NeoModal>
</template>
<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import { TransactionStatus } from '@/composables/useTransactionStatus'

const props = defineProps<{
  modelValue: boolean
  status: TransactionStatus
  title: string
}>()

const { $i18n } = useNuxtApp()

const isModalActive = useVModel(props, 'modelValue')

const statusTransalationsKeys: Partial<Record<TransactionStatus, string>> = {
  [TransactionStatus.Block]: 'transactionSteps.loading',
  [TransactionStatus.Casting]: 'transactionSteps.loading',
  [TransactionStatus.Sign]: 'transactionSteps.loading',
  [TransactionStatus.Broadcast]: 'transactionSteps.loading',
  [TransactionStatus.Finalized]: 'transactionSteps.completed',
  [TransactionStatus.IPFS]: 'transactionSteps.uploading',
}

const subtitle = computed(() =>
  $i18n.t(statusTransalationsKeys[props.status] || 'transactionSteps.waiting'),
)

const onClose = () => {
  isModalActive.value = false
}
</script>
