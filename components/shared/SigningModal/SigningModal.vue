<template>
  <NeoModal
    :value="isModalActive"
    :can-cancel="['outside', 'escape']"
    scroll="clip"
    @close="onClose">
    <ModalBody :title="$t('drops.signTransaction')" @close="onClose">
      <SigningModalBody
        :title="title"
        :subtitle="subtitle"
        :failed="isCancelled"
        :show-subtitle-dots="isLoading"
        @try-again="() => $emit('tryAgain')" />
    </ModalBody>
  </NeoModal>
</template>
<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import { TransactionStatus } from '@/composables/useTransactionStatus'

defineEmits(['tryAgain'])
const props = defineProps<{
  isLoading: boolean
  status: TransactionStatus
  title: string
}>()

const { $i18n } = useNuxtApp()

const isModalActive = ref(false)
const isCancelled = ref(false)

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

watch(
  [() => props.status, () => props.isLoading],
  ([status, loading], [prevStatus, wasLoading]) => {
    if (loading) {
      isModalActive.value = true
    }

    if (status === TransactionStatus.Finalized) {
      isModalActive.value = false
      return
    }

    isCancelled.value =
      !loading &&
      wasLoading &&
      prevStatus === TransactionStatus.Unknown &&
      status === TransactionStatus.Unknown
  },
)
</script>
