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
    :to-mint-nft="toMintNft"
    :is-allocating-raffle="isAllocatingRaffle"
    @confirm="handleConfirmPaidMint"
    @close="closeMintModal"
    @list="handleList" />
  <ListingCartModal />
</template>

<script setup lang="ts">
import { NeoButton, NeoInput, NeoModalExtend } from '@kodadot1/brick'
import { createUnlockableMetadata } from '../unlockable/utils'
import { allocateClaim, allocateCollection } from '@/services/fxart'
import { useDrop, useDropStatus } from '@/components/drops/useDrops'
import { fetchNft } from '@/components/items/ItemsGrid/useNftActions'
import useGenerativeDropMint, {
  useCollectionEntity,
} from '@/composables/drop/useGenerativeDropMint'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import { ActionlessInteraction } from '@/components/common/autoTeleport/utils'
import useCursorDropEvents from '@/composables/party/useCursorDropEvents'
import { ToMintNft } from './types'
import { getFakeEmail } from './utils'

const { chainSymbol, decimals } = useChain()
const { drop } = useDrop()

const toMintNft = computed<ToMintNft>(() => ({
  image: sanitizeIpfsUrl(selectedImage.value),
  name: `${collectionName.value || ''} #${raffleId.value || nftCount.value || ''}`,
  collectionName: collectionName.value || '',
  price: drop.value?.price as string,
  priceUSD: priceUSD.value,
}))

const isWalletConnecting = ref(false)
const { fetchDropStatus } = useDropStatus()
const instance = getCurrentInstance()
const mintNftSN = ref('0')
const { doAfterLogin } = useDoAfterlogin(instance)
const { $i18n, $consola } = useNuxtApp()
const { toast } = useToast()
const { accountId, isLogIn } = useAuth()

const isLoading = ref(false)
const isAllocatingRaffle = ref(false)
const isImageFetching = ref(false)
const isMintModalActive = ref(false)
const isRaffleModalActive = ref(false)
const raffleEmail = ref('')
const raffleId = ref()
const imageHash = ref('')

const { usd: priceUSD } = useAmount(
  computed(() => drop.value?.price),
  decimals,
  chainSymbol,
)

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

const {
  claimedNft,
  mintedNftWithMetadata,
  selectedImage,
  tryCapture,
  subscribeToMintedNft,
  listMintedNft,
} = useGenerativeDropMint()
const { description, collectionName, nftCount } = useCollectionEntity()

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

watch(status, (curStatus) => {
  if (curStatus === TransactionStatus.Block) {
    submitMint(mintNftSN.value)
  }
})

const clearWalletConnecting = () => {
  isWalletConnecting.value = false
}

const allocateRaffle = async () => {
  isLoading.value = true
  isAllocatingRaffle.value = true

  const imageUrl = new URL(selectedImage.value)
  imageHash.value = imageUrl.searchParams.get('hash') || ''
  const imageCid = await tryCapture()
  const metadata = await createUnlockableMetadata(
    imageCid,
    description.value || '',
    collectionName.value || drop.value?.name || '',
    'text/html',
    selectedImage.value,
  )
  const body = {
    email: raffleEmail.value,
    hash: imageHash.value,
    address: accountId.value,
    image: selectedImage.value,
    metadata: metadata,
  }

  const response = await allocateCollection(body, drop.value?.id)
  raffleId.value = response.result.id

  isAllocatingRaffle.value = false
  isLoading.value = false
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
  raffleEmail.value = getFakeEmail()
  openMintModal()
  await allocateRaffle()
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

const submitMint = async (sn: string) => {
  try {
    const { result } = await allocateClaim(
      {
        sn: parseInt(sn),
        txHash: imageHash.value,
        address: accountId.value,
      },
      drop.value?.id,
    )

    await fetchDropStatus()

    const id = `${drop.value?.collection}-${result.sn}`

    subscribeToMintedNft(id, async () => {
      const mintedNft = await fetchNft(id)
      if (mintedNft) {
        mintedNftWithMetadata.value = mintedNft
      }
    })

    isLoading.value = false

    claimedNft.value = {
      ...result,
      id,
      collection: result.collection,
      chain: result.chain,
      name: result.name,
      image: result.image,
      collectionName: collectionName.value,
    }
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
</script>

<style scoped lang="scss">
.order-1 {
  order: 1;
}
</style>
