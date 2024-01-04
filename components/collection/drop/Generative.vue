<template>
  <CollectionDropGenerativeLayout
    :user-minted-nft-id="userMintedNftId"
    :is-wallet-connecting="isWalletConnecting"
    :is-image-fetching="isImageFetching"
    :is-loading="isLoading"
    :minimum-funds="minimumFundsProps"
    :max-count="maxCount"
    :minted-count="mintedCount"
    :mint-count-available="mintCountAvailable || !disabledByBackend"
    :mint-button="mintButtonProps"
    :collection-id="collectionId"
    :description="description"
    :drop="drop"
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
import { createUnlockableMetadata } from '../unlockable/utils'
import { DropItem } from '@/params/types'
import { doWaifu } from '@/services/waifu'
import { useDropMinimumFunds, useDropStatus } from '@/components/drops/useDrops'
import DropConfirmModal from './modal/DropConfirmModal.vue'
import ListingCartModal from '@/components/common/listingCart/ListingCartModal.vue'
import { fetchNft } from '@/components/items/ItemsGrid/useNftActions'
import useGenerativeDropMint, {
  type UnlockableCollectionById,
} from '@/composables/drop/useGenerativeDropMint'
import useGenerativeDropNewsletter from '@/composables/drop/useGenerativeDropNewsletter'
import useGenerativeDropDetails from '@/composables/drop/useGenerativeDropDetails'

const MINTING_SECOND = 120

const props = withDefaults(
  defineProps<{
    drop: DropItem
  }>(),
  {
    drop: () => ({}) as DropItem,
  },
)

const instance = getCurrentInstance()
const listingCartStore = useListingCartStore()
const preferencesStore = usePreferencesStore()

const { $i18n } = useNuxtApp()

const { toast } = useToast()
const { accountId, isLogIn } = useAuth()
const { urlPrefix } = usePrefix()
const { currentAccountMintedToken, mintedDropCount, fetchDropStatus } =
  useDropStatus(props.drop.alias)
const { doAfterLogin } = useDoAfterlogin(instance)
const { fetchMultipleBalance } = useMultipleBalance()
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

const minimumFundsProps = computed(() => ({
  amount: minimumFunds.value,
  description: minimumFundsDescription.value,
}))

const isWalletConnecting = ref(false)
const isLoading = ref(false)
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
  mintedNft,
  mintedNftWithMetadata,
  userMintedNftId,
  canListMintedNft,
  mintedCount,
  mintCountAvailable,
  selectedImage,
  description,
  collectionName,
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

const mintButtonDisabled = computed(
  () =>
    isLogIn.value &&
    Boolean(
      !mintCountAvailable.value ||
        !selectedImage.value ||
        disabledByBackend.value,
    ),
)

const mintButtonLabel = computed(() => {
  if (isWalletConnecting.value) {
    return $i18n.t('shoppingCart.wallet')
  }
  return $i18n.t('mint.unlockable.claimNftNow')
})

const mintButtonProps = computed(() => ({
  disabled: mintButtonDisabled.value,
  label: mintButtonLabel.value,
}))

const handleSelectImage = (image: string) => {
  selectedImage.value = image
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

  if (isLoading.value || isImageFetching.value) {
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

const submitMint = async () => {
  try {
    isImageFetching.value = true
    isLoading.value = true

    const imageHash = await tryCapture()

    const hash = await createUnlockableMetadata(
      imageHash,
      description.value as string,
      collectionName.value || defaultName.value,
      'text/html',
      selectedImage.value,
    )

    isImageFetching.value = false

    const { result } = await doWaifu(
      {
        address: accountId.value,
        metadata: hash,
        image: imageHash,
        email: preferencesStore.getNewsletterSubscription.email,
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
  preferencesStore.listingCartModalOpen = false
  listingCartStore.removeItem(mintedNftWithMetadata.value?.id)
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

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.order-1 {
  order: 1;
}
</style>
