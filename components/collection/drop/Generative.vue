<template>
  <div class="unlockable-container">
    <div class="container is-fluid border-top pt-6">
      <div class="columns is-desktop">
        <div class="column is-half-desktop mobile-padding">
          <UnlockableCollectionInfo
            :collection-id="collectionId"
            :description="description" />
          <hr />

          <UnlockableTag :collection-id="collectionId" />

          <CollectionDropMintSection
            v-if="!isMobile"
            :has-user-minted="hasUserMinted"
            :is-wallet-connecting="isWalletConnecting"
            :is-image-fetching="isImageFetching"
            :minimum-funds="minimumFunds"
            :minimum-funds-description="minimumFundsDescription"
            :max-count="maxCount"
            :minted-count="mintedCount"
            :mint-count-available="mintCountAvailable"
            :disabled="mintButtonDisabled"
            :mint-button-label="mintButtonLabel"
            @mint="handleSubmitMint" />
        </div>

        <div class="column pt-5 is-flex is-justify-content-center">
          <GenerativePreview
            :content="drop.content"
            :image="drop.image"
            @select="handleSelectImage" />
        </div>

        <CollectionDropMintSection
          v-if="isMobile"
          class="column"
          :has-user-minted="hasUserMinted"
          :is-wallet-connecting="isWalletConnecting"
          :is-image-fetching="isImageFetching"
          :minimum-funds="minimumFunds"
          :minimum-funds-description="minimumFundsDescription"
          :max-count="maxCount"
          :minted-count="mintedCount"
          :mint-count-available="mintCountAvailable"
          :disabled="mintButtonDisabled"
          :mint-button-label="mintButtonLabel"
          @mint="handleSubmitMint" />
      </div>

      <CollectionUnlockableItemInfo :collection-id="collectionId" />
      <div class="my-4">
        <CarouselTypeLatestMints
          :collection-id="collectionId"
          interaction="MINT" />
      </div>
    </div>
  </div>

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
import UnlockableCollectionInfo from '@/components/collection/unlockable/UnlockableCollectionInfo.vue'
import UnlockableTag from '@/components/collection/unlockable/UnlockableTag.vue'
import CarouselTypeLatestMints from '@/components/carousel/CarouselTypeLatestMints.vue'
import { createUnlockableMetadata } from '../unlockable/utils'
import GenerativePreview from '@/components/collection/drop/GenerativePreview.vue'
import { DropItem } from '@/params/types'
import { doWaifu } from '@/services/waifu'
import { useDropMinimumFunds, useDropStatus } from '@/components/drops/useDrops'
import DropConfirmModal from './modal/DropConfirmModal.vue'
import ListingCartModal from '@/components/common/listingCart/ListingCartModal.vue'
import { nftToListingCartItem } from '@/components/common/shoppingCart/utils'
import { fetchNft } from '@/components/items/ItemsGrid/useNftActions'
import useGenerativeDropMint from './composables/useGenerativeDropMint'
import useGenerativeDropNewsletter from './composables/useGenerativeDropNewsletter'
import useGenerativeDropDetails from './composables/useGenerativeDropDetails'

const MINTING_SECOND = 120

const props = defineProps({
  drop: {
    type: Object,
    default: () => {
      return {} as DropItem
    },
  },
})

const { width } = useWindowSize()
const isMobile = computed(() => width.value <= 768)

useDropStatus(props.drop.alias)
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

const isWalletConnecting = ref(false)
const isLoading = ref(false)
const isImageFetching = ref(false)
const isConfirmModalActive = ref(false)
const isAddFundModalActive = ref(false)

const { data: collectionData } = useGraphql({
  queryName: 'unlockableCollectionById',
  variables: {
    id: collectionId.value,
  },
})

const {
  maxCount,
  mintedNft,
  mintedNftWithMetadata,
  hasUserMinted,
  mintedCount,
  mintCountAvailable,
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
  mintedDropCount,
  defaultImage,
})

const canListMintedNft = computed(() => Boolean(mintedNftWithMetadata.value))

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
      description.value,
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

const handleResendConfirmationEmail = async () => {
  await resendConfirmationEmail(subscriptionId.value as string)
}

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

  if (!mintedNftWithMetadata.value) {
    return
  }

  if (!listingCartStore.isItemInCart(mintedNftWithMetadata.value?.id)) {
    const floorPrice =
      mintedNftWithMetadata.value?.collection.floorPrice[0]?.price || '0'

    listingCartStore.setItem(
      nftToListingCartItem(mintedNftWithMetadata.value, floorPrice),
    )
  }

  preferencesStore.listingCartModalOpen = true
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
