<template>
  <CollectionDropGenerativeLayout
    :user-minted-nft-id="userMintedNftId"
    :is-wallet-connecting="isWalletConnecting"
    :is-image-fetching="isImageFetching"
    :is-loading="isLoading"
    :minimum-funds="minimumFundsProps"
    :mint-count-available="mintCountAvailable || !disabledByBackend"
    :mint-button="mintButtonProps"
    :collection-id="collectionId"
    :description="description"
    :drop="drop"
    :mint-phases="mintPhases"
    :handle-select-image="handleSelectImage"
    :handle-submit-mint="handleSubmitMint" />

  <DropConfirmModal
    v-model="isConfirmModalActive"
    :claiming="isLoading"
    :email-confirmed="emailConfirmed"
    :subscription-email="preferencesStore.getNewsletterSubscription.email"
    :checking-subscription="checkingSubscription"
    :subscribing-to-newsletter="subscribingToNewsletter"
    :resending-confirmation-email="resendingConfirmationEmail"
    :minting-seconds="MINTING_SECOND"
    :minted-nft="mintedNft"
    :can-list-nft="canListMintedNft"
    :send-confirmation-email-on-modal-open="sendConfirmationEmailOnModalOpen"
    @subscribe="handleEmailSubscription"
    @check-subscription="handleCheckSubscription"
    @resend-confirmation-email="handleResendConfirmationEmail"
    @close="closeConfirmModal"
    @list="handleList" />

  <CollectionDropAddFundsModal
    v-model="isAddFundModalActive"
    :minimum-funds="minimumFunds"
    :formatted-minimum-funds="formattedMinimumFunds"
    :token="token"
    :chain="chainName"
    free
    @close="closeAddFundModal"
    @confirm="handleDropAddModalConfirm" />

  <ListingCartModal />
</template>

<script setup lang="ts">
import { DropItem } from '@/params/types'
import { useDropMinimumFunds, useDropStatus } from '@/components/drops/useDrops'
import DropConfirmModal from './modal/DropConfirmModal.vue'
import ListingCartModal from '@/components/common/listingCart/ListingCartModal.vue'
import useGenerativeDropMint, {
  type UnlockableCollectionById,
} from '@/composables/drop/useGenerativeDropMint'
import useGenerativeDropNewsletter from '@/composables/drop/useGenerativeDropNewsletter'
import useGenerativeDropDetails from '@/composables/drop/useGenerativeDropDetails'
import useDropPhases from '@/composables/drop/useDropPhases'
import useFreeDropMint from '@/composables/drop/useFreeDropMint'
import { MinimumFundsProp, MintButtonProp, PhaseType } from './types'

const MINTING_SECOND = 120

const props = withDefaults(
  defineProps<{
    drop: DropItem
  }>(),
  {
    drop: () => ({}) as DropItem,
  },
)

const preferencesStore = usePreferencesStore()

const { $i18n } = useNuxtApp()
const { isLogIn } = useAuth()
const { urlPrefix } = usePrefix()
const { currentAccountMintedToken, mintedDropCount, fetchDropStatus } =
  useDropStatus(props.drop.alias)
const { hasMinimumFunds, formattedMinimumFunds, minimumFunds } =
  useDropMinimumFunds(props.drop)

const {
  defaultName,
  defaultImage,
  defaultMax,
  collectionId,
  chainName,
  disabledByBackend,
  token,
} = useGenerativeDropDetails(props.drop)

const {
  checkSubscription,
  subscribe,
  resendConfirmationEmail,
  checkingSubscription,
  subscribingToNewsletter,
  resendingConfirmationEmail,
  sendConfirmationEmailOnModalOpen,
  subscriptionId,
  emailConfirmed,
} = useGenerativeDropNewsletter()

const minimumFundsDescription = computed(() =>
  $i18n.t('mint.unlockable.freeMinimumFundsDescription', [
    formattedMinimumFunds.value,
    chainName.value,
  ]),
)

const minimumFundsProps = computed<MinimumFundsProp>(() => ({
  amount: minimumFunds.value,
  description: minimumFundsDescription.value,
  hasAmount: hasMinimumFunds.value,
}))

const isImageFetching = ref(false)
const isConfirmModalActive = ref(false)
const isAddFundModalActive = ref(false)

const { data: collectionData } = useGraphql<UnlockableCollectionById>({
  queryName: 'unlockableCollectionById',
  variables: {
    id: collectionId.value,
  },
})

const {
  maxCount,
  mintedCount,
  mintCountAvailable,
  selectedImage,
  collectionName,
  description,
  imageDataPayload,
} = useGenerativeDropMint({
  collectionData,
  defaultMax,
  mintedDropCount,
})

const { mintPhases } = useDropPhases({
  phases: PhaseType.FREE,
  maxCount,
  mintedCount,
})

const {
  isLoading,
  isWalletConnecting,
  mintedNft,
  canListMintedNft,
  userMintedNftId,
  preSubmitMint,
  fetchMultipleBalance,
  submitMint,
  listMintedNft,
} = useFreeDropMint({
  dropAlias: props.drop.id,
  defaultImage,
  defaultName,
  collectionId,
  currentAccountMintedToken,
  description,
  collectionName,
  imageDataPayload,
  selectedImage,
  fetchDropStatus,
})

const mintButtonDisabled = computed<boolean>(
  () =>
    !mintCountAvailable.value ||
    Boolean(disabledByBackend.value) ||
    (isLogIn.value && Boolean(!selectedImage.value)),
)

const mintButtonLabel = computed(() => {
  if (isWalletConnecting.value) {
    return $i18n.t('shoppingCart.wallet')
  }
  return $i18n.t('mint.unlockable.claimNftNow')
})

const mintButtonProps = computed<MintButtonProp>(() => ({
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
    openConfirmModal()
  } else {
    openAddFundModal()
  }
}

const closeConfirmModal = () => {
  isConfirmModalActive.value = false
}

const openConfirmModal = () => {
  isConfirmModalActive.value = true
}

const openAddFundModal = () => {
  isAddFundModalActive.value = true
}

const closeAddFundModal = () => {
  isAddFundModalActive.value = false
}

const handleEmailSubscription = async (email: string) => {
  await subscribe(email)
}

const handleCheckSubscription = async () => {
  await checkSubscription(subscriptionId.value as string)
}

const handleResendConfirmationEmail = () =>
  resendConfirmationEmail(subscriptionId.value as string)

const startMinting = async () => {
  try {
    isLoading.value = true
    await submitMint()
  } catch (error) {
    isLoading.value = false
    isConfirmModalActive.value = false
  }
}

const handleList = async () => {
  isConfirmModalActive.value = false
  listMintedNft()
}

const clear = () => {
  isConfirmModalActive.value = false
}

const handleDropAddModalConfirm = () => {
  closeAddFundModal()
  openConfirmModal()
  fetchMultipleBalance([urlPrefix.value])
}

watch([isConfirmModalActive, emailConfirmed], ([modalActive, confirmed]) => {
  if (modalActive && confirmed) {
    startMinting()
  }
})

onBeforeUnmount(clear)
</script>
