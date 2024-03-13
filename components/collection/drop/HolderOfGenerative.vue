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
        :minting-session="mintingSession"
        :can-list-nfts="canListMintedNft"
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
  useHolderOfCollectionDrop,
} from '@/components/drops/useDrops'
import holderOfCollectionById from '@/queries/subsquid/general/holderOfCollectionById.graphql'
import useGenerativeDropMint, {
  useCollectionEntity,
} from '@/composables/drop/useGenerativeDropMint'
import useCursorDropEvents from '@/composables/party/useCursorDropEvents'

import type { HolderOfCollectionProp } from './types'
import { ActionlessInteraction } from '@/components/common/autoTeleport/utils'
import { AutoTeleportAction } from '@/composables/autoTeleport/types'
import { TransactionStatus } from '@/composables/useTransactionStatus'
import useDropMassMint from '@/composables/drop/massmint/useDropMassMint'
import useDropMassMintListing from '@/composables/drop/massmint/useDropMassMintListing'

const { $i18n, $consola } = useNuxtApp()
const { urlPrefix, client } = usePrefix()
const { toast } = useToast()
const { accountId, isLogIn } = useAuth()
const dropStore = useDropStore()
const { mintingSession, toMintNFTs, allocatedNFTs, runtimeMintCount } =
  storeToRefs(dropStore)
const { openListingCartModal } = useListingCartModal()

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
const { claimedNft, canListMintedNft } = useGenerativeDropMint()
const { collectionName } = useCollectionEntity()

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
    watch: [accountId, runtimeMintCount],
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
const isLoading = ref(false)
const isImageFetching = ref(false)
const isAddFundModalActive = ref(false)
const isSuccessModalActive = ref(false)
const isMintModalActive = ref(false)

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
provide('amountAvailableNFTs', availableNfts.amount)

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
          ownedItem: availableNfts.snList[index],
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

  if (isLoading.value || isTransactionLoading.value || isImageFetching.value) {
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
      collectionName: collectionName.value as string,
    }))

    mintingSession.value.items = mintedNfts

    subscribeForNftsWithMetadata(mintedNfts.map((item) => item.id))

    await fetchDropStatus()

    isLoading.value = false
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
  isLoading.value = false
  clearMassMint()
}

const { massGenerate, allocateGenerated, submitMint, clearMassMint } =
  useDropMassMint({ isLoading })

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
    isLoading.value = false
  },
  // ensure txHash is set, it's needed when calling /do/:id
  waitFor: [computed(() => mintingSession.value.txHash)],
})

watch([holderOfCollectionData, runtimeMintCount], checkAvailableNfts, {
  immediate: true,
})
watch(runtimeMintCount, fetchDropStatus, {
  immediate: true,
})
</script>

<style scoped lang="scss">
.order-1 {
  order: 1;
}
</style>
