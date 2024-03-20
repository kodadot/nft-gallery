<template>
  <CollectionDropGenerativeLayout @mint="handleSubmitMint" />

  <NeoModalExtend v-model:active="isRaffleModalActive">
    <ModalBody title="Submit Raffle" @close="isRaffleModalActive = false">
      <form @submit.prevent="submitRaffle()">
        <NeoInput
          v-model="raffleEmail"
          placeholder="Email"
          class="mb-4"
          type="email"
          :disabled="loading"
          required />
        <NeoButton
          expanded
          variant="k-accent"
          native-type="submit"
          :loading="loading"
          :disabled="loading">
          Allocate
        </NeoButton>
      </form>
    </ModalBody>
  </NeoModalExtend>

  <CollectionDropModalPaidMint
    v-model="isMintModalActive"
    :action="action"
    :status="status"
    @confirm="handleConfirmPaidMint"
    @close="handleMintModalClose"
    @list="handleList" />
</template>

<script setup lang="ts">
import { NeoButton, NeoInput, NeoModalExtend } from '@kodadot1/brick'
import { useDrop, useDropStatus } from '@/components/drops/useDrops'
import { useCollectionEntity } from '@/composables/drop/useGenerativeDropMint'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import { ActionlessInteraction } from '@/components/common/autoTeleport/utils'
import useCursorDropEvents from '@/composables/party/useCursorDropEvents'
import useDropMassMint from '@/composables/drop/massmint/useDropMassMint'
import useDropMassMintListing from '@/composables/drop/massmint/useDropMassMintListing'

const { drop } = useDrop()
const { fetchDropStatus } = useDropStatus()
const instance = getCurrentInstance()
const { doAfterLogin } = useDoAfterlogin(instance)
const { $i18n, $consola } = useNuxtApp()
const { toast } = useToast()
const { accountId, isLogIn } = useAuth()
const { openListingCartModal } = useListingCartModal({
  clearItemsOnBeforeUnmount: true,
  clearItemsOnModalClose: true,
})
const { collectionName } = useCollectionEntity()
const {
  loading,
  walletConnecting,
  previewItem,
  mintingSession,
  toMintNFTs,
  allocatedNFTs,
  isCapturingImage,
} = storeToRefs(useDropStore())

const {
  howAboutToExecute,
  isLoading: isTransactionLoading,
  initTransactionLoader,
  isError,
  status,
} = useMetaTransaction()
useCursorDropEvents([isTransactionLoading, loading])

const isMintModalActive = ref(false)
const isRaffleModalActive = ref(false)

const action = computed<AutoTeleportAction>(() => ({
  interaction: ActionlessInteraction.PAID_DROP,
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
    mintingSession.value.txHash = undefined

    const { apiInstance } = useApi()
    const api = await apiInstance.value

    initTransactionLoader()

    const cb = api.tx.utility.batchAll
    const args = allocatedNFTs.value.map((allocatedNFT) =>
      api.tx.nfts.mint(
        drop.value?.collection,
        allocatedNFT.id,
        accountId.value,
        {
          ownedItem: null,
          mintPrice: drop.value?.price,
        },
      ),
    )

    howAboutToExecute(accountId.value, cb, [args], {
      onResult: ({ txHash }) => {
        mintingSession.value.txHash = txHash
      },
    })
  } catch (e) {
    showNotification(`[MINT::ERR] ${e}`, notificationTypes.warn)
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

  // skip raffle modal at the moment. generate random email instead
  // isRaffleModalActive.value = true
  openMintModal()
  massGenerate()
}

const submitRaffle = async () => {
  await allocateRaffle()

  isRaffleModalActive.value = false
  openMintModal()
}

const openMintModal = () => {
  isMintModalActive.value = true
}

const handleMintModalClose = () => {
  closeMintModal()
  clearMassMint()
}

const closeMintModal = () => {
  isMintModalActive.value = false
}

const allocateRaffle = async () => {
  if (previewItem.value) {
    await allocateRaffleMode(raffleEmail.value, previewItem.value)
  }
}

const submitMints = async () => {
  try {
    const response = await Promise.all(toMintNFTs.value.map(submitMint))

    const mintedNfts = response.map((item) => ({
      id: drop.value.collection,
      collection: item.collection,
      chain: item.chain,
      name: item.name,
      image: item.image as string,
      collectionName: collectionName.value,
    }))

    mintingSession.value.items = mintedNfts

    subscribeForNftsWithMetadata(mintedNfts.map((item) => item.id))

    await fetchDropStatus()

    loading.value = false
  } catch (error) {
    toast($i18n.t('drops.mintDropError', [error?.toString()]))
    isCapturingImage.value = false
    closeMintModal()
    throw error
  }
}

const handleList = () => {
  closeMintModal()
  listMintedNFTs()
  openListingCartModal()
}

const handleConfirmPaidMint = () => {
  mintNft()
}

const stopMint = () => {
  isMintModalActive.value = false
  loading.value = false
  clearMassMint()
}

const {
  massGenerate,
  submitMint,
  allocateRaffleMode,
  raffleEmail,
  clearMassMint,
} = useDropMassMint()

const { subscribeForNftsWithMetadata, listMintedNFTs } =
  useDropMassMintListing()

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
</script>

<style scoped lang="scss">
.order-1 {
  order: 1;
}
</style>
