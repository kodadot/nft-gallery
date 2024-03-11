<template>
  <SigningModal
    v-if="isOnlyHolderOfMint"
    :title="$t('mint.nft.minting')"
    :is-loading="isLoading"
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

  <CollectionDropGenerativeLayout
    :holder-of-collection="holderOfCollection"
    @mint="handleSubmitMint" />

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
  useHolderOfCollectionDrop,
} from '@/components/drops/useDrops'
import { fetchNft } from '@/components/items/ItemsGrid/useNftActions'
import holderOfCollectionById from '@/queries/subsquid/general/holderOfCollectionById.graphql'
import useGenerativeDropMint, {
  useCollectionEntity,
} from '@/composables/drop/useGenerativeDropMint'
import { allocateClaim, allocateCollection } from '@/services/fxart'
import useCursorDropEvents from '@/composables/party/useCursorDropEvents'

import type { HolderOfCollectionProp, ToMintNft } from './types'
import { ActionlessInteraction } from '@/components/common/autoTeleport/utils'
import { AutoTeleportAction } from '@/composables/autoTeleport/types'
import { getFakeEmail } from './utils'
import { useDropStore } from '@/stores/drop'

const { $i18n, $consola } = useNuxtApp()
const { urlPrefix, client } = usePrefix()
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
const { isNftClaimed } = useHolderOfCollectionDrop()
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

const { data: holderOfCollectionData } = await useAsyncData(
  'holderOfCollectionData',
  () =>
    useAsyncQuery<{
      nftEntitiesConnection: { totalCount: number }
      nftEntities: Array<{ sn: string }>
    }>({
      clientId: client.value,
      query: holderOfCollectionById,
      variables: {
        id: drop.value?.holder_of,
        account: accountId.value,
      },
    }).then((res) => res.data.value),
  {
    watch: [accountId, () => dropStore.runtimeMintCount],
  },
)

const maxMintLimitForCurrentUser = computed(
  () => holderOfCollectionData.value?.nftEntitiesConnection?.totalCount ?? 0,
)

const isHolderOfTargetCollection = computed(
  () => maxMintLimitForCurrentUser.value > 0,
)

const holderOfCollection = computed<HolderOfCollectionProp>(() => ({
  id: drop.value?.holder_of as string,
  isHolder: isHolderOfTargetCollection.value,
  hasAvailable: availableNfts.amount !== 0,
  isLoading: availableNfts.isLoading,
  amount: {
    total: maxMintLimitForCurrentUser.value,
    available: availableNfts.amount,
  },
}))

const isWalletConnecting = ref(false)
const mintNftSN = ref('0')
const isLoading = ref(false)
const isImageFetching = ref(false)
const isAddFundModalActive = ref(false)
const isSuccessModalActive = ref(false)
const isAllocatingRaffle = ref(false)
const isMintModalActive = ref(false)
const raffleEmail = ref('')
const raffleId = ref()
const imageHash = ref('')
const availableNfts = reactive<{
  isLoading: boolean
  amount: number
  snList: string[]
}>({
  isLoading: true,
  amount: 0,
  snList: [],
})

// used by MintButton to determine if button is disabled and to determine label
// in case of drop.type is 'holder'
provide('hasNFTsAvailable', availableNfts.amount !== 0)

useCursorDropEvents([isTransactionLoading, isLoading])

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
        ownedItem: availableNfts.snList[0],
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
      isLoading.value = false
      isTransactionLoading.value = false
      return
    }
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

  if (isLoading.value || isTransactionLoading.value || isImageFetching.value) {
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

    isLoading.value = false

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

const checkAvailableNfts = async () => {
  availableNfts.isLoading = true
  const nftEntities = holderOfCollectionData.value?.nftEntities ?? []
  const nftIds = nftEntities.map((nft) => nft.sn)
  availableNfts.snList = []
  const claimed = await Promise.all(
    nftIds.map((sn) => {
      return isNftClaimed(
        sn,
        drop.value.holder_of as string,
        drop.value.collection,
      )
    }),
  )

  claimed.forEach((isClaimed, index) => {
    if (!isClaimed) {
      availableNfts.snList.push(nftIds[index])
    }
  })

  availableNfts.amount = claimed.filter((x) => !x).length
  availableNfts.isLoading = false
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

watch(
  [holderOfCollectionData, () => dropStore.runtimeMintCount],
  checkAvailableNfts,
  {
    immediate: true,
  },
)
watch(() => dropStore.runtimeMintCount, fetchDropStatus, {
  immediate: true,
})
</script>

<style scoped lang="scss">
.order-1 {
  order: 1;
}
</style>
