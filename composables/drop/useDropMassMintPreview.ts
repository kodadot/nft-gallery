import { DropItem } from '@/params/types'
import { MassMintNFT } from './useDropMassMint'
import useGenerativeIframeData, {
  ImageDataPayload,
} from './useGenerativeIframeData'
import useGenerativePreview from './useGenerativePreview'
import { createUnlockableMetadata } from '@/components/collection/unlockable/utils'
import useDropGenerativePreview from './useDropGenerativePreview'

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
  const { generatePreviewItem, getEntropyRange } = useGenerativePreview(drop)
  const { tryCapture } = useDropGenerativePreview()

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

  useGenerativeIframeData({
    onMessage,
  })

  const handleNewImageDataPayload = (payload: ImageDataPayload) => {
    toMintNfts.value = toMintNfts.value.map((toMintNft) =>
      toMintNft.hash === payload.hash
        ? { ...toMintNft, imageDataPayload: payload }
        : toMintNft,
    )
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
    payloads,
    pinMetadata,
  }
}
