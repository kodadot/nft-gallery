<template>
  <NeoModal
    :value="modelValue"
    :can-cancel="isSigningStep ? false : ['outside', 'escape']"
    @close="onClose">
    <ModalBody
      :title="title"
      :scrollable="false"
      :loading="loading"
      :custom-skeleton-title="preStepTitle"
      :estimated-time="estimedTime"
      @close="onClose">
      <MintOverview
        v-if="isMintOverviewStep"
        ref="mintOverview"
        :to-mint-nfts="toMintNFTs"
        :minimum-funds="minimumFunds"
        :mint-button="mintButton"
        :formatted-minimum-funds="formattedMinimumFunds"
        :formatted-existential-deposit="formattedExistentialDeposit"
        :action="action"
        @confirm="handleConfirm"
        @close="handleModalClose" />

      <SigningModalBody
        v-else-if="isSigningStep"
        :title="$t('autoTeleport.steps.paid_drop.title')"
        :subtitle="transactionStatus"
        :status="status"
        :failed="isError"
        @try-again="confirm" />

      <SuccessfulDrop
        v-else-if="isSuccessfulDropStep"
        :status="status"
        :minting-session="mintingSession"
        :can-list-nfts="canList"
        @list="$emit('list')" />
    </ModalBody>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import { AutoTeleportActionButtonConfirmEvent } from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import MintOverview from './paid/MintOverview.vue'
import SuccessfulDrop from './shared/SuccessfulDrop.vue'
import { usePreloadImages } from './utils'
import { useDropMinimumFunds } from '@/components/drops/useDrops'
import useDropMassMintState from '@/composables/drop/massmint/useDropMassMintState'
import { TransactionStatus } from '@/composables/useTransactionStatus'
import useAutoTeleportModal from '@/composables/autoTeleport/useAutoTeleportModal'

enum ModalStep {
  OVERVIEW = 'overview',
  SIGNING = 'SIGNING',
  SUCCEEDED = 'succeded',
}

const IPFS_ESTIMATED_TIME_SECONDS = 15

const emit = defineEmits(['confirm', 'update:modelValue', 'list', 'close'])
const props = defineProps<{
  modelValue: boolean
  action: AutoTeleportAction
  status: TransactionStatus
  isError: boolean
}>()

const { canMint, canList } = useDropMassMintState()
const { mintingSession, amountToMint, toMintNFTs } = storeToRefs(useDropStore())
const { $i18n } = useNuxtApp()
const { isAutoTeleportModalOpen } = useAutoTeleportModal()

const { formattedMinimumFunds, minimumFunds, formattedExistentialDeposit } =
  useDropMinimumFunds(computed(() => amountToMint.value))

const { completed: imagePreloadingCompleted } = usePreloadImages(
  computed(() => mintingSession.value.items),
)

const mintOverview = ref()
const modalStep = ref<ModalStep>(ModalStep.OVERVIEW)
const autoteleportCompleted = ref(false)
const isModalOpen = useVModel(props, 'modelValue')

const isSingleMintNotReady = computed(
  () => amountToMint.value === 1 && !canMint.value,
)

const estimedTime = computed(() =>
  isSingleMintNotReady.value ? IPFS_ESTIMATED_TIME_SECONDS : undefined,
)

const mintButton = computed(() => {
  if (!canMint.value) {
    return {
      label: $i18n.t('drops.mintDropError'),
      disabled: true,
    }
  }

  return { label: $i18n.t('drops.proceedToSigning'), disabled: false }
})

const loading = computed(
  () =>
    isSingleMintNotReady.value ||
    mintOverview.value?.loading ||
    (autoteleportCompleted.value && !moveSuccessfulDrop.value) ||
    false,
)

const preStepTitle = computed<string | undefined>(() =>
  isSingleMintNotReady.value ? $i18n.t('drops.mintDropError') : undefined,
)

const isMintOverviewStep = computed(
  () => modalStep.value === ModalStep.OVERVIEW,
)
const isSigningStep = computed(() => modalStep.value === ModalStep.SIGNING)
const isSuccessfulDropStep = computed(
  () => modalStep.value === ModalStep.SUCCEEDED,
)

const moveSuccessfulDrop = computed<boolean>(
  () =>
    imagePreloadingCompleted.value &&
    Boolean(mintingSession.value.items.length) &&
    Boolean(mintingSession.value.txHash) &&
    props.action.details.status === TransactionStatus.Finalized,
)

const transactionStatus = computed(() => {
  const status = props.action.details.status

  if (status === TransactionStatus.Unknown) {
    return $i18n.t('transactionSteps.waiting')
  }

  return $i18n.t('transactionSteps.loading')
})

const title = computed(() => {
  if (isMintOverviewStep.value) {
    return $i18n.t('drops.mintDrop')
  }

  if (isSigningStep.value) {
    return $i18n.t('drops.signTransaction')
  }

  return $i18n.t('success')
})

const close = () => emit('close')

const onClose = () => {
  close()
  if (isSuccessfulDropStep.value) {
    window.location.reload()
  }
}

const handleModalClose = (completed: boolean) => {
  if (completed) {
    autoteleportCompleted.value = true
    isModalOpen.value = true
  } else {
    close()
  }
}

const confirm = () => emit('confirm')

const handleConfirm = ({
  autoteleport,
}: AutoTeleportActionButtonConfirmEvent) => {
  if (!autoteleport) {
    confirm()
    modalStep.value = ModalStep.SIGNING
  } else {
    isModalOpen.value = false
  }
}

const reset = () => {
  modalStep.value = ModalStep.OVERVIEW
  autoteleportCompleted.value = false
}

watchEffect(() => {
  if (
    moveSuccessfulDrop.value &&
    (isSigningStep.value || autoteleportCompleted.value)
  ) {
    modalStep.value = ModalStep.SUCCEEDED
  }
})

watchDebounced(
  [() => props.modelValue, isAutoTeleportModalOpen],
  ([isOpen]) => {
    if (!isOpen && !isAutoTeleportModalOpen.value) {
      reset()
    }
  },
  { debounce: 500 }, // wait for the modal closing animation to finish
)
</script>
