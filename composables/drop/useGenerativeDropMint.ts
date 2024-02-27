import { DoResult } from '@/services/fxart'
import { pinFileToIPFS } from '@/services/nftStorage'
import { nftToListingCartItem } from '@/components/common/shoppingCart/utils'
import useGenerativeIframeData from '@/composables/drop/useGenerativeIframeData'

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
  defaultMax: Ref<number>
  collectionData: Ref<UnlockableCollectionById | undefined | null>
}

export default ({
  collectionData,
  defaultMax,
  mintedDropCount,
}: GenerativeDropMintParams) => {
  const { toast } = useToast()
  const { $i18n } = useNuxtApp()
  const listingCartStore = useListingCartStore()
  const preferencesStore = usePreferencesStore()
  const { imageDataPayload } = useGenerativeIframeData()

  const mintedNft = ref<DropMintedNft>()
  const mintedNftWithMetadata = ref<NFTWithMetadata>()
  const selectedImage = ref<string>('')

  const maxCount = computed(
    () => collectionData.value?.collectionEntity?.max || defaultMax.value,
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
      throw error
    }
  }

  const getCaptureImageFile = async () => {
    const selectedImageHash = selectedImage.value.split('?hash=')[1]
    const isTheSameImage = selectedImageHash === imageDataPayload.value?.hash
    if (!imageDataPayload.value?.image || !isTheSameImage) {
      throw new Error('Failed to load image, please try again later')
    }
    const res = (await fetch(imageDataPayload.value.image)) as any
    return new File([res], 'image.png', { type: 'image/png' })
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

    if (mintedNftWithMetadata.value?.id) {
      listingCartStore.removeItem(mintedNftWithMetadata.value?.id)
    }
  })

  return {
    maxCount,
    mintedNft,
    mintedNftWithMetadata,
    mintedAmountForCurrentUser,
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
