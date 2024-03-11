import { DropItem } from '@/params/types'
import { MassMintNFT } from './useDropMassMint'
import useGenerativeIframeData, {
  ImageDataPayload,
} from './useGenerativeIframeData'
import useGenerativePreview from './useGenerativePreview'
import { createUnlockableMetadata } from '@/components/collection/unlockable/utils'
import useDropGenerativePreview from './useDropGenerativePreview'
import { MintingSession } from '@/components/collection/drop/types'

export default ({
  toMintNfts,
  drop,
  description,
  collectionName,
  defaultName,
  mintingSession,
}: {
  toMintNfts: Ref<MassMintNFT[]>
  drop: DropItem
  description: Ref<string | undefined>
  collectionName: Ref<string | undefined>
  defaultName: Ref<string>
  mintingSession: Ref<MintingSession>
}) => {
  const { generatePreviewItem, getEntropyRange } = useGenerativePreview(drop)
  const { tryCapture } = useDropGenerativePreview()

  const payloads = ref(new Map<string, ImageDataPayload>())

  const allPinned = computed(
    () =>
      toMintNfts.value.length !== 0 &&
      toMintNfts.value.map((item) => item.metadata).every(Boolean),
  )

  const onMessage = (payload: ImageDataPayload) => {
    // always keep track of incomming payloads
    payloads.value.set(payload.hash, payload)

    const mintHasntStarted = !toMintNfts.value.length
    const mintHasEnded = mintingSession.value.items.length

    if (mintHasntStarted || mintHasEnded) {
      return
    }

    if (payload.image === 'data:,') {
      return regenerateNfTWithHash(payload.hash)
    }

    console.log('[MASSMINT::PREVIEW] Successfully generated ', payload.hash)

    handleNewImageDataPayload(payload)
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
    return new Promise((resolve, reject) => {
      const image = item.image
      tryCapture({
        image,
        data: item.imageDataPayload as ImageDataPayload,
      })
        .then((imageCid) =>
          createUnlockableMetadata(
            imageCid,
            description.value || '',
            collectionName.value || defaultName.value,
            'text/html',
            image,
          ),
        )
        .then(resolve)
        .catch(reject)
    })
  }

  return {
    getEntropyRange,
    allPinned,
    generatePreviewItem,
    payloads,
    pinMetadata,
  }
}
