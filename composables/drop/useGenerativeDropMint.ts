import { DoResult } from '@/services/fxart'
import { pinFileToIPFS } from '@/services/nftStorage'
import { nftToListingCartItem } from '@/components/common/shoppingCart/utils'
import useGenerativeIframeData from '@/composables/drop/useGenerativeIframeData'
import { useDrop } from '@/components/drops/useDrops'
import unlockableCollectionById from '@/queries/subsquid/general/unlockableCollectionById.graphql'

export type DropMintedNft = DoResult & {
  id: string
  collectionName: string
  name: string
  max: number
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

// for feature parity with canary, no idea where this number comes from (by daiagi on 12/03/2024 PR #9709)
export const DEFAULT_MAX = 255

export function useCollectionEntity(collectionId?: string) {
  const { drop } = useDrop()
  const { client } = usePrefix()

  const collectionKey = computed(() => collectionId ?? drop.value?.collection)

  const { data: collectionData } = useAsyncData<UnlockableCollectionById>(
    'collectionEntity' + collectionKey.value,
    () =>
      useAsyncQuery<UnlockableCollectionById>({
        clientId: client.value,
        query: unlockableCollectionById,
        variables: {
          id: collectionKey.value,
        },
      }).then((res) => res.data.value),
    {
      watch: collectionId ? undefined : [() => drop.value?.collection],
    },
  )

  const maxCount = computed(() => collectionData.value?.collectionEntity?.max)

  const mintedAmountForCurrentUser = computed(
    () => collectionData.value?.nftEntitiesConnection?.totalCount ?? 0,
  )

  const description = computed(
    () => collectionData.value?.collectionEntity?.meta?.description ?? '',
  )
  const collectionName = computed(
    () => collectionData.value?.collectionEntity?.name ?? '',
  )

  const nftCount = computed(
    () => collectionData.value?.collectionEntity?.nftCount ?? 0,
  )

  return {
    maxCount,
    mintedAmountForCurrentUser,
    description,
    collectionName,
    nftCount,
  }
}

export default () => {
  const { toast } = useToast()
  const { $i18n } = useNuxtApp()
  const listingCartStore = useListingCartStore()
  const preferencesStore = usePreferencesStore()
  const dropStore = useDropStore()
  const { imageDataPayload } = useGenerativeIframeData()
  const { drop } = useDrop()
  const { maxCount: collectionMaxCount } = useCollectionEntity()

  const claimedNft = computed({
    get: () => dropStore.claimedNFT,
    set: (value) => dropStore.setClaimedNFT(value),
  })

  const mintedNftWithMetadata = computed({
    get: () => dropStore.mintedNFT,
    set: (value) => dropStore.setMintedNFT(value),
  })
  const selectedImage = computed({
    get: () => dropStore.selectedImage,
    set: (value) => dropStore.setSelectedImage(value),
  })

  const maxCount = computed(
    () => collectionMaxCount.value ?? drop.value?.max ?? DEFAULT_MAX,
  )

  const mintCountAvailable = computed(
    () => dropStore.mintsCount < maxCount.value,
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
    claimedNft,
    mintedNftWithMetadata,
    mintCountAvailable,
    selectedImage,
    canListMintedNft,
    listMintedNft,
    tryCapture,
    subscribeToMintedNft,
  }
}
