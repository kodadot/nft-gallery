import { DoResult, DropMintedStatus } from '@/services/waifu'
import { makeScreenshot } from '@/services/capture'
import { pinFileToIPFS } from '@/services/nftStorage'

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

  const mintedNft = ref<DropMintedNft>()
  const mintedNftWithMetadata = ref<NFTWithMetadata>()
  const selectedImage = ref<string>('')

  const maxCount = computed(
    () => collectionData.value?.collectionEntity?.max || defaultMax.value,
  )

  const userMintedNftId = computed(() =>
    currentAccountMintedToken.value
      ? `${collectionId.value}-${currentAccountMintedToken.value.id}`
      : mintedNft.value?.id,
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

  const tryCapture = async () => {
    try {
      const imgFile = await makeScreenshot(
        sanitizeIpfsUrl(selectedImage.value),
        { webgl: true },
      )
      const imageHash = await pinFileToIPFS(imgFile)
      return imageHash
    } catch (error) {
      toast($i18n.t('drops.capture'))
      return defaultImage.value
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

  return {
    maxCount,
    mintedNft,
    mintedNftWithMetadata,
    userMintedNftId,
    mintedCount,
    mintCountAvailable,
    selectedImage,
    description,
    collectionName,
    tryCapture,
    subscribeToMintedNft,
  }
}
