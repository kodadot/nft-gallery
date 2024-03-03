import { DropItem } from '@/params/types'
import { MassMintNFT } from './useDropMassMint'
import useGenerativeIframeData, {
  ImageDataPayload,
} from './useGenerativeIframeData'
import useGenerativePreview from './useGenerativePreview'
import { pinFileToIPFS } from '@/services/nftStorage'
import { createUnlockableMetadata } from '@/components/collection/unlockable/utils'

export default ({
  toMintNfts,
  drop,
  description,
  collectionName,
  defaultName,
}: {
  toMintNfts: Ref<MassMintNFT[]>
  drop: DropItem
  description: Ref<string | undefined>
  collectionName: Ref<string | undefined>
  defaultName: Ref<string>
}) => {
  const { toast } = useToast()
  const { $i18n } = useNuxtApp()

  const { generatePreviewItem, getEntropyRange } = useGenerativePreview(drop)

  const pinning = ref(new Map<string, boolean>())
  const payloads = ref(new Map<string, ImageDataPayload>())

  const allPinned = computed(
    () =>
      toMintNfts.value.length !== 0 &&
      toMintNfts.value.map((item) => item.metadata).every(Boolean),
  )

  const onMessage = (payload: ImageDataPayload) => {
    if (payload.image === 'data:,') {
      return regenerateNfTWithHash(payload.hash)
    }

    payloads.value.set(payload.hash, payload)

    handleNewImageDataPayload(payload)
    pinNFTWithHash(payload.hash)
  }

  const handleNewImageDataPayload = (payload: ImageDataPayload) => {
    toMintNfts.value = toMintNfts.value.map((toMintNft) =>
      toMintNft.hash === payload.hash
        ? { ...toMintNft, imageDataPayload: payload }
        : toMintNft,
    )
  }

  const { getCaptureImageFile, imageDataPayload } = useGenerativeIframeData({
    onMessage,
  })

  const tryCapture = async ({
    image,
    data,
  }: {
    image: string
    data: ImageDataPayload
  }) => {
    try {
      const imgFile = await getCaptureImageFile({ image, data })
      const imageHash = await pinFileToIPFS(imgFile)
      return imageHash
    } catch (error) {
      toast($i18n.t('drops.capture'))
      throw error
    }
  }

  const pinNFTWithHash = async (hash: string) => {
    const toMintNft = toMintNfts.value.find((item) => item.hash === hash)

    if (!toMintNft || toMintNft.metadata || pinning.value.has(toMintNft.hash)) {
      return
    }

    pinning.value.set(toMintNft.hash, true)

    const metadata = await pinMetadata(toMintNft)

    toMintNfts.value = toMintNfts.value.map((item) =>
      item.hash === hash ? { ...item, metadata } : item,
    )
  }

  const regenerateNfTWithHash = (hash: string) => {
    toMintNfts.value = toMintNfts.value.map((item) => {
      if (item.hash === hash) {
        console.log(
          '[MASSMINT::PREVIEW] Regenerating nft with range ',
          item.entropyRange,
        )
        return { ...item, ...generatePreviewItem(item.entropyRange) }
      }
      return item
    })
  }

  const pinMetadata = (item: MassMintNFT): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const image = item.image
        const imageCid = await tryCapture({
          image,
          data: item.imageDataPayload as ImageDataPayload,
        })
        const metadata = await createUnlockableMetadata(
          imageCid,
          description.value || '',
          collectionName.value || defaultName.value,
          'text/html',
          image,
        )

        resolve(metadata)
      } catch (error) {
        reject(error)
      }
    })
  }

  return {
    getEntropyRange,
    pinning,
    allPinned,
    generatePreviewItem,
    imageDataPayload,
    payloads,
    pinMetadata,
  }
}
