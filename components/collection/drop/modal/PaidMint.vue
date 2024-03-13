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
        :modal-loading="loading"
        @confirm="handleConfirm"
        @close="handleModalClose" />

      <SigningModalBody
        v-else-if="isSigningStep"
        :title="$t('autoTeleport.steps.paid_drop.title')"
        :subtitle="transactionStatus" />

      <SuccessfulDrop
        v-else-if="isSuccessfulDropStep"
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

enum ModalStep {
  OVERVIEW = 'overview',
  SIGNING = 'SIGNING',
  SUCCEEDED = 'succeded',
}

const emit = defineEmits(['confirm', 'update:modelValue', 'list'])
const props = defineProps<{
  modelValue: boolean
  action: AutoTeleportAction
}>()

const { canMint, canList } = useDropMassMintState()
const { mintingSession, amountToMint, toMintNFTs } = storeToRefs(useDropStore())
const { $i18n } = useNuxtApp()

const { formattedMinimumFunds, minimumFunds, formattedExistentialDeposit } =
  useDropMinimumFunds(computed(() => amountToMint.value))

const { loadedAll, triedAll } = usePreloadImages(
  computed(() => mintingSession.value.items),
)

const mintOverview = ref()
const modalStep = ref<ModalStep>(ModalStep.OVERVIEW)

const isSingleMintNotReady = computed(
  () => amountToMint.value === 1 && !canMint.value,
)

const mintButton = computed(() => {
  const generatingVariations =
    toMintNFTs.value.map((nft) => nft.imageDataPayload).filter(Boolean)
      .length !== toMintNFTs.value.length

  if (generatingVariations) {
    return {
      label: `${$i18n.t('drops.generatingVariations')} ~ 5s `,
      disabled: true,
      loading: true,
    }
  }

  if (!canMint.value) {
    return { label: $i18n.t('loader.ipfs'), disabled: true }
  }

  return { label: $i18n.t('drops.proceedToSigning'), disabled: false }
})

const loading = computed(
  () => isSingleMintNotReady.value || mintOverview.value?.loading || false,
)
const preStepTitle = computed<string | undefined>(() =>
  isSingleMintNotReady.value ? $i18n.t('loader.ipfs') : undefined,
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
    mintingSession.value.items.length &&
    mintingSession.value.txHash &&
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

watch(
  () => props.action.details.status,
  (status) => {
    if (status === TransactionStatus.Cancelled) {
      modalStep.value = ModalStep.OVERVIEW
    }
  },
)
</script>
