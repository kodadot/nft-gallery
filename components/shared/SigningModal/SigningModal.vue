<template>
  <NeoModal
    :value="isModalActive"
    :can-cancel="['outside', 'escape']"
    scroll="clip"
    class="top"
    content-class="modal-width"
    @close="onClose">
    <ModalBody :title="$t('drops.signTransaction')" @close="onClose">
      <SigningModalBody
        :title="title"
        :subtitle="subtitle"
        :show-subtitle-dots="isLoading" />
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
  [TransactionStatus.Finalized]: 'transactionSteps.completed',
  [TransactionStatus.IPFS]: 'transactionSteps.uploading',
}

const isLoading = computed(() =>
  [
    TransactionStatus.Block,
    TransactionStatus.Casting,
    TransactionStatus.Sign,
    TransactionStatus.Broadcast,
  ].includes(props.status),
)

const subtitle = computed(() =>
  isLoading.value
    ? $i18n.t('transactionSteps.loading')
    : $i18n.t(
        statusTransalationsKeys[props.status] || 'transactionSteps.waiting',
      ),
)

const onClose = () => {
  isModalActive.value = false
}
</script>
