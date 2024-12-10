<template>
  <CollectionDropGenerativeLayout @mint="handleSubmitMint" />

  <CollectionDropModalPaidMint
    v-model="isMintModalActive"
    :action="autoTeleportAction"
    @confirm="mintNft"
    @close="handleMintModalClose"
    @list="handleList"
  />
</template>

<script setup lang="ts">
import { useUpdateMetadata } from '@/composables/drop/useGenerativeDropMint'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import useCursorDropEvents from '@/composables/party/useCursorDropEvents'
import useDropMassMint from '@/composables/drop/massmint/useDropMassMint'
import useDropMassMintListing from '@/composables/drop/massmint/useDropMassMintListing'
import useAutoTeleportModal from '@/composables/autoTeleport/useAutoTeleportModal'
import { type ActionMintDrop, NFTs } from '@/composables/transaction/types'
import { doAfterCheckCurrentChainVM } from '@/components/common/ConnectWallet/openReconnectWalletModal'

const { urlPrefix } = usePrefix()
const { doAfterLogin } = useDoAfterlogin()
const { $i18n, $consola } = useNuxtApp()
const { toast } = useToastOruga()
const { isLogIn } = useAuth()
const { openListingCartModal } = useListingCartModal({
  clearItemsOnBeforeUnmount: true,
  clearItemsOnModalClose: true,
})

const { loading, walletConnecting, mintingSession, isCapturingImage, drop }
  = storeToRefs(useDropStore())

const { isAutoTeleportModalOpen } = useAutoTeleportModal()

const {
  transaction,
  isLoading: isTransactionLoading,
  status,
  isError,
  txHash,
  blockNumber,
} = useTransaction({
  disableSuccessNotification: true,
})

useCursorDropEvents([isTransactionLoading, loading])

const isMintModalActive = ref(false)

const dropAction = computed<ActionMintDrop>(() => ({
  interaction: NFTs.MINT_DROP,
  collectionId: drop.value?.collection,
  price: drop.value?.price || null,
  prefix: urlPrefix.value,
}))

const autoTeleportAction = computed<AutoTeleportAction>(() => ({
  action: dropAction.value,
  handler: () => mintNft(),
  details: {
    isLoading: isTransactionLoading.value,
    status: status.value,
    isError: isError.value,
  },
}))

const mintNft = async () => {
  try {
    loading.value = true
    isError.value = false
    mintingSession.value.txHash = undefined

    transaction(dropAction.value)
  }
  catch (e) {
    warningMessage(`${e}`)
    $consola.error(e)
    isTransactionLoading.value = false
    loading.value = false
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
  if (loading.value || isCapturingImage.value) {
    return false
  }

  doAfterCheckCurrentChainVM(() => {
    isMintModalActive.value = true
    massGenerate().catch(handleMintModalClose)
  })
}

const handleMintModalClose = () => {
  closeMintModal()
  setTimeout(clearMassMint, NEO_MODAL_ANIMATION_DURATION)
}

const closeMintModal = () => {
  isMintModalActive.value = false
}

const submitMints = async () => {
  try {
    await useUpdateMetadata({ blockNumber })

    loading.value = false
  }
  catch (error) {
    toast($i18n.t('drops.mintDropError', [error?.toString()]))
    isCapturingImage.value = false
    closeMintModal()
    throw error
  }
}

const handleList = () => {
  isMintModalActive.value = false
  listMintedNFTs()
  openListingCartModal()
}

const stopMint = () => {
  if (isAutoTeleportModalOpen.value) {
    return
  }

  isMintModalActive.value = false
  loading.value = false
  clearMassMint()
}

const { massGenerate, clearMassMint } = useDropMassMint()
const { listMintedNFTs } = useDropMassMintListing()

useTransactionTracker({
  transaction: {
    isError,
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
</script>

<style scoped lang="scss">
.order-1 {
  order: 1;
}
</style>
