import {
  makeJsonFile,
  uploadMediaAndMetadataDirectories,
} from '@/composables/transaction/mintToken/constructDirectoryMeta'
import { makeUnlockableMetadata } from '@/components/collection/unlockable/utils'
import { useCollectionEntity } from '@/composables/drop/useGenerativeDropMint'
import useDropMassMintState from './useDropMassMintState'

const getFiles = () => {
  const { toMintNFTs } = storeToRefs(useDropStore())
  return Promise.all(
    toMintNFTs.value.map((nft) =>
      getCaptureImageFile({
        image: nft.image,
        data: nft.imageDataPayload as GenerativePreviewItem,
      }),
    ),
  )
}

const generateMetadatas = (files) => {
  const { toMintNFTs, drop } = storeToRefs(useDropStore())
  const { collectionName, description } = useCollectionEntity()

  return uploadMediaAndMetadataDirectories(files, (imageHashes) =>
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
}

export default () => {
  const { toMintNFTs } = storeToRefs(useDropStore())
  const { canPin } = useDropMassMintState()

  const prepareMetadatas = async () => {
    try {
      console.log('[MASSMINT::UPLOADER] Starting to upload metadata')

      const files = await getFiles()

      const metadatas = await generateMetadatas(files)

      toMintNFTs.value = toMintNFTs.value.map((nft, index) => ({
        ...nft,
        metadata: metadatas[index],
      }))
    } catch (error) {
      console.log('[MASSMINT::UPLOADER] Failed uploading metadata', error)
    }
  }

  watch(canPin, (isReady) => {
    if (isReady) {
      prepareMetadatas()
    }
  })
}
