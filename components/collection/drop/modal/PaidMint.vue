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
        :to-mint-nfts="toMintNfts"
        :minimum-funds="minimumFunds"
        :has-minimum-funds="hasMinimumFunds"
        :mint-button="mintButton"
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
        :minting-session="mintingSession"
        :can-list-nft="canListNft"
        @list="$emit('list')" />
    </ModalBody>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import { AutoTeleportActionButtonConfirmEvent } from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'
import type { MintingSession } from '../types'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import MintOverview from './paid/MintOverview.vue'
import SuccessfulDrop from './shared/SuccessfulDrop.vue'
import { usePreloadMintedNftCovers } from './utils'
import { MassMintNFT } from '@/composables/drop/useDropMassMint'

const emit = defineEmits(['confirm', 'update:modelValue', 'list'])

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    toMintNfts: MassMintNFT[]
    action: AutoTeleportAction
    isAllocatingRaffle: boolean
    minimumFunds: number
    hasMinimumFunds: boolean
    amountToMint: number
    readyToMint: boolean
    hideMinimumFundsWarning: boolean
    formattedMinimumFunds: string
    formattedExistentialDeposit: string
    mintingSession: MintingSession
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

const { loadedAll, triedAll } = usePreloadMintedNftCovers(
  computed(() => props.mintingSession.items),
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
  if (loadedAll.value) {
    return true
  }

  return (
    props.mintingSession.items.length &&
    triedAll.value &&
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

const mintButton = computed(() => {
  if (props.amountToMint !== props.toMintNfts.length) {
    return {
      label: `${$i18n.t('drops.generatingVariations')} ~ 5s `,
      disabled: true,
      loading: true,
    }
  }

  if (!props.readyToMint) {
    return { label: $i18n.t('loader.ipfs'), disabled: true }
  }

  return { label: $i18n.t('drops.proceedToSigning'), disabled: false }
})

const onClose = () => {
  emit('update:modelValue', false)

  if (isSuccessfulDropStep.value) {
    window.location.reload()
  }
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
