<template>
  <Loader v-model="isLoading" :status="status" />

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
import Loader from '@/components/shared/Loader.vue'
import { type UnlockableCollectionById } from '@/composables/drop/useGenerativeDropMint'
import useGenerativeDropDetails from '@/composables/drop/useGenerativeDropDetails'
import useHolderOfCollectionDropMint from '@/composables/drop/useHolderOfCollectionDropMint'
import { MintButtonProp } from './types'
import { DropMintedStatus } from '@/services/waifu'
import { type ImageDataPayload } from '@/composables/drop/useGenerativeDropMint'
import { Prefix } from '@kodadot1/static'

const props = withDefaults(
  defineProps<{
    drop: DropItem
    hasMinimumFunds: boolean
    formattedMinimumFunds: string
    minimumFunds: number
    collectionData: UnlockableCollectionById | null
    currentAccountMintedToken: DropMintedStatus | null
    imageDataPayload: ImageDataPayload | undefined
    description: string | undefined
    collectionName: string | undefined
    selectedImage: string
    mintedAmountForCurrentUser: number
    mintCountAvailable: boolean
    fetchMultipleBalance: (
      onlyPrefixes: Prefix[],
      force?: boolean,
    ) => Promise<PromiseSettledResult<void>[]>
    fetchDropStatus: () => Promise<void>
  }>(),
  {
    drop: () => ({}) as DropItem,
  },
)

const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { isLogIn } = useAuth()

const selectedImage = computed(() => props.selectedImage)
const isAddFundModalActive = ref(false)
const mintedAmountForCurrentUser = computed(
  () => props.mintedAmountForCurrentUser,
)
const hasMinimumFunds = computed(() => props.hasMinimumFunds)
const mintCountAvailable = computed(() => props.mintCountAvailable)

const { totalItemDeposit, chainSymbol: depositChainSymbol } = useDeposit(
  computed(() => props.drop.chain),
)

const depositAmount = computed(() =>
  (Number(totalItemDeposit.value) - 0.1).toFixed(4),
)

const {
  defaultName,
  defaultImage,
  collectionId,
  chainName,
  disabledByBackend,
  token,
  holderOfCollectionId,
} = useGenerativeDropDetails(props.drop)

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
  mintNft: mintHolderOfCollectionNft,
} = useHolderOfCollectionDropMint({
  dropAlias: props.drop.id,
  holderOfCollectionId,
  defaultImage,
  defaultName,
  collectionId,
  currentAccountMintedToken: computed(() => props.currentAccountMintedToken),
  description: computed(() => props.description),
  mintedAmountForCurrentUser,
  collectionName: computed(() => props.collectionName),
  imageDataPayload: computed(() => props.imageDataPayload),
  selectedImage,
  fetchDropStatus: props.fetchDropStatus,
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

const mintButtonProps = computed<MintButtonProp>(() => ({
  disabled: mintButtonDisabled.value,
  label: mintButtonLabel.value,
}))

const openAddFundModal = () => {
  isAddFundModalActive.value = true
}

const closeAddFundModal = () => {
  isAddFundModalActive.value = false
}

const handleDropAddModalConfirm = () => {
  closeAddFundModal()
  props.fetchMultipleBalance([urlPrefix.value])
}

const onSubmit = () => {
  if (!preSubmitMint()) {
    return false
  }

  if (!hasMinimumFunds.value) {
    return openAddFundModal()
  }

  mintHolderOfCollectionNft()
}

defineExpose({
  holderOfCollection,
  isLoading,
  isImageFetching,
  isWalletConnecting,
  mintButtonProps,
  userMintedNftId,
  onSubmit,
})
</script>

<style scoped></style>
