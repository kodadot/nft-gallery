<template>
  <SigningModal
    :title="$t('mint.nft.minting')"
    :is-loading="isLoading"
    :status="status"
    :is-error="isTransactionError"
    @try-again="mintNft" />

  <NeoModal
    v-if="status === TransactionStatus.Finalized"
    :value="isSuccessModalActive"
    teleport>
    <ModalBody
      :title="$i18n.t('success')"
      @close="isSuccessModalActive = false">
      <CollectionDropModalSharedSuccessfulDrop
        v-if="mintedNft"
        :minted-nft="mintedNft"
        :can-list-nft="canListMintedNft"
        @list="handleList" />
    </ModalBody>
  </NeoModal>

  <CollectionDropGenerativeLayout
    :collection-id="collectionId"
    :description="description"
    :drop="drop"
    :holder-of-collection="holderOfCollection"
    :user-minted-nft-id="userMintedNftId"
    :user-minted-count="mintedAmountForCurrentUser"
    :is-wallet-connecting="isWalletConnecting"
    :is-image-fetching="isImageFetching"
    :is-loading="isLoading"
    :minimum-funds="minimumFundsProps"
    :max-count="maxCount"
    :minted-count="mintedCount"
    :mint-count-available="mintCountAvailable"
    :mint-button="mintButtonProps"
    :handle-select-image="handleSelectImage"
    :handle-submit-mint="handleSubmitMint" />

  <CollectionDropAddFundsModal
    v-model="isAddFundModalActive"
    :minimum-funds="minimumFunds"
    :formatted-minimum-funds="formattedMinimumFunds"
    :token="token"
    :chain="chainName"
    @close="closeAddFundModal"
    @confirm="handleDropAddModalConfirm" />
</template>

<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import { createUnlockableMetadata } from '../unlockable/utils'
import { DropItem } from '@/params/types'
import {
  useDropMinimumFunds,
  useDropStatus,
  useHolderOfCollectionDrop,
} from '@/components/drops/useDrops'
import { fetchNft } from '@/components/items/ItemsGrid/useNftActions'
import holderOfCollectionById from '@/queries/subsquid/general/holderOfCollectionById.graphql'
import unlockableCollectionById from '@/queries/subsquid/general/unlockableCollectionById.graphql'
import useGenerativeDropMint, {
  type UnlockableCollectionById,
} from '@/composables/drop/useGenerativeDropMint'
import useGenerativeDropDetails from '@/composables/drop/useGenerativeDropDetails'
import { allocateClaim, allocateCollection } from '@/services/fxart'
import useCursorDropEvents from '@/composables/party/useCursorDropEvents'

import {
  HolderOfCollectionProp,
  MinimumFundsProp,
  MintButtonProp,
} from './types'

const props = withDefaults(
  defineProps<{
    drop: DropItem
  }>(),
  {
    drop: () => ({}) as DropItem,
  },
)

const { fetchMultipleBalance, hasCurrentChainBalance } = useMultipleBalance()

const { hasMinimumFunds, formattedMinimumFunds, minimumFunds } =
  useDropMinimumFunds(props.drop)
const minimumFundsDescription = computed(() =>
  $i18n.t('drops.requirements.minimumFunds', [
    formattedMinimumFunds.value,
    chainName.value,
  ]),
)

const minimumFundsProps = computed<MinimumFundsProp>(() => ({
  amount: minimumFunds.value,
  description: minimumFundsDescription.value,
  hasAmount: hasMinimumFunds.value,
  isLoading: !hasCurrentChainBalance.value,
}))

const isWalletConnecting = ref(false)
const { currentAccountMintedToken, mintedDropCount, fetchDropStatus } =
  useDropStatus(props.drop.alias)
const { isNftClaimed } = useHolderOfCollectionDrop()
const instance = getCurrentInstance()
const mintNftSN = ref('0')
const { doAfterLogin } = useDoAfterlogin(instance)
const { $i18n, $consola } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { toast } = useToast()
const { accountId, isLogIn } = useAuth()
const { chainSymbol, withoutDecimals } = useChain()
const runtimeMintedCount = ref(0)

const { client } = usePrefix()
const isLoading = ref(false)
const isImageFetching = ref(false)
const isAddFundModalActive = ref(false)
const isSuccessModalActive = ref(false)
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

const {
  defaultName,
  defaultImage,
  defaultMax,
  collectionId,
  chainName,
  disabledByBackend,
  token,
  holderOfCollectionId,
} = useGenerativeDropDetails(props.drop)

const {
  howAboutToExecute,
  isLoading: isTransactionLoading,
  initTransactionLoader,
  status,
  isError: isTransactionError,
} = useMetaTransaction()

const handleSelectImage = (image: string) => {
  selectedImage.value = image
}

const { data: collectionData } = await useAsyncData(
  'unlockableCollectionData',
  async () =>
    await useAsyncQuery<UnlockableCollectionById>({
      clientId: client.value,
      query: unlockableCollectionById,
      variables: {
        id: collectionId.value,
        search: { currentOwner_eq: accountId.value },
      },
    }).then((res) => res.data.value),
  {
    watch: [accountId],
  },
)

const {
  maxCount,
  mintedNft,
  mintedNftWithMetadata,
  userMintedNftId,
  mintedCount,
  mintCountAvailable,
  mintedAmountForCurrentUser,
  selectedImage,
  description,
  collectionName,
  tryCapture,
  subscribeToMintedNft,
  canListMintedNft,
  listMintedNft,
} = useGenerativeDropMint({
  collectionData,
  defaultMax,
  currentAccountMintedToken,
  collectionId,
  mintedDropCount,
  defaultImage,
})

useCursorDropEvents(
  props.drop.alias,
  [isTransactionLoading, isLoading],
  mintedNft,
)

const { data: holderOfCollectionData } = await useAsyncData(
  'holderOfCollectionData',
  async () =>
    await useAsyncQuery({
      clientId: client.value,
      query: holderOfCollectionById,
      variables: {
        id: holderOfCollectionId.value,
        account: accountId.value,
      },
    }).then((res) => res.data.value),
  {
    watch: [accountId, runtimeMintedCount],
  },
)

const maxMintLimitForCurrentUser = computed(
  () => holderOfCollectionData.value?.nftEntitiesConnection?.totalCount || 0,
)

const isHolderOfTargetCollection = computed(
  () => maxMintLimitForCurrentUser.value > 0,
)

const hasAvailableNfts = computed(() => availableNfts.amount !== 0)

const holderOfCollection = computed<HolderOfCollectionProp>(() => ({
  id: holderOfCollectionId.value as string,
  isHolder: isHolderOfTargetCollection.value,
  hasAvailable: hasAvailableNfts.value,
  isLoading: availableNfts.isLoading,
  amount: {
    total: maxMintLimitForCurrentUser.value,
    available: availableNfts.amount,
  },
}))

const mintButtonLabel = computed(() => {
  return isWalletConnecting.value
    ? $i18n.t('shoppingCart.wallet')
    : isLogIn.value
      ? isHolderOfTargetCollection.value &&
        maxMintLimitForCurrentUser.value > mintedAmountForCurrentUser.value &&
        hasMinimumFunds.value &&
        hasAvailableNfts.value
        ? $i18n.t('drops.mintForPaid', [
            `${withoutDecimals({ value: Number(props.drop?.price), prefix: props.drop?.chain })} ${chainSymbol.value}`,
          ])
        : $i18n.t('mint.unlockable.notEligibility')
      : $i18n.t('mint.unlockable.checkEligibility')
})
const mintButtonDisabled = computed<boolean>(
  () =>
    !mintCountAvailable.value ||
    Boolean(disabledByBackend.value) ||
    (isLogIn.value &&
      Boolean(
        !selectedImage.value ||
          !isHolderOfTargetCollection.value ||
          maxMintLimitForCurrentUser.value <=
            mintedAmountForCurrentUser.value ||
          !hasMinimumFunds.value ||
          !hasAvailableNfts.value,
      )),
)

const mintButtonProps = computed<MintButtonProp>(() => ({
  disabled: mintButtonDisabled.value,
  label: mintButtonLabel.value,
}))

const mintNft = async () => {
  try {
    isTransactionError.value = false
    const { apiInstance } = useApi()
    const api = await apiInstance.value

    initTransactionLoader()
    const cb = api.tx.nfts.mint

    const args = [
      collectionId.value,
      raffleId.value,
      accountId.value,
      {
        ownedItem: availableNfts.snList[0],
        mintPrice: props.drop.price,
      },
    ]

    mintNftSN.value = raffleId.value
    howAboutToExecute(accountId.value, cb, args, ({ txHash }) => {
      if (mintedNft.value) {
        mintedNft.value.txHash = txHash
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

  const imageUrl = new URL(selectedImage.value)
  imageHash.value = imageUrl.searchParams.get('hash') || ''
  const imageCid = await tryCapture()
  const metadata = await createUnlockableMetadata(
    imageCid,
    description.value || '',
    collectionName.value || defaultName.value,
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

  const response = await allocateCollection(body, props.drop.id)
  raffleId.value = response.result.id

  if (
    currentAccountMintedToken.value?.id &&
    !currentAccountMintedToken.value?.claimed
  ) {
    body.email = currentAccountMintedToken.value?.email || body.email
    body.hash = currentAccountMintedToken.value?.hash || body.hash
    body.image = currentAccountMintedToken.value?.image || body.image
    body.metadata = currentAccountMintedToken.value?.metadata || body.metadata
  }

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

  if (hasMinimumFunds.value) {
    // skip raffle modal at the moment. generate random email instead
    // isRaffleModalActive.value = true
    const crypto = window.crypto
    const array = new Uint32Array(1)
    raffleEmail.value = `${crypto.getRandomValues(array).toString()}@example.com`

    await allocateRaffle()
    await mintNft()
  } else {
    openAddFundModal()
  }
}

const openAddFundModal = () => {
  isAddFundModalActive.value = true
}

const closeAddFundModal = () => {
  isAddFundModalActive.value = false
}

const submitMint = async (sn: string) => {
  try {
    const { result } = await allocateClaim(
      {
        sn: parseInt(sn),
        txHash: imageHash.value,
        address: accountId.value,
      },
      props.drop.id,
    )

    await fetchDropStatus()

    const id = `${collectionId.value}-${result.sn}`

    subscribeToMintedNft(id, async () => {
      mintedNftWithMetadata.value = await fetchNft(id)
    })

    isLoading.value = false

    mintedNft.value = {
      ...result,
      id,
      name: result.name,
      collectionName: collectionName.value,
    }

    isSuccessModalActive.value = true
    runtimeMintedCount.value += 1
  } catch (error) {
    toast($i18n.t('drops.mintPerAddress'))
    isImageFetching.value = false
    $consola.error(error)
    throw error
  }
}

const checkAvailableNfts = async () => {
  availableNfts.isLoading = true
  const nftEntities = holderOfCollectionData.value?.nftEntities || []
  const nftIds = nftEntities.map((nft) => nft.sn)
  availableNfts.snList = []
  const claimed = await Promise.all(
    nftIds.map((sn) => {
      return isNftClaimed(
        sn,
        holderOfCollectionId.value as string,
        collectionId.value,
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

const handleDropAddModalConfirm = () => {
  closeAddFundModal()
  fetchMultipleBalance([urlPrefix.value])
}

const handleList = () => {
  isSuccessModalActive.value = false
  listMintedNft()
}

watch([holderOfCollectionData, runtimeMintedCount], checkAvailableNfts, {
  immediate: true,
})
watch(runtimeMintedCount, fetchDropStatus, {
  immediate: true,
})
</script>

<style scoped lang="scss">
.order-1 {
  order: 1;
}
</style>
