import { DoResult, DropMintedStatus } from '@/services/waifu'
import { makeScreenshot } from '@/services/capture'
import { pinFileToIPFS } from '@/services/nftStorage'

export type DropMintedNft = DoResult & {
  id: string
  collectionName: string
  name: string
}

export default ({
  collectionData,
  defaultMax,
  currentAccountMintedToken,
  collectionId,
  mintedDropCount,
  defaultImage,
}: {
  mintedDropCount: Ref<number>
  collectionId: Ref
  defaultImage: Ref
  currentAccountMintedToken: Ref<DropMintedStatus | null>
  defaultMax: Ref<number>
  collectionData: Ref
}) => {
  const { toast } = useToast()
  const { $i18n } = useNuxtApp()

  const mintedNft = ref<DropMintedNft>()
  const mintedNftWithMetadata = ref<NFTWithMetadata>()
  const selectedImage = ref<string>('')

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
    hasUserMinted,
    mintedCount,
    mintCountAvailable,
    selectedImage,
    tryCapture,
    subscribeToMintedNft,
  }
}
