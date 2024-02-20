import { DoResult, DropMintedStatus } from '@/services/fxart'
import { makeScreenshot } from '@/services/capture'
import { pinFileToIPFS } from '@/services/nftStorage'
import { nftToListingCartItem } from '@/components/common/shoppingCart/utils'
import { useEventListener } from '@vueuse/core'

export type DropMintedNft = DoResult & {
  id: string
  collectionName: string
  name: string
}

export type UnlockableCollectionById = {
  collectionEntity: {
    meta: { description: string }
    name: string
    max: number
    nftCount: number
    nfts: { sn: string }[]
  }
  nftEntitiesConnection: { totalCount: number }
}

type GenerativeDropMintParams = {
  mintedDropCount: Ref<number>
  collectionId: Ref<string>
  defaultImage: Ref<string>
  currentAccountMintedToken: Ref<DropMintedStatus | null>
  defaultMax: Ref<number>
  collectionData: Ref<UnlockableCollectionById | undefined | null>
}

export default ({
  collectionData,
  defaultMax,
  currentAccountMintedToken,
  collectionId,
  mintedDropCount,
  defaultImage,
}: GenerativeDropMintParams) => {
  const { toast } = useToast()
  const { $i18n } = useNuxtApp()
  const listingCartStore = useListingCartStore()
  const preferencesStore = usePreferencesStore()

  const imageDataPayload = ref<{ hash: string; image: string }>()

  const mintedNft = ref<DropMintedNft>()
  const mintedNftWithMetadata = ref<NFTWithMetadata>()
  const selectedImage = ref<string>('')

  useEventListener(window, 'message', (res) => {
    if (
      res?.data?.type === 'kodahash/render/completed' &&
      res?.data?.payload.image
    ) {
      imageDataPayload.value = res?.data?.payload
    }
  })

  const maxCount = computed(
    () => collectionData.value?.collectionEntity?.max || defaultMax.value,
  )

  const userMintedNftId = computed(() =>
    currentAccountMintedToken.value
      ? `${collectionId.value}-${currentAccountMintedToken.value.id}`
      : mintedNft.value?.id,
  )

  const mintedAmountForCurrentUser = computed(
    () => collectionData.value?.nftEntitiesConnection?.totalCount || 0, // todo: fetch from backend
  )

  const mintedCount = computed(() =>
    Math.min(mintedDropCount.value, maxCount.value),
  )

  const mintCountAvailable = computed(() => mintedCount.value < maxCount.value)

  const description = computed(
    () => collectionData.value?.collectionEntity?.meta?.description,
  )
  const collectionName = computed(
    () => collectionData.value?.collectionEntity?.name,
  )

  const nftCount = computed(
    () => collectionData.value?.collectionEntity?.nftCount,
  )

  const canListMintedNft = computed(() => Boolean(mintedNftWithMetadata.value))

  const tryCapture = async () => {
    try {
      const imgFile = await getCaptureImageFile()
      const imageHash = await pinFileToIPFS(imgFile)
      return imageHash
    } catch (error) {
      toast($i18n.t('drops.capture'))
      return defaultImage.value
    }
  }

  const getCaptureImageFile = async () => {
    try {
      const selectedImageHash = selectedImage.value.split('?hash=')[1]
      const isTheSameImage = selectedImageHash === imageDataPayload.value?.hash
      if (!imageDataPayload.value?.image || !isTheSameImage) {
        throw new Error('Not loaded, try screenshot service')
      }
      const res = (await fetch(imageDataPayload.value.image)) as any
      return new File([res], 'image.png', { type: 'image/png' })
    } catch (error) {
      return await makeScreenshot(sanitizeIpfsUrl(selectedImage.value), {
        webgl: false,
      })
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

  const listMintedNft = async () => {
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

  onBeforeUnmount(() => {
    preferencesStore.listingCartModalOpen = false
    listingCartStore.removeItem(mintedNftWithMetadata.value?.id)
  })

  return {
    maxCount,
    mintedNft,
    mintedNftWithMetadata,
    mintedAmountForCurrentUser,
    userMintedNftId,
    mintedCount,
    mintCountAvailable,
    selectedImage,
    description,
    collectionName,
    canListMintedNft,
    nftCount,
    listMintedNft,
    tryCapture,
    subscribeToMintedNft,
  }
}
