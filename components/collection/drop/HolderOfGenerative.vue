<template>
  <SigningModal
    v-if="isOnlyHolderOfMint"
    :title="$t('mint.nft.minting')"
    :is-loading="isLoading"
    :status="status"
    :is-error="isTransactionError"
    @try-again="mint" />

  <NeoModal
    v-if="isOnlyHolderOfMint && status === TransactionStatus.Finalized"
    :value="isSuccessModalActive"
    teleport>
    <ModalBody
      :title="$i18n.t('success')"
      @close="isSuccessModalActive = false">
      <CollectionDropModalSharedSuccessfulDrop
        v-if="mintedNft"
        :minting-session="mintingSession"
        :can-list-nft="canListMintedNft"
        @list="handleList" />
    </ModalBody>
  </NeoModal>

  <CollectionDropGenerativeLayout
    v-model:amount-to-mint="amountToMint"
    :available-amount-to-mint="availableNfts.amount"
    :collection-id="collectionId"
    :description="description"
    :drop="drop"
    :holder-of-collection="holderOfCollection"
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
    :to-mint-nfts="toMintNfts"
    :minting-session="mintingSession"
    :amount-to-mint="amountToMint"
    :ready-to-mint="canMint"
    :minimum-funds="minimumFunds"
    :has-minimum-funds="hasMinimumFunds"
    :can-list-nft="canListMintedNfts"
    :formatted-minimum-funds="formattedMinimumFunds"
    :formatted-existential-deposit="formattedExistentialDeposit"
    :token="token"
    :chain="chainName"
    hide-minimum-funds-warning
    @confirm="mint"
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
import { DropItem } from '@/params/types'
import {
  useDropMinimumFunds,
  useDropStatus,
  useHolderOfCollectionDrop,
} from '@/components/drops/useDrops'
import holderOfCollectionById from '@/queries/subsquid/general/holderOfCollectionById.graphql'
import unlockableCollectionById from '@/queries/subsquid/general/unlockableCollectionById.graphql'
import useGenerativeDropMint, {
  type UnlockableCollectionById,
} from '@/composables/drop/useGenerativeDropMint'
import useGenerativeDropDetails from '@/composables/drop/useGenerativeDropDetails'
import useCursorDropEvents from '@/composables/party/useCursorDropEvents'

import type {
  HolderOfCollectionProp,
  MinimumFundsProp,
  MintButtonProp,
  MintingSession,
} from './types'
import { ActionlessInteraction } from '@/components/common/autoTeleport/utils'
import { AutoTeleportAction } from '@/composables/autoTeleport/types'
import { GenerativePreviewItem } from '~/composables/drop/useGenerativePreview'
import useDropMassMint from '@/composables/drop/useDropMassMint'

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
const { mintedDropCount, fetchDropStatus } = useDropStatus(props.drop.alias)
const { isNftClaimed } = useHolderOfCollectionDrop()
const instance = getCurrentInstance()
const { doAfterLogin } = useDoAfterlogin(instance)
const { $i18n, $consola } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { toast } = useToast()
const { accountId, isLogIn } = useAuth()
const { chainSymbol, withoutDecimals, decimals } = useChain()
const runtimeMintedCount = ref(0)

const { client } = usePrefix()
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

const {
  defaultName,
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
  mintedNft,
  mintedCount,
  mintCountAvailable,
  mintedAmountForCurrentUser,
  description,
  collectionName,
  canListMintedNft,
} = useGenerativeDropMint({
  collectionData,
  defaultMax,
  mintedDropCount,
})

useCursorDropEvents(
  props.drop.alias,
  [isTransactionLoading, isLoading],
  computed(() => mintingSession.value.items?.[0]),
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
      : $i18n.t('general.connect_wallet')
})
const mintButtonDisabled = computed<boolean>(
  () =>
    !mintCountAvailable.value ||
    Boolean(disabledByBackend.value) ||
    (isLogIn.value &&
      Boolean(
        !previewItem.value?.image ||
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

const mintSubmit = async (session: Ref<MintingSession>) => {
  try {
    isTransactionError.value = false
    session.value.txHash = undefined

    const { apiInstance } = useApi()
    const api = await apiInstance.value

    initTransactionLoader()

    const cb = api.tx.utility.batchAll
    const args = allocatedNfts.value.map((allocatedNft, index) =>
      api.tx.nfts.mint(collectionId.value, allocatedNft.id, accountId.value, {
        ownedItem: availableNfts.snList[index],
        mintPrice: props.drop.price,
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
    generate()
    return
  }

  if (hasMinimumFunds.value) {
    await mintGenerated(previewItem.value)
    await mint()
  } else {
    openAddFundModal()
  }
}

const generate = () => {
  massGenerate({
    amount: amountToMint.value,
    minted: mintedAmountForCurrentUser.value,
    withPreviewItems: [previewItem.value].filter(
      Boolean,
    ) as GenerativePreviewItem[],
  })
}

const openAddFundModal = () => {
  isAddFundModalActive.value = true
}

const closeAddFundModal = () => {
  isAddFundModalActive.value = false
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

    isSuccessModalActive.value = true
    runtimeMintedCount.value += 1
  } catch (error) {
    toast($i18n.t('drops.mintPerAddress'))
    isImageFetching.value = false
    $consola.error(error)
    throw error
  }
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
  mint,
  mintGenerated,
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
  isTransactionLoading,
  submitMints,
  isError: isTransactionError,
  mintSubmit,
})

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
  listMintedNFts()
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
