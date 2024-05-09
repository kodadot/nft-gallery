<template>
  <SigningModal
    v-if="isOnlyHolderOfMint"
    :title="$t('mint.nft.minting')"
    :is-loading="loading"
    :status="status"
    :is-error="isTransactionError"
    @try-again="mintNft" />

  <NeoModal
    v-if="isOnlyHolderOfMint && status === TransactionStatus.Finalized"
    :value="isSuccessModalActive"
    teleport>
    <ModalBody
      :title="$i18n.t('success')"
      @close="isSuccessModalActive = false">
      <CollectionDropModalSharedSuccessfulDrop
        v-if="claimedNft"
        :minting-session="mintingSession"
        :can-list-nfts="canListMintedNft"
        @list="handleList" />
    </ModalBody>
  </NeoModal>

  <CollectionDropGenerativeLayout @mint="handleSubmitMint" />

  <CollectionDropModalPaidMint
    v-if="isHolderOfWithPaidMint"
    v-model="isMintModalActive"
    :action="action"
    :status="status"
    :is-error="isTransactionError"
    @confirm="mintNft"
    @close="closeMintModal"
    @list="handleList" />

  <CollectionDropAddFundsModal
    v-if="isOnlyHolderOfMint"
    v-model="isAddFundModalActive"
    @close="isAddFundModalActive = false"
    @confirm="handleDropAddModalConfirm" />
</template>

<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import {
  useDrop,
  useDropMinimumFunds,
  useDropStatus,
} from '@/components/drops/useDrops'
import useGenerativeDropMint, {
  useUpdateMetadata,
} from '@/composables/drop/useGenerativeDropMint'
import useCursorDropEvents from '@/composables/party/useCursorDropEvents'
import { ActionlessInteraction } from '@/components/common/autoTeleport/utils'
import { AutoTeleportAction } from '@/composables/autoTeleport/types'
import { TransactionStatus } from '@/composables/useTransactionStatus'
import useDropMassMint from '@/composables/drop/massmint/useDropMassMint'
import useDropMassMintListing from '@/composables/drop/massmint/useDropMassMintListing'
import { useDropStore } from '@/stores/drop'
import useHolderOfCollection from '@/composables/drop/useHolderOfCollection'
import { NFTs } from '@/composables/transaction/types'

const { $i18n, $consola } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { toast } = useToast()
const { isLogIn } = useAuth()
const instance = getCurrentInstance()
const { doAfterLogin } = useDoAfterlogin(instance)
const {
  transaction,
  isLoading: isTransactionLoading,
  status,
  isError: isTransactionError,
  txHash,
} = useTransaction({
  disableSuccessNotification: true,
})
const { openListingCartModal } = useListingCartModal({
  clearItemsOnBeforeUnmount: true,
  clearItemsOnModalClose: true,
})
const { fetchMultipleBalance } = useMultipleBalance()
const { hasMinimumFunds } = useDropMinimumFunds()

const { drop } = useDrop()
const { subscribeDropStatus } = useDropStatus(drop)
const dropStore = useDropStore()
const { claimedNft, canListMintedNft } = useGenerativeDropMint()
const { availableNfts } = useHolderOfCollection()

const {
  mintingSession,
  allocatedNFTs,
  loading,
  walletConnecting,
  isCapturingImage,
} = storeToRefs(dropStore)

useCursorDropEvents([isTransactionLoading, loading])

const isAddFundModalActive = ref(false)
const isSuccessModalActive = ref(false)
const isMintModalActive = ref(false)

const isHolderOfWithPaidMint = computed(() => Boolean(drop.value?.price))
const isOnlyHolderOfMint = computed(() => !isHolderOfWithPaidMint.value)

const action = computed<AutoTeleportAction>(() => ({
  interaction: ActionlessInteraction.PAID_DROP,
  handler: () => mint(),
  details: {
    isLoading: isTransactionLoading.value,
    status: status.value,
    isError: isTransactionError.value,
  },
}))

const mintNft = async () => {
  try {
    isTransactionError.value = false
    mintingSession.value.txHash = undefined

    transaction({
      interaction: NFTs.MINT_DROP,
      collectionId: drop.value?.collection,
      nfts: allocatedNFTs.value,
      availableSerialNumbers: availableNfts.serialNumbers,
      price: drop.value?.price || null,
    })
  } catch (e) {
    warningMessage(`${e}`)
    $consola.error(e)
    isTransactionLoading.value = false
  }
}

const clearWalletConnecting = () => {
  walletConnecting.value = false
}

const handleSubmitMint = async () => {
  if (!isLogIn.value) {
    walletConnecting.value = true
    doAfterLogin({
      onLoginSuccess: clearWalletConnecting,
      onCancel: clearWalletConnecting,
    })

    return
  }

  if (loading.value || isTransactionLoading.value || isCapturingImage.value) {
    return false
  }

  // use paid modal if it's holder of + price
  if (isHolderOfWithPaidMint.value) {
    isMintModalActive.value = true
    return await massGenerate()
  }

  if (hasMinimumFunds.value) {
    mint()
  } else {
    isAddFundModalActive.value = true
  }
}

const mint = async () => {
  await allocateGenerated()
  await mintNft()
}

const submitMints = async () => {
  try {
    await useUpdateMetadata()

    loading.value = false
    isSuccessModalActive.value = true

    dropStore.incrementRuntimeMintCount()
  } catch (error) {
    toast($i18n.t('drops.mintDropError', [error?.toString()]))
    isCapturingImage.value = false
    $consola.error(error)
    throw error
  }
}

const closeMintModal = () => {
  isMintModalActive.value = false
  clearMassMint()
}

const handleDropAddModalConfirm = () => {
  isAddFundModalActive.value = false
  fetchMultipleBalance([urlPrefix.value])
}

const handleList = () => {
  isSuccessModalActive.value = false
  listMintedNFTs()
  openListingCartModal()
}

const stopMint = () => {
  closeMintModal()
  loading.value = false
  clearMassMint()
}

const { massGenerate, allocateGenerated, clearMassMint } = useDropMassMint()

const { listMintedNFTs } = useDropMassMintListing()

useTransactionTracker({
  transaction: {
    isError: isTransactionError,
    status,
  },
  onSuccess: submitMints,
  onCancel: stopMint,
  onError: () => {
    loading.value = false
  },
  // ensure txHash is set, it's needed when calling /do/:id
  waitFor: [computed(() => Boolean(mintingSession.value.txHash))],
})

watch(txHash, () => {
  mintingSession.value.txHash = txHash.value
})

onBeforeMount(subscribeDropStatus)
</script>

<style scoped lang="scss">
.order-1 {
  order: 1;
}
</style>
