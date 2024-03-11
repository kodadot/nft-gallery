import {
  makeJsonFile,
  uploadMediaAndMetadataDirectories,
} from '@/composables/transaction/mintToken/constructDirectoryMeta'
import { makeUnlockableMetadata } from '@/components/collection/unlockable/utils'
import useDropGenerativePreview from '../useDropGenerativePreview'
import { useCollectionEntity } from '@/composables/drop/useGenerativeDropMint'
import { GenerativePreviewItem } from '../useGenerativePreview'

export default () => {
  const { getCaptureImageFile } = useDropGenerativePreview()
  const { toMintNFTs, drop } = storeToRefs(useDropStore())
  const { collectionName, description } = useCollectionEntity()

  const readyToPin = computed<boolean>(
    () =>
      toMintNFTs.value
        .map((toMintNft) => toMintNft.imageDataPayload)
        .every(Boolean) && Boolean(toMintNFTs.value.length),
  )

  const prepareMetadatas = async () => {
    try {
      console.log('[MASSMINT::UPLOADER] Starting to upload metadata')

      const files = await Promise.all(
        toMintNFTs.value.map((nft) =>
          getCaptureImageFile({
            image: nft.image,
            data: nft.imageDataPayload as GenerativePreviewItem,
          }),
        ),
      )

      const metadatas = await uploadMediaAndMetadataDirectories(
        files,
        (imageHashes) =>
          toMintNFTs.value.map((nft, index) =>
            makeJsonFile(
              makeUnlockableMetadata(
                collectionName.value || drop.value.name,
                description.value || '',
                imageHashes[index],
                nft.image,
                'text/html',
              ),
              String(index),
            ),
          ),
      )

      toMintNFTs.value = toMintNFTs.value.map((nft, index) => ({
        ...nft,
        metadata: metadatas[index],
      }))
    } catch (error) {
      console.log('[MASSMINT::UPLOADER] Failed uploading metadata', error)
    }
  }

  watch(readyToPin, (isReady) => {
    if (isReady) {
      prepareMetadatas()
    }
  })

  return {}
}
