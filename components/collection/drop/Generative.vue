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
            :token="token"
            :max-count="maxCount"
            :minted-count="mintedCount"
            :mint-count-available="mintCountAvailable"
            :disabled="mintButtonDisabled"
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
          :max-count="maxCount"
          :minted-count="mintedCount"
          :token="token"
          :disabled="mintButtonDisabled"
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
    :minting-seconds="MINTING_SECOND"
    :minted-nft="mintedNft"
    :can-list-nft="canListMintedNft"
    @confirm="handleConfirmMint"
    @close="closeConfirmModal"
    @list="handleList" />

  <CollectionDropAddFundsModal
    v-model="isAddFundModalActive"
    :minimum-funds="minimumFunds"
    :token="token"
    @close="isAddFundModalActive = false" />

  <ListingCartModal />
</template>

<script setup lang="ts">
import UnlockableCollectionInfo from '@/components/collection/unlockable/UnlockableCollectionInfo.vue'
import UnlockableTag from '@/components/collection/unlockable/UnlockableTag.vue'
import CarouselTypeLatestMints from '@/components/carousel/CarouselTypeLatestMints.vue'
import { createUnlockableMetadata } from '../unlockable/utils'
import GenerativePreview from '@/components/collection/drop/GenerativePreview.vue'
import { DropItem } from '@/params/types'
import { DoResult, doWaifu } from '@/services/waifu'
import { useDropStatus } from '@/components/drops/useDrops'
import { makeScreenshot } from '@/services/capture'
import { pinFileToIPFS } from '@/services/nftStorage'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import newsletterApi from '@/utils/newsletter'
import { formatBsxBalanceToNumber } from '@/utils/format/balance'
import { prefixToToken } from '@/components/common/shoppingCart/utils'
import { useIdentityStore } from '@/stores/identity'
import {
  DOT_EXISTENTIAL_DEPOSIT,
  KSM_EXISTENTIAL_DEPOSIT,
} from '@/components/collection/unlockable/const'
import DropConfirmModal from './modal/DropConfirmModal.vue'
import ListingCartModal from '@/components/common/listingCart/ListingCartModal.vue'
import { nftToListingCartItem } from '@/components/common/shoppingCart/utils'
import { fetchNft } from '@/components/items/ItemsGrid/useNftActions'

const MINTING_SECOND = 120

const props = defineProps({
  drop: {
    type: Object,
    default: () => {
      return {} as DropItem
    },
  },
})

useMultipleBalance(true)

const minimumFunds = computed<number>(
  () => (props.drop.meta && formatBsxBalanceToNumber(props.drop.meta)) || 0,
)
const store = useIdentityStore()

const { width } = useWindowSize()
const isMobile = computed(() => width.value <= 768)

const isWalletConnecting = ref(false)
const collectionId = computed(() => props.drop?.collection)
const disabledByBackend = computed(() => props.drop?.disabled)
const defaultImage = computed(() => props.drop?.image)
const defaultName = computed(() => props.drop?.name)
const defaultMax = computed(() => props.drop?.max || 255)
const { currentAccountMintedToken, mintedDropCount, fetchDropStatus } =
  useDropStatus(props.drop.alias)
const instance = getCurrentInstance()
const listingCartStore = useListingCartStore()
const preferencesStore = usePreferencesStore()

const { doAfterLogin } = useDoAfterlogin(instance)
const { $i18n } = useNuxtApp()

const { toast } = useToast()
const { accountId, isLogIn } = useAuth()

const selectedImage = ref<string>('')
const isLoading = ref(false)
const isImageFetching = ref(false)
const isConfirmModalActive = ref(false)
const isAddFundModalActive = ref(false)

const token = computed(() => prefixToToken[props.drop.chain])

export type DropMintedNft = DoResult & {
  id: string
  collectionName: string
  name: string
}

const mintedNft = ref<DropMintedNft>()
const mintedNftWithMetadata = ref<NFTWithMetadata>()

const handleSelectImage = (image: string) => {
  selectedImage.value = image
}

const { data: collectionData } = useGraphql({
  queryName: 'unlockableCollectionById',
  variables: {
    id: collectionId.value,
  },
})

const canListMintedNft = computed(() => Boolean(mintedNftWithMetadata.value))

const maxCount = computed(
  () => collectionData.value?.collectionEntity?.max || defaultMax.value,
)

const hasUserMinted = computed(() =>
  currentAccountMintedToken.value
    ? `${collectionId.value}-${currentAccountMintedToken.value.id}`
    : mintedNft.value?.id,
)

const mintedCount = computed(() =>
  Math.min(mintedDropCount.value, maxCount.value),
)

const mintCountAvailable = computed(() => mintedCount.value < maxCount.value)

const mintButtonDisabled = computed(
  () =>
    isLogIn.value &&
    Boolean(
      !mintCountAvailable.value ||
        !selectedImage.value ||
        disabledByBackend.value,
    ),
)

const description = computed(
  () => collectionData.value?.collectionEntity?.meta?.description,
)
const collectionName = computed(
  () => collectionData.value?.collectionEntity?.name,
)

const tryCapture = async () => {
  try {
    const imgFile = await makeScreenshot(sanitizeIpfsUrl(selectedImage.value))
    const imageHash = await pinFileToIPFS(imgFile)
    return imageHash
  } catch (error) {
    toast($i18n.t('drops.capture'))
    return defaultImage.value
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
  if (isLoading.value || isImageFetching.value) {
    return false
  }

  const dropChainBalance = Number(store.getAuthBalanceByChain(props.drop.chain))
  const relayChainBalance = Number(
    store.getAuthBalanceByRelayChain(props.drop.chain),
  )
  const existentialDeposit =
    token.value === 'KSM' ? KSM_EXISTENTIAL_DEPOSIT : DOT_EXISTENTIAL_DEPOSIT

  if (
    dropChainBalance >= minimumFunds.value ||
    relayChainBalance >= existentialDeposit + minimumFunds.value
  ) {
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

const subscribe = async (email: string) => {
  try {
    await newsletterApi.subscribe(email)
  } catch (error) {
    dangerMessage($i18n.t('signupBanner.failed'))
    throw error
  }
}

const subscribeToMintedNft = (id: string, onReady: (data) => void) => {
  useSubscriptionGraphql({
    query: `nftEntityById(id: "${id}") {
    id
  }`,
    onChange: onReady,
  })
}

const submitMint = async (email: string) => {
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
        email,
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

const handleConfirmMint = async ({ email }) => {
  try {
    isLoading.value = true
    await subscribe(email)
    await submitMint(email)
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

onBeforeUnmount(clear)
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.order-1 {
  order: 1;
}

.minimum-funds-description {
  max-width: 314px;
}
</style>
