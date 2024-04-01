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
import useGenerativeDropMint, {
  useCollectionEntity,
} from '@/composables/drop/useGenerativeDropMint'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import { ActionlessInteraction } from '@/components/common/autoTeleport/utils'
import useCursorDropEvents from '@/composables/party/useCursorDropEvents'
import useDropMassMint from '@/composables/drop/massmint/useDropMassMint'
import useDropMassMintListing from '@/composables/drop/massmint/useDropMassMintListing'
import { MintedNFT } from './types'
import { NFTs } from '@/composables/transaction/types'

const { drop } = useDrop()
const { maxCount } = useGenerativeDropMint()
const { fetchDropStatus } = useDropStatus(drop)
const instance = getCurrentInstance()
const { doAfterLogin } = useDoAfterlogin(instance)
const { $i18n, $consola } = useNuxtApp()
const { toast } = useToast()
const { isLogIn } = useAuth()
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
  transaction,
  isLoading: isTransactionLoading,
  status,
  isError,
  txHash,
} = useTransaction({
  disableSuccessNotification: true,
})

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

    transaction({
      interaction: NFTs.MINT_DROP,
      collectionId: drop.value?.collection,
      nfts: allocatedNFTs.value,
      price: drop.value?.price || null,
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

    const mintedNfts: MintedNFT[] = []
    for (const [index, res] of response.entries()) {
      let metadata = {
        animation_url: toMintNFTs.value[index].image,
        name: toMintNFTs.value[index].name,
      }

      try {
        metadata = await $fetch(sanitizeIpfsUrl(res.metadata), {
          retry: 12,
          retryDelay: 5000,
        })
      } catch (error) {
        $consola.warn(error)
      }

      mintedNfts.push({
        id: drop.value.collection,
        chain: res.chain,
        name: metadata.name,
        image: metadata.animation_url,
        collection: {
          id: res.collection,
          name: collectionName.value,
          max: maxCount.value,
        },
      })
    }

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

watch(txHash, () => {
  mintingSession.value.txHash = txHash.value
})
</script>

<style scoped lang="scss">
.order-1 {
  order: 1;
}
</style>
