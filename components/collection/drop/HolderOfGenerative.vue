<template>
  <Loader v-model="isLoading" :status="status" />

  <CollectionDropGenerativeLayout
    :collection-id="collectionId"
    :description="description"
    :drop="drop"
    :holder-of-collection="holderOfCollection"
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
import { DropItem } from '@/params/types'
import { useDropMinimumFunds, useDropStatus } from '@/components/drops/useDrops'
import unlockableCollectionById from '@/queries/subsquid/general/unlockableCollectionById.graphql'
import Loader from '@/components/shared/Loader.vue'
import useGenerativeDropMint, {
  type UnlockableCollectionById,
} from '@/composables/drop/useGenerativeDropMint'
import useGenerativeDropDetails from '@/composables/drop/useGenerativeDropDetails'
import useHolderOfCollectionDropMint from '@/composables/drop/useHolderOfCollectionDropMint'

const props = withDefaults(
  defineProps<{
    drop: DropItem
  }>(),
  {
    drop: () => ({}) as DropItem,
  },
)

const { fetchMultipleBalance } = useMultipleBalance()

const { hasMinimumFunds, formattedMinimumFunds, minimumFunds } =
  useDropMinimumFunds(props.drop)
const minimumFundsDescription = computed(() =>
  $i18n.t('mint.unlockable.holderOfCollectionMinimumFundsDescription', [
    formattedMinimumFunds.value,
    chainName.value,
  ]),
)

const minimumFundsProps = computed(() => ({
  amount: minimumFunds.value,
  description: minimumFundsDescription.value,
  hasAmount: hasMinimumFunds.value,
}))

const { currentAccountMintedToken, mintedDropCount, fetchDropStatus } =
  useDropStatus(props.drop.alias)
const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { accountId, isLogIn } = useAuth()
const { client } = usePrefix()

const isAddFundModalActive = ref(false)

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

const { totalItemDeposit, chainSymbol: depositChainSymbol } = useDeposit(
  computed(() => props.drop.chain),
)

const depositAmount = computed(() =>
  (Number(totalItemDeposit.value) - 0.1).toFixed(4),
)

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
  collectionName,
  description,
  imageDataPayload,
  selectedImage,
} = useGenerativeDropMint({
  collectionData,
  defaultMax,
  mintedDropCount,
})

const {
  isHolderOfTargetCollection,
  maxMintLimitForCurrentUser,
  hasAvailableNfts,
  holderOfCollection,
  status,
  isLoading,
  isImageFetching,
  isWalletConnecting,
  userMintedNftId,
  preSubmitMint,
  mintNft,
} = useHolderOfCollectionDropMint({
  dropAlias: props.drop.id,
  holderOfCollectionId,
  defaultImage,
  defaultName,
  collectionId,
  currentAccountMintedToken,
  description,
  mintedAmountForCurrentUser,
  collectionName,
  imageDataPayload,
  selectedImage,
  fetchDropStatus,
})

const mintButtonLabel = computed(() => {
  return isWalletConnecting.value
    ? $i18n.t('shoppingCart.wallet')
    : isLogIn.value
      ? isHolderOfTargetCollection.value &&
        maxMintLimitForCurrentUser.value > mintedAmountForCurrentUser.value &&
        hasMinimumFunds.value &&
        hasAvailableNfts.value
        ? $i18n.t('mint.unlockable.claimPaidNft', [
            `${depositAmount.value} ${depositChainSymbol.value}`,
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

const mintButtonProps = computed(() => ({
  disabled: mintButtonDisabled.value,
  label: mintButtonLabel.value,
}))

const handleSelectImage = (image: string) => {
  selectedImage.value = image
}

const handleSubmitMint = async () => {
  if (!preSubmitMint()) {
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

const handleDropAddModalConfirm = () => {
  closeAddFundModal()
  fetchMultipleBalance([urlPrefix.value])
}
</script>

<style scoped lang="scss">
.order-1 {
  order: 1;
}
</style>
