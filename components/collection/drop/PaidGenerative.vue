<template>
  <CollectionDropGenerativeLayout
    :collection-id="collectionId"
    :description="description"
    :drop="drop"
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
import { NeoButton, NeoInput, NeoModalExtend } from '@kodadot1/brick'
import { createUnlockableMetadata } from '../unlockable/utils'
import { DropItem } from '@/params/types'
import { allocateClaim, allocateCollection } from '@/services/fxart'
import { useDropMinimumFunds, useDropStatus } from '@/components/drops/useDrops'
import { fetchNft } from '@/components/items/ItemsGrid/useNftActions'
import unlockableCollectionById from '@/queries/subsquid/general/unlockableCollectionById.graphql'
import useGenerativeDropMint, {
  type UnlockableCollectionById,
} from '@/composables/drop/useGenerativeDropMint'
import useGenerativeDropDetails from '@/composables/drop/useGenerativeDropDetails'
import { formatAmountWithRound } from '@/utils/format/balance'
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
const { hasCurrentChainBalance } = useMultipleBalance()
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
  hasAmount: hasMinimumFunds.value,
  isLoading: !hasCurrentChainBalance.value,
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
const isRaffleModalActive = ref(false)
const raffleEmail = ref('')
const raffleId = ref('')
const imageHash = ref('')

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
  mintedAmountForCurrentUser,
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

const maxMintLimitForCurrentUser = computed(() => maxCount.value)

const mintButtonLabel = computed(() => {
  if (isLoading.value) {
    return $i18n.t('loader.ipfs')
  }

  return isWalletConnecting.value
    ? $i18n.t('shoppingCart.wallet')
    : $i18n.t('drops.mintForPaid', [
        `${formatAmountWithRound(price.value || '', decimals.value)} ${
          chainSymbol.value
        }`,
      ])
})
const mintButtonDisabled = computed<boolean>(
  () =>
    isLoading.value ||
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

    initTransactionLoader()
    const cb = api.tx.nfts.mint
    const args = [
      collectionId.value,
      raffleId.value,
      accountId.value,
      {
        ownedItem: null,
        mintPrice: price.value,
      },
    ]

    mintNftSN.value = raffleId.value
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
  raffleEmail.value = `${Math.random().toString(36).substring(7)}@example.com`
  await allocateRaffle()
  openMintModal()
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
