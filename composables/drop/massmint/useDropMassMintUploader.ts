import {
  makeJsonFile,
  uploadMediaAndMetadataDirectories,
} from '@/composables/transaction/mintToken/constructDirectoryMeta'
import { makeUnlockableMetadata } from '@/components/collection/unlockable/utils'
import useDropGenerativePreview from '../useDropGenerativePreview'
import { MassMintNFT } from '../useDropMassMint'

export default ({
  toMintNfts,
  collectionName,
  defaultName,
  description,
}: {
  toMintNfts: Ref<MassMintNFT[]>
  description: Ref<string | undefined>
  collectionName: Ref<string | undefined>
  defaultName: Ref<string>
}) => {
  const { getCaptureImageFile } = useDropGenerativePreview()

  const readyToPin = computed<boolean>(
    () =>
      toMintNfts.value
        .map((toMintNft) => toMintNft.imageDataPayload)
        .every(Boolean) && Boolean(toMintNfts.value.length),
  )

  const prepareMetadatas = async () => {
    try {
      console.log('[MASSMINT::UPLOADER] Starting to upload metadata')

      const files = await Promise.all(
        toMintNfts.value.map((nft) =>
          getCaptureImageFile({ image: nft.image, data: nft.imageDataPayload }),
        ),
      )

      const metadatas = await uploadMediaAndMetadataDirectories(
        files,
        (imageHashes) =>
          toMintNfts.value.map((nft, index) =>
            makeJsonFile(
              makeUnlockableMetadata(
                collectionName.value || defaultName.value,
                description.value || '',
                imageHashes[index],
                nft.image,
                'text/html',
              ),
              String(index),
            ),
          ),
      )

      toMintNfts.value = toMintNfts.value.map((nft, index) => ({
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
