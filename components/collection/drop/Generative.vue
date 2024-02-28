<template>
  <CollectionDropGenerativeLayout
    :user-minted-count="mintedAmountForCurrentUser"
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
    :loading="isLoading"
    :minted-nft="mintedNft"
    :can-list-nft="canListMintedNft"
    @subscribe="handleEmailSubscription"
    @check-subscription="handleCheckSubscription"
    @resend-confirmation-email="handleResendConfirmationEmail"
    @close="isConfirmModalActive = false"
    @list="handleList" />

  <CollectionDropAddFundsModal
    v-model="isAddFundModalActive"
    :minimum-funds="minimumFunds"
    :formatted-minimum-funds="formattedMinimumFunds"
    :token="token"
    :chain="chainName"
    free
    @close="isAddFundModalActive = false"
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
import useCursorDropEvents from '@/composables/party/useCursorDropEvents'

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
const { mintedDropCount, fetchDropStatus } = useDropStatus(props.drop.alias)
const { doAfterLogin } = useDoAfterlogin(instance)
const { fetchMultipleBalance, hasCurrentChainBalance } = useMultipleBalance()
const { hasMinimumFunds, formattedMinimumFunds, minimumFunds } =
  useDropMinimumFunds(props.drop)

const {
  defaultName,
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

  subscriptionId,
  emailConfirmed,
} = useGenerativeDropNewsletter()

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
  canListMintedNft,
  mintedCount,
  mintCountAvailable,
  mintedAmountForCurrentUser,
  selectedImage,
  description,
  collectionName,
  tryCapture,
  subscribeToMintedNft,
  listMintedNft,
} = useGenerativeDropMint({
  collectionData,
  defaultMax,
  mintedDropCount,
})

useCursorDropEvents(props.drop.alias, [isLoading], mintedNft)

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
  return $i18n.t('drops.mintForFree')
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
    isConfirmModalActive.value = true
  } else {
    isAddFundModalActive.value = true
  }
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
  isAddFundModalActive.value = false

  isConfirmModalActive.value = true
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
