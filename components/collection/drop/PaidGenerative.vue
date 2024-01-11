<template>
  <CollectionDropGenerativeLayout
    :collection-id="collectionId"
    :description="description"
    :drop="drop"
    :user-minted-nft-id="userMintedNftId"
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
    v-model="isMintModalActive"
    :action="action"
    :to-mint-nft="toMintNft"
    :minted-nft="mintedNft"
    :minimum-funds="minimumFunds"
    :has-minimum-funds="hasMinimumFunds"
    :can-list-nft="canListMintedNft"
    :formatted-minimum-funds="formattedMinimumFunds"
    :formatted-existential-deposit="formattedExistentialDeposit"
    :token="token"
    :chain="chainName"
    @confirm="handleConfirmPaidMint"
    @close="closeMintModal"
    @list="handleList" />

  <ListingCartModal />
</template>

<script setup lang="ts">
import { createUnlockableMetadata } from '../unlockable/utils'
import { DropItem } from '@/params/types'
import { claimDropItem } from '@/services/waifu'
import { useDropMinimumFunds, useDropStatus } from '@/components/drops/useDrops'
import { fetchNft } from '@/components/items/ItemsGrid/useNftActions'
import unlockableCollectionById from '@/queries/subsquid/general/unlockableCollectionById.graphql'
import useGenerativeDropMint, {
  type UnlockableCollectionById,
} from '@/composables/drop/useGenerativeDropMint'
import useGenerativeDropDetails from '@/composables/drop/useGenerativeDropDetails'
import formatBalance from '@/utils/format/balance'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import { ActionlessInteraction } from '@/components/common/autoTeleport/utils'

export type ToMintNft = {
  name: string
  collectionName: string
  image: string
  price: string
  priceUSD: string
}

const props = withDefaults(
  defineProps<{
    drop: DropItem
  }>(),
  {
    drop: () => ({}) as DropItem,
  },
)

useMultipleBalance()
const { chainSymbol, decimals } = useChain()

const {
  hasMinimumFunds,
  formattedMinimumFunds,
  minimumFunds,
  formattedExistentialDeposit,
} = useDropMinimumFunds(props.drop)
const minimumFundsDescription = computed(() =>
  $i18n.t('mint.unlockable.minimumFundsDescription', [
    formattedMinimumFunds.value,
    chainName.value,
  ]),
)

const toMintNft = computed<ToMintNft>(() => ({
  image: sanitizeIpfsUrl(selectedImage.value),
  name: `${collectionName.value || ''} #${nftCount.value || ''}`,
  collectionName: collectionName.value || '',
  price: price.value as string,
  priceUSD: priceUSD.value,
}))

const minimumFundsProps = computed(() => ({
  amount: minimumFunds.value,
  description: minimumFundsDescription.value,
}))

const isWalletConnecting = ref(false)
const { currentAccountMintedToken, mintedDropCount, fetchDropStatus } =
  useDropStatus(props.drop.alias)
const instance = getCurrentInstance()
const mintNftSN = ref('0')
const { doAfterLogin } = useDoAfterlogin(instance)
const { $i18n, $consola } = useNuxtApp()
const { toast } = useToast()
const { accountId, isLogIn } = useAuth()

const { client } = usePrefix()
const isLoading = ref(false)
const isImageFetching = ref(false)
const isMintModalActive = ref(false)

const {
  defaultName,
  defaultImage,
  defaultMax,
  collectionId,
  chainName,
  disabledByBackend,
  token,
  price,
} = useGenerativeDropDetails(props.drop)

const { usd: priceUSD } = useAmount(price, decimals, chainSymbol)

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
  canListMintedNft,
  selectedImage,
  description,
  collectionName,
  nftCount,
  tryCapture,
  subscribeToMintedNft,
  listMintedNft,
} = useGenerativeDropMint({
  collectionData,
  defaultMax,
  currentAccountMintedToken,
  collectionId,
  mintedDropCount,
  defaultImage,
})

const mintedAmountForCurrentUser = computed(
  () => collectionData.value?.nftEntitiesConnection?.totalCount || 0, // todo: fetch from backend
)

const maxMintLimitForCurrentUser = computed(() => maxCount.value)

const mintButtonLabel = computed(() => {
  return isWalletConnecting.value
    ? $i18n.t('shoppingCart.wallet')
    : $i18n.t('mint.unlockable.claimPaidNft', [
        `${formatBalance(price.value || '', decimals.value, '')} ${
          chainSymbol.value
        }`,
      ])
})
const mintButtonDisabled = computed<boolean>(
  () =>
    !mintCountAvailable.value ||
    Boolean(disabledByBackend.value) ||
    (isLogIn.value &&
      Boolean(
        !selectedImage.value ||
          disabledByBackend.value ||
          maxMintLimitForCurrentUser.value <= mintedAmountForCurrentUser.value,
      )),
)

const mintButtonProps = computed(() => ({
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
        ownedItem: null,
        mintPrice: price.value,
      },
    ]

    mintNftSN.value = collectionRes.items
    howAboutToExecute(accountId.value, cb, args)
  } catch (e) {
    showNotification(`[MINT::ERR] ${e}`, notificationTypes.warn)
    $consola.error(e)
    isTransactionLoading.value = false
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
        image: imageHash,
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
      collection: result.collection,
      chain: result.chain,
      name: result.name,
      image: result.image,
      txHash: result.txHash.versionstamp,
      collectionName: collectionName.value as string,
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
