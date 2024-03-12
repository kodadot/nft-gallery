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
        :can-list-nft="canListMintedNft"
        @list="handleList" />
    </ModalBody>
  </NeoModal>

  <CollectionDropGenerativeLayout @mint="handleSubmitMint" />

  <CollectionDropModalPaidMint
    v-if="isHolderOfWithPaidMint"
    v-model="isMintModalActive"
    :action="action"
    :to-mint-nft="toMintNft"
    :is-allocating-raffle="isAllocatingRaffle"
    hide-minimum-funds-warning
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
import { createUnlockableMetadata } from '../unlockable/utils'
import {
  useDrop,
  useDropMinimumFunds,
  useDropStatus,
} from '@/components/drops/useDrops'
import { fetchNft } from '@/components/items/ItemsGrid/useNftActions'
import useGenerativeDropMint, {
  useCollectionEntity,
} from '@/composables/drop/useGenerativeDropMint'
import { allocateClaim, allocateCollection } from '@/services/fxart'
import useCursorDropEvents from '@/composables/party/useCursorDropEvents'

import type { ToMintNft } from './types'
import { ActionlessInteraction } from '@/components/common/autoTeleport/utils'
import { AutoTeleportAction } from '@/composables/autoTeleport/types'
import { getFakeEmail } from './utils'
import { TransactionStatus } from '@/composables/useTransactionStatus'
import { useDropStore } from '@/stores/drop'
import useHolderOfCollection from '@/composables/drop/useHolderOfCollection'

const { $i18n, $consola } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { toast } = useToast()
const { accountId, isLogIn } = useAuth()
const { chainSymbol, decimals } = useChain()
const dropStore = useDropStore()

const { fetchMultipleBalance } = useMultipleBalance()
const {
  howAboutToExecute,
  isLoading: isTransactionLoading,
  initTransactionLoader,
  status,
  isError: isTransactionError,
} = useMetaTransaction()

const { hasMinimumFunds } = useDropMinimumFunds()

const instance = getCurrentInstance()
const { drop } = useDrop()
const { fetchDropStatus } = useDropStatus()
const { doAfterLogin } = useDoAfterlogin(instance)
const {
  claimedNft,
  mintedNftWithMetadata,
  selectedImage,
  tryCapture,
  subscribeToMintedNft,
  canListMintedNft,
  listMintedNft,
} = useGenerativeDropMint()
const { collectionName, description } = useCollectionEntity()
const { usd: priceUSD } = useAmount(
  computed(() => drop.value?.price),
  decimals,
  chainSymbol,
)
const { availableNfts } = useHolderOfCollection()
const { loading, walletConnecting } = storeToRefs(useDropStore())

const mintNftSN = ref('0')
const isImageFetching = ref(false)
const isAddFundModalActive = ref(false)
const isSuccessModalActive = ref(false)
const isAllocatingRaffle = ref(false)
const isMintModalActive = ref(false)
const raffleEmail = ref('')
const raffleId = ref()
const imageHash = ref('')

useCursorDropEvents([isTransactionLoading, loading])

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

const toMintNft = computed<ToMintNft>(() => ({
  image: sanitizeIpfsUrl(selectedImage.value),
  name:
    collectionName.value && raffleId.value
      ? `${collectionName.value} #${raffleId.value}`
      : '',
  collectionName: collectionName.value || '',
  price: drop.value?.price as string,
  priceUSD: priceUSD.value,
}))

const mintNft = async () => {
  try {
    isTransactionError.value = false
    const { apiInstance } = useApi()
    const api = await apiInstance.value

    initTransactionLoader()
    const cb = api.tx.nfts.mint

    const args = [
      drop.value?.collection,
      raffleId.value,
      accountId.value,
      {
        ownedItem: availableNfts.serialNumbers[0],
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
  }
}

watch(status, (curStatus) => {
  if (curStatus === TransactionStatus.Block) {
    if (isTransactionError.value) {
      loading.value = false
      isTransactionLoading.value = false
      return
    }
    submitMint(mintNftSN.value)
  }
  if (curStatus === TransactionStatus.Cancelled) {
    isMintModalActive.value = false
  }
})

const clearWalletConnecting = () => {
  walletConnecting.value = false
}

const allocateRaffle = async () => {
  loading.value = true
  isAllocatingRaffle.value = true

  const imageUrl = new URL(selectedImage.value)
  imageHash.value = imageUrl.searchParams.get('hash') ?? ''
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

  const response = await allocateCollection(body, drop.value.id)
  raffleId.value = response.result.id

  isAllocatingRaffle.value = false
  loading.value = false
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

  if (loading.value || isTransactionLoading.value || isImageFetching.value) {
    return false
  }

  // use paid modal if it's holder of + price
  if (isHolderOfWithPaidMint.value) {
    isMintModalActive.value = true
    await prepareRaffle()
    return
  }

  if (hasMinimumFunds.value) {
    mint()
  } else {
    isAddFundModalActive.value = true
  }
}

const prepareRaffle = async () => {
  // skip raffle modal at the moment. generate random email instead
  // isRaffleModalActive.value = true
  raffleEmail.value = getFakeEmail()

  await allocateRaffle()
}

const mint = async () => {
  await prepareRaffle()
  await mintNft()
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

    loading.value = false

    claimedNft.value = {
      ...result,
      id,
      name: result.name,
      collectionName: collectionName.value,
    }

    isSuccessModalActive.value = true
    dropStore.incrementRuntimeMintCount()
  } catch (error) {
    toast($i18n.t('drops.mintPerAddress'))
    isImageFetching.value = false
    $consola.error(error)
    throw error
  }
}

const closeMintModal = () => {
  isMintModalActive.value = false
}

const handleDropAddModalConfirm = () => {
  isAddFundModalActive.value = false
  fetchMultipleBalance([urlPrefix.value])
}

const handleList = () => {
  isSuccessModalActive.value = false
  listMintedNft()
}

watch(() => dropStore.runtimeMintCount, fetchDropStatus, {
  immediate: true,
})
</script>

<style scoped lang="scss">
.order-1 {
  order: 1;
}
</style>
