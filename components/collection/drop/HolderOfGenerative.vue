<template>
  <div class="unlockable-container">
    <Loader v-model="isLoading" :status="status" />
    <div class="container is-fluid border-top pt-6">
      <div class="columns is-desktop">
        <div class="column is-half-desktop mobile-padding">
          <UnlockableCollectionInfo
            :collection-id="collectionId"
            :description="description" />
          <hr class="mb-4" />

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
            :is-holder-of-target-collection="isHolderOfTargetCollection"
            :holder-of-collection-id="holderOfCollectionId"
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
          :is-holder-of-target-collection="isHolderOfTargetCollection"
          :holder-of-collection-id="holderOfCollectionId"
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
import UnlockableCollectionInfo from '@/components/collection/unlockable/UnlockableCollectionInfo.vue'
import UnlockableTag from '@/components/collection/unlockable/UnlockableTag.vue'
import CarouselTypeLatestMints from '@/components/carousel/CarouselTypeLatestMints.vue'
import { createUnlockableMetadata } from '../unlockable/utils'
import GenerativePreview from '@/components/collection/drop/GenerativePreview.vue'
import { DropItem } from '@/params/types'
import { DoResult, claimDropItem } from '@/services/waifu'
import { useDropMinimumFunds, useDropStatus } from '@/components/drops/useDrops'
import { makeScreenshot } from '@/services/capture'
import { pinFileToIPFS } from '@/services/nftStorage'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { prefixToToken } from '@/components/common/shoppingCart/utils'
import { fetchNft } from '@/components/items/ItemsGrid/useNftActions'
import holderOfCollectionById from '@/queries/subsquid/general/holderOfCollectionById.graphql'
import unlockableCollectionById from '@/queries/subsquid/general/unlockableCollectionById.graphql'
import Loader from '@/components/shared/Loader.vue'

const holderOfCollectionId = '50' // ChaosFlakes | todo: mock for testing, should be fetched from backend

const props = defineProps({
  drop: {
    type: Object,
    default: () => {
      return {} as DropItem
    },
  },
})

export type DropMintedNft = DoResult & {
  id: string
  collectionName: string
  name: string
}

const { fetchMultipleBalance } = useMultipleBalance()

const { isMobile } = useViewport()

const { hasMinimumFunds, formattedMinimumFunds, minimumFunds } =
  useDropMinimumFunds(props.drop)
const minimumFundsDescription = computed(() =>
  $i18n.t('mint.unlockable.minimumFundsDescription', [
    formattedMinimumFunds.value,
    chainName.value,
  ]),
)

const isWalletConnecting = ref(false)
const collectionId = computed(() => props.drop?.collection)
const disabledByBackend = computed(() => props.drop?.disabled)
const defaultImage = computed(() => props.drop?.image)
const defaultName = computed(() => props.drop?.name)
const defaultMax = computed(() => props.drop?.max || 255)
const { currentAccountMintedToken, mintedDropCount, fetchDropStatus } =
  useDropStatus(props.drop.alias)
const instance = getCurrentInstance()
const mintNftSN = ref('0')
const { doAfterLogin } = useDoAfterlogin(instance)
const { $i18n, $consola } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { toast } = useToast()
const { accountId, isLogIn } = useAuth()

const { client } = usePrefix()
const selectedImage = ref<string>('')
const isLoading = ref(false)
const isImageFetching = ref(false)
const isAddFundModalActive = ref(false)

const {
  howAboutToExecute,
  isLoading: isTransactionLoading,
  initTransactionLoader,
  status,
} = useMetaTransaction()

const chainName = computed(() => getChainName(props.drop.chain))
const token = computed(() => prefixToToken[props.drop.chain])

const mintedNft = ref<DropMintedNft>()
const mintedNftWithMetadata = ref<NFTWithMetadata>()

const { totalItemDeposit, chainSymbol: depositChainSymbol } = useDeposit(
  computed(() => props.drop.chain),
)

const depositAmount = computed(() =>
  (Number(totalItemDeposit.value) - 0.1).toFixed(4),
)

const handleSelectImage = (image: string) => {
  selectedImage.value = image
}

const { data: collectionData } = await useAsyncData(
  'unlockableCollectionData',
  async () =>
    await useAsyncQuery({
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

const { data: holderOfCollectionData } = await useAsyncData(
  'holderOfCollectionData',
  async () =>
    await useAsyncQuery({
      clientId: client.value,
      query: holderOfCollectionById,
      variables: {
        id: holderOfCollectionId,
        account: accountId.value,
      },
    }).then((res) => res.data.value),
  {
    watch: [accountId],
  },
)

const mintedAmountForCurrentUser = computed(
  () => collectionData.value?.nftEntitiesConnection?.totalCount || 0, // todo: fetch from backend
)

const maxMintLimitForCurrentUser = computed(
  () => holderOfCollectionData.value?.nftEntitiesConnection?.totalCount || 0,
)
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

const isHolderOfTargetCollection = computed(
  () => maxMintLimitForCurrentUser.value > 0,
)

const mintButtonLabel = computed(() => {
  return isWalletConnecting.value
    ? $i18n.t('shoppingCart.wallet')
    : isLogIn.value
      ? isHolderOfTargetCollection.value &&
        maxMintLimitForCurrentUser.value > mintedAmountForCurrentUser.value
        ? $i18n.t('mint.unlockable.claimPaidNft', [
            `${depositAmount.value} ${depositChainSymbol.value}`,
          ])
        : $i18n.t('mint.unlockable.notEligibility')
      : $i18n.t('mint.unlockable.checkEligibility')
})
const mintButtonDisabled = computed(
  () =>
    isLogIn.value &&
    Boolean(
      !mintCountAvailable.value ||
        !selectedImage.value ||
        disabledByBackend.value ||
        !isHolderOfTargetCollection.value ||
        maxMintLimitForCurrentUser.value <= mintedAmountForCurrentUser.value,
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

const mintNft = async () => {
  try {
    isLoading.value = true

    const { apiInstance } = useApi()
    const api = await apiInstance.value
    const collectionRes = (
      await api.query.nfts.collection(collectionId.value)
    ).toJSON() as {
      items: string
    }

    initTransactionLoader()
    const cb = api.tx.utility.batchAll
    const mint = api.tx.nfts.mint(
      collectionId.value,
      collectionRes.items,
      accountId.value,
      {
        ownedItem: holderOfCollectionData.value?.nftEntities?.at(
          mintedAmountForCurrentUser.value,
        ).sn,
        mintPrice: null,
      },
    )

    const transfer = api.tx.balances.transfer(
      '5GGWQ1yiSvS2rPciRtAuK2xQTuxCcgoGZ7dTSzHWws4ELzwD',
      2e9,
    )

    mintNftSN.value = collectionRes.items
    howAboutToExecute(accountId.value, cb, [[mint, transfer]])
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

const subscribeToMintedNft = (id: string, onReady: (data) => void) => {
  useSubscriptionGraphql({
    query: `nftEntityById(id: "${id}") {
    id
  }`,
    onChange: onReady,
  })
}

const submitMint = async (sn: string) => {
  try {
    isImageFetching.value = true

    const imageHash = await tryCapture()

    const hash = await createUnlockableMetadata(
      imageHash,
      description.value,
      collectionName.value || defaultName.value,
      'text/html',
      selectedImage.value,
    )

    isImageFetching.value = false

    const { result } = await claimDropItem(
      {
        account: accountId.value,
        metadata: hash,
        sn,
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
