<template>
  <NeoModal :value="isModalActive" :can-cancel="false" @close="onClose">
    <ModalBody :title="$t('drops.signTransaction')" @close="onClose">
      <SigningModalBody
        :title="title"
        :subtitle="subtitle"
        :failed="isFailed"
        :show-subtitle-dots="isLoading"
        :status="status"
        @try-again="() => $emit('tryAgain')" />
    </ModalBody>
  </NeoModal>
</template>
<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import { TransactionStatus } from '@/composables/useTransactionStatus'

defineEmits(['tryAgain'])
const props = withDefaults(
  defineProps<{
    isLoading: boolean
    status: TransactionStatus
    title: string
    isError?: boolean
  }>(),
  {
    isError: false,
  },
)

const { $i18n } = useNuxtApp()

const isModalActive = ref(false)
const isCancelled = ref(false)
const isFailed = computed(() => isCancelled.value || props.isError)

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
  isCancelled.value = false
}

watch([() => props.status, () => props.isLoading], ([status, loading]) => {
  if (loading) {
    isModalActive.value = true
  }

  if (status === TransactionStatus.Finalized) {
    isModalActive.value = false
    return
  }

  isCancelled.value = status === TransactionStatus.Cancelled
})
</script>
