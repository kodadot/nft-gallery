<template>
  <CollectionDropGenerativeLayout
    v-model:amount-to-mint="amountToMint"
    :available-amount-to-mint="availableAmountToMint"
    :collection-id="collectionId"
    :description="description"
    :drop="drop"
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
    :to-mint-nfts="toMintNfts"
    :minting-session="mintingSession"
    :minimum-funds="minimumFunds"
    :has-minimum-funds="hasMinimumFunds"
    :can-list-nft="canListMintedNfts"
    :formatted-minimum-funds="formattedMinimumFunds"
    :formatted-existential-deposit="formattedExistentialDeposit"
    :amount-to-mint="amountToMint"
    :ready-to-mint="canMint"
    :token="token"
    :chain="chainName"
    @confirm="handleConfirmPaidMint"
    @close="closeMintModal"
    @list="handleList" />
  <ListingCartModal />
</template>

<script setup lang="ts">
import { NeoButton, NeoInput, NeoModalExtend } from '@kodadot1/brick'
import { DropItem } from '@/params/types'
import { useDropMinimumFunds, useDropStatus } from '@/components/drops/useDrops'
import unlockableCollectionById from '@/queries/subsquid/general/unlockableCollectionById.graphql'
import useGenerativeDropMint, {
  type UnlockableCollectionById,
} from '@/composables/drop/useGenerativeDropMint'
import useGenerativeDropDetails from '@/composables/drop/useGenerativeDropDetails'
import { formatAmountWithRound } from '@/utils/format/balance'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import { ActionlessInteraction } from '@/components/common/autoTeleport/utils'
import useCursorDropEvents from '@/composables/party/useCursorDropEvents'
import useDropMassMint from '@/composables/drop/useDropMassMint'
import { GenerativePreviewItem } from '@/composables/drop/useGenerativePreview'
import { MintingSession } from './types'

const props = withDefaults(
  defineProps<{
    drop: DropItem
  }>(),
  {
    drop: () => ({}) as DropItem,
  },
)

const { chainSymbol, decimals } = useChain()
const { hasCurrentChainBalance, currentChainBalance } = useMultipleBalance()

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

const minimumFundsProps = computed(() => ({
  amount: minimumFunds.value,
  description: minimumFundsDescription.value,
  hasAmount: hasMinimumFunds.value,
  isLoading: !hasCurrentChainBalance.value,
}))

const isWalletConnecting = ref(false)
const { mintedDropCount, fetchDropStatus } = useDropStatus(props.drop.alias)
const instance = getCurrentInstance()
const { doAfterLogin } = useDoAfterlogin(instance)
const { $i18n, $consola } = useNuxtApp()
const { toast } = useToast()
const { accountId, isLogIn } = useAuth()

const { client } = usePrefix()
const isLoading = ref(false)
const isImageFetching = ref(false)
const isMintModalActive = ref(false)
const isRaffleModalActive = ref(false)

const {
  defaultName,
  defaultMax,
  collectionId,
  chainName,
  disabledByBackend,
  token,
  price,
} = useGenerativeDropDetails(props.drop)

const {
  howAboutToExecute,
  isLoading: isTransactionLoading,
  initTransactionLoader,
  isError: isTransactionError,
  status,
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

const handleSelectImage = (item: GenerativePreviewItem) => {
  previewItem.value = item
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
  mintedCount,
  mintCountAvailable,
  mintedAmountForCurrentUser,
  description,
  collectionName,
} = useGenerativeDropMint({
  collectionData,
  defaultMax,
  mintedDropCount,
})

const totalPrice = computed(() => Number(price.value) * amountToMint.value)

const { usd: priceUSD } = useAmount(totalPrice, decimals, chainSymbol)

useCursorDropEvents(
  props.drop.alias,
  [isTransactionLoading, isLoading],
  computed(() => mintingSession.value.items?.[0]),
)

const maxMintLimitForCurrentUser = computed(() => maxCount.value)

const mintButtonLabel = computed(() => {
  if (!isLogIn.value) {
    return $i18n.t('general.connect_wallet')
  }

  if (isLoading.value) {
    return canMint.value
      ? `${$i18n.t('mint.minting')}...`
      : $i18n.t('loader.ipfs')
  }

  return isWalletConnecting.value
    ? $i18n.t('shoppingCart.wallet')
    : $i18n.t('drops.mintForPaid', [
        `${formatAmountWithRound(totalPrice.value || '', decimals.value)} ${
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
        !previewItem.value?.image ||
          disabledByBackend.value ||
          maxMintLimitForCurrentUser.value <= mintedAmountForCurrentUser.value,
      )),
)

const availableAmountToMint = computed(() =>
  currentChainBalance.value
    ? Math.floor(Number(currentChainBalance.value) / Number(price.value))
    : 1,
)

const mintButtonProps = computed(() => ({
  disabled: mintButtonDisabled.value,
  label: mintButtonLabel.value,
}))

const mintSubmit = async (session: Ref<MintingSession>) => {
  try {
    isLoading.value = true
    session.value.txHash = undefined

    const { apiInstance } = useApi()
    const api = await apiInstance.value

    initTransactionLoader()

    const cb = api.tx.utility.batchAll
    const args = allocatedNfts.value.map((allocatedNft) =>
      api.tx.nfts.mint(collectionId.value, allocatedNft.id, accountId.value, {
        ownedItem: null,
        mintPrice: price.value,
      }),
    )

    howAboutToExecute(accountId.value, cb, [args], {
      onResult: ({ txHash }) => {
        session.value.txHash = txHash
      },
    })
  } catch (e) {
    showNotification(`[MINT::ERR] ${e}`, notificationTypes.warn)
    $consola.error(e)
    isTransactionLoading.value = false
    isLoading.value = false
  }
}

const clearWalletConnecting = () => {
  isWalletConnecting.value = false
}

const allocateRaffle = async () => {
  await allocateRaffleMode(raffleEmail.value, previewItem.value)
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
  openMintModal()
  massGenerate({
    amount: amountToMint.value,
    minted: mintedAmountForCurrentUser.value,
    withPreviewItems: [previewItem.value].filter(
      Boolean,
    ) as GenerativePreviewItem[],
  })
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

const submitMints = async (session: Ref<MintingSession>) => {
  try {
    const response = await Promise.all(toMintNfts.value.map(submitMint))

    const mintedNfts = response.map((item) => ({
      id: `${collectionId.value}-${item.sn}`,
      collection: item.collection,
      chain: item.chain,
      name: item.name,
      image: item.image as string,
      collectionName: collectionName.value as string,
    }))

    session.value.items = mintedNfts

    subscribeForNftsWithMetadata(mintedNfts.map((item) => item.id))

    await fetchDropStatus()

    isLoading.value = false
  } catch (error) {
    toast($i18n.t('drops.mintPerAddress'))
    isImageFetching.value = false
    closeMintModal()
    throw error
  }
}

const handleList = () => {
  closeMintModal()
  listMintedNFts()
}

const handleConfirmPaidMint = () => {
  mint()
}

const stopMint = () => {
  isMintModalActive.value = false
  isLoading.value = false
}

const {
  toMintNfts,
  amountToMint,
  canMint,
  allocatedNfts,
  mintingSession,
  canListMintedNfts,
  previewItem,
  subscribeForNftsWithMetadata,
  massGenerate,
  listMintedNFts,
  submitMint,
  allocateRaffleMode,
  raffleEmail,
  mint,
} = useDropMassMint({
  drop: props.drop,
  collectionName,
  defaultName,
  description,
  price,
  priceUSD,
  isLoading,
  mintedCount,
  status,
  submitMints,
  isError: isTransactionError,
  isTransactionLoading: isTransactionLoading,
  mintSubmit,
})

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
