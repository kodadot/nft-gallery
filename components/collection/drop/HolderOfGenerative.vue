<template>
  <SigningModal
    :title="$t('mint.nft.minting')"
    :is-loading="isLoading"
    :status="status"
    @try-again="mintNft" />

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
import { createUnlockableMetadata } from '../unlockable/utils'
import { DropItem } from '@/params/types'
import { claimDropItem } from '@/services/waifu'
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
const { currentAccountMintedToken, fetchDropStatus } = useDropStatus(
  props.drop.alias,
)
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
const availableNfts = reactive({ isLoading: true, amount: 0 })

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
    const collectionRes = (
      await api.query.nfts.collection(collectionId.value)
    ).toJSON() as {
      items: string
    }

    initTransactionLoader()
    const cb = api.tx.nfts.mint

    const args = [
      collectionId.value,
      collectionRes.items,
      accountId.value,
      {
        ownedItem: holderOfCollectionData.value?.nftEntities?.at(
          mintedAmountForCurrentUser.value,
        ).sn,
        mintPrice: props.drop.price,
      },
    ]

    mintNftSN.value = collectionRes.items
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
    mintNft()
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
    isImageFetching.value = true

    const imageHash = await tryCapture()

    const hash = await createUnlockableMetadata(
      imageHash,
      description.value,
      collectionName.value || defaultName.value,
      'text/html',
      selectedImage.value,
    )

    isImageFetching.value = false

    const { result } = await claimDropItem(
      {
        account: accountId.value,
        metadata: hash,
        sn,
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
  } catch (error) {
    toast($i18n.t('drops.mintPerAddress'))
    isImageFetching.value = false
    throw error
  }
}

const checkAvailableNfts = async () => {
  availableNfts.isLoading = true
  const nftEntities = holderOfCollectionData.value?.nftEntities || []
  const nftIds = nftEntities.map((nft) => nft.sn)
  const claimed = await Promise.all(
    nftIds.map((sn) => isNftClaimed(sn, holderOfCollectionId.value as string)),
  )
  availableNfts.amount = claimed.filter((x) => !x).length
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
