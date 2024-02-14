<template>
  <SigningModal
    :title="$t('mint.nft.minting')"
    :is-loading="isLoading"
    :status="status"
    @try-again="mintNft" />

  <NeoModalExtend v-model:active="isSuccessModalActive">
    <ModalBody :title="$i18n.t('success')" :scrollable="false">
      <CollectionDropModalSharedSuccessfulDrop
        v-if="mintedNft"
        :minted-nft="mintedNft"
        :can-list-nft="false" />
    </ModalBody>
  </NeoModalExtend>

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
import { NeoModalExtend } from '@kodadot1/brick'
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

const { client } = usePrefix()
const isLoading = ref(false)
const isImageFetching = ref(false)
const isAddFundModalActive = ref(false)
const isSuccessModalActive = ref(false)
const availableNfts = reactive({ isLoading: true, amount: 0 })
const raffleEmail = ref('')
const raffleId = ref()
const imageHash = ref('')

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

    const { apiInstance } = useApi()
    const api = await apiInstance.value

    initTransactionLoader()
    const cb = api.tx.nfts.mint

    const args = [
      collectionId.value,
      raffleId.value,
      accountId.value,
      {
        ownedItem: holderOfCollectionData.value?.nftEntities?.at(
          mintedAmountForCurrentUser.value,
        ).sn,
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
  } catch (error) {
    toast($i18n.t('drops.mintPerAddress'))
    isImageFetching.value = false
    $consola.error(error)
    throw error
  }
}

const checkAvailableNfts = async () => {
  availableNfts.isLoading = true
  const nftIds =
    collectionData.value?.collectionEntity.nfts.map((nft) => nft.sn) || []
  const claimed = await Promise.all(
    nftIds.map((sn) => isNftClaimed(sn, holderOfCollectionId.value as string)),
  )
  availableNfts.amount =
    maxMintLimitForCurrentUser.value - claimed.filter((x) => !x).length
  availableNfts.isLoading = false
}

const handleDropAddModalConfirm = () => {
  closeAddFundModal()
  fetchMultipleBalance([urlPrefix.value])
}

watch(holderOfCollectionData, checkAvailableNfts, { immediate: true })
</script>

<style scoped lang="scss">
.order-1 {
  order: 1;
}
</style>
