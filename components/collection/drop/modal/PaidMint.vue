<template>
  <NeoModal
    :value="modelValue"
    @close="close"
  >
    <ModalBody
      :title="title"
      :scrollable="false"
      :loading="loading"
      @close="close"
    >
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
        @close="handleModalClose"
      />

      <SigningModalBody
        v-else-if="isSigningStep"
        :title="$t('autoTeleport.steps.paid_drop.title')"
        :subtitle="transactionStatus"
        :status="status"
        :failed="isError"
        @try-again="confirm"
      />

      <SuccessfulDrop
        v-else-if="isSuccessfulDropStep"
        :status="status"
        :minting-session="mintingSession"
        :can-list-nfts="canList"
        @list="$emit('list')"
      />
    </ModalBody>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import MintOverview from './paid/MintOverview.vue'
import SuccessfulDrop from './shared/SuccessfulDrop.vue'
import { usePreloadImages } from './utils'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import type { AutoTeleportActionButtonConfirmEvent } from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import { useDropMinimumFunds } from '@/components/drops/useDrops'
import useDropMassMintState from '@/composables/drop/massmint/useDropMassMintState'
import { TransactionStatus } from '@/composables/useTransactionStatus'
import useAutoTeleportModal from '@/composables/autoTeleport/useAutoTeleportModal'

enum ModalStep {
  OVERVIEW = 'overview',
  SIGNING = 'SIGNING',
  SUCCEEDED = 'succeded',
}

const emit = defineEmits(['confirm', 'update:modelValue', 'list', 'close'])
const props = defineProps<{
  modelValue: boolean
  action: AutoTeleportAction
}>()

const { canMint, canList } = useDropMassMintState()
const { mintingSession, amountToMint, toMintNFTs } = storeToRefs(useDropStore())
const { $i18n } = useNuxtApp()
const { isAutoTeleportModalOpen } = useAutoTeleportModal()

const { formattedMinimumFunds, minimumFunds, formattedExistentialDeposit }
  = useDropMinimumFunds(computed(() => amountToMint.value))

const { completed: imagePreloadingCompleted } = usePreloadImages(
  computed(() => mintingSession.value.items),
)

const mintOverview = ref()
const modalStep = ref<ModalStep>(ModalStep.OVERVIEW)
const autoteleportCompleted = ref(false)
const isModalOpen = useVModel(props, 'modelValue')

const isError = computed(() => props.action.details.isError)
const status = computed(() => props.action.details.status)
const isLoading = computed(() => props.action.details.isLoading)

const { isTransactionSuccessful } = useTransactionSuccessful({
  status,
  isError,
  isLoading,
})

const mintButton = { label: $i18n.t('drops.proceedToSigning'), disabled: false }

const loading = computed(
  () =>
    !canMint.value
    || mintOverview.value?.loading
    || (autoteleportCompleted.value && !moveSuccessfulDrop.value)
    || false,
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
    imagePreloadingCompleted.value
    && Boolean(mintingSession.value.items.length)
    && Boolean(mintingSession.value.txHash)
    && isTransactionSuccessful.value,
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

const handleModalClose = (completed: boolean) => {
  if (completed) {
    autoteleportCompleted.value = true
    isModalOpen.value = true
  }
  else {
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
  }
  else {
    isModalOpen.value = false
  }
}

const reset = () => {
  modalStep.value = ModalStep.OVERVIEW
  autoteleportCompleted.value = false
}

watchEffect(() => {
  if (
    moveSuccessfulDrop.value
    && (isSigningStep.value || autoteleportCompleted.value)
  ) {
    modalStep.value = ModalStep.SUCCEEDED
  }
})

useModalIsOpenTracker({
  isOpen: computed(() => props.modelValue),
  onChange: reset,
  and: [computed(() => !isAutoTeleportModalOpen.value)],
})
</script>
