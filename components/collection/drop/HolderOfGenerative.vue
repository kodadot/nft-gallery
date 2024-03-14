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
  useCollectionEntity,
} from '@/composables/drop/useGenerativeDropMint'
import useCursorDropEvents from '@/composables/party/useCursorDropEvents'
import { ActionlessInteraction } from '@/components/common/autoTeleport/utils'
import { AutoTeleportAction } from '@/composables/autoTeleport/types'
import { TransactionStatus } from '@/composables/useTransactionStatus'
import useDropMassMint from '@/composables/drop/massmint/useDropMassMint'
import useDropMassMintListing from '@/composables/drop/massmint/useDropMassMintListing'
import { useDropStore } from '@/stores/drop'
import useHolderOfCollection from '@/composables/drop/useHolderOfCollection'

const { $i18n, $consola } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { toast } = useToast()
const { accountId, isLogIn } = useAuth()
const instance = getCurrentInstance()
const { doAfterLogin } = useDoAfterlogin(instance)

const { openListingCartModal } = useListingCartModal()
const { fetchMultipleBalance } = useMultipleBalance()
const { hasMinimumFunds } = useDropMinimumFunds()

const { drop } = useDrop()
const { fetchDropStatus } = useDropStatus()
const dropStore = useDropStore()
const { claimedNft, canListMintedNft } = useGenerativeDropMint()
const { collectionName } = useCollectionEntity()
const { availableNfts } = useHolderOfCollection()

const {
  mintingSession,
  toMintNFTs,
  allocatedNFTs,
  loading,
  walletConnecting,
  isCaptutingImage,
} = storeToRefs(dropStore)

const {
  howAboutToExecute,
  isLoading: isTransactionLoading,
  initTransactionLoader,
  status,
  isError: isTransactionError,
} = useMetaTransaction()

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

    const { apiInstance } = useApi()
    const api = await apiInstance.value

    initTransactionLoader()

    const cb = api.tx.utility.batchAll
    const args = allocatedNFTs.value.map((allocatedNft, index) =>
      api.tx.nfts.mint(
        drop.value?.collection,
        allocatedNft.id,
        accountId.value,
        {
          ownedItem: availableNfts.serialNumbers[index],
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

  if (loading.value || isTransactionLoading.value || isCaptutingImage.value) {
    return false
  }

  // use paid modal if it's holder of + price
  if (isHolderOfWithPaidMint.value) {
    isMintModalActive.value = true
    return massGenerate()
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
    const response = await Promise.all(toMintNFTs.value.map(submitMint))

    const mintedNfts = response.map((item) => ({
      id: `${drop.value?.collection}-${item.sn}`,
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
    isSuccessModalActive.value = true

    dropStore.incrementRuntimeMintCount()
  } catch (error) {
    toast($i18n.t('drops.mintPerAddress'))
    isCaptutingImage.value = false
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

const { massGenerate, allocateGenerated, submitMint, clearMassMint } =
  useDropMassMint()

const { subscribeForNftsWithMetadata, listMintedNFTs } =
  useDropMassMintListing()

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

watch(() => dropStore.runtimeMintCount, fetchDropStatus, {
  immediate: true,
})
</script>

<style scoped lang="scss">
.order-1 {
  order: 1;
}
</style>
