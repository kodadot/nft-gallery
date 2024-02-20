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

  <CollectionDropModalPaidMint
    v-if="isHolderOfWithPaidMint"
    v-model="isMintModalActive"
    :action="action"
    :to-mint-nft="toMintNft"
    :minted-nft="mintedNft"
    :minimum-funds="minimumFunds"
    :is-allocating-raffle="isAllocatingRaffle"
    :has-minimum-funds="hasMinimumFunds"
    :can-list-nft="canListMintedNft"
    :formatted-minimum-funds="formattedMinimumFunds"
    :formatted-existential-deposit="formattedExistentialDeposit"
    :token="token"
    :chain="chainName"
    hide-minimum-funds-warning
    @confirm="mintNft"
    @close="closeMintModal"
    @list="handleList" />

  <CollectionDropAddFundsModal
    v-if="isOnlyHolderOfMint"
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

import type {
  HolderOfCollectionProp,
  MinimumFundsProp,
  MintButtonProp,
  ToMintNft,
} from './types'
import { ActionlessInteraction } from '@/components/common/autoTeleport/utils'
import { AutoTeleportAction } from '@/composables/autoTeleport/types'

const props = withDefaults(
  defineProps<{
    drop: DropItem
  }>(),
  {
    drop: () => ({}) as DropItem,
  },
)

const { fetchMultipleBalance, hasCurrentChainBalance } = useMultipleBalance()

const {
  hasMinimumFunds,
  formattedMinimumFunds,
  minimumFunds,
  formattedExistentialDeposit,
} = useDropMinimumFunds(props.drop)
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
const { chainSymbol, withoutDecimals, decimals } = useChain()

const { client } = usePrefix()
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

const {
  defaultName,
  defaultImage,
  defaultMax,
  collectionId,
  chainName,
  disabledByBackend,
  token,
  holderOfCollectionId,
  price,
} = useGenerativeDropDetails(props.drop)

const { usd: priceUSD } = useAmount(price, decimals, chainSymbol)

const isHolderOfWithPaidMint = computed(() => Boolean(price.value))
const isOnlyHolderOfMint = computed(() => !isHolderOfWithPaidMint.value)

const {
  howAboutToExecute,
  isLoading: isTransactionLoading,
  initTransactionLoader,
  status,
  isError: isTransactionError,
} = useMetaTransaction()

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
  price: price.value as string,
  priceUSD: priceUSD.value,
}))

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
    watch: [accountId],
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
    isLoading.value = true
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
    howAboutToExecute(accountId.value, cb, args)
  } catch (e) {
    showNotification(`[MINT::ERR] ${e}`, notificationTypes.warn)
    $consola.error(e)
    isTransactionLoading.value = false
    isLoading.value = false
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

  // claim previous ID first. else, allocate new raffle
  if (
    currentAccountMintedToken.value?.id &&
    !currentAccountMintedToken.value?.claimed
  ) {
    body.email = currentAccountMintedToken.value?.email || body.email
    body.hash = currentAccountMintedToken.value?.hash || body.hash
    body.image = currentAccountMintedToken.value?.image || body.image
    body.metadata = currentAccountMintedToken.value?.metadata || body.metadata
    raffleId.value = currentAccountMintedToken.value?.id || mintedCount.value
  } else {
    const response = await allocateCollection(body, props.drop.id)
    raffleId.value = response.result.id
  }

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

  // use paid modal if it's holder of + price
  if (isHolderOfWithPaidMint.value) {
    isMintModalActive.value = true
    await prepareRaffle()
    return
  }

  if (hasMinimumFunds.value) {
    mint()
  } else {
    openAddFundModal()
  }
}

const prepareRaffle = async () => {
  // skip raffle modal at the moment. generate random email instead
  // isRaffleModalActive.value = true
  const crypto = window.crypto
  const array = new Uint32Array(1)
  raffleEmail.value = `${crypto.getRandomValues(array).toString()}@example.com`

  await allocateRaffle()
}

const mint = async () => {
  await prepareRaffle()
  await mintNft()
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

const closeMintModal = () => {
  isMintModalActive.value = false
}

const handleDropAddModalConfirm = () => {
  closeAddFundModal()
  fetchMultipleBalance([urlPrefix.value])
}

const handleList = () => {
  isSuccessModalActive.value = false
  listMintedNft()
}

watch(holderOfCollectionData, checkAvailableNfts, { immediate: true })
</script>

<style scoped lang="scss">
.order-1 {
  order: 1;
}
</style>
