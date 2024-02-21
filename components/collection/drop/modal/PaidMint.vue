<template>
  <NeoModal
    :value="modelValue"
    :can-cancel="isSigningStep ? false : ['outside', 'escape']"
    scroll="clip"
    @close="onClose">
    <ModalBody
      :title="title"
      :scrollable="false"
      :loading="loading"
      :custom-skeleton-title="preStepTitle"
      @close="onClose">
      <MintOverview
        v-if="isMintOverviewStep"
        ref="mintOverview"
        :to-mint-nft="toMintNft"
        :minimum-funds="minimumFunds"
        :has-minimum-funds="hasMinimumFunds"
        :hide-minimum-funds-warning="hideMinimumFundsWarning"
        :formatted-minimum-funds="formattedMinimumFunds"
        :formatted-existential-deposit="formattedExistentialDeposit"
        :action="action"
        @confirm="handleConfirm"
        @close="handleModalClose" />

      <SigningModalBody
        v-else-if="isSigningStep"
        :title="$t('autoTeleport.steps.paid_drop.title')"
        :subtitle="transactionStatus" />

      <SuccessfulDrop
        v-else-if="isSuccessfulDropStep"
        :minted-nft="sanitizedMintedNft as DropMintedNft"
        :can-list-nft="canListNft"
        @list="$emit('list')" />
    </ModalBody>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import { AutoTeleportActionButtonConfirmEvent } from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'
import type { ToMintNft } from '../types'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import MintOverview from './paid/MintOverview.vue'
import SuccessfulDrop from './shared/SuccessfulDrop.vue'
import type { DropMintedNft } from '@/composables/drop/useGenerativeDropMint'
import { usePreloadMintedNftCover } from './utils'

const emit = defineEmits(['confirm', 'update:modelValue', 'list'])

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    toMintNft: ToMintNft
    action: AutoTeleportAction
    isAllocatingRaffle: boolean
    minimumFunds: number
    hasMinimumFunds: boolean
    hideMinimumFundsWarning: boolean
    formattedMinimumFunds: string
    formattedExistentialDeposit: string
    mintedNft?: DropMintedNft
    canListNft: boolean
  }>(),
  {
    hideMinimumFundsWarning: false,
  },
)

enum ModalStep {
  OVERVIEW = 'overview',
  SIGNING = 'SIGNING',
  SUCCEEDED = 'succeded',
}

const { $i18n } = useNuxtApp()

const { retry, nftCoverLoaded, sanitizedMintedNft } = usePreloadMintedNftCover(
  computed(() => props.mintedNft),
)

const mintOverview = ref()
const modalStep = ref<ModalStep>(ModalStep.OVERVIEW)

const loading = computed(
  () => props.isAllocatingRaffle || mintOverview.value?.loading || false,
)
const preStepTitle = computed<string | undefined>(() =>
  props.isAllocatingRaffle ? $i18n.t('loader.ipfs') : undefined,
)
const isMintOverviewStep = computed(
  () => modalStep.value === ModalStep.OVERVIEW,
)
const isSigningStep = computed(() => modalStep.value === ModalStep.SIGNING)
const isSuccessfulDropStep = computed(
  () => modalStep.value === ModalStep.SUCCEEDED,
)

const moveSuccessfulDrop = computed(() => {
  if (nftCoverLoaded.value) {
    return true
  }

  return (
    sanitizedMintedNft.value &&
    retry.value === 0 &&
    props.action.details.status === TransactionStatus.Finalized
  )
})

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

const onClose = () => {
  emit('update:modelValue', false)
}

const handleModalClose = (completed: boolean) => {
  if (completed) {
    modalStep.value = ModalStep.SUCCEEDED
  }
}

const handleConfirm = ({
  autoteleport,
}: AutoTeleportActionButtonConfirmEvent) => {
  if (!autoteleport) {
    emit('confirm')
    modalStep.value = ModalStep.SIGNING
  }
}

watchEffect(() => {
  if (moveSuccessfulDrop.value && isSigningStep.value) {
    modalStep.value = ModalStep.SUCCEEDED
  }
})
</script>
