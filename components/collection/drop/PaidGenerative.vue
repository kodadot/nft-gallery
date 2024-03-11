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
          :disabled="isLoading"
          required />
        <NeoButton
          expanded
          variant="k-accent"
          native-type="submit"
          :loading="isLoading"
          :disabled="isLoading">
          Allocate
        </NeoButton>
      </form>
    </ModalBody>
  </NeoModalExtend>

  <CollectionDropModalPaidMint
    v-model="isMintModalActive"
    :action="action"
    :to-mint-nfts="toMintNFTs"
    :amount-to-mint="amountToMint"
    :minting-session="mintingSession"
    :ready-to-mint="canMint"
    @confirm="handleConfirmPaidMint"
    @close="closeMintModal"
    @list="handleList" />
  <ListingCartModal />
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
import useDropMassMint, {
  MassMintNFT,
} from '@/composables/drop/massmint/useDropMassMint'
import { MintingSession } from './types'

const { drop } = useDrop()

const isWalletConnecting = ref(false)
const { fetchDropStatus } = useDropStatus()
const instance = getCurrentInstance()
const mintNftSN = ref('0')
const { doAfterLogin } = useDoAfterlogin(instance)
const { $i18n, $consola } = useNuxtApp()
const { toast } = useToast()
const { accountId, isLogIn } = useAuth()

const isLoading = ref(false)
const isImageFetching = ref(false)
const isMintModalActive = ref(false)
const isRaffleModalActive = ref(false)
const raffleId = ref()

const {
  howAboutToExecute,
  isLoading: isTransactionLoading,
  initTransactionLoader,
  isError,
  status,
} = useMetaTransaction()

const action = computed<AutoTeleportAction>(() => ({
  interaction: ActionlessInteraction.PAID_DROP,
  handler: () => mintNft(),
  details: {
    isLoading: isTransactionLoading.value,
    status: status.value,
    isError: isError.value,
  },
}))

const { claimedNft, listMintedNft } = useGenerativeDropMint()
const { collectionName } = useCollectionEntity()
const { toMintNFTs, amountToMint, mintingSession, previewItem } =
  storeToRefs(useDropStore())
useCursorDropEvents([isTransactionLoading, isLoading])

const mintNft = async () => {
  try {
    isLoading.value = true

    const { apiInstance } = useApi()
    const api = await apiInstance.value

    initTransactionLoader()
    const cb = api.tx.nfts.mint
    const args = [
      drop.value?.collection,
      raffleId.value,
      accountId.value,
      {
        ownedItem: null,
        mintPrice: drop.value?.price,
      },
    ]

    mintNftSN.value = raffleId.value
    howAboutToExecute(accountId.value, cb, args, ({ txHash }) => {
      if (claimedNft.value) {
        claimedNft.value.txHash = txHash
      }
    })
  } catch (e) {
    showNotification(`[MINT::ERR] ${e}`, notificationTypes.warn)
    $consola.error(e)
    isTransactionLoading.value = false
    isLoading.value = false
  }
}

const clearWalletConnecting = () => {
  isWalletConnecting.value = false
}

const handleSubmitMint = async () => {
  if (!isLogIn.value) {
    isWalletConnecting.value = true
    doAfterLogin({
      onLoginSuccess: clearWalletConnecting,
      onCancel: clearWalletConnecting,
    })

    return
  }
  if (isLoading.value || isImageFetching.value) {
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

const closeMintModal = () => {
  isMintModalActive.value = false
}

const allocateRaffle = async () => {
  if (previewItem.value) {
    await allocateRaffleMode(raffleEmail.value, previewItem.value)
  }
}

const submitMints = async ({
  session,
  toMintNFTs,
}: {
  session: Ref<MintingSession>
  toMintNFTs: MassMintNFT[]
}) => {
  try {
    const response = await Promise.all(toMintNFTs.map(submitMint))

    const mintedNfts = response.map((item) => ({
      id: `${drop.value.collection}-${item.sn}`,
      collection: item.collection,
      chain: item.chain,
      name: item.name,
      image: item.image as string,
      collectionName: collectionName.value as string,
    }))

    session.value.items = mintedNfts

    subscribeForNftsWithMetadata(mintedNfts.map((item) => item.id))

    await fetchDropStatus()

    isLoading.value = false
  } catch (error) {
    toast($i18n.t('drops.mintPerAddress'))
    isImageFetching.value = false
    closeMintModal()
    throw error
  }
}

const handleList = () => {
  closeMintModal()
  listMintedNft()
}

const handleConfirmPaidMint = () => {
  mintNft()
}

const stopMint = () => {
  isMintModalActive.value = false
  isLoading.value = false
}

watch([isTransactionLoading, status], ([loading, status], [wasLoading]) => {
  if (wasLoading && !loading && status === TransactionStatus.Unknown) {
    stopMint()
  }
})

const {
  massGenerate,
  subscribeForNftsWithMetadata,
  submitMint,
  canMint,
  allocateRaffleMode,
  raffleEmail,
} = useDropMassMint({
  isLoading,
  isError,
  isTransactionLoading,
  status,
  submitMints,
})
</script>

<style scoped lang="scss">
.order-1 {
  order: 1;
}
</style>
